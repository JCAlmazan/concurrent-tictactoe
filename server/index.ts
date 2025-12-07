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
 *   [roomId]: {
 *     board: (null|'X'|'O')[],
 *     players: string[],
 *     turn: 'X'|'O',
 *     finished: boolean
 *   }
 * }
 */
const rooms: Record<
  string,
  {
    board: (null | "X" | "O")[];
    players: string[];
    turn: "X" | "O";
    finished: boolean;
  }
> = {};

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: (null | "X" | "O")[]) {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }
  return null;
}

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
        finished: false,
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
      room.finished = false;
      room.board = Array(9).fill(null);
      room.turn = "X";

      socket.join(roomId);

      // send only to the newly joined socket that it's player O
      socket.emit("roomJoined", {
        player: "O",
        board: room.board,
        message: "Game started",
      });

      // inform all participants that the game started (does not change assigned players)
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

    if (room.finished) {
      socket.emit("invalid", { reason: "Game is finished" });
      return;
    }

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

    // check for winner
    const winner = checkWinner(room.board);
    if (winner) {
      room.finished = true;
      io.to(roomId).emit("updateBoard", {
        board: room.board,
        message: `Player ${playerSymbol} wins!`,
      });

      io.to(roomId).emit("gameOver", {
        winner,
        board: room.board,
      });
      return;
    }

    // check for draw
    if (room.board.every((c) => c !== null)) {
      room.finished = true;

      io.to(roomId).emit("updateBoard", {
        board: room.board,
        message: "Draw!",
      });

      io.to(roomId).emit("gameOver", {
        winner: null,
        board: room.board,
      });

      return;
    }

    // toggle turn
    room.turn = room.turn === "X" ? "O" : "X";

    io.to(roomId).emit("updateBoard", {
      board: room.board,
      message: `Player ${playerSymbol} moved`,
    });
  });

  // restart request
  socket.on("restart", (roomId: string) => {
    const room = rooms[roomId];
    if (!room) return;

    room.board = Array(9).fill(null);
    room.turn = "X";
    room.finished = false;

    io.to(roomId).emit("restart", {
      board: room.board,
      message: "Game restarted",
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

// SPA FALLBACK (IMPORTANT: MUST BE LAST ROUTE)
app.get("*", (_, res) => {
  res.sendFile(path.join(outPath, "index.html"));
});

// START SERVER
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, CLIENT_URL=${CLIENT_URL}`);
});
