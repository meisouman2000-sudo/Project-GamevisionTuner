import { motion } from 'framer-motion';
import { Play, Settings, X } from 'lucide-react';

interface GameCardProps {
    id: string;
    title: string;
    profileName?: string;
    isLaunching?: boolean; // New prop
    onPlay: () => void;
    onSettings: () => void;
    onRemove?: () => void;
}

export function GameCard({ id, title, profileName, isLaunching, onPlay, onSettings, onRemove }: GameCardProps) {
    // Steam header image URL
    const coverUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.jpg`;

    return (
        <div
            className="group relative bg-[#112240] rounded-3xl overflow-hidden shadow-[0_8px_0_#051021] hover:shadow-[0_8px_0_#051021,0_0_20px_rgba(0,243,255,0.2)] border-2 border-transparent hover:border-electric-cyan/30 transition-all duration-300 ease-out hover:-translate-y-1"
        >
            {/* Image Section */}
            <div className="h-32 overflow-hidden relative bg-[#0a1628]">
                {/* Background Pattern/Gradient for transparent images */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2a] to-[#112240] opacity-100" />

                <img
                    src={coverUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><rect width="24" height="24" fill="%230A192F"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="4">GAME</text></svg>';
                    }}
                />

                {/* Profile Tag (Capsule) */}
                {profileName && (
                    <div className="absolute top-3 right-3 bg-deep-navy/95 text-electric-cyan px-3 py-1 rounded-full border border-electric-cyan/30 text-[10px] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(0,195,255,0.3)]">
                        {profileName}
                    </div>
                )}

                {/* Remove Button (Visible on Hover) */}
                {onRemove && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="absolute top-3 left-3 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                        title="Remove Game"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 pt-2 flex flex-col gap-3">
                <h3 className="text-lg font-bold text-white truncate leading-tight h-6 mb-1">{title}</h3>

                <div className="flex gap-2">
                    {/* Play Button (Juicy Trigger) */}
                    <motion.button
                        whileTap={{ scale: 0.95, y: 2 }}
                        onClick={onPlay}
                        disabled={isLaunching}
                        className={`flex-1 font-black py-3 rounded-xl shadow-[0_4px_0_#2d6a01] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-1.5
                          ${isLaunching
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-none translate-y-[4px]'
                                : 'bg-juicy-green hover:bg-[#4ab802] text-deep-navy'
                            }`}
                    >
                        {isLaunching ? (
                            <>Running...</>
                        ) : (
                            <> <Play size={16} fill="currentColor" /> GO! </>
                        )}
                    </motion.button>

                    {/* Settings Button */}
                    <motion.button
                        whileTap={{ scale: 0.90 }}
                        onClick={onSettings}
                        className="w-10 h-[44px] flex items-center justify-center bg-[#1a365d] text-electric-cyan rounded-xl hover:bg-[#234b86] shadow-[0_4px_0_#0f2342] active:shadow-none active:translate-y-[4px] transition-all border border-white/5"
                    >
                        <Settings size={20} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
