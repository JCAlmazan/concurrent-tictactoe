import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import ConcurrencyBanner from "../../components/ConcurrencyBanner";

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
    
    // Base classes
    let classes = "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold text-white drop-shadow-md transition-transform duration-100 bg-white/10 hover:bg-white/15 shadow-inner border border-white/5";
    
    // Player specific classes (using custom configuration)
    if (value === "X") {
      classes += " bg-neon-blue shadow-neon-x scale-105 border-transparent";
    } else if (value === "O") {
      classes += " bg-neon-purple shadow-neon-o scale-105 border-transparent";
    }

    if (gameOver) classes += " cursor-not-allowed opacity-80";
    else classes += " cursor-pointer hover:scale-105 active:scale-95";

    return (
      <button
        onClick={() => clickCell(i)}
        disabled={gameOver}
        className={classes}
      >
        {value === "X" && (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
        {value === "O" && (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
            <circle cx="12" cy="12" r="9"></circle>
          </svg>
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-white font-sans">
      <ConcurrencyBanner 
        message={`Consistency Domain: ${id}`}
        subMessage={status} 
      />

      <main className="flex flex-col items-center p-5 mt-10">
        {/* Visual Cue for Player */}
        <div className="mb-8 opacity-80 font-mono text-sm tracking-wider bg-black/20 px-4 py-2 rounded-lg border border-white/10 shadow-sm">
             [Local Thread: {player || "Observer"}]
        </div>

        <div className="grid grid-cols-3 gap-4 p-6 bg-black/20 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i}>{renderCell(i)}</div>
          ))}
        </div>

        {gameOver && (
          <button
            onClick={restartGame}
            className="mt-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3 px-8 rounded-full transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
          >
            Trigger State Reset
          </button>
        )}
      </main>
    </div>
  );
}
