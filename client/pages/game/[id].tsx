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
    return (
      <button
        onClick={() => clickCell(i)}
        disabled={gameOver}
        style={{
          width: 60,
          height: 60,
          fontSize: 24,
          cursor: gameOver ? "not-allowed" : "pointer",
        }}
      >
        {board[i]}
      </button>
    );
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
      }}
    >
      <h2>Match: {id}</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 60px)",
          gap: 5,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i}>{renderCell(i)}</div>
        ))}
      </div>

      <p style={{ marginTop: 10 }}>
        {status} {player ? `| You: ${player}` : ""}
      </p>

      {gameOver && (
        <button
          onClick={restartGame}
          style={{
            marginTop: 15,
            padding: "8px 16px",
            fontSize: 16,
          }}
        >
          Restart Match
        </button>
      )}
    </main>
  );
}
