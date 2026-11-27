package io.github.protoforge

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.io.OutputStream
import java.net.Inet4Address
import java.net.NetworkInterface
import java.net.ServerSocket
import java.net.Socket
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

class GameService : Service() {

    companion object {
        const val PORT = 8765
        const val CHANNEL_ID = "protoforge_host_channel"
    }

    data class Player(
        val id: String,
        val name: String,
        val station: Int,
        @Volatile var lastSeen: Long = System.currentTimeMillis()
    )

    data class HistEntry(val r: Int, val op: Int, val res: String)

    class Room(
        val key: String,
        var program: String,
        var target: Int
    ) {
        var state: String = "lobby"
        var phase: String = "brief"
        var result: String = ""
        var why: String = ""
        var round: Int = 1
        var k: Int = 0
        var seed: Int = Random.nextInt(1000, 9999)
        var fixed: Int = 0
        var lives: Int = 3
        var faults: Int = 0
        var operator: Int = 0
        var totalModules: Int = 1
        var timeMs: Long = 180000L
        var repairStart: Long = 0L
        var resultAt: Long = 0L
        var raceStart: Long = 0L
        var finishedAt: Long = 0L
        var raceMs: Long = 0L
        var rank: Int = 0
        var ended: String = ""
        val solved = mutableListOf<Int>()
        val hist = mutableListOf<HistEntry>()
        val players = mutableListOf<Player>()

        fun n(): Int = max(3, min(6, players.size))
    }

    data class Finisher(
        val team: String,
        val program: String,
        val raceMs: Long,
        val finishedAt: Long,
        val players: List<String>
    )

    data class SseClient(
        val out: OutputStream,
        val isHost: Boolean,
        val roomKey: String = "",
        val playerId: String = ""
    )

    private val rooms = ConcurrentHashMap<String, Room>()
    private val finishers = CopyOnWriteArrayList<Finisher>()
    private val clients = CopyOnWriteArrayList<SseClient>()
    @Volatile private var targetGoal = 3
    @Volatile private var running = false
    private var serverSocket: ServerSocket? = null
    private val pool = Executors.newCachedThreadPool()
    private val ticker: ScheduledExecutorService = Executors.newSingleThreadScheduledExecutor()
    private var wakeLock: PowerManager.WakeLock? = null

    override fun onCreate() {
        super.onCreate()
        startForegroundNotification()
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ProtoForge::HostLock").apply { acquire() }
        running = true
        pool.execute { runServer() }
        ticker.scheduleAtFixedRate({ tick() }, 500, 500, TimeUnit.MILLISECONDS)
    }

