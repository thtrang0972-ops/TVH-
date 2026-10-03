import React from 'react';
import { HeartHandshake, ShieldCheck, Heart, Settings } from 'lucide-react';
import { SchoolSettings } from '../types';

interface FooterProps {
  onOpenSOS: () => void;
  setActiveTab: (tab: 'confessions' | 'wishbox' | 'wall_of_hope' | 'counseling') => void;
  schoolSettings?: SchoolSettings;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenSOS, 
  setActiveTab,
  schoolSettings,
}) => {
  const schoolName = schoolSettings?.schoolName || 'Trường THPT Thân Thiện';
  const subTitle = schoolSettings?.subTitle || 'Trạm Lắng Nghe Học Đường';

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/80 text-xs text-slate-500 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif font-bold text-slate-900 text-sm">
                {subTitle} · {schoolName}
              </span>
            </div>
            <p className="text-slate-500 max-w-md">
              Hệ thống kết nối và hỗ trợ tâm lý học sinh được phối hợp phát triển bởi Ban Giám Hiệu, Đoàn Thanh Niên và {schoolSettings?.counselingRoom || 'Phòng Tư Vấn Học Đường'}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('confessions')}
              className="hover:text-slate-900 transition-colors"
            >
              Hòm thư ẩn danh
            </button>
            <button
              onClick={() => setActiveTab('wishbox')}
              className="hover:text-slate-900 transition-colors"
            >
              Góc nguyện vọng
            </button>
            <button
              onClick={() => setActiveTab('wall_of_hope')}
              className="hover:text-slate-900 transition-colors"
            >
              Bức tường hy vọng
            </button>
            <button
              onClick={() => setActiveTab('counseling')}
              className="hover:text-slate-900 transition-colors"
            >
              Trò chuyện cùng Thầy Cô
            </button>
            <button
              onClick={onOpenSOS}
              className="text-rose-600 hover:text-rose-700 font-semibold transition-colors"
            >
              Đường dây nóng 111
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mọi nội dung đều được mã hóa và bảo vệ tính ẩn danh của học sinh {schoolName}.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Được tạo nên với sự ân cần dành cho tuổi học trò</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

