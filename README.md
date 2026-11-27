# ProtoForge — Technopreneurship Team Sprint Game

**ProtoForge** is a fast-paced, zero-projector classroom game for engineering **Technopreneurship** teams (3–6 members per team) practicing **idea generation, MVP scoping, BOM trade-offs, and customer validation**.

One Android phone acts as the **Host Server** (displaying a QR code and local address over hotspot or classroom Wi-Fi—no internet required), while students join directly in their mobile browsers (`Chrome` / `Safari`) with zero app installation.

---

## How to Play

1. **Connect:** Turn on a mobile hotspot or connect the host phone and student phones to the same Wi-Fi network.
2. **Join via QR:** Open **ProtoForge Host** on the host phone and have students scan the displayed QR code (or visit `http://<host-ip>:8765`).
3. **Form Teams (3–6 Students):** Every member of a team selects the same **Sprint Track** and enters the same **Team Code** (e.g., `TEAM1`).
4. **Asymmetric Roles Each Round:**
   - **Product Lead (1 phone):** Sees the active Venture Board, timer, and prototype serial number—but **cannot** see the playbook rules.
   - **Playbook Holders (remaining 2–5 phones):** Hold different pages of the *Idea & Product Playbook* and give exact instructions verbally.
5. **Rotate & Race:** The Product Lead rotates every round. Teams have **3 spare iterations** (3 strikes fail a sprint) and race to validate the target number of sprints.

---

## Sprint Tracks

- **Idea Spark (`Divergent Ideation`):** Pain-Point Filter, Market Feasibility, SCAMPER Matrix, Assumption Gates, and Ideation Sprint.
- **MVP Forge (`Product Development`):** BOM Trade-Offs, Unit Economics, TRL Milestones, Design-for-Manufacturing, and Validation Loop.
- **Pivot Lab (`Customer & Market Fit`):** Channel Mix, CAC/LTV Ratio, Persona Signals, Pivot Triggers, and Discovery Gate.
- **Scale Run (`Full Venture Sprint`):** Combined Idea-to-Launch pressure test across ideation, BOM feasibility, and customer validation.

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
