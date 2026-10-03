import React, { useState } from 'react';
import { X, Search, Lock, UserCheck, Calendar, ShieldCheck, Heart } from 'lucide-react';
import { Confession } from '../types';

interface CounselorLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  confessions: Confession[];
}

export const CounselorLookupModal: React.FC<CounselorLookupModalProps> = ({
  isOpen,
  onClose,
  confessions,
}) => {
  const [code, setCode] = useState('');
  const [searchedConfession, setSearchedConfession] = useState<Confession | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    const found = confessions.find(
      (c) => c.isPrivateToCounselor && c.trackingCode && c.trackingCode.toUpperCase() === cleanCode
    );

    if (found) {
      setSearchedConfession(found);
      setErrorMsg('');
    } else {
      setSearchedConfession(null);
      setErrorMsg('Không tìm thấy thư có mã này. Hãy kiểm tra lại mã (ví dụ: TL-7729) hoặc đợi thầy cô xem xét.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">Hộp Thư Riêng Tư Cùng Thầy Cô</h2>
              <p className="text-xs text-slate-500">Tra cứu lời hồi đáp kín đáo từ chuyên viên tâm lý bằng mã theo dõi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 grow">
          {/* Code input form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800">
              Nhập mã bí mật của em (thử mã mẫu: <span className="font-mono text-indigo-600 font-bold">TL-7729</span>):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ví dụ: TL-7729"
                className="grow uppercase px-3.5 py-2 text-sm font-mono tracking-wider border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tra cứu</span>
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {errorMsg}
              </p>
            )}
          </form>

          {/* Result view */}
          {searchedConfession && (
            <div className="space-y-4 pt-2">
              {/* Student letter */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Tâm sự của em</span>
                  <span>{searchedConfession.createdAt}</span>
                </div>
                <h3 className="font-serif text-sm font-bold text-slate-900">{searchedConfession.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {searchedConfession.content}
                </p>
              </div>

              {/* Counselor response */}
              {searchedConfession.counselorReply ? (
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                      <UserCheck className="w-4 h-4 text-indigo-600" />
                      <span>{searchedConfession.counselorReply.counselorName}</span>
                    </div>
                    <span className="text-[11px] text-indigo-700">
                      {searchedConfession.counselorReply.repliedAt}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white/80 p-3.5 rounded-lg border border-indigo-100">
                    {searchedConfession.counselorReply.replyContent}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-indigo-800">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Địa điểm hẹn: Phòng 204 Nhà A (Tầng 2)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Bảo mật 100%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-semibold">Thầy cô đã nhận được thư của em!</div>
                  <p>
                    Hiện chuyên viên tư vấn đang đọc và chuẩn bị phản hồi kỹ lưỡng cho em. Em hãy quay lại kiểm tra sau vài tiếng nhé.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Safety promise */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Mã tra cứu là chìa khóa duy nhất để xem nội dung thư này. Nhà trường không gắn mã này với bất kỳ danh tính học sinh nào.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
