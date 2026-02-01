import React, { useEffect, useState } from 'react';
import { CONCURRENCY_CONCEPTS, ConcurrencyConcept } from '../constants/concurrency';

interface ConcurrencyBannerProps {
  gameState?: any;
  message?: string; // Fallback for manual overrides
  subMessage?: string;
}

export default function ConcurrencyBanner({ gameState, message, subMessage }: ConcurrencyBannerProps) {
  const [activeConcepts, setActiveConcepts] = useState<ConcurrencyConcept[]>([]);

  useEffect(() => {
    const concepts: ConcurrencyConcept[] = [];

    if (!gameState) {
      // Home page specific concepts
      concepts.push(CONCURRENCY_CONCEPTS.CONCURRENT_SESSIONS);
      concepts.push(CONCURRENCY_CONCEPTS.DISTRIBUTED_SYSTEM);
      setActiveConcepts(concepts);
      return;
    }

    // Server source of truth is always active when connected
    if (gameState.status !== 'Disconnected' && gameState.status !== 'Connecting...') {
        concepts.push(CONCURRENCY_CONCEPTS.SERVER_AUTHORITATIVE);
    }

    // Shared state is always active in a room
    if (gameState.id) {
        concepts.push(CONCURRENCY_CONCEPTS.SHARED_STATE);
    }

    // High priority: Game Over states
    if (gameState.gameOver) {
        concepts.push(CONCURRENCY_CONCEPTS.TERMINAL_STATE);
    }

    // Conflict detection
    if (gameState.status === 'Cell already taken' || gameState.status === 'Not your turn') {
        concepts.push(CONCURRENCY_CONCEPTS.CONFLICT_DETECTION);
    }

    // Restarting? (If status indicates restart - simple heuristic)
    if (gameState.status === "Game restarted") {
        concepts.push(CONCURRENCY_CONCEPTS.SAFE_RESTART);
    }

    // Turn logic
    if (gameState.player && gameState.board && !gameState.gameOver) {
         const xCount = gameState.board.filter((c: any) => c === 'X').length;
         const oCount = gameState.board.filter((c: any) => c === 'O').length;
         const currentTurn = xCount === oCount ? 'X' : 'O';

         if (currentTurn === gameState.player) {
             concepts.push(CONCURRENCY_CONCEPTS.TURN_SYNCHRONIZATION);
         } else {
             concepts.push(CONCURRENCY_CONCEPTS.MUTUAL_EXCLUSION); 
         }
    }

    // Eventual consistency is inherent in the async nature
    if (gameState.status === 'Syncing...') {
        concepts.push(CONCURRENCY_CONCEPTS.EVENTUAL_CONSISTENCY);
    }

    if (concepts.length === 0) {
        concepts.push(CONCURRENCY_CONCEPTS.DISTRIBUTED_SYSTEM);
    }

    setActiveConcepts(concepts);

  }, [gameState]);

  // Fallback for Manual Override (e.g. initial load before any state)
  if (!gameState && message && activeConcepts.length === 0) {
     return (
        <div className="w-full bg-white/10 border border-white/10 rounded-xl py-4 px-6 text-center backdrop-blur-sm transition-all duration-500 shadow-lg">
          <h3 className="m-0 font-semibold text-xl tracking-wide text-white/90">{message}</h3>
          {subMessage && <small className="block mt-2 opacity-70 text-sm font-light">{subMessage}</small>}
        </div>
      );
  }

  return (
    <div className="w-full space-y-3">
        {activeConcepts.map((concept, idx) => (
            <div 
                key={concept.id} 
                className="w-full bg-indigo-900/40 border border-indigo-500/30 rounded-xl py-2 px-6 text-center backdrop-blur-md shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-top-2"
                style={{ animationDelay: `${idx * 100}ms` }}
            >
                <h3 className="m-0 font-bold text-[10px] tracking-wider text-cyan-300 uppercase drop-shadow-sm">
                    {concept.title}
                </h3>
                <p className="block mt-0.5 text-white/70 text-[11px] font-light leading-snug">
                    {concept.text}
                </p>
            </div>
        ))}
    </div>
  );
}
