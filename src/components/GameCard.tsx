import { motion } from 'framer-motion';
import { Play, Settings, X, Gamepad2 } from 'lucide-react';
import { useT } from '../i18n-context';

interface GameCardProps {
    id: string;
    title: string;
    profileName?: string;
    isLaunching?: boolean;
    onPlay: () => void;
    onSettings: () => void;
    onRemove?: () => void;
}

// Accent colors per card (hashed from appId)
const ACCENTS = [
    { bg: 'from-cyan-500/10 to-cyan-900/5', border: 'hover:border-cyan-500/40', icon: 'text-cyan-400/60' },
    { bg: 'from-emerald-500/10 to-emerald-900/5', border: 'hover:border-emerald-500/40', icon: 'text-emerald-400/60' },
    { bg: 'from-violet-500/10 to-violet-900/5', border: 'hover:border-violet-500/40', icon: 'text-violet-400/60' },
    { bg: 'from-amber-500/10 to-amber-900/5', border: 'hover:border-amber-500/40', icon: 'text-amber-400/60' },
    { bg: 'from-rose-500/10 to-rose-900/5', border: 'hover:border-rose-500/40', icon: 'text-rose-400/60' },
    { bg: 'from-sky-500/10 to-sky-900/5', border: 'hover:border-sky-500/40', icon: 'text-sky-400/60' },
    { bg: 'from-fuchsia-500/10 to-fuchsia-900/5', border: 'hover:border-fuchsia-500/40', icon: 'text-fuchsia-400/60' },
    { bg: 'from-teal-500/10 to-teal-900/5', border: 'hover:border-teal-500/40', icon: 'text-teal-400/60' },
];

function getAccent(appId: string) {
    let hash = 0;
    for (let i = 0; i < appId.length; i++) {
        hash = ((hash << 5) - hash) + appId.charCodeAt(i);
        hash |= 0;
    }
    return ACCENTS[Math.abs(hash) % ACCENTS.length];
}

export function GameCard({ id, title, profileName, isLaunching, onPlay, onSettings, onRemove }: GameCardProps) {
    const t = useT();
    const accent = getAccent(id);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative bg-gradient-to-r ${accent.bg} backdrop-blur-sm rounded-2xl border border-white/[0.06] ${accent.border} transition-all duration-200 hover:shadow-lg hover:shadow-black/20`}
        >
            <div className="flex items-center gap-4 px-5 py-3.5">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/[0.06]">
                    <Gamepad2 size={20} className={accent.icon} strokeWidth={1.5} />
                </div>

                {/* Title + Profile */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-white/90 truncate leading-tight">{title}</h3>
                    {profileName && (
                        <span className="text-[10px] text-electric-cyan/70 font-semibold tracking-wider uppercase">{profileName}</span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={onPlay}
                        disabled={isLaunching}
                        className={`font-black px-5 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all
                          ${isLaunching
                                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                : 'bg-juicy-green hover:bg-[#4ab802] text-deep-navy shadow-[0_3px_0_#2d6a01] active:shadow-none active:translate-y-[3px]'
                            }`}
                    >
                        {isLaunching ? (
                            <>{t('running')}</>
                        ) : (
                            <><Play size={14} fill="currentColor" /> {t('go')}</>
                        )}
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.90 }}
                        onClick={onSettings}
                        className="w-9 h-9 flex items-center justify-center bg-white/[0.04] text-electric-cyan/70 rounded-xl hover:bg-white/[0.08] hover:text-electric-cyan transition-all border border-white/[0.06]"
                    >
                        <Settings size={17} />
                    </motion.button>

                    {onRemove && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="w-7 h-7 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            title={t('removeGame')}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
