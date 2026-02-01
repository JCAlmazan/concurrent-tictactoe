import { useState } from "react";
import { useRouter } from "next/router";
import ConcurrencyBanner from "../components/ConcurrencyBanner";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";
import { DICTIONARY } from "../constants/translations";

export default function Home() {
  const [id, setId] = useState("");
  const router = useRouter();
  const { language } = useLanguage();
  const t = DICTIONARY[language].ui;

  function createRoom() {
    const room = Math.random().toString(36).slice(2, 9);
    router.push(`/game/${room}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white font-sans p-4 relative">
      <LanguageToggle />
      
      {/* Top Banner - Academic */}
      <div className="w-full max-w-md mb-8">
        <ConcurrencyBanner />
      </div>

      <main className="flex flex-col items-center w-full max-w-md">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,255,0.3)] text-center">
          {t.title}
        </h1>
        <p className="opacity-70 text-center leading-relaxed mb-8 text-sm">
          {t.subtitle}
        </p>
        
        <div className="flex flex-col gap-4 w-full">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95" onClick={createRoom}>
            {t.initNewState}
          </button>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
              #
            </div>
            <div className="flex gap-2">
                <input
                  className="flex-1 pl-8 p-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
                  placeholder={t.existingState}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 rounded-xl border border-white/10 transition-all" onClick={() => router.push(`/game/${id}`)}>
                  {t.sync}
                </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Banner - Footer Status */}
      <div className="w-full max-w-md mt-12 bg-white/5 border border-white/10 rounded-xl py-4 text-center backdrop-blur-sm">
         <p className="text-xs font-semibold text-cyan-300 tracking-widest uppercase mb-2">
            {t.systemStatus}
         </p>
         <p className="text-[10px] opacity-50 font-mono px-4 leading-relaxed">
            {t.footer}
         </p>
      </div>
    </div>
  );
}
