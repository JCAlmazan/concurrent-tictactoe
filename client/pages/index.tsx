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
    <div className="min-h-screen flex flex-col bg-background text-white font-sans">
      <ConcurrencyBanner
        message="Distributed State & Concurrency Demo"
        subMessage="Select a consistency domain (room) to begin"
      />

      <main className="flex flex-col items-center mt-[10vh] px-4">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,255,0.3)] text-center">
          Concurrent Tic-Tac-Toe
        </h1>
        <p className="opacity-70 max-w-md text-center leading-relaxed mb-4">
          Explore race conditions, state synchronization, and eventual consistency in a real-time environment.
        </p>

        <div className="flex flex-col gap-4 mt-10 w-full max-w-xs">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg" onClick={createRoom}>
            Initialize New State (Create Room)
          </button>

          <div className="flex gap-2">
            <input
              className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Existing State ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg" onClick={() => router.push(`/game/${id}`)}>
              Sync
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
