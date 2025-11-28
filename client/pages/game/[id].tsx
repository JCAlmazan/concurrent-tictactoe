import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

let socket: any = null;

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [player, setPlayer] = useState<"X" | "O" | null>(null);
  const [status, setStatus] = useState("Conectando...");

  useEffect(() => {
    if (!id) return;
    // connect to same origin; socket.io served by server at /socket.io
    socket = io(undefined, { path: "/socket.io" });
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
      setStatus("Sala completa");
    });

    socket.on("invalid", (d: any) => {
      setStatus(d.reason);
    });

    socket.on("disconnect", () => {
      setStatus("Desconectado");
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [id]);

  function clickCell(i: number) {
    if (!socket) return;
    socket.emit("play", { roomId: id, index: i });
  }

  function renderCell(i: number) {
    return (
      <button
        onClick={() => clickCell(i)}
        style={{ width: 60, height: 60, fontSize: 24 }}
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
      <h2>Partida: {id}</h2>
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
        {status} {player ? `| Eres: ${player}` : ""}
      </p>
    </main>
  );
}
