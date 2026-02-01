export interface ConcurrencyConcept {
  id: string;
  title: string;
  text: string;
}

export const CONCURRENCY_CONCEPTS: Record<string, ConcurrencyConcept> = {
  SHARED_STATE: {
    id: "shared_state",
    title: "SHARED STATE",
    text: "This game operates on shared state. The board, turn order, and outcome are synchronized across multiple clients in real time."
  },
  SERVER_AUTHORITATIVE: {
    id: "server_authoritative",
    title: "SERVER AUTHORITATIVE",
    text: "The server acts as the single source of truth. All clients synchronize their local state from server-approved updates."
  },
  MUTUAL_EXCLUSION: {
    id: "mutual_exclusion",
    title: "MUTUAL EXCLUSION",
    text: "Logical mutual exclusion is enforced. Only one player is allowed to perform a valid move at a time."
  },
  TURN_SYNCHRONIZATION: {
    id: "turn_based_synchronization",
    title: "TURN BASED SYNCHRONIZATION",
    text: "Turn-based synchronization ensures deterministic progression. Concurrent actions are serialized through turn validation."
  },
  RACE_CONDITION: {
    id: "race_condition_prevention",
    title: "RACE CONDITION PREVENTION",
    text: "Race conditions are prevented at the server level. Simultaneous actions are resolved deterministically."
  },
  CONFLICT_DETECTION: {
    id: "conflict_detection",
    title: "CONFLICT DETECTION",
    text: "Invalid concurrent operations are detected and rejected. State integrity is preserved under conflicting actions."
  },
  EVENTUAL_CONSISTENCY: {
    id: "eventual_consistency",
    title: "EVENTUAL CONSISTENCY",
    text: "The system provides eventual consistency. All clients converge to the same game state after synchronization."
  },
  TERMINAL_STATE: {
    id: "terminal_state_enforcement",
    title: "TERMINAL STATE ENFORCEMENT",
    text: "Terminal states are enforced. Once the game is finished, no further mutations are allowed."
  },
  SAFE_RESTART: {
    id: "safe_restart",
    title: "SAFE RESTART",
    text: "Game reset is performed safely. All clients transition to a clean initial state simultaneously."
  },
  CONCURRENT_SESSIONS: {
    id: "concurrent_sessions",
    title: "CONCURRENT SESSIONS",
    text: "Multiple concurrent sessions are isolated. Each game room maintains independent state and synchronization."
  },
  IDEMPOTENCY: {
    id: "idempotency",
    title: "IDEMPOTENCY",
    text: "Actions are idempotent. Repeated or duplicated events do not corrupt the game state."
  },
  // Default/Fallback
  DISTRIBUTED_SYSTEM: {
    id: "distributed_system",
    title: "DISTRIBUTED SYSTEM",
    text: "This application exposes real-world concurrency mechanisms through observable runtime behavior."
  }
};
