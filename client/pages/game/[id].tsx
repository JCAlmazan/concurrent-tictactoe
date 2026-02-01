import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import ConcurrencyBanner from "../../components/ConcurrencyBanner";
import LanguageToggle from "../../components/LanguageToggle";
import { useLanguage } from "../../context/LanguageContext";
import { DICTIONARY } from "../../constants/translations";

let socket: any = null;

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [player, setPlayer] = useState<"X" | "O" | null>(null);
  const [status, setStatus] = useState("Connecting...");
  const [gameOver, setGameOver] = useState(false);
  const { language } = useLanguage();
  const t = DICTIONARY[language].ui;

  const translateStatus = (svrMsg: string) => {
    // Try to find exact match in serverMessages
    if (t.serverMessages[svrMsg as keyof typeof t.serverMessages]) {
        return t.serverMessages[svrMsg as keyof typeof t.serverMessages];
    }
    // Handle dynamic messages like "Winner: X" or "Player X moved"
    if (svrMsg.startsWith("Winner: ")) {
       return svrMsg.replace("Winner:", language === 'es' ? "Ganador:" : "Winner:");
    }
    if (svrMsg.includes("moved")) {
       return svrMsg.replace("moved", language === 'es' ? "movió" : "moved")
                    .replace("Player", language === 'es' ? "Jugador" : "Player");
    }
    // Fallback
    return svrMsg;
  };

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
      if (data.player) {
          setPlayer(data.player);
      }
      setStatus("Game restarted");
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [id]);

  function clickCell(i: number) {
    if (!socket || gameOver || board[i]) return;
    setStatus("Syncing..."); // Trigger Eventual Consistency visual
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white font-sans p-4 relative">
      <LanguageToggle />

      {/* Top Banner - Academic Context */}
      <div className="w-full max-w-md mb-6 min-h-[160px] flex items-end justify-center">
        <ConcurrencyBanner 
          gameState={{
            id,
            player,
            status,
            gameOver,
            board
          }}
        />
      </div>

      {/* Room ID Display & Controls */}
      <div className="mb-6 flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">{t.sessionProtocol}</span>
        <div className="flex gap-4">
            <button 
                onClick={() => router.push('/')}
                className="flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/30 hover:text-cyan-300 transition-all text-white/50"
                title="Return to Consistency Domain Selection (Home)"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            </button>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm group hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => {
            navigator.clipboard.writeText(id as string);
            alert("Room ID copied to clipboard!");
            }}>
            <code className="text-blue-400 font-mono font-bold tracking-wider">{id}</code>
            <div className="h-3 w-px bg-white/10"></div>
            <span className="text-[10px] text-white/40 uppercase font-mono group-hover:text-white/60">{t.shareId}</span>
            </div>
        </div>
      </div>

      {/* Game Board */}
      <main className="flex flex-col items-center">
        <div className="grid grid-cols-3 gap-4 p-6 bg-black/20 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i}>{renderCell(i)}</div>
          ))}
        </div>

        {gameOver && (
          <button
            onClick={restartGame}
            className="mt-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3 px-8 rounded-full transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>
            {t.triggerReset}
          </button>
        )}
      </main>
      
      {/* Bottom Banner - Gameplay Context */}
      <div className="w-full max-w-md mt-8 bg-white/5 border border-white/10 rounded-xl py-4 text-center backdrop-blur-sm shadow-lg">
         <p className="text-sm font-medium text-white/90 mb-1">
            {player ? `${t.playingAs}: ${player}` : t.observer} 
            <span className="mx-2 opacity-30">|</span> 
            {translateStatus(status)}
         </p>
         <div className="h-px w-1/3 bg-white/10 mx-auto my-2"></div>
         <p className="text-[10px] opacity-50 font-mono tracking-wide">
            State Machine • Observable Concurrency • Eventual Consistency
         </p>
      </div>
    </div>
  );
}
