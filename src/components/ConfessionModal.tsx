import React, { useState } from 'react';
import { X, Shuffle, ShieldCheck, Lock, Globe, Sparkles, BookOpen, Users, Home, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { ConfessionCategory, Confession } from '../types';
import { SUGGESTED_NICKNAMES } from '../data/mockData';

interface ConfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newConfession: Omit<Confession, 'id' | 'createdAt' | 'reactions' | 'userReactions' | 'comments'>) => { trackingCode?: string };
}

export const ConfessionModal: React.FC<ConfessionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [authorType, setAuthorType] = useState<'anonymous' | 'nickname'>('nickname');
  const [nickname, setNickname] = useState('Sao Hôm Nhỏ Bé');
  const [category, setCategory] = useState<ConfessionCategory>('academic');
  const [isPrivateToCounselor, setIsPrivateToCounselor] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleShuffleNickname = () => {
    const randomIndex = Math.floor(Math.random() * SUGGESTED_NICKNAMES.length);
    setNickname(SUGGESTED_NICKNAMES[randomIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const authorDisplayName = authorType === 'anonymous' ? 'Học sinh Ẩn danh' : (nickname.trim() || 'Học sinh');

    const result = onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      authorNickname: authorDisplayName,
      isPrivateToCounselor,
    });

    if (isPrivateToCounselor && result?.trackingCode) {
      setSubmittedCode(result.trackingCode);
    } else {
      onClose();
      // Reset form
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">Gửi Tâm Sự Đến Hòm Thư Học Đường</h2>
            <p className="text-xs text-slate-500">Mọi cảm xúc của em đều xứng đáng được lắng nghe và tôn trọng</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 grow">
          {submittedCode ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Thư Riêng Tư Đã Được Chuyển Đến Thầy Cô!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Tâm sự của em đã được mã hóa và chuyển riêng đến Thầy Đặng Quốc Hoàng & Cô Vũ Hoài Phương tại Phòng Tư vấn.
              </p>

              {/* Tracking code box */}
              <div className="max-w-xs mx-auto p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1">
                <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Mã bí mật tra cứu thư của em:</div>
                <div className="text-2xl font-mono font-bold text-amber-950 tracking-widest">{submittedCode}</div>
                <div className="text-[11px] text-amber-700">
                  Hãy ghi nhớ hoặc chụp lại mã này. Em dùng nó tại mục <strong>"Tra cứu thư riêng"</strong> để đọc lời hồi đáp từ thầy cô nhé!
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmittedCode(null);
                    onClose();
                  }}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Đã ghi lại mã & Hoàn tất
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  1. Chọn chủ đề tâm sự của em:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('academic')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      category === 'academic'
                        ? 'border-rose-500 bg-rose-50/70 text-rose-900 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-rose-600" />
                    <span className="text-xs">Áp lực điểm số</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('friends')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      category === 'friends'
                        ? 'border-rose-500 bg-rose-50/70 text-rose-900 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs">Mâu thuẫn bạn bè</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('family')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      category === 'family'
                        ? 'border-rose-500 bg-rose-50/70 text-rose-900 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Home className="w-4 h-4 text-amber-600" />
                    <span className="text-xs">Tâm tư gia đình</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('personal')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      category === 'personal'
                        ? 'border-rose-500 bg-rose-50/70 text-rose-900 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs">Tuổi mới lớn</span>
                  </button>
                </div>
              </div>

              {/* Author anonymity option */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-semibold text-slate-800">
                  2. Định danh của em khi gửi:
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="radio"
                      name="authorType"
                      checked={authorType === 'nickname'}
                      onChange={() => setAuthorType('nickname')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>Dùng biệt danh dễ thương</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="radio"
                      name="authorType"
                      checked={authorType === 'anonymous'}
                      onChange={() => setAuthorType('anonymous')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>Ẩn danh hoàn toàn</span>
                  </label>
                </div>

                {authorType === 'nickname' && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Nhập biệt danh của em..."
                      className="grow px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={handleShuffleNickname}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                      title="Gợi ý biệt danh ngẫu nhiên"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Đổi tên</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Privacy Scope Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  3. Nơi gửi tâm sự:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPrivateToCounselor(false)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      !isPrivateToCounselor
                        ? 'border-rose-500 bg-rose-50/60 text-rose-950 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Chia sẻ lên Hòm thư chung</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        Các bạn học sinh cùng đọc, thả tim an ủi và chia sẻ đồng cảm
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPrivateToCounselor(true)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      isPrivateToCounselor
                        ? 'border-indigo-500 bg-indigo-50/60 text-indigo-950 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Gửi riêng Thầy/Cô Tâm Lý</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        Bảo mật 100%, nhận mã bí mật để xem thư hồi đáp từ chuyên viên
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Tiêu đề tâm sự (ngắn gọn):
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Mình cảm thấy rất áp lực mỗi khi chuẩn bị tới tiết kiểm tra..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Nội dung tâm tư của em:
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Hãy viết ra mọi điều đang làm em trĩu nặng trong lòng. Không có đánh giá, không có phán xét ở đây..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
              </div>

              {/* Safe sharing guarantee */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Không thu thập địa chỉ IP, không lưu thông tin nhận dạng cá nhân.</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>{isPrivateToCounselor ? 'Gửi riêng cho thầy cô' : 'Gửi tâm sự'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
