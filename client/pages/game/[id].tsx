import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

let socket: any = null;

export default function Game() {
  const router = useRouter();
  const { id } = router.query;

  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [player, setPlayer] = useState<"X" | "O" | null>(null);
  const [status, setStatus] = useState("Connecting...");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!id) return;

    const BACKEND =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    socket = io(BACKEND, { transports: ["websocket"] });

    socket.emit("joinRoom", id);

    socket.on("roomJoined", (data: any) => {
      setPlayer(data.player);
      setBoard(data.board);
      setStatus(data.message);
    });

    socket.on("updateBoard", (data: any) => {
      setBoard(data.board);
      setStatus(data.message);
    });

    socket.on("roomFull", () => {
      setStatus("Room full");
    });

    socket.on("invalid", (d: any) => {
      setStatus(d.reason);
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected");
    });

    socket.on("gameOver", (data: any) => {
      setBoard(data.board);
      setGameOver(true);
      setStatus(data.winner ? `Winner: ${data.winner}` : "Draw!");
    });

    socket.on("restart", (data: any) => {
      setBoard(data.board);
      setGameOver(false);
      setStatus("Game restarted");
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [id]);

  function clickCell(i: number) {
    if (!socket || gameOver) return;
    socket.emit("play", { roomId: id, index: i });
  }

  function restartGame() {
    if (!socket) return;
    socket.emit("restart", id);
  }

  function renderCell(i: number) {
    const value = board[i];

    const base =
      "w-20 h-20 rounded-xl flex items-center justify-center text-3xl font-bold transition";

    if (!value) {
      return (
        <button
          onClick={() => clickCell(i)}
          disabled={gameOver}
          className={`${base} bg-white/10 hover:bg-white/20`}
        />
      );
    }

    if (value === "X") {
      return (
        <div
          className={`${base}`}
          style={{
            backgroundColor: "#0fd",
            boxShadow:
              "0 3px 2px rgba(0, 0, 70, .4), 0 4px 35px #0fd, inset 0 -5px 1px #00e2c0",
          }}
        >
          X
        </div>
      );
    }

    return (
      <div
        className={`${base}`}
        style={{
          backgroundColor: "#f6f",
          boxShadow:
            "0 3px 2px rgba(0, 0, 70, .4), 0 4px 35px #f6f, inset 0 -5px 1px #e047ff",
        }}
      >
        O
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#06066b] text-white">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-lg opacity-80">Match: {id}</h2>

        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i}>{renderCell(i)}</div>
          ))}
        </div>

        <p className="text-sm opacity-90">
          {status} {player ? `| You: ${player}` : ""}
        </p>

        {gameOver && (
          <button
            onClick={restartGame}
            className="mt-4 px-6 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
          >
            Restart Match
          </button>
        )}
      </div>
    </main>
  );
}
