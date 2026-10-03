import React, { useState } from 'react';
import { 
  MessageSquareHeart, 
  Search, 
  Plus, 
  Lock, 
  Heart, 
  MessageCircle, 
  Send, 
  Sparkles, 
  Shield, 
  Filter
} from 'lucide-react';
import { Confession, ConfessionCategory } from '../types';

interface ConfessionSectionProps {
  confessions: Confession[];
  onAddReaction: (confessionId: string, reaction: 'hug' | 'sympathy' | 'cheer' | 'sparkle') => void;
  onAddComment: (confessionId: string, commentText: string, authorNickname?: string) => void;
  onOpenWriteModal: () => void;
  onOpenLookupModal: () => void;
}

export const ConfessionSection: React.FC<ConfessionSectionProps> = ({
  confessions,
  onAddReaction,
  onAddComment,
  onOpenWriteModal,
  onOpenLookupModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ConfessionCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<'newest' | 'most_reacted'>('newest');

  // Filter public confessions only (private confessions are accessed via the lookup modal)
  const publicConfessions = confessions.filter((c) => !c.isPrivateToCounselor);

  // Category mapping
  const categoryLabels: Record<ConfessionCategory, string> = {
    academic: 'Áp lực điểm số',
    friends: 'Mâu thuẫn bạn bè',
    family: 'Tâm tư gửi gia đình',
    personal: 'Chuyện tuổi học trò',
  };

  const filteredConfessions = publicConfessions
    .filter((c) => {
      const matchCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const matchSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.authorNickname.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'most_reacted') {
        const totalA = a.reactions.hug + a.reactions.sympathy + a.reactions.cheer + a.reactions.sparkle;
        const totalB = b.reactions.hug + b.reactions.sympathy + b.reactions.cheer + b.reactions.sparkle;
        return totalB - totalA;
      }
      return 0; // Default order
    });

  const toggleComments = (id: string) => {
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentSubmit = (confessionId: string) => {
    const text = newCommentText[confessionId]?.trim();
    if (!text) return;
    onAddComment(confessionId, text);
    setNewCommentText((prev) => ({ ...prev, [confessionId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [confessionId]: true }));
  };

  const handleQuickCheer = (confessionId: string, promptText: string) => {
    onAddComment(confessionId, promptText);
    setExpandedComments((prev) => ({ ...prev, [confessionId]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Banner & Actions Header */}
      <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50/60 p-6 sm:p-7 rounded-2xl border border-rose-100/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <MessageSquareHeart className="w-4 h-4" />
              <span>Hòm Thư Ẩn Danh & Lắng Nghe Tâm Tư</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Nơi Trút Bỏ Gánh Nặng Học Đường
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Em có thể ẩn danh trút bỏ mọi áp lực điểm số, bất hòa với bạn bè hay mâu thuẫn gia đình. Nơi đây chỉ có sự đồng cảm, an ủi lành mạnh và không phán xét.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={onOpenLookupModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-xl transition-colors whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Tra cứu thư riêng</span>
            </button>

            <button
              onClick={onOpenWriteModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-xl shadow-xs shadow-rose-200 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Gửi tâm sự mới</span>
            </button>
          </div>
        </div>

        {/* Safe notice bar */}
        <div className="mt-5 pt-4 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Được kiểm duyệt tự động đảm bảo môi trường an toàn, không ngôn từ thù ghét.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Đã có <strong>{publicConfessions.length}</strong> tâm sự được sẻ chia</span>
            <span aria-hidden="true">·</span>
            <span><strong>100%</strong> ẩn danh</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs (Functional buttons per Zero-Pill discipline) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả tâm sự
            </button>
            <button
              onClick={() => setSelectedCategory('academic')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'academic'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Áp lực điểm số
            </button>
            <button
              onClick={() => setSelectedCategory('friends')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'friends'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mâu thuẫn bạn bè
            </button>
            <button
              onClick={() => setSelectedCategory('family')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'family'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tâm tư gia đình
            </button>
            <button
              onClick={() => setSelectedCategory('personal')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'personal'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tuổi học trò
            </button>
          </div>

          {/* Search bar & Sort */}
          <div className="flex items-center gap-2">
            <div className="relative grow md:w-56">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo từ khóa..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'most_reacted')}
                aria-label="Sắp xếp danh sách tâm sự"
                className="bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="most_reacted">Nhiều đồng cảm nhất</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Confession Cards Feed */}
      <div className="space-y-4">
        {filteredConfessions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <MessageSquareHeart className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-slate-700">Chưa có tâm sự nào trong mục này</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Em có thể là người đầu tiên mở lòng và gửi gắm tâm tư đến hòm thư hôm nay.
            </p>
            <button
              onClick={onOpenWriteModal}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Gửi tâm sự đầu tiên
            </button>
          </div>
        ) : (
          filteredConfessions.map((confession) => (
            <article
              key={confession.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden"
            >
              <div className="p-5 sm:p-6 space-y-3">
                {/* Strict Zero-Pill Metadata row per Frontend Design Constitution */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-rose-700">
                      {categoryLabels[confession.category]}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-700 font-medium">{confession.authorNickname}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{confession.createdAt}</span>
                  </div>
                </div>

                {/* Primary Title */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  {confession.title}
                </h3>

                {/* Content prose */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {confession.content}
                </p>

                {/* Interactive Reactions Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Hug reaction */}
                    <button
                      onClick={() => onAddReaction(confession.id, 'hug')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        confession.userReactions.hug
                          ? 'bg-rose-100 text-rose-800 font-semibold'
                          : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700'
                      }`}
                      title="Gửi một cái ôm động viên"
                    >
                      <span>🫂</span>
                      <span className="text-[11px] hidden sm:inline">Ôm bạn</span>
                      <span className="font-mono tabular-nums text-xs">{confession.reactions.hug}</span>
                    </button>

                    {/* Sympathy reaction */}
                    <button
                      onClick={() => onAddReaction(confession.id, 'sympathy')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        confession.userReactions.sympathy
                          ? 'bg-blue-100 text-blue-800 font-semibold'
                          : 'bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700'
                      }`}
                      title="Mình rất đồng cảm với bạn"
                    >
                      <span>💙</span>
                      <span className="text-[11px] hidden sm:inline">Đồng cảm</span>
                      <span className="font-mono tabular-nums text-xs">{confession.reactions.sympathy}</span>
                    </button>

                    {/* Cheer reaction */}
                    <button
                      onClick={() => onAddReaction(confession.id, 'cheer')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        confession.userReactions.cheer
                          ? 'bg-amber-100 text-amber-800 font-semibold'
                          : 'bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700'
                      }`}
                      title="Cố lên nhé, mọi chuyện rồi sẽ ổn thôi"
                    >
                      <span>🌻</span>
                      <span className="text-[11px] hidden sm:inline">Cố lên</span>
                      <span className="font-mono tabular-nums text-xs">{confession.reactions.cheer}</span>
                    </button>

                    {/* Sparkle reaction */}
                    <button
                      onClick={() => onAddReaction(confession.id, 'sparkle')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        confession.userReactions.sparkle
                          ? 'bg-purple-100 text-purple-800 font-semibold'
                          : 'bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-700'
                      }`}
                      title="Gửi năng lượng tích cực"
                    >
                      <span>✨</span>
                      <span className="text-[11px] hidden sm:inline">Năng lượng</span>
                      <span className="font-mono tabular-nums text-xs">{confession.reactions.sparkle}</span>
                    </button>
                  </div>

                  {/* Comments counter & toggle */}
                  <button
                    onClick={() => toggleComments(confession.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{confession.comments.length} lời an ủi</span>
                  </button>
                </div>

                {/* Expandable Comments & Encouragements Section */}
                {expandedComments[confession.id] && (
                  <div className="pt-3 mt-3 border-t border-slate-100 space-y-3 bg-slate-50/60 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5">
                    {/* Quick cheer suggestions for fast empathetic connection */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      <span className="text-[11px] text-slate-400 shrink-0">Gửi nhanh lời ấm áp:</span>
                      <button
                        onClick={() => handleQuickCheer(confession.id, 'Bạn đã làm rất tốt rồi, cho phép mình nghỉ ngơi nhé! 🌻')}
                        className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-md text-[11px] text-slate-600 transition-colors whitespace-nowrap"
                      >
                        "Bạn đã làm rất tốt rồi! 🌻"
                      </button>
                      <button
                        onClick={() => handleQuickCheer(confession.id, 'Mình luôn ở đây nếu bạn cần người lắng nghe! 🫂')}
                        className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-md text-[11px] text-slate-600 transition-colors whitespace-nowrap"
                      >
                        "Mình luôn ở đây lắng nghe! 🫂"
                      </button>
                      <button
                        onClick={() => handleQuickCheer(confession.id, 'Đừng từ bỏ nhé, cơn mưa nào rồi cũng tạnh thôi! 🌈')}
                        className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-md text-[11px] text-slate-600 transition-colors whitespace-nowrap"
                      >
                        "Cơn mưa nào rồi cũng tạnh! 🌈"
                      </button>
                    </div>

                    {/* Existing Comments List */}
                    <div className="space-y-2">
                      {confession.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-3 rounded-xl text-xs space-y-1 ${
                            comment.isCounselor
                              ? 'bg-rose-50/80 border border-rose-200 text-rose-950'
                              : 'bg-white border border-slate-200/80 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 font-semibold">
                              {comment.isCounselor ? (
                                <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                                  <Sparkles className="w-3 h-3" />
                                  {comment.authorNickname}
                                </span>
                              ) : (
                                <span className="text-slate-800">{comment.authorNickname}</span>
                              )}
                            </div>
                            <span className="text-slate-400">{comment.createdAt}</span>
                          </div>
                          <p className="leading-relaxed">{comment.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Comment Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newCommentText[confession.id] || ''}
                        onChange={(e) =>
                          setNewCommentText((prev) => ({ ...prev, [confession.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCommentSubmit(confession.id);
                          }
                        }}
                        placeholder="Viết một lời động viên gửi bạn ấy (ẩn danh)..."
                        className="grow px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <button
                        onClick={() => handleCommentSubmit(confession.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
