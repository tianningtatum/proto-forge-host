# ProtoForge — ENTECH30 Technopreneurship Team Sprint Game

**ProtoForge** is a fast-paced, zero-projector classroom game for engineering **Technopreneurship** teams (3–6 members per team) practicing **idea generation, JTBD/NDSB product shaping, prototyping & pretotyping (XYZ hypotheses & Feedback Capture Grids), IP/RA 8293 & GTM, and entrepreneurial finance/pitching**.

One Android phone acts as the **Host Server** (displaying a QR code and local address over hotspot or classroom Wi-Fi—no internet required), while students join directly in their mobile browsers (`Chrome` / `Safari`) with zero app installation.

---

## How to Play

1. **Connect:** Turn on a mobile hotspot or connect the host phone and student phones to the same Wi-Fi network.
2. **Join via QR:** Open **ProtoForge Host** on the host phone and have students scan the displayed QR code (or visit `http://<host-ip>:8765`).
3. **Form Teams (3–6 Students):** Every member of a team selects the same **Sprint Track / Engineering Program** and enters the same **Team Code** (e.g., `TEAM1`).
4. **Asymmetric Roles Each Round:**
   - **Product Lead (1 phone):** Sees the active Venture Board, timer, and prototype serial number—but **cannot** see the playbook rules.
   - **Playbook Holders (remaining 2–5 phones):** Hold different pages of the *Venture Playbook* and give exact instructions verbally.
5. **Rotate & Race:** The Product Lead rotates every round. Teams have **3 spare iterations** (3 strikes fail a sprint) and race to validate the target number of sprints (default: **3 sprints**, adjustable on the host screen from 1 to 12).

---

## Tracks & Engineering Programs Included

- **Idea Spark (`Idea Gen & JTBD · T4–T6`):** Divergent ideation (SCAMPER, reverse thinking, attribute listing), JTBD opportunity scoring, Design Thinking, and NDSB + SDG alignment.
- **Pretotype Lab (`Proto & Pretotype · T7`):** Low- vs. high-fidelity prototyping, pretotyping methods (Fake Door, Wizard of Oz, Pinocchio, Mechanical Turk, Façade), XYZ testable hypotheses, and 4-box Feedback Capture Grids.
- **IP & Market Fit (`IP, Value & GTM · T8–T10`):** IP Code (RA 8293) & IPOPHL protection/prior art, "it" to "you" value propositions, Lean Canvas, competitor grid & PESTEL, TAM-SAM-SOM, pricing, and sales/customer service.
- **Finance & Pitch (`Finance & Pitch · T11–T12`):** Funding stages & DOST/PH funding options, cash flow vs. profit, burn/runway/break-even, PH legal forms (Sole Prop, OPC, Partnership, Corporation), and 12-slide / 7-minute pitch discipline.
- **Electronics Engg (`Electronics Engineering`):** Smart sensors, embedded telemetry, low-power/RF design, EMC/safety compliance, and field pilots.
- **Envi & Sanitary Engg (`Environmental & Sanitary Engg`):** Water/wastewater/sanitation systems, treatment trains, DENR/LGU compliance, and sustainable community pilots.

---

## Scoring & Ranking

Teams are ranked automatically on the **Sprint Race** leaderboard by **Race Time** (measured from the team's first Start to reaching the sprint goal):

- **1st Place:** `100 pts`
- **2nd – 3rd Place:** `95 pts`
- **4th – 6th Place:** `90 pts`
- **7th Place & Beyond / Unfinished:** `80 pts`
- **Iteration Penalty:** `−3 pts` per lost spare iteration (minimum score floor of `60 pts`).

Instructors can export results directly via **Copy results** on the host screen or verify student-submitted logs using **Instructor tools → Check and rank logs**.

---

## Building the Host APK on GitHub Actions

This repository includes `.github/workflows/build-apk.yml` to compile `app-debug.apk` automatically:

1. Push or commit changes to the `main` branch.
2. Open the **Actions** tab and select the **Build ProtoForge Host APK** workflow run.
3. Once the `build` job finishes, download **`ProtoForge-Host-APK`** (`app-debug.apk`) under **Artifacts** and install it on your Android host device.

---

## Project Structure

- `app/src/main/java/io/github/protoforge/MainActivity.kt` — Launches the background server and loads the Host Console (`/host`).
- `app/src/main/java/io/github/protoforge/GameService.kt` — Embedded HTTP + Server-Sent Events (`SSE`) server on port `8765`.
- `app/src/main/assets/web/` — Mobile browser client (`index.html`, `player.js`, `core.js`, `themes.js`, `style.css`) and Host dashboard (`host.html`, `qrcode.js`).
