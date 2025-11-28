import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // default options
});

// Serve static exported Next.js files (client should run `next build && next export -o out`)
app.use(express.static(path.join(__dirname, "out")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "out", "index.html"));
});

// Simple in-memory rooms state
const rooms: Record<
  string,
  { board: (null | "X" | "O")[]; players: string[]; turn: "X" | "O" }
> = {};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    const room = rooms[roomId];
    if (!room) {
      // create room
      rooms[roomId] = {
        board: Array(9).fill(null),
        players: [socket.id],
        turn: "X",
      };
      socket.join(roomId);
      socket.emit("roomJoined", {
        player: "X",
        board: rooms[roomId].board,
        message: "Esperando segundo jugador...",
      });
      return;
    }

    if (room.players.length === 1) {
      room.players.push(socket.id);
      socket.join(roomId);
      // notify both players
      io.to(roomId).emit("roomJoined", {
        player: "O",
        board: room.board,
        message: "Partida iniciada",
      });
      io.to(roomId).emit("updateBoard", {
        board: room.board,
        message: "Comenzó la partida",
      });
      return;
    }

    // room full
    socket.emit("roomFull", {});
  });

  socket.on("play", ({ roomId, index }) => {
    const room = rooms[roomId];
    if (!room) return;

    // simple mapping: first player is X, second is O
    const playerIndex = room.players.indexOf(socket.id);
    const playerSymbol =
      playerIndex === 0 ? "X" : playerIndex === 1 ? "O" : null;
    if (!playerSymbol) return;

    // check turn
    if (room.turn !== playerSymbol) {
      socket.emit("invalid", { reason: "No es tu turno" });
      return;
    }

    // check cell empty
    if (room.board[index] !== null) {
      socket.emit("invalid", { reason: "Casilla ocupada" });
      return;
    }

    // apply move
    room.board[index] = playerSymbol;
    // toggle turn
    room.turn = room.turn === "X" ? "O" : "X";

    io.to(roomId).emit("updateBoard", {
      board: room.board,
      message: `Jugador ${playerSymbol} jugó`,
    });
  });

  socket.on("disconnect", () => {
    // remove player from any room
    for (const [roomId, room] of Object.entries(rooms)) {
      const idx = room.players.indexOf(socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        io.to(roomId).emit("updateBoard", {
          board: room.board,
          message: "Un jugador se desconectó",
        });
        // if empty, delete room
        if (room.players.length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
