import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Settings, Sun, Moon, Zap, Target } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameTitle: string;
    gameId: string;
    initialProfile?: any;
    onSave: (gameId: string, profile: any) => void;
    onPreview: (profile: any) => void;
}

export function SettingsModal({ isOpen, onClose, gameTitle, gameId, initialProfile, onSave, onPreview }: SettingsModalProps) {
    const [brightness, setBrightness] = useState(50);
    const [contrast, setContrast] = useState(50);
    const [gamma, setGamma] = useState(100); // 1.00 = 100%
    const [digitalVibrance, setDigitalVibrance] = useState(50);

    // Reset or load profile when modal opens
    useEffect(() => {
        if (isOpen) {
            setBrightness(initialProfile?.brightness ?? 50);
            setContrast(initialProfile?.contrast ?? 50);
            setGamma(initialProfile?.gamma ?? 100);
            setDigitalVibrance(initialProfile?.digitalVibrance ?? 50);
        }
    }, [isOpen, initialProfile]);

    // Real-time preview with debounce
    const isFirstRender = React.useRef(true);
    useEffect(() => {
        if (!isOpen) {
            isFirstRender.current = true; // Reset when closed
            return;
        }

        // Skip the first valid render execution to prevent auto-apply on open
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            onPreview({ brightness, contrast, gamma, digitalVibrance });
        }, 150); // 150ms debounce to prevent freezing
        return () => clearTimeout(timer);
    }, [brightness, contrast, gamma, digitalVibrance, onPreview, isOpen]);

    const handleSave = () => {
        onSave(gameId, { brightness, contrast, gamma, digitalVibrance, name: 'Custom' });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.5, y: 100, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.8, y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 15, stiffness: 200 }}
                            className="bg-deep-navy w-[500px] rounded-3xl border-4 border-[#1a365d] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="bg-[#112240] p-6 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <span className="text-electric-cyan"><Settings /></span> {gameTitle}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-8 space-y-8">
                                {/* Preview Area */}
                                <div className="h-32 bg-black rounded-2xl relative overflow-hidden group shadow-inner border border-white/5">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900"
                                        style={{
                                            filter: `brightness(${brightness / 50}) contrast(${contrast / 50}) saturate(${1 + (digitalVibrance - 50) / 50})`
                                            // Gamma approximation in CSS is hard without SVG filters, limiting to standard filters
                                        }}
                                    >
                                        <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-4xl uppercase tracking-widest">
                                            Preview
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white/70 font-mono">
                                        Realtime
                                    </div>
                                </div>

                                {/* Sliders */}
                                <div className="space-y-6">
                                    <ToySlider label="Brightness" icon={<Sun size={16} />} value={brightness} onChange={setBrightness} color="text-yellow-400" />
                                    <ToySlider label="Contrast" icon={<Moon size={16} />} value={contrast} onChange={setContrast} color="text-white" />
                                    <ToySlider label="Gamma" icon={<Target size={16} />} value={gamma} onChange={setGamma} color="text-green-400" isGamma />
                                    <ToySlider label="Digital Vibrance" icon={<Zap size={16} />} value={digitalVibrance} onChange={setDigitalVibrance} color="text-panic-pink" />
                                </div>

                                {/* Actions */}
                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3 rounded-xl font-bold text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSave}
                                        className="flex-[2] py-4 bg-juicy-green text-deep-navy font-black rounded-xl shadow-[0_4px_0_#3e8e01] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wider"
                                    >
                                        Save Profile
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

function ToySlider({ label, icon, value, onChange, color, isGamma }: { label: string, icon: React.ReactNode, value: number, onChange: (v: number) => void, color: string, isGamma?: boolean }) {
    const displayValue = isGamma ? (value / 100).toFixed(2) : `${value}%`;
    const max = isGamma ? 280 : 100; // Gamma usually 0.5 - 2.8 or similar

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <div className={`font-bold text-sm ${color} flex items-center gap-1.5`}>
                    {icon} {label}
                </div>
                <span className="bg-[#112240] px-2 py-0.5 rounded text-electric-cyan font-mono text-xs font-bold border border-electric-cyan/20">
                    {displayValue}
                </span>
            </div>
            <div className="relative h-6 w-full flex items-center">
                {/* Track Background */}
                <div className="absolute w-full h-3 bg-[#112240] rounded-full overflow-hidden shadow-inner">
                    {/* Fill */}
                    <div
                        className="h-full bg-electric-cyan/30"
                        style={{ width: `${(value / max) * 100}%` }}
                    />
                </div>

                {/* Custom Range Input */}
                <input
                    type="range"
                    min="1"
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Custom Thumb handle (visual only, position controlled by value) */}
                <motion.div
                    className="absolute w-6 h-6 bg-white rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.5)] border-2 border-electric-cyan pointer-events-none flex items-center justify-center z-0"
                    style={{ left: `calc(${(value / max) * 100}% - 12px)` }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 1.2 }}
                >
                    <div className="w-2 h-2 bg-electric-cyan rounded-full" />
                </motion.div>
            </div>
        </div>
    )
}
