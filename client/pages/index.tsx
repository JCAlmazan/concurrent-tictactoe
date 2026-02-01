import { useState } from "react";
import { useRouter } from "next/router";
import ConcurrencyBanner from "../components/ConcurrencyBanner"; // Added this import

export default function Home() {
  const [id, setId] = useState("");
  const router = useRouter(); // Fixed typo: 'useRout' changed to 'useRouter()'

  function createRoom() {
    const room = Math.random().toString(36).slice(2, 9);
    router.push(`/game/${room}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white font-sans p-4">
      
      {/* Top Banner - Academic */}
      <div className="w-full max-w-md mb-8">
        <ConcurrencyBanner />
      </div>

      <main className="flex flex-col items-center w-full max-w-md">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,255,0.3)] text-center">
          Concurrent Tic-Tac-Toe
        </h1>
        <p className="opacity-70 text-center leading-relaxed mb-8 text-sm">
          Explore race conditions, state synchronization, and eventual consistency in a real-time environment.
        </p>
        
        <div className="flex flex-col gap-4 w-full">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95" onClick={createRoom}>
            Initialize New State (Create Room)
          </button>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
              #
            </div>
            <div className="flex gap-2">
                <input
                  className="flex-1 pl-8 p-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
                  placeholder="Existing State ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 rounded-xl border border-white/10 transition-all" onClick={() => router.push(`/game/${id}`)}>
                  Sync
                </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Banner - Footer Status */}
      <div className="w-full max-w-md mt-12 bg-white/5 border border-white/10 rounded-xl py-4 text-center backdrop-blur-sm">
         <p className="text-xs font-semibold text-cyan-300 tracking-widest uppercase mb-2">
            System Status: Active
         </p>
         <p className="text-[10px] opacity-50 font-mono px-4 leading-relaxed">
            This application is a controlled environment designed to expose real-world concurrency mechanisms through observable behavior.
         </p>
      </div>
    </div>
  );
}
