import React from 'react';
import { HeartHandshake, AlertCircle, Sparkles, MessageSquareHeart, Lightbulb, Heart, Settings } from 'lucide-react';

interface NavbarProps {
  activeTab: 'confessions' | 'wishbox' | 'wall_of_hope' | 'counseling';
  setActiveTab: (tab: 'confessions' | 'wishbox' | 'wall_of_hope' | 'counseling') => void;
  onOpenSOS: () => void;
  schoolName?: string;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenSOS,
  schoolName 
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('confessions')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-rose-200">
            <HeartHandshake className="w-5 h-5 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-lg font-bold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
              Trạm Lắng Nghe
            </span>
            {schoolName && (
              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                {schoolName}
              </span>
            )}
          </div>
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('confessions')}
            className={`flex items-center gap-1.5 py-1 transition-colors relative whitespace-nowrap ${
              activeTab === 'confessions'
                ? 'text-rose-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Hòm Thư Ẩn Danh</span>
            {activeTab === 'confessions' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('wishbox')}
            className={`flex items-center gap-1.5 py-1 transition-colors relative whitespace-nowrap ${
              activeTab === 'wishbox'
                ? 'text-rose-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Góc Nguyện Vọng</span>
            {activeTab === 'wishbox' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('wall_of_hope')}
            className={`flex items-center gap-1.5 py-1 transition-colors relative whitespace-nowrap ${
              activeTab === 'wall_of_hope'
                ? 'text-rose-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Bức Tường Động Lực</span>
            {activeTab === 'wall_of_hope' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('counseling')}
            className={`flex items-center gap-1.5 py-1 transition-colors relative whitespace-nowrap ${
              activeTab === 'counseling'
                ? 'text-rose-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Trò Chuyện Cùng Thầy Cô</span>
            {activeTab === 'counseling' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 active:scale-95 transition-all shadow-sm shadow-rose-200 whitespace-nowrap animate-gentle-pulse"
            title="Mở cổng hỗ trợ tâm lý khẩn cấp 24/7"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Hỗ Trợ Khẩn Cấp</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50/90 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('confessions')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'confessions' ? 'bg-white text-rose-600 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Hòm thư</span>
        </button>
        <button
          onClick={() => setActiveTab('wishbox')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'wishbox' ? 'bg-white text-rose-600 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Nguyện vọng</span>
        </button>
        <button
          onClick={() => setActiveTab('wall_of_hope')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'wall_of_hope' ? 'bg-white text-rose-600 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Động lực</span>
        </button>
        <button
          onClick={() => setActiveTab('counseling')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'counseling' ? 'bg-white text-rose-600 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tư vấn</span>
        </button>
      </div>
    </header>
  );
};

