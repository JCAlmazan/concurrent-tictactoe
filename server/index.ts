import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// CORS
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  })
);

// Serve static exported Next.js frontend
const outPath = path.join(__dirname, "out");
app.use(express.static(outPath));

// SPA fallback (so /game/123 works)
app.get("*", (req, res) => {
  res.sendFile(path.join(outPath, "index.html"));
});

// simple health check
app.get("/health", (_, res) => res.send("ok"));

const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

/**
 * Simple in-memory rooms state for the demo:
 * rooms = {
 *   [roomId]: { board: (null|'X'|'O')[], players: string[], turn: 'X'|'O' }
 * }
 */
const rooms: Record<
  string,
  { board: (null | "X" | "O")[]; players: string[]; turn: "X" | "O" }
> = {};

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    let room = rooms[roomId];

    if (!room) {
      // create room, first player is X
      rooms[roomId] = {
        board: Array(9).fill(null),
        players: [socket.id],
        turn: "X",
      };
      socket.join(roomId);
      socket.emit("roomJoined", {
        player: "X",
        board: rooms[roomId].board,
        message: "Waiting for second player...",
      });
      return;
    }

    if (room.players.length === 1) {
      room.players.push(socket.id);
      socket.join(roomId);
      // notify both: second player joins as O
      io.to(roomId).emit("roomJoined", {
        player: "O",
        board: room.board,
        message: "Game started",
      });
      io.to(roomId).emit("updateBoard", {
        board: room.board,
        message: "Game started",
      });
      return;
    }

    // room full
    socket.emit("roomFull", {});
  });

  socket.on("play", ({ roomId, index }: { roomId: string; index: number }) => {
    const room = rooms[roomId];
    if (!room) return;

    const playerIndex = room.players.indexOf(socket.id);
    const playerSymbol =
      playerIndex === 0 ? "X" : playerIndex === 1 ? "O" : null;
    if (!playerSymbol) return;

    // check turn
    if (room.turn !== playerSymbol) {
      socket.emit("invalid", { reason: "Not your turn" });
      return;
    }

    // check cell empty
    if (room.board[index] !== null) {
      socket.emit("invalid", { reason: "Cell occupied" });
      return;
    }

    // apply move
    room.board[index] = playerSymbol;
    // toggle turn
    room.turn = room.turn === "X" ? "O" : "X";

    io.to(roomId).emit("updateBoard", {
      board: room.board,
      message: `Player ${playerSymbol} moved`,
    });
  });

  socket.on("disconnect", () => {
    // remove player from rooms
    for (const [roomId, room] of Object.entries(rooms)) {
      const idx = room.players.indexOf(socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        io.to(roomId).emit("updateBoard", {
          board: room.board,
          message: "A player disconnected",
        });
        if (room.players.length === 0) {
          delete rooms[roomId];
        }
      }
    }
    console.log("socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, CLIENT_URL=${CLIENT_URL}`);
});
