import React from 'react';
import { AlertCircle, Phone } from 'lucide-react';

interface FloatingSOSButtonProps {
  onOpenSOS: () => void;
}

export const FloatingSOSButton: React.FC<FloatingSOSButtonProps> = ({ onOpenSOS }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center">
      <button
        onClick={onOpenSOS}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-full shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 active:scale-95 transition-all duration-200 border-2 border-white/20 animate-gentle-pulse"
        aria-label="Mở cổng hỗ trợ khẩn cấp và đường dây nóng tâm lý"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        
        <AlertCircle className="w-5 h-5 text-white" />
        
        <div className="text-left">
          <div className="text-xs font-bold leading-tight">SOS Khẩn Cấp</div>
          <div className="text-[10px] text-rose-200 font-medium">Hỗ trợ 24/7</div>
        </div>

        <div className="hidden lg:flex items-center pl-1 border-l border-rose-400/40 ml-1">
          <Phone className="w-3.5 h-3.5 text-rose-200" />
        </div>
      </button>
    </div>
  );
};
