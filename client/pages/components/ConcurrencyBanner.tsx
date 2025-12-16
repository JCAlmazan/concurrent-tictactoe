type Props = {
  mode: "home" | "game";
};

export default function ConcurrencyBanner({ mode }: Props) {
  return (
    <div className="mb-6 w-full max-w-xl rounded-xl bg-glass px-6 py-4 text-center text-sm leading-relaxed">
      {mode === "home" && (
        <>
          <p>
            This application uses <strong>room-based concurrency</strong> to
            allow multiple matches to run simultaneously.
          </p>
          <p className="mt-2">
            Each game room is isolated in memory and managed independently by
            the server.
          </p>
        </>
      )}

      {mode === "game" && (
        <>
          <p>
            This match is synchronized in real time using{" "}
            <strong>WebSockets</strong>.
          </p>
          <p className="mt-2">
            The server acts as the authoritative source of truth, validating
            moves and broadcasting state updates to all connected players.
          </p>
        </>
      )}
    </div>
  );
}
