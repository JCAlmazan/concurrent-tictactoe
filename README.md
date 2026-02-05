# Concurrent Multiplayer Tic-Tac-Toe

A real-time, distributed, and concurrent system disguised as a Tic-Tac-Toe game.
Designed as an academic laboratory to visualize and experiment with **Distributed Systems** concepts in a controlled environment.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎓 Academic Objectives

This project is not just a game; it is a **concurrency visualizer**. It demonstrates:

*   **Shared State & Synchronization:** How a single "truth" is maintained across multiple clients.
*   **Race Condition Prevention:** How the server serializes interactions to prevent conflicting state mutations.
*   **Mutual Exclusion:** Logical locking mechanisms (Strict Turn-Based) to ensure data integrity.
*   **Eventual Consistency:** Visual feedback on the latency gap between "User Action" and "Server Confirmation".
*   **Real-Time Authorization:** Validation of actions based on dynamic state (e.g., Turn Tokens).

---

## 🚀 Features

*   **Real-Time Communication:** Powered by **Socket.IO** (WebSockets) for bi-directional event streams.
*   **Educational UI:** Dynamic **Concurrency Banners** allowing users to see exactly which theoretical concept is active (e.g., "Mutual Exclusion", "Server Authoritative").
*   **Bilingual Support (i18n):** Full support for **English** and **Spanish**, making academic concepts accessible to a wider audience.
*   **Resilient Architecture:** Handles disconnections, room partitioning, and concurrent session management.
*   **Modern Stack:** 
    *   **Frontend:** Next.js 13+ (React), TailwindCSS, TypeScript.
    *   **Backend:** Node.js, Express, Socket.IO Check.

---

## 🛠️ Installation & Setup

You can run the full stack (Client + Server) from the root directory using the simplified scripts.

### Prerequisites

*   Node.js 18+
*   npm

### 1. Install Dependencies

```bash
# Installs dependencies for BOTH client and server automatically
npm run build
```
*(Note: The build script handles installation steps)*

Alternatively, install manually:

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Run in Development Mode

This will start both the Next.js frontend (port 3000) and the Node.js backend (port 3001) concurrently.

```bash
# Run from the root directory
npm run dev
```

*   **Frontend:** [http://localhost:3000](http://localhost:3000)
*   **Backend:** [http://localhost:3001](http://localhost:3001)

### 3. Production Build

To test the production behavior (Static Export served by Node/Express):

```bash
npm run build
npm start
```

---

## 🧪 How to Experiment (Testing Concurrency)

1.  Open **Two Browser Windows** (e.g., one Incognito).
2.  In Window A: Click **"Initialize New State"** to create a Room.
3.  Copy the **Room ID** (click the ID in the protocol bar).
4.  In Window B: Paste the ID into **"Existing State ID"** and press Enter.
5.  Observe the **Concurrency Banners** changing as you play.
6.  Try to play out of turn or disconnect one client to see how the system enforces **Consistency**.

---

## 📂 Project Structure

*   **/client**: Next.js Application.
    *   `pages/game/[id].tsx`: Main game loop and socket logic.
    *   `components/ConcurrencyBanner.tsx`: Educational component for visualizing concepts.
    *   `constants/translations.ts`: Dictionary for i18n.
*   **/server**: Node.js Application.
    *   `index.ts`: The "Truth Source". Handles the Event Loop, Room State, and Validations.

---

## 📄 License

MIT License.
