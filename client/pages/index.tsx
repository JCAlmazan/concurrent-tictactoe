import { useState } from "react";
import { useRouter } from "next/router";
import ConcurrencyBanner from "./components/ConcurrencyBanner";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  function createRoom() {
    const id = Math.random().toString(36).substring(2, 8);
    router.push(`/${id}`);
  }

  function joinRoom() {
    if (!roomId) return;
    router.push(`/${roomId}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <ConcurrencyBanner mode="home" />

      <div className="flex flex-col items-center gap-4 rounded-xl bg-glass px-6 py-6">
        <button
          onClick={createRoom}
          className="rounded-lg bg-white/20 px-4 py-2 hover:bg-white/30"
        >
          Create new room
        </button>

        <div className="flex gap-2">
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Room ID"
            className="rounded-lg px-3 py-2 text-black"
          />
          <button
            onClick={joinRoom}
            className="rounded-lg bg-white/20 px-4 py-2 hover:bg-white/30"
          >
            Join
          </button>
        </div>
      </div>
    </main>
  );
}