    override fun onDestroy() {
        running = false
        try { serverSocket?.close() } catch (_: Exception) {}
        ticker.shutdownNow()
        pool.shutdownNow()
        try { if (wakeLock?.isHeld == true) wakeLock?.release() } catch (_: Exception) {}
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startForegroundNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val ch = NotificationChannel(CHANNEL_ID, "ProtoForge Host Server", NotificationManager.IMPORTANCE_LOW)
            val nm = getSystemService(NotificationManager::class.java)
            nm.createNotificationChannel(ch)
        }
        val pi = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val notif = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
                .setContentTitle("ProtoForge Host Active")
                .setContentText("Students can scan QR & play over Wi-Fi / Hotspot")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentIntent(pi)
                .build()
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
                .setContentTitle("ProtoForge Host Active")
                .setContentText("Students can scan QR & play over Wi-Fi / Hotspot")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentIntent(pi)
                .build()
        }
        startForeground(1, notif)
    }

    private fun getLocalIps(): List<String> {
        val list = mutableListOf<String>()
        try {
            val interfaces = NetworkInterface.getNetworkInterfaces() ?: return list
            for (intf in interfaces) {
                if (!intf.isUp || intf.isLoopback) continue
                for (addr in intf.inetAddresses) {
                    if (addr is Inet4Address && !addr.isLoopbackAddress) {
                        val ip = addr.hostAddress ?: continue
                        if (ip.startsWith("192.168.43.") || ip.startsWith("192.168.")) {
                            list.add(0, ip)
                        } else {
                            list.add(ip)
                        }
                    }
                }
            }
        } catch (_: Exception) {}
        return list.distinct()
    }

    private fun tick() {
        val now = System.currentTimeMillis()
        var changed = false
        for (room in rooms.values) {
            synchronized(room) {
                if (room.state == "playing" && room.phase == "repair") {
                    if (now - room.repairStart >= room.timeMs) {
                        failAttempt(room, "Time ran out", now)
                        changed = true
                    }
                } else if (room.state == "playing" && room.phase == "result") {
                    if (now - room.resultAt >= 4500L) {
                        advanceAfterResult(room)
                        changed = true
                    }
                }
            }
        }
        if (changed) broadcastAll()
    }

    private fun failAttempt(room: Room, reason: String, now: Long) {
        room.phase = "result"
        room.result = "fail"
        room.why = reason
        room.resultAt = now
        room.lives = max(0, room.lives - 1)
        room.hist.add(HistEntry(room.round, room.operator + 1, "fail"))
        if (room.lives <= 0) {
            room.state = "over"
            room.ended = "out"
        }
    }

    private fun advanceAfterResult(room: Room) {
        if (room.state != "playing" || room.phase != "result") return
        if (room.result == "ok") {
            room.round += 1
        }
        room.k += 1
        room.operator = room.k % room.n()
        room.phase = "brief"
        room.faults = 0
        room.solved.clear()
        room.result = ""
        room.why = ""
    }

    private fun runServer() {
        try {
            serverSocket = ServerSocket(PORT)
            while (running) {
                val sock = serverSocket?.accept() ?: break
                pool.execute { handleClient(sock) }
            }
        } catch (_: Exception) {}
    }

    private fun handleClient(sock: Socket) {
        try {
            sock.soTimeout = 15000
            val input = BufferedInputStream(sock.getInputStream())
            val out = sock.getOutputStream()
            val reqLine = readLine(input) ?: run { sock.close(); return }
            val parts = reqLine.split(" ")
            if (parts.size < 2) { sock.close(); return }
            val method = parts[0]
            val rawTarget = parts[1]
            val qIdx = rawTarget.indexOf('?')
            val path = if (qIdx >= 0) rawTarget.substring(0, qIdx) else rawTarget
            val query = parseQuery(if (qIdx >= 0) rawTarget.substring(qIdx + 1) else "")

            var contentLength = 0
            while (true) {
                val h = readLine(input) ?: break
                if (h.isEmpty()) break
                val colon = h.indexOf(':')
                if (colon > 0 && h.substring(0, colon).trim().equals("Content-Length", ignoreCase = true)) {
                    contentLength = h.substring(colon + 1).trim().toIntOrNull() ?: 0
                }
            }

            val bodyBytes = if (contentLength > 0) {
                val buf = ByteArray(contentLength)
                var read = 0
                while (read < contentLength) {
                    val r = input.read(buf, read, contentLength - read)
                    if (r <= 0) break
                    read += r
                }
                buf
            } else ByteArray(0)
            val bodyStr = String(bodyBytes, StandardCharsets.UTF_8)

            when {
                path == "/events" -> {
                    sock.soTimeout = 0
                    val roomKey = query["room"] ?: ""
                    val pid = query["id"] ?: ""
                    startSse(out, SseClient(out, isHost = false, roomKey = roomKey, playerId = pid))
                    return
                }
                path == "/host/events" -> {
                    sock.soTimeout = 0
                    startSse(out, SseClient(out, isHost = true))
                    return
                }
                path == "/api/info" -> {
                    val obj = JSONObject()
                    obj.put("port", PORT)
                    obj.put("ips", JSONArray(getLocalIps()))
                    sendJson(out, obj.toString())
                }
                path == "/api/join" && method == "POST" -> {
                    sendJson(out, handleJoin(JSONObject(bodyStr)))
                }
                path == "/api/act" && method == "POST" -> {
                    sendJson(out, handleAct(JSONObject(bodyStr)))
                }
                path == "/host/act" && method == "POST" -> {
                    sendJson(out, handleHostAct(JSONObject(bodyStr)))
                }
                else -> serveAsset(out, path)
            }
            out.flush()
            sock.close()
        } catch (_: Exception) {
            try { sock.close() } catch (_: Exception) {}
        }
    }

    private fun startSse(out: OutputStream, client: SseClient) {
        val hdr = "HTTP/1.1 200 OK\r\n" +
                "Content-Type: text/event-stream; charset=utf-8\r\n" +
                "Cache-Control: no-cache\r\n" +
                "Connection: keep-alive\r\n\r\n"
        out.write(hdr.toByteArray(StandardCharsets.UTF_8))
        out.flush()
        clients.add(client)
        pushToClient(client)
    }

    private fun broadcastAll() {
        for (c in clients) {
            pushToClient(c)
        }
    }

    private fun pushToClient(c: SseClient) {
        try {
            val payload = if (c.isHost) {
                "data: ${buildHostJson()}\n\n"
            } else {
                val room = rooms[c.roomKey]
                if (room == null) {
                    "event: closed\ndata: {}\n\n"
                } else {
                    val me = synchronized(room) { room.players.find { it.id == c.playerId } }
                    if (me == null) {
                        "event: gone\ndata: {}\n\n"
                    } else {
                        me.lastSeen = System.currentTimeMillis()
                        "data: ${buildPlayerJson(room, me)}\n\n"
                    }
                }
            }
            synchronized(c.out) {
                c.out.write(payload.toByteArray(StandardCharsets.UTF_8))
                c.out.flush()
            }
        } catch (_: Exception) {
            clients.remove(c)
            try { c.out.close() } catch (_: Exception) {}
        }
    }

    private fun handleJoin(req: JSONObject): String {
        val id = req.optString("id").trim()
        val name = req.optString("name").trim().take(16)
        val team = req.optString("team").trim().uppercase().replace(Regex("[^A-Z0-9]"), "").take(12)
        val program = req.optString("program").trim()
        val res = JSONObject()
        if (id.isEmpty() || name.isEmpty() || team.length < 2 || program.isEmpty()) {
            return res.put("ok", false).put("error", "Fill in all fields.").toString()
        }
        val room = rooms.computeIfAbsent(team) { Room(team, program, targetGoal) }
        synchronized(room) {
            val existing = room.players.find { it.id == id }
            if (existing != null) {
                existing.lastSeen = System.currentTimeMillis()
            } else {
                if (room.players.size >= 6) {
                    return res.put("ok", false).put("error", "Team $team already has 6 members.").toString()
                }
                val usedStations = room.players.map { it.station }.toSet()
                val st = (0..5).first { it !in usedStations }
                room.players.add(Player(id, name, st))
            }
        }
        broadcastAll()
        return res.put("ok", true).put("room", room.key).put("program", room.program).toString()
    }

    private fun handleAct(req: JSONObject): String {
        val roomKey = req.optString("room")
        val id = req.optString("id")
        val type = req.optString("type")
        val room = rooms[roomKey] ?: return "{\"ok\":false}"
        val now = System.currentTimeMillis()

        synchronized(room) {
            val me = room.players.find { it.id == id } ?: return "{\"ok\":false}"
            me.lastSeen = now
            when (type) {
                "leave" -> {
                    room.players.removeAll { it.id == id }
                    if (room.players.isEmpty()) rooms.remove(roomKey)
                }
                "start" -> {
                    if (room.state == "lobby" && room.players.size >= 2) {
                        room.state = "playing"
                        room.phase = "brief"
                        room.round = 1
                        room.k = 0
                        room.fixed = 0
                        room.lives = 3
                        room.faults = 0
                        room.operator = 0
                        room.solved.clear()
                        room.hist.clear()
                        if (room.raceStart == 0L) room.raceStart = now
                    }
                }
                "lobby" -> {
                    room.state = "lobby"
                    room.phase = "brief"
                    room.seed = Random.nextInt(1000, 9999)
                    room.ended = ""
                }
                "repair" -> {
                    if (room.state == "playing" && room.phase == "brief" && req.optInt("k") == room.k) {
                        room.phase = "repair"
                        room.totalModules = max(1, req.optInt("total", 1))
                        room.timeMs = max(30000L, req.optLong("timeMs", 180000L))
                        room.repairStart = now
                    }
                }
                "solve" -> {
                    if (room.state == "playing" && room.phase == "repair" && req.optInt("k") == room.k) {
                        val idx = req.optInt("i")
                        if (idx !in room.solved) room.solved.add(idx)
                        if (room.solved.size >= room.totalModules) {
                            room.phase = "result"
                            room.result = "ok"
                            room.resultAt = now
                            room.fixed += 1
                            room.hist.add(HistEntry(room.round, room.operator + 1, "ok"))
                            if (room.fixed >= room.target) {
                                room.state = "over"
                                room.ended = "target"
                                room.finishedAt = now
                                room.raceMs = max(1000L, now - room.raceStart)
                                if (finishers.none { it.team == room.key }) {
                                    finishers.add(Finisher(room.key, room.program, room.raceMs, now, room.players.map { it.name }))
                                }
                                val sorted = finishers.sortedBy { it.raceMs }
                                room.rank = sorted.indexOfFirst { it.team == room.key } + 1
                            }
                        }
                    }
                }
                "fault" -> {
                    if (room.state == "playing" && room.phase == "repair" && req.optInt("k") == room.k) {
                        room.faults += 1
                        if (room.faults >= 3) {
                            failAttempt(room, "3 validation strikes", now)
                        }
                    }
                }
                "next" -> {
                    if (room.state == "playing" && room.phase == "result" && req.optInt("k") == room.k) {
                        advanceAfterResult(room)
                    }
                }
                "end" -> {
                    if (room.state == "playing") {
                        room.state = "over"
                        room.ended = "end"
                    }
                }
            }
        }
        broadcastAll()
        return "{\"ok\":true}"
    }

    private fun handleHostAct(req: JSONObject): String {
        val type = req.optString("type")
        val roomKey = req.optString("room")
        when (type) {
            "target" -> {
                targetGoal = max(1, min(12, req.optInt("n", 5)))
                for (r in rooms.values) synchronized(r) { r.target = targetGoal }
            }
            "resetBoard" -> {
                finishers.clear()
            }
            "skip" -> {
                rooms[roomKey]?.let { r ->
                    synchronized(r) {
                        if (r.state == "playing") {
                            r.hist.add(HistEntry(r.round, r.operator + 1, "skip"))
                            r.k += 1
                            r.operator = r.k % r.n()
                            r.phase = "brief"
                            r.faults = 0
                            r.solved.clear()
                        }
                    }
                }
            }
            "close" -> {
                rooms.remove(roomKey)
            }
        }
        broadcastAll()
        return "{\"ok\":true}"
    }

    private fun roomToJson(room: Room, now: Long): JSONObject {
        val obj = JSONObject()
        obj.put("key", room.key)
        obj.put("program", room.program)
        obj.put("target", room.target)
        obj.put("state", room.state)
        obj.put("phase", room.phase)
        obj.put("result", room.result)
        obj.put("why", room.why)
        obj.put("round", room.round)
        obj.put("k", room.k)
        obj.put("seed", room.seed)
        obj.put("fixed", room.fixed)
        obj.put("lives", room.lives)
        obj.put("faults", room.faults)
        obj.put("operator", room.operator)
        obj.put("modules", room.totalModules)
        obj.put("timeMs", room.timeMs)
        obj.put("repairStart", room.repairStart)
        obj.put("raceStart", room.raceStart)
        obj.put("finishedAt", room.finishedAt)
        obj.put("raceMs", room.raceMs)
        obj.put("rank", room.rank)
        obj.put("teamsOnHost", rooms.size)
        obj.put("ended", room.ended)
        obj.put("n", room.n())
        obj.put("solved", JSONArray(room.solved))

        val parr = JSONArray()
        for (p in room.players.sortedBy { it.station }) {
            val po = JSONObject()
            po.put("name", p.name)
            po.put("station", p.station)
            po.put("online", now - p.lastSeen < 20000L)
            parr.put(po)
        }
        obj.put("players", parr)

        val harr = JSONArray()
        for (h in room.hist) {
            val ho = JSONObject()
            ho.put("r", h.r)
            ho.put("op", h.op)
            ho.put("res", h.res)
            harr.put(ho)
        }
        obj.put("hist", harr)
        return obj
    }

    private fun buildPlayerJson(room: Room, me: Player): String {
        val now = System.currentTimeMillis()
        val root = JSONObject()
        root.put("now", now)
        synchronized(room) {
            root.put("room", roomToJson(room, now))
            val mo = JSONObject()
            mo.put("id", me.id)
            mo.put("name", me.name)
            mo.put("station", me.station)
            root.put("me", mo)
        }
        return root.toString()
    }

    private fun buildHostJson(): String {
        val now = System.currentTimeMillis()
        val root = JSONObject()
        root.put("target", targetGoal)
        val rarr = JSONArray()
        for (r in rooms.values.sortedBy { it.key }) {
            synchronized(r) { rarr.put(roomToJson(r, now)) }
        }
        root.put("rooms", rarr)
        val farr = JSONArray()
        for (f in finishers) {
            val fo = JSONObject()
            fo.put("team", f.team)
            fo.put("program", f.program)
            fo.put("raceMs", f.raceMs)
            fo.put("finishedAt", f.finishedAt)
            fo.put("players", JSONArray(f.players))
            farr.put(fo)
        }
        root.put("finishers", farr)
        return root.toString()
    }

    private fun serveAsset(out: OutputStream, rawPath: String) {
        val assetPath = when (rawPath) {
            "/", "" -> "web/index.html"
            "/host" -> "web/host.html"
            else -> "web" + rawPath.replace("..", "")
        }
        val mime = when {
            assetPath.endsWith(".html") -> "text/html; charset=utf-8"
            assetPath.endsWith(".css") -> "text/css; charset=utf-8"
            assetPath.endsWith(".js") -> "application/javascript; charset=utf-8"
            assetPath.endsWith(".svg") -> "image/svg+xml"
            else -> "application/octet-stream"
        }
        try {
            val bytes = assets.open(assetPath).use { it.readBytes() }
            val hdr = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: $mime\r\n" +
                    "Content-Length: ${bytes.size}\r\n" +
                    "Cache-Control: no-cache\r\n" +
                    "Connection: close\r\n\r\n"
            out.write(hdr.toByteArray(StandardCharsets.UTF_8))
            out.write(bytes)
        } catch (_: Exception) {
            val notFound = "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\nConnection: close\r\n\r\nNot Found"
            out.write(notFound.toByteArray(StandardCharsets.UTF_8))
        }
    }

    private fun sendJson(out: OutputStream, json: String) {
        val bytes = json.toByteArray(StandardCharsets.UTF_8)
        val hdr = "HTTP/1.1 200 OK\r\n" +
                "Content-Type: application/json; charset=utf-8\r\n" +
                "Content-Length: ${bytes.size}\r\n" +
                "Cache-Control: no-cache\r\n" +
                "Connection: close\r\n\r\n"
        out.write(hdr.toByteArray(StandardCharsets.UTF_8))
        out.write(bytes)
    }

    private fun readLine(input: InputStream): String? {
        val buf = ByteArrayOutputStream()
        while (true) {
            val b = input.read()
            if (b == -1) return if (buf.size() == 0) null else buf.toString("UTF-8")
            if (b == '\n'.code) break
            if (b != '\r'.code) buf.write(b)
        }
        return buf.toString("UTF-8")
    }

    private fun parseQuery(q: String): Map<String, String> {
        val map = mutableMapOf<String, String>()
        if (q.isEmpty()) return map
        for (pair in q.split("&")) {
            val eq = pair.indexOf('=')
            if (eq > 0) {
                val k = URLDecoder.decode(pair.substring(0, eq), "UTF-8")
                val v = URLDecoder.decode(pair.substring(eq + 1), "UTF-8")
                map[k] = v
            }
        }
        return map
    }
}
