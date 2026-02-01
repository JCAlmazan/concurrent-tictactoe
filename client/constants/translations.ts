import { ConcurrencyConcept } from "./concurrency";

export const DICTIONARY = {
  en: {
    ui: {
        systemStatus: "System Status: Active",
        playingAs: "Playing as",
        observer: "Observer Mode",
        waitingInit: "Waiting for session initialization",
        shareId: "Share State ID",
        sessionProtocol: "Session Protocol",
        triggerReset: "Trigger State Reset",
        initNewState: "Initialize New State (Create Room)",
        sync: "Sync",
        existingState: "Existing State ID",
        footer: "This application is a controlled environment designed to expose real-world concurrency mechanisms through observable behavior.",
        title: "Concurrent Tic-Tac-Toe",
        subtitle: "Explore race conditions, state synchronization, and eventual consistency in a real-time environment.",
        homeBannerTitle: "Distributed State & Concurrency Demo",
        homeBannerSub: "Select a consistency domain (room) to begin",
        systemReady: "System Ready",
        serverMessages: {
            "Waiting for second player...": "Waiting for second player...",
            "Game started": "Game started",
            "Game started - Roles swapped": "Game started - Roles swapped",
            "Room full": "Room full",
            "Disconnected": "Disconnected",
            "Game restarted": "Game restarted",
            "Game restarted - Roles swapped": "Game restarted - Roles swapped",
            "Cell occupied": "Cell occupied",
            "Not your turn": "Not your turn",
            "Cell already taken": "Cell already taken",
            "Draw!": "Draw!",
            "Syncing...": "Syncing...",
            "Connecting...": "Connecting..."
        }
    },
    concepts: {
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
      DISTRIBUTED_SYSTEM: {
        id: "distributed_system",
        title: "DISTRIBUTED SYSTEM",
        text: "This application exposes real-world concurrency mechanisms through observable runtime behavior."
      }
    } as Record<string, ConcurrencyConcept>
  },
  es: {
    ui: {
        systemStatus: "Estado del Sistema: Activo",
        playingAs: "Jugando como",
        observer: "Modo Observador",
        waitingInit: "Esperando inicialización de sesión",
        shareId: "Compartir ID de Estado",
        sessionProtocol: "Protocolo de Sesión",
        triggerReset: "Reiniciar Estado",
        initNewState: "Inicializar Nuevo Estado (Crear Sala)",
        sync: "Sincronizar",
        existingState: "ID de Estado Existente",
        footer: "Esta aplicación es un entorno controlado diseñado para exponer mecanismos de concurrencia del mundo real mediante comportamiento observable.",
        title: "Ta-Te-Ti Concurrente",
        subtitle: "Explora condiciones de carrera, sincronización de estado y consistencia eventual en tiempo real.",
        homeBannerTitle: "Demostración de Estado Distribuido y Concurrencia",
        homeBannerSub: "Selecciona un dominio de consistencia (sala) para comenzar",
        systemReady: "Sistema Listo",
        serverMessages: {
            "Waiting for second player...": "Esperando segundo jugador...",
            "Game started": "Juego iniciado",
            "Game started - Roles swapped": "Juego iniciado - Roles cambiados",
            "Room full": "Sala llena",
            "Disconnected": "Desconectado",
            "Game restarted": "Juego reiniciado",
            "Game restarted - Roles swapped": "Juego reiniciado - Roles cambiados",
            "Cell occupied": "Celda ocupada",
            "Not your turn": "No es tu turno",
            "Cell already taken": "Celda ya ocupada",
            "Draw!": "¡Empate!",
            "Syncing...": "Sincronizando...",
            "Connecting...": "Conectando..."
        }
    },
    concepts: {
      SHARED_STATE: {
        id: "shared_state",
        title: "ESTADO COMPARTIDO",
        text: "Este juego opera sobre un estado compartido. El tablero, turnos y resultado se sincronizan entre múltiples clientes en tiempo real."
      },
      SERVER_AUTHORITATIVE: {
        id: "server_authoritative",
        title: "SERVIDOR AUTORITATIVO",
        text: "El servidor actúa como la única fuente de verdad. Todos los clientes sincronizan su estado local a partir de actualizaciones aprobadas."
      },
      MUTUAL_EXCLUSION: {
        id: "mutual_exclusion",
        title: "EXCLUSIÓN MUTUA",
        text: "Se impone exclusión mutua lógica. Solo un jugador tiene permitido realizar un movimiento válido a la vez."
      },
      TURN_SYNCHRONIZATION: {
        id: "turn_based_synchronization",
        title: "SINCRONIZACIÓN POR TURNOS",
        text: "La sincronización por turnos asegura una progresión determinista. Las acciones concurrentes se serializan mediante validación de turno."
      },
      RACE_CONDITION: {
        id: "race_condition_prevention",
        title: "PREVENCIÓN DE RACE CONDITION",
        text: "Las condiciones de carrera se previenen a nivel servidor. Las acciones simultáneas se resuelven de forma determinista."
      },
      CONFLICT_DETECTION: {
        id: "conflict_detection",
        title: "DETECCIÓN DE CONFLICTOS",
        text: "Operaciones concurrentes inválidas son detectadas y rechazadas. La integridad del estado se preserva ante acciones conflictivas."
      },
      EVENTUAL_CONSISTENCY: {
        id: "eventual_consistency",
        title: "CONSISTENCIA EVENTUAL",
        text: "El sistema provee consistencia eventual. Todos los clientes convergen al mismo estado de juego tras la sincronización."
      },
      TERMINAL_STATE: {
        id: "terminal_state_enforcement",
        title: "EJECUCIÓN DE ESTADO TERMINAL",
        text: "Se imponen estados terminales. Una vez finalizado el juego, no se permiten más mutaciones."
      },
      SAFE_RESTART: {
        id: "safe_restart",
        title: "REINICIO SEGURO",
        text: "El reinicio del juego se realiza de forma segura. Todos los clientes transicionan a un estado inicial limpio simultáneamente."
      },
      CONCURRENT_SESSIONS: {
        id: "concurrent_sessions",
        title: "SESIONES CONCURRENTES",
        text: "Múltiples sesiones concurrentes están aisladas. Cada sala de juego mantiene estado y sincronización independientes."
      },
      IDEMPOTENCY: {
        id: "idempotency",
        title: "IDEMPOTENCIA",
        text: "Las acciones son idempotentes. Eventos repetidos o duplicados no corrompen el estado del juego."
      },
      DISTRIBUTED_SYSTEM: {
        id: "distributed_system",
        title: "SISTEMA DISTRIBUIDO",
        text: "Esta aplicación expone mecanismos de concurrencia del mundo real a través de comportamiento observable."
      }
    } as Record<string, ConcurrencyConcept>
  }
};
