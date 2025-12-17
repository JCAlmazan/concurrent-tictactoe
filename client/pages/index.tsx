import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [id, setId] = useState("");
  const router = useRouter();

  function createRoom() {
    const room = Math.random().toString(36).slice(2, 9);
    router.push(`/game/${room}`);
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
      }}
    >
      <h1>Ta-Te-Ti Multiplayer (demo)</h1>
      <p>Crear o unirse a una sala para jugar en tiempo real.</p>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={createRoom}>Crear partida</button>
        <input
          placeholder="ID de sala"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={() => router.push(`/game/${id}`)}>Unirse</button>
      </div>
    </main>
  );
}
