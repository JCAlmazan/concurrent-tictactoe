import React, { useEffect, useState } from 'react';
import { CONCURRENCY_CONCEPTS, ConcurrencyConcept } from '../constants/concurrency';

interface ConcurrencyBannerProps {
  gameState?: any;
  message?: string; // Fallback for manual overrides
  subMessage?: string;
}

export default function ConcurrencyBanner({ gameState, message, subMessage }: ConcurrencyBannerProps) {
  const [activeConcept, setActiveConcept] = useState<ConcurrencyConcept>(CONCURRENCY_CONCEPTS.DISTRIBUTED_SYSTEM);

  useEffect(() => {
    if (!gameState) {
        if (message) {
            // If no gamestate but message is provided (e.g. Home page), use a custom object or default
            return;
        }
        return;
    }

    const determineConcept = () => {
        // High priority: Game Over states
        if (gameState.gameOver) {
            return CONCURRENCY_CONCEPTS.TERMINAL_STATE;
        }

        // Restarting? (If status indicates restart - simple heuristic)
        if (gameState.status === "Game restarted") {
            return CONCURRENCY_CONCEPTS.SAFE_RESTART;
        }

        // Turn logic
        if (gameState.player && gameState.board) {
             const xCount = gameState.board.filter((c: any) => c === 'X').length;
             const oCount = gameState.board.filter((c: any) => c === 'O').length;
             const currentTurn = xCount === oCount ? 'X' : 'O';

             if (currentTurn === gameState.player) {
                 return CONCURRENCY_CONCEPTS.TURN_SYNCHRONIZATION;
             } else {
                 return CONCURRENCY_CONCEPTS.MUTUAL_EXCLUSION; 
             }
        }

        // Default active state
        if (gameState.status === 'Connected' || gameState.status.includes('Welcome')) {
            return CONCURRENCY_CONCEPTS.SHARED_STATE;
        }
        
        return CONCURRENCY_CONCEPTS.SERVER_AUTHORITATIVE;
    };

    setActiveConcept(determineConcept());

  }, [gameState]);

  // Manual Override / Home Page Mode
  if (!gameState && message) {
     return (
        <div className="w-full bg-white/10 border border-white/10 rounded-xl py-4 px-6 text-center backdrop-blur-sm transition-all duration-500 shadow-lg">
          <h3 className="m-0 font-semibold text-xl tracking-wide text-white/90">{message}</h3>
          {subMessage && <small className="block mt-2 opacity-70 text-sm font-light">{subMessage}</small>}
        </div>
      );
  }

  return (
    <div className="w-full bg-indigo-900/40 border border-indigo-500/30 rounded-xl py-4 px-6 text-center backdrop-blur-md shadow-xl transition-all duration-500">
      <h3 className="m-0 font-bold text-lg tracking-wider text-cyan-300 uppercase drop-shadow-sm">
        {activeConcept.title}
      </h3>
      <p className="block mt-2 text-white/80 text-sm font-light leading-relaxed">
        {activeConcept.text}
      </p>
    </div>
  );
}
