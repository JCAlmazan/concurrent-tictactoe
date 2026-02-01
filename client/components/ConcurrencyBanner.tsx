
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DICTIONARY } from '../constants/translations';
import { ConcurrencyConcept } from '../constants/concurrency';

interface ConcurrencyBannerProps {
  gameState?: any;
}

export default function ConcurrencyBanner({ gameState }: ConcurrencyBannerProps) {
  const { language } = useLanguage();
  const t = DICTIONARY[language];
  const [displayedConcepts, setDisplayedConcepts] = useState<ConcurrencyConcept[]>([]);
  // We use a separate state to track what is *currently* strictly active based on game logic,
  // effectively decoupling the logic from the display which has persistence/hysteresis.
  
  // Timers ref to keep track of pending removals
  const removalTimers = React.useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    // 1. Calculate strictly active concepts based on current state
    const validConcepts: ConcurrencyConcept[] = [];
    
    // Helper to get concept by key (typed)
    const getConcept = (key: keyof typeof t.concepts) => t.concepts[key];
    const CONCEPTS = t.concepts; // This variable is not used in the provided snippet, but included as per instruction.

    if (!gameState) {
      // Home page specific concepts
      validConcepts.push(getConcept('CONCURRENT_SESSIONS'));
      validConcepts.push(getConcept('DISTRIBUTED_SYSTEM'));
    } else {
        // Server source of truth is always active when connected
        if (gameState.status !== 'Disconnected' && gameState.status !== 'Connecting...') {
            validConcepts.push(getConcept('SERVER_AUTHORITATIVE'));
        }

        // Shared state is always active in a room
        if (gameState.id) {
            validConcepts.push(getConcept('SHARED_STATE'));
        }

        // High priority: Game Over states
        if (gameState.gameOver) {
            validConcepts.push(getConcept('TERMINAL_STATE'));
        }

        // Conflict detection
        // We need to match status strings. Ideally we should map status codes, but checking if the translated status matches a known error or just sticking to the logic that triggers these statuses.
        // Actually, gameState.status is coming from server (English).
        // Conflict detection triggers: 'Cell already taken', 'Not your turn', 'Cell occupied'
        if (gameState.status === 'Cell already taken' || gameState.status === 'Not your turn' || gameState.status === 'Cell occupied') {
            validConcepts.push(getConcept('CONFLICT_DETECTION'));
        }

        // Restarting?
        if (gameState.status === "Game restarted" || gameState.status === "Game restarted - Roles swapped") {
            validConcepts.push(getConcept('SAFE_RESTART'));
        }

        // Turn logic
        if (gameState.player && gameState.board && !gameState.gameOver) {
             const xCount = gameState.board.filter((c: any) => c === 'X').length;
             const oCount = gameState.board.filter((c: any) => c === 'O').length;
             const currentTurn = xCount === oCount ? 'X' : 'O';

             if (currentTurn === gameState.player) {
                 validConcepts.push(getConcept('TURN_SYNCHRONIZATION'));
             } else {
                 validConcepts.push(getConcept('MUTUAL_EXCLUSION')); 
             }
        }

        // Eventual consistency
        if (gameState.status === 'Syncing...') {
            validConcepts.push(getConcept('EVENTUAL_CONSISTENCY'));
        }

        if (validConcepts.length === 0) {
            validConcepts.push(getConcept('DISTRIBUTED_SYSTEM'));
        }
    }

    // 2. Update Display State with Hysteresis
    setDisplayedConcepts(prev => {
        const next = [...prev];
        const validIds = new Set(validConcepts.map(c => c.id));
        const prevIds = new Set(prev.map(c => c.id));
        
        // A. Handle New Arrivals
        validConcepts.forEach(c => {
           // Check if ID is already in displayed list (regardless of language version, ID should be stable)
           // Actually, if language changes, the object references change. 
           // We should probably rely on ID matching.
           const existingIndex = next.findIndex(n => n.id === c.id);
           
           if (existingIndex === -1) {
              next.push(c);
           } else {
              // Update text if language changed but concept is same
              next[existingIndex] = c;
           }

           if (removalTimers.current[c.id]) {
              clearTimeout(removalTimers.current[c.id]);
              delete removalTimers.current[c.id];
           }
        });
        
        // B. Handle Departures
        prev.forEach(c => {
           if (!validIds.has(c.id)) {
              if (!removalTimers.current[c.id]) {
                 removalTimers.current[c.id] = setTimeout(() => {
                    setDisplayedConcepts(current => current.filter(x => x.id !== c.id));
                    delete removalTimers.current[c.id];
                 }, 2000); 
              }
           }
        });

        return next;
    });

  }, [gameState, language]); // Re-run whenever gameState OR LANGUAGE changes

  // Fallback for Manual Override (e.g. initial load before any state) - REMOVED as message/subMessage props are removed.

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
