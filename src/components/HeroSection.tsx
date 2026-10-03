import React from 'react';
import { 
  MessageSquareHeart, 
  Lightbulb, 
  Heart, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  Edit3
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface HeroSectionProps {
  activeTab: 'confessions' | 'wishbox' | 'wall_of_hope' | 'counseling';
  setActiveTab: (tab: 'confessions' | 'wishbox' | 'wall_of_hope' | 'counseling') => void;
  onOpenSOS: () => void;
  onOpenWriteModal: () => void;
  schoolSettings?: SchoolSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeTab,
  setActiveTab,
  onOpenSOS,
  onOpenWriteModal,
  schoolSettings,
}) => {
  const currentSchoolName = schoolSettings?.schoolName || 'Trường THPT Thân Thiện';
  const currentSubTitle = schoolSettings?.subTitle || 'Trạm Lắng Nghe - Điểm Tựa Học Đường';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-rose-100/40 via-amber-50/30 to-white border border-rose-100/70 p-6 sm:p-10 mb-8 shadow-xs">
      {/* Decorative gentle glow background */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-rose-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl space-y-4">
        {/* Editorial Pill-Free Tag with School Name */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{currentSubTitle}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-800 font-bold normal-case tracking-normal text-xs sm:text-sm">
            {currentSchoolName}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15] text-balance">
          Mọi cảm xúc của em đều xứng đáng được lắng nghe.
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          Nơi trút bỏ áp lực điểm số và những bất hòa tuổi học trò trong sự ẩn danh tuyệt đối; đóng góp nguyện vọng xây dựng trường học; tiếp nhận năng lượng tích cực từ bức tường hy vọng và kết nối ngay với hỗ trợ tâm lý khẩn cấp 24/7.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onOpenWriteModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs shadow-rose-200 transition-all"
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Gửi tâm sự ẩn danh</span>
          </button>

          <button
            onClick={() => setActiveTab('wishbox')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 transition-all"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Đề xuất nguyện vọng</span>
          </button>

          <button
            onClick={onOpenSOS}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-semibold rounded-xl border border-rose-200 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Khủng hoảng? Cần hỗ trợ ngay</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars Quick Access Bento Bar */}
      <div className="mt-8 pt-6 border-t border-slate-200/60 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Pillar 1: Confessions */}
        <button
          onClick={() => setActiveTab('confessions')}
          className={`p-3.5 rounded-2xl text-left transition-all border ${
            activeTab === 'confessions'
              ? 'bg-white border-rose-300 shadow-xs'
              : 'bg-white/60 hover:bg-white border-slate-200/70 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-2">
            <MessageSquareHeart className="w-4 h-4" />
          </div>
          <div className="font-serif text-sm font-bold text-slate-900">Hòm Thư Ẩn Danh</div>
          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
            Điểm số, bạn bè, gia đình
          </div>
        </button>

        {/* Pillar 2: Wishbox */}
        <button
          onClick={() => setActiveTab('wishbox')}
          className={`p-3.5 rounded-2xl text-left transition-all border ${
            activeTab === 'wishbox'
              ? 'bg-white border-amber-300 shadow-xs'
              : 'bg-white/60 hover:bg-white border-slate-200/70 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="font-serif text-sm font-bold text-slate-900">Góc Nguyện Vọng</div>
          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
            Góp ý xây dựng nhà trường
          </div>
        </button>

        {/* Pillar 3: Wall of Hope */}
        <button
          onClick={() => setActiveTab('wall_of_hope')}
          className={`p-3.5 rounded-2xl text-left transition-all border ${
            activeTab === 'wall_of_hope'
              ? 'bg-white border-rose-300 shadow-xs'
              : 'bg-white/60 hover:bg-white border-slate-200/70 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
            <Heart className="w-4 h-4" />
          </div>
          <div className="font-serif text-sm font-bold text-slate-900">Bức Tường Động Lực</div>
          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
            Lan tỏa lời nhắn yêu thương
          </div>
        </button>

        {/* Pillar 4: Emergency SOS */}
        <button
          onClick={onOpenSOS}
          className="p-3.5 rounded-2xl text-left bg-gradient-to-br from-rose-50 to-rose-100/60 hover:from-rose-100 hover:to-rose-200/70 border border-rose-200 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="font-serif text-sm font-bold text-rose-950 flex items-center gap-1">
            <span>Hỗ Trợ Khẩn Cấp</span>
            <ArrowRight className="w-3.5 h-3.5 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-[11px] text-rose-700 mt-0.5 line-clamp-1">
            Hotline 111 & Thầy cô 24/7
          </div>
        </button>
      </div>
    </div>
  );
};
