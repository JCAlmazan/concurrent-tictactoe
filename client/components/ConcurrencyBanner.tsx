import React, { useEffect, useState } from 'react';
import { CONCURRENCY_CONCEPTS, ConcurrencyConcept } from '../constants/concurrency';

interface ConcurrencyBannerProps {
  gameState?: any;
  message?: string; // Fallback for manual overrides
  subMessage?: string;
}

export default function ConcurrencyBanner({ gameState, message, subMessage }: ConcurrencyBannerProps) {
  const [displayedConcepts, setDisplayedConcepts] = useState<ConcurrencyConcept[]>([]);
  // We use a separate state to track what is *currently* strictly active based on game logic,
  // effectively decoupling the logic from the display which has persistence/hysteresis.
  
  // Timers ref to keep track of pending removals
  const removalTimers = React.useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    // 1. Calculate strictly active concepts based on current state
    const validConcepts: ConcurrencyConcept[] = [];

    if (!gameState) {
      // Home page specific concepts
      validConcepts.push(CONCURRENCY_CONCEPTS.CONCURRENT_SESSIONS);
      validConcepts.push(CONCURRENCY_CONCEPTS.DISTRIBUTED_SYSTEM);
    } else {
        // Server source of truth is always active when connected
        if (gameState.status !== 'Disconnected' && gameState.status !== 'Connecting...') {
            validConcepts.push(CONCURRENCY_CONCEPTS.SERVER_AUTHORITATIVE);
        }

        // Shared state is always active in a room
        if (gameState.id) {
            validConcepts.push(CONCURRENCY_CONCEPTS.SHARED_STATE);
        }

        // High priority: Game Over states
        if (gameState.gameOver) {
            validConcepts.push(CONCURRENCY_CONCEPTS.TERMINAL_STATE);
        }

        // Conflict detection
        if (gameState.status === 'Cell already taken' || gameState.status === 'Not your turn') {
            validConcepts.push(CONCURRENCY_CONCEPTS.CONFLICT_DETECTION);
        }

        // Restarting? (If status indicates restart - simple heuristic)
        if (gameState.status === "Game restarted") {
            validConcepts.push(CONCURRENCY_CONCEPTS.SAFE_RESTART);
        }

        // Turn logic
        if (gameState.player && gameState.board && !gameState.gameOver) {
             const xCount = gameState.board.filter((c: any) => c === 'X').length;
             const oCount = gameState.board.filter((c: any) => c === 'O').length;
             const currentTurn = xCount === oCount ? 'X' : 'O';

             if (currentTurn === gameState.player) {
                 validConcepts.push(CONCURRENCY_CONCEPTS.TURN_SYNCHRONIZATION);
             } else {
                 validConcepts.push(CONCURRENCY_CONCEPTS.MUTUAL_EXCLUSION); 
             }
        }

        // Eventual consistency: Inherent in async nature, specifically during updates
        if (gameState.status === 'Syncing...') {
            validConcepts.push(CONCURRENCY_CONCEPTS.EVENTUAL_CONSISTENCY);
        }

        if (validConcepts.length === 0) {
            validConcepts.push(CONCURRENCY_CONCEPTS.DISTRIBUTED_SYSTEM);
        }
    }

    // 2. Update Display State with Hysteresis (Lingering)
    setDisplayedConcepts(prev => {
        const next = [...prev];
        const validIds = new Set(validConcepts.map(c => c.id));
        const prevIds = new Set(prev.map(c => c.id));
        
        // A. Handle New Arrivals (Immediate Add)
        validConcepts.forEach(c => {
           if (!prevIds.has(c.id)) {
              next.push(c);
           }
           // Revive: If it was scheduled for removal, cancel it (it's back!)
           if (removalTimers.current[c.id]) {
              clearTimeout(removalTimers.current[c.id]);
              delete removalTimers.current[c.id];
           }
        });
        
        // B. Handle Departures (Delayed Remove)
        prev.forEach(c => {
           if (!validIds.has(c.id)) {
              // Should be removed. 
              // Only start timer if not already pending.
              if (!removalTimers.current[c.id]) {
                 removalTimers.current[c.id] = setTimeout(() => {
                    // Actual removal logic after delay
                    setDisplayedConcepts(current => current.filter(x => x.id !== c.id));
                    delete removalTimers.current[c.id];
                 }, 2000); // 2 seconds persistence
              }
           }
        });

        return next;
    });

  }, [gameState]); // Re-run whenever gameState changes

  // Fallback for Manual Override (e.g. initial load before any state)
  if (!gameState && message && displayedConcepts.length === 0) {
     return (
        <div className="w-full bg-white/10 border border-white/10 rounded-xl py-4 px-6 text-center backdrop-blur-sm transition-all duration-500 shadow-lg">
          <h3 className="m-0 font-semibold text-xl tracking-wide text-white/90">{message}</h3>
          {subMessage && <small className="block mt-2 opacity-70 text-sm font-light">{subMessage}</small>}
        </div>
      );
  }

  // Sort displayed concepts to keep 'Distributed System' or 'Shared State' at bottom if desired, 
  // or just render in order of appearance. Order of appearance (as done by push) might be jumpy.
  // Ideally, we might want a stable sort order based on ID or Priority, but user didn't request specific sort.
  // Using the order in which they were added is fine, but since we modify the array, let's just render.

  return (
    <div className="w-full space-y-3">
        {displayedConcepts.map((concept) => (
            <div 
                key={concept.id} 
                className="w-full bg-indigo-900/40 border border-indigo-500/30 rounded-xl py-2 px-6 text-center backdrop-blur-md shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-top-2"
            >
                <h3 className="m-0 font-bold text-xs tracking-wider text-cyan-300 uppercase drop-shadow-sm">
                    {concept.title}
                </h3>
                <p className="block mt-0.5 text-white/80 text-xs font-light leading-snug">
                    {concept.text}
                </p>
            </div>
        ))}
    </div>
  );
}
