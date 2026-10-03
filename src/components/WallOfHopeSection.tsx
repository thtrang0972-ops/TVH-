import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Plus, 
  Gift, 
  X, 
  Send, 
  Filter
} from 'lucide-react';
import { HopeNote } from '../types';
import { DAILY_HOPE_QUOTES } from '../data/mockData';

interface WallOfHopeSectionProps {
  hopeNotes: HopeNote[];
  onLikeNote: (noteId: string) => void;
  onCreateHopeNote: (newNote: Omit<HopeNote, 'id' | 'likes' | 'hasLiked' | 'createdAt'>) => void;
}

export const WallOfHopeSection: React.FC<WallOfHopeSectionProps> = ({
  hopeNotes,
  onLikeNote,
  onCreateHopeNote,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isDailyCookieOpen, setIsDailyCookieOpen] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // New note form state
  const [sender, setSender] = useState('Gửi bạn đang cố gắng từng ngày');
  const [recipientTag, setRecipientTag] = useState('Chữa lành');
  const [message, setMessage] = useState('');
  const [themeColor, setThemeColor] = useState<'amber' | 'emerald' | 'rose' | 'sky' | 'purple'>('amber');
  const [icon, setIcon] = useState('🌻');

  const colorThemes: Record<
    'amber' | 'emerald' | 'rose' | 'sky' | 'purple',
    { cardBg: string; border: string; textTag: string; iconBg: string }
  > = {
    amber: {
      cardBg: 'bg-amber-50/90',
      border: 'border-amber-200/90',
      textTag: 'text-amber-800',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    emerald: {
      cardBg: 'bg-emerald-50/90',
      border: 'border-emerald-200/90',
      textTag: 'text-emerald-800',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    rose: {
      cardBg: 'bg-rose-50/90',
      border: 'border-rose-200/90',
      textTag: 'text-rose-800',
      iconBg: 'bg-rose-100 text-rose-800',
    },
    sky: {
      cardBg: 'bg-sky-50/90',
      border: 'border-sky-200/90',
      textTag: 'text-sky-800',
      iconBg: 'bg-sky-100 text-sky-800',
    },
    purple: {
      cardBg: 'bg-purple-50/90',
      border: 'border-purple-200/90',
      textTag: 'text-purple-800',
      iconBg: 'bg-purple-100 text-purple-800',
    },
  };

  const availableTags = ['all', 'Động lực thi cử', 'Vượt qua thử thách', 'Tình bạn', 'Chữa lành', 'Trưởng thành'];

  const filteredNotes = hopeNotes.filter((note) => {
    if (selectedTag === 'all') return true;
    return note.recipientTag === selectedTag;
  });

  const handleOpenDailyCookie = () => {
    const randomIndex = Math.floor(Math.random() * DAILY_HOPE_QUOTES.length);
    setCurrentQuoteIndex(randomIndex);
    setIsDailyCookieOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onCreateHopeNote({
      sender: sender.trim() || 'Người gửi ẩn danh',
      recipientTag: recipientTag.trim() || 'Chữa lành',
      message: message.trim(),
      themeColor,
      icon,
    });

    setIsWriteModalOpen(false);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Wall Header */}
      <div className="bg-gradient-to-br from-rose-50/60 via-amber-50/40 to-emerald-50/60 p-6 sm:p-7 rounded-2xl border border-rose-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Bức Tường Động Lực & Kết Nối Tương Thân</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Ánh Sáng Lan Tỏa Giữa Các Bạn Học Sinh
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Mỗi mẩu giấy dán là một tia nắng ấm áp gửi đến người bạn cùng trường đang mỏi mệt. Đôi khi chỉ một câu động viên kịp lúc cũng có thể vực dậy cả một tâm hồn.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            {/* Daily Hope Cookie button */}
            <button
              onClick={handleOpenDailyCookie}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all whitespace-nowrap active:scale-95 shadow-xs"
            >
              <Gift className="w-4 h-4 text-amber-700" />
              <span>Rút quẻ động viên hôm nay</span>
            </button>

            {/* Pin note button */}
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-xl shadow-xs shadow-rose-200 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Dán lời nhắn mới</span>
            </button>
          </div>
        </div>

        {/* Motivational count bar */}
        <div className="mt-5 pt-4 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>🌻</span>
            <span>Đã có <strong>{hopeNotes.length}</strong> thông điệp yêu thương được gửi gắm trên bức tường này.</span>
          </div>
          <div className="text-rose-700 font-medium">
            "Bạn không bao giờ phải bước đi một mình!"
          </div>
        </div>
      </div>

      {/* Tag Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto text-xs font-medium">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tag === 'all' ? 'Tất cả thông điệp' : tag}
          </button>
        ))}
      </div>

      {/* Sticky Notes Masonry / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => {
          const theme = colorThemes[note.themeColor] || colorThemes.amber;
          return (
            <div
              key={note.id}
              className={`p-5 rounded-2xl border ${theme.border} ${theme.cardBg} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 relative group`}
            >
              {/* Pin indicator */}
              <div className="flex items-center justify-between">
                <span className="text-xl" role="img" aria-label="Icon thiệp">
                  {note.icon}
                </span>

                {/* Zero-Pill metadata row */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className={`font-semibold ${theme.textTag}`}>{note.recipientTag}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{note.createdAt}</span>
                </div>
              </div>

              {/* Sender lead-in */}
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {note.sender}
              </div>

              {/* Heartfelt Note Body */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans grow">
                {note.message}
              </p>

              {/* Bottom bar with Like heart */}
              <div className="pt-2 border-t border-slate-900/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Ẩn danh từ học sinh</span>

                <button
                  onClick={() => onLikeNote(note.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    note.hasLiked
                      ? 'bg-rose-500 text-white font-semibold shadow-xs'
                      : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600'
                  }`}
                  title="Thả tim tiếp thêm sức mạnh"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      note.hasLiked ? 'fill-white text-white' : 'text-rose-500'
                    }`}
                  />
                  <span className="font-mono tabular-nums text-xs">{note.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Hope Cookie Modal */}
      {isDailyCookieOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-gradient-to-b from-amber-50 to-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden text-center p-6 sm:p-8 space-y-5 animate-scale-up"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setIsDailyCookieOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Gift className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                Món Quà Tinh Thần Hôm Nay
              </span>
              <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">
                {DAILY_HOPE_QUOTES[currentQuoteIndex].tag}
              </h3>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-amber-100 shadow-xs relative">
              <span className="text-3xl text-amber-300 font-serif absolute -top-2 left-4 select-none">“</span>
              <p className="font-serif text-sm sm:text-base text-slate-800 leading-relaxed italic pt-2">
                {DAILY_HOPE_QUOTES[currentQuoteIndex].quote}
              </p>
              <div className="mt-3 text-xs text-slate-500 font-sans">
                — {DAILY_HOPE_QUOTES[currentQuoteIndex].author}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={handleOpenDailyCookie}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-xl transition-colors"
              >
                Rút lá quẻ khác ✨
              </button>
              <button
                onClick={() => setIsDailyCookieOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Lưu vào tim & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Hope Note Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900">Dán Thiệp Động Viên Lên Bức Tường</h2>
                <p className="text-xs text-slate-500">Gửi gắm niềm hy vọng và lời an ủi chân thành đến bạn bè</p>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 grow">
              {/* Choose paper color */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  1. Chọn sắc màu thiệp dán:
                </label>
                <div className="flex items-center gap-2.5">
                  {(['amber', 'emerald', 'rose', 'sky', 'purple'] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setThemeColor(color)}
                      className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                        themeColor === color ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent'
                      } ${
                        color === 'amber'
                          ? 'bg-amber-100'
                          : color === 'emerald'
                          ? 'bg-emerald-100'
                          : color === 'rose'
                          ? 'bg-rose-100'
                          : color === 'sky'
                          ? 'bg-sky-100'
                          : 'bg-purple-100'
                      }`}
                      aria-label={`Màu ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Choose emoji icon */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  2. Chọn biểu tượng may mắn:
                </label>
                <div className="flex items-center gap-2">
                  {['🌻', '🌟', '🍀', '💌', '🕊️', '🎈', '🌈'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setIcon(item)}
                      className={`text-xl p-2 rounded-xl transition-all ${
                        icon === item ? 'bg-slate-200/80 scale-110 shadow-xs' : 'hover:bg-slate-100'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Gửi đến ai (hoặc danh xưng người gửi):
                  </label>
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="VD: Gửi bạn đang khóc, Gửi cả lớp 12..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Chủ đề động viên:
                  </label>
                  <select
                    value={recipientTag}
                    onChange={(e) => setRecipientTag(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="Chữa lành">Chữa lành</option>
                    <option value="Động lực thi cử">Động lực thi cử</option>
                    <option value="Vượt qua thử thách">Vượt qua thử thách</option>
                    <option value="Tình bạn">Tình bạn</option>
                    <option value="Trưởng thành">Trưởng thành</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Thông điệp ấm áp của bạn:
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hãy viết những lời khích lệ chân thành nhất mà bạn muốn dành tặng cho người bạn học sinh của mình..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dán lên tường ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
