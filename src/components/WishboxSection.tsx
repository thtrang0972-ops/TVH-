import React, { useState } from 'react';
import { 
  Lightbulb, 
  Plus, 
  ThumbsUp, 
  CheckCircle, 
  Clock, 
  Hourglass, 
  CheckCheck, 
  Building2, 
  BookOpen, 
  Users2, 
  Coffee, 
  Search,
  Filter,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { WishItem, WishCategory, WishStatus } from '../types';

interface WishboxSectionProps {
  wishes: WishItem[];
  onUpvote: (wishId: string) => void;
  onCreateWish: (newWish: Omit<WishItem, 'id' | 'createdAt' | 'upvotes' | 'hasUpvoted' | 'status' | 'schoolReply'>) => void;
}

export const WishboxSection: React.FC<WishboxSectionProps> = ({
  wishes,
  onUpvote,
  onCreateWish,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WishCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<WishStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New wish form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WishCategory>('facilities');
  const [proposerNickname, setProposerNickname] = useState('Đại diện học sinh');
  const [impactScore, setImpactScore] = useState('Toàn trường');

  const categoryLabels: Record<WishCategory, string> = {
    facilities: 'Cơ sở vật chất',
    learning: 'Phương pháp & Sinh hoạt',
    activities: 'CLB & Ngoại khóa',
    canteen: 'Căng tin & Đời sống',
  };

  const statusLabels: Record<WishStatus, { label: string; textClass: string; icon: React.ReactNode }> = {
    received: {
      label: 'Đã tiếp nhận',
      textClass: 'text-slate-600',
      icon: <Hourglass className="w-3.5 h-3.5 text-slate-500" />,
    },
    reviewing: {
      label: 'Đang xem xét',
      textClass: 'text-amber-700',
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
    },
    in_progress: {
      label: 'Đang triển khai',
      textClass: 'text-blue-700',
      icon: <CheckCircle className="w-3.5 h-3.5 text-blue-500" />,
    },
    completed: {
      label: 'Đã hoàn thành',
      textClass: 'text-emerald-700',
      icon: <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />,
    },
  };

  const filteredWishes = wishes
    .filter((w) => {
      const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || w.status === selectedStatus;
      const matchSearch =
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.proposerNickname.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    })
    .sort((a, b) => b.upvotes - a.upvotes); // Sort by highest upvotes first

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onCreateWish({
      title: title.trim(),
      description: description.trim(),
      category,
      proposerNickname: proposerNickname.trim() || 'Học sinh ẩn danh',
      impactScore: impactScore.trim() || 'Toàn trường',
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Banner & Intro */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-sky-50/60 p-6 sm:p-7 rounded-2xl border border-amber-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <Lightbulb className="w-4 h-4" />
              <span>Góc Nguyện Vọng & Tiếng Nói Học Sinh</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Đóng Góp Ý Kiến Xây Dựng Ngôi Trường Hạnh Phúc
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Nơi mỗi ý tưởng cải tiến thư viện, đổi mới giờ sinh hoạt lớp hay mở câu lạc bộ mới của các em đều được Ban Giám Hiệu lắng nghe, bình chọn và phản hồi minh bạch.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition-all rounded-xl shadow-xs shadow-amber-200 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Đề xuất nguyện vọng mới</span>
          </button>
        </div>

        {/* Quick Highlights */}
        <div className="mt-5 pt-4 border-t border-amber-100/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Đã có <strong>4</strong> đề xuất được Nhà Trường phê duyệt và đưa vào thực tế trong tháng này.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Tổng cộng: <strong>{wishes.length}</strong> nguyện vọng</span>
            <span aria-hidden="true">·</span>
            <span>Tỷ lệ tiếp nhận: <strong>100%</strong></span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs (Buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả danh mục
            </button>
            <button
              onClick={() => setSelectedCategory('facilities')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'facilities'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cơ sở vật chất
            </button>
            <button
              onClick={() => setSelectedCategory('learning')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'learning'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học tập & Sinh hoạt
            </button>
            <button
              onClick={() => setSelectedCategory('activities')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'activities'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CLB & Hoạt động
            </button>
            <button
              onClick={() => setSelectedCategory('canteen')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'canteen'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Căng tin & Dịch vụ
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-2">
            <div className="relative grow md:w-52">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm đề xuất..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as WishStatus | 'all')}
                aria-label="Lọc theo trạng thái nguyện vọng"
                className="bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Mọi trạng thái</option>
                <option value="received">Đã tiếp nhận</option>
                <option value="reviewing">Đang xem xét</option>
                <option value="in_progress">Đang triển khai</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Wishes Grid */}
      <div className="space-y-4">
        {filteredWishes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <Lightbulb className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-slate-700">Chưa có nguyện vọng nào phù hợp</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hãy đề xuất ý tưởng đầu tiên để cùng nhà trường cải thiện môi trường học tập tốt hơn.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Gửi đề xuất mới
            </button>
          </div>
        ) : (
          filteredWishes.map((wish) => {
            const statusConfig = statusLabels[wish.status];
            return (
              <article
                key={wish.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden"
              >
                <div className="p-5 sm:p-6 space-y-3.5">
                  {/* Strict Zero-Pill Metadata row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-800">
                        {categoryLabels[wish.category]}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-700">{wish.proposerNickname}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{wish.createdAt}</span>
                    </div>

                    {/* Status indicator with explicit text + icon (no color-alone signaling) */}
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${statusConfig.textClass}`}>
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Wish Title & Vote Split */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 leading-snug tracking-tight">
                      {wish.title}
                    </h3>

                    {/* Upvote button */}
                    <button
                      onClick={() => onUpvote(wish.id)}
                      className={`flex flex-col items-center justify-center p-2.5 sm:px-3 sm:py-2 rounded-xl transition-all border shrink-0 ${
                        wish.hasUpvoted
                          ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-800'
                      }`}
                      title="Ủng hộ nguyện vọng này"
                    >
                      <ThumbsUp className="w-4 h-4 mb-0.5" />
                      <span className="text-[11px] font-mono tabular-nums font-bold">
                        {wish.upvotes}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider hidden sm:inline">Ủng hộ</span>
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {wish.description}
                  </p>

                  {/* Scope note */}
                  {wish.impactScore && (
                    <div className="text-[11px] text-slate-500">
                      Phạm vi thụ hưởng: <span className="font-medium text-slate-700">{wish.impactScore}</span>
                    </div>
                  )}

                  {/* Official School Reply Card if available */}
                  {wish.schoolReply && (
                    <div className="mt-3 p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-amber-950 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-amber-700" />
                          <span>Phản hồi chính thức từ {wish.schoolReply.authorRole}</span>
                        </div>
                        <span className="text-[11px] text-amber-700 font-normal">
                          {wish.schoolReply.date}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed bg-white/90 p-3 rounded-lg border border-amber-100">
                        {wish.schoolReply.content}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Create Wish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900">Đề Xuất Nguyện Vọng Xây Dựng</h2>
                <p className="text-xs text-slate-500">Cùng nhà trường hoàn thiện môi trường học đường tích cực</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 grow">
              {/* Category picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  1. Lĩnh vực đề xuất:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('facilities')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-colors ${
                      category === 'facilities'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Cơ sở vật chất</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('learning')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-colors ${
                      category === 'learning'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Phương pháp & Giờ học</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('activities')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-colors ${
                      category === 'activities'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Users2 className="w-4 h-4 text-emerald-600" />
                    <span>CLB & Ngoại khóa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('canteen')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-colors ${
                      category === 'canteen'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Coffee className="w-4 h-4 text-rose-600" />
                    <span>Căng tin & Dịch vụ</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Tiêu đề đề xuất (ngắn gọn, rõ ý):
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Mở rộng giờ tự học tại thư viện đến 17h30 các ngày trong tuần"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Chi tiết đề xuất & Giá trị mang lại cho học sinh:
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả thực trạng hiện tại, giải pháp cụ thể em đề xuất, và lợi ích đối với các bạn học sinh..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Proposer & Scope */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Người đề xuất (tên hoặc biệt danh):
                  </label>
                  <input
                    type="text"
                    value={proposerNickname}
                    onChange={(e) => setProposerNickname(e.target.value)}
                    placeholder="VD: Đại diện Khối 11, hoặc Mọt Sách"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Đối tượng thụ hưởng:
                  </label>
                  <input
                    type="text"
                    value={impactScore}
                    onChange={(e) => setImpactScore(e.target.value)}
                    placeholder="VD: Toàn trường, Khối 12, Các CLB..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                💡 <strong>Gợi ý:</strong> Các đề xuất mang tính xây dựng, cụ thể và có tính khả thi cao sẽ nhanh chóng được Ban Giám Hiệu đưa vào cuộc họp tuần để xem xét triển khai!
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi nguyện vọng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
