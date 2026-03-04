import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useT } from '../i18n-context';

export function HelpTooltip() {
    const t = useT();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative flex items-center z-[100]"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#112240] text-electric-cyan/70 hover:text-electric-cyan hover:bg-electric-cyan/10 transition-all border border-electric-cyan/20 hover:border-electric-cyan/50">
                <HelpCircle size={22} strokeWidth={2.5} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-[130%] w-80 bg-[#0d1b2a] border border-electric-cyan/30 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] p-5 pointer-events-none z-10"
                    >
                        <h3 className="font-bold text-electric-cyan flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                            {t('ob_title1')}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed tracking-wide">
                            {t('ob_desc1')}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
