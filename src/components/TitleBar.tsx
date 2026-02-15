import { Minus, Square, X, Monitor } from 'lucide-react';

export function TitleBar() {
    const handleMinimize = () => {
        window.gameVisionAPI.minimizeWindow?.();
    };

    const handleMaximize = () => {
        window.gameVisionAPI.maximizeWindow?.();
    };

    const handleClose = () => {
        window.gameVisionAPI.closeWindow?.();
    };

    return (
        <div className="h-8 bg-[#051021] flex justify-between items-center px-3 select-none drag-region">
            <div className="flex items-center gap-2 text-white/50 text-xs font-bold tracking-wider">
                <Monitor size={14} className="text-electric-cyan" />
                <span>GameVision Tuner</span>
            </div>
            <div className="flex items-center h-full no-drag-region">
                <button onClick={handleMinimize} className="h-full px-3 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                    <Minus size={16} />
                </button>
                <button onClick={handleMaximize} className="h-full px-3 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                    <Square size={14} />
                </button>
                <button onClick={handleClose} className="h-full px-3 hover:bg-panic-pink text-white/70 hover:text-white transition-colors">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
