# Concurrent Tic-Tac-Toe

A real-time concurrent Tic-Tac-Toe system built with **Next.js**, **TypeScript**, **Express**, and **Socket.IO**.  
This project is designed for the _Concurrent Programming_ course, focusing on:

- Mutual exclusion over shared game state
- Synchronization between distributed players
- Real-time communication using event-driven concurrency
- Controlled concurrent access (max two players per room)
- Consistency guarantees under simultaneous interactions

The goal is educational, demonstrating concurrency mechanisms in a clear, observable and practical way.

---

## Architecture Overview

```
Client (Next.js + TypeScript) → Rendered as static files
↓ WebSocket events
Server (Express + Socket.IO) → Manages rooms, turns, state and concurrency rules
```

- Each match runs in an isolated room.
- The server serializes moves to prevent race conditions.
- Shared state (the board) is protected under a simple critical section.
- Events synchronize both clients in real time.

---

## Development Setup

### Requirements

- Node.js 18+
- npm or yarn

### Install

```bash
cd client
npm install

cd ../server
npm install
```

### Run (development)

Two terminals:

**Client**

```bash
cd client
npm run dev
```

**Server**

```bash
cd server
npm run dev
```

### Build for Production

```bash
cd client
npm run build

cd ../server
npm run build
node dist/index.js
```

---

## Deployment (Render)

You can deploy the entire system on a **single Render Web Service**, since the server bundles the exported Next.js client.

Example Render build command:

```bash
cd client && npm ci && npm run build && cd ../server && npm ci && npm run build
```

Start command:

```bash
node dist/index.js
```

---

## Academic Focus

This project highlights:

- Concurrency models in distributed interactive systems
- Event-driven synchronization
- State consistency under simultaneous operations
- Practical application of mutual exclusion (shared board)
- Controlled admission to concurrent processes (two players max)

---

## License

MIT License.
