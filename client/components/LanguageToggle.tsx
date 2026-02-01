import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-mono text-xs py-1 px-3 rounded-full transition-all flex items-center gap-2"
        >
            <span className={language === 'en' ? 'font-bold text-cyan-300' : 'opacity-50'}>EN</span>
            <span className="w-px h-3 bg-white/30"></span>
            <span className={language === 'es' ? 'font-bold text-cyan-300' : 'opacity-50'}>ES</span>
        </button>
    );
}
