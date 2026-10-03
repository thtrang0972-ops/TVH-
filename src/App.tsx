import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ConfessionSection } from './components/ConfessionSection';
import { WishboxSection } from './components/WishboxSection';
import { WallOfHopeSection } from './components/WallOfHopeSection';
import { CounselingSection } from './components/CounselingSection';
import { EmergencyModal } from './components/EmergencyModal';
import { ConfessionModal } from './components/ConfessionModal';
import { CounselorLookupModal } from './components/CounselorLookupModal';
import { FloatingSOSButton } from './components/FloatingSOSButton';
import { Footer } from './components/Footer';

import { Confession, WishItem, HopeNote, SOSAlert } from './types';
import { INITIAL_CONFESSIONS, INITIAL_WISHES, INITIAL_HOPE_NOTES, DEFAULT_SCHOOL_SETTINGS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'confessions' | 'wishbox' | 'wall_of_hope' | 'counseling'>('confessions');

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isWriteConfessionOpen, setIsWriteConfessionOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  // Locked School Settings (School name & Counselors are fixed presets as requested)
  const schoolSettings = DEFAULT_SCHOOL_SETTINGS;

  // Confessions state with LocalStorage persistence
  const [confessions, setConfessions] = useState<Confession[]>(() => {
    try {
      const saved = localStorage.getItem('tram_lang_nghe_confessions');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CONFESSIONS;
  });

  // Wishes state with LocalStorage persistence
  const [wishes, setWishes] = useState<WishItem[]>(() => {
    try {
      const saved = localStorage.getItem('tram_lang_nghe_wishes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_WISHES;
  });

  // Hope Notes state with LocalStorage persistence
  const [hopeNotes, setHopeNotes] = useState<HopeNote[]>(() => {
    try {
      const saved = localStorage.getItem('tram_lang_nghe_hope_notes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_HOPE_NOTES;
  });

  // SOS alerts list (stored in memory/session for school counselor demonstration)
  const [, setSosAlerts] = useState<SOSAlert[]>([]);

  // Persist confessions
  useEffect(() => {
    try {
      localStorage.setItem('tram_lang_nghe_confessions', JSON.stringify(confessions));
    } catch (e) {
      console.error(e);
    }
  }, [confessions]);

  // Persist wishes
  useEffect(() => {
    try {
      localStorage.setItem('tram_lang_nghe_wishes', JSON.stringify(wishes));
    } catch (e) {
      console.error(e);
    }
  }, [wishes]);

  // Persist hope notes
  useEffect(() => {
    try {
      localStorage.setItem('tram_lang_nghe_hope_notes', JSON.stringify(hopeNotes));
    } catch (e) {
      console.error(e);
    }
  }, [hopeNotes]);

  // Handle Confession Reactions
  const handleAddReaction = (
    confessionId: string,
    reactionType: 'hug' | 'sympathy' | 'cheer' | 'sparkle'
  ) => {
    setConfessions((prev) =>
      prev.map((c) => {
        if (c.id !== confessionId) return c;
        const currentActive = c.userReactions[reactionType];
        const newActive = !currentActive;
        const diff = newActive ? 1 : -1;

        return {
          ...c,
          reactions: {
            ...c.reactions,
            [reactionType]: Math.max(0, c.reactions[reactionType] + diff),
          },
          userReactions: {
            ...c.userReactions,
            [reactionType]: newActive,
          },
        };
      })
    );
  };

  // Handle Confession Comments
  const handleAddComment = (
    confessionId: string,
    commentText: string,
    authorNickname = 'Bạn học quan tâm'
  ) => {
    setConfessions((prev) =>
      prev.map((c) => {
        if (c.id !== confessionId) return c;
        const newComment = {
          id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          authorNickname,
          content: commentText,
          createdAt: 'Vừa xong',
        };
        return {
          ...c,
          comments: [...c.comments, newComment],
        };
      })
    );
  };

  // Handle Creating Confession
  const handleCreateConfession = (
    newConf: Omit<Confession, 'id' | 'createdAt' | 'reactions' | 'userReactions' | 'comments'>
  ) => {
    const id = `conf-${Date.now()}`;
    const trackingCode = newConf.isPrivateToCounselor
      ? `TL-${Math.floor(1000 + Math.random() * 9000)}`
      : undefined;

    const confessionItem: Confession = {
      ...newConf,
      id,
      createdAt: 'Vừa gửi',
      trackingCode,
      reactions: { hug: 0, sympathy: 0, cheer: 0, sparkle: 0 },
      userReactions: {},
      comments: [],
    };

    setConfessions((prev) => [confessionItem, ...prev]);

    return { trackingCode };
  };

  // Handle Upvoting Wish
  const handleUpvoteWish = (wishId: string) => {
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id !== wishId) return w;
        const hasVoted = w.hasUpvoted;
        return {
          ...w,
          upvotes: hasVoted ? w.upvotes - 1 : w.upvotes + 1,
          hasUpvoted: !hasVoted,
        };
      })
    );
  };

  // Handle Creating Wish
  const handleCreateWish = (
    newWish: Omit<WishItem, 'id' | 'createdAt' | 'upvotes' | 'hasUpvoted' | 'status' | 'schoolReply'>
  ) => {
    const wishItem: WishItem = {
      ...newWish,
      id: `wish-${Date.now()}`,
      createdAt: 'Hôm nay',
      upvotes: 1,
      hasUpvoted: true,
      status: 'received',
      schoolReply: {
        authorRole: 'Ban Thư Ký Nhà Trường',
        content: 'Đã tiếp nhận ý kiến đóng góp của em và đưa vào danh sách tổng hợp gửi Ban Giám Hiệu trong phiên họp giao ban tuần này.',
        date: 'Vừa tiếp nhận',
      },
    };

    setWishes((prev) => [wishItem, ...prev]);
  };

  // Handle Liking Hope Note
  const handleLikeHopeNote = (noteId: string) => {
    setHopeNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId) return n;
        const hasLiked = n.hasLiked;
        return {
          ...n,
          likes: hasLiked ? n.likes - 1 : n.likes + 1,
          hasLiked: !hasLiked,
        };
      })
    );
  };

  // Handle Creating Hope Note
  const handleCreateHopeNote = (
    newNote: Omit<HopeNote, 'id' | 'likes' | 'hasLiked' | 'createdAt'>
  ) => {
    const noteItem: HopeNote = {
      ...newNote,
      id: `hope-${Date.now()}`,
      likes: 1,
      hasLiked: true,
      createdAt: 'Vừa dán',
    };

    setHopeNotes((prev) => [noteItem, ...prev]);
  };

  // Handle Sending SOS Alert
  const handleSubmitSOS = (alertData: Omit<SOSAlert, 'id' | 'timestamp' | 'status'>) => {
    const alertItem: SOSAlert = {
      ...alertData,
      id: `sos-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      status: 'pending',
    };

    setSosAlerts((prev) => [alertItem, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-rose-100 selection:text-rose-900">
      {/* Strict Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        schoolName={schoolSettings.schoolName}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grow w-full">
        {/* Welcoming Hero & Pillar Overview */}
        <HeroSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSOS={() => setIsSOSOpen(true)}
          onOpenWriteModal={() => setIsWriteConfessionOpen(true)}
          schoolSettings={schoolSettings}
        />

        {/* Dynamic Section Display */}
        {activeTab === 'confessions' && (
          <ConfessionSection
            confessions={confessions}
            onAddReaction={handleAddReaction}
            onAddComment={handleAddComment}
            onOpenWriteModal={() => setIsWriteConfessionOpen(true)}
            onOpenLookupModal={() => setIsLookupModalOpen(true)}
          />
        )}

        {activeTab === 'wishbox' && (
          <WishboxSection
            wishes={wishes}
            onUpvote={handleUpvoteWish}
            onCreateWish={handleCreateWish}
          />
        )}

        {activeTab === 'wall_of_hope' && (
          <WallOfHopeSection
            hopeNotes={hopeNotes}
            onLikeNote={handleLikeHopeNote}
            onCreateHopeNote={handleCreateHopeNote}
          />
        )}

        {activeTab === 'counseling' && (
          <CounselingSection
            onOpenSOS={() => setIsSOSOpen(true)}
            onOpenWriteModal={() => setIsWriteConfessionOpen(true)}
            schoolSettings={schoolSettings}
          />
        )}
      </main>

      {/* Persistent Floating Emergency SOS Button */}
      <FloatingSOSButton onOpenSOS={() => setIsSOSOpen(true)} />

      {/* Emergency Crisis Modal */}
      <EmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onSubmitSOS={handleSubmitSOS}
        schoolSettings={schoolSettings}
      />

      {/* Write Confession Modal */}
      <ConfessionModal
        isOpen={isWriteConfessionOpen}
        onClose={() => setIsWriteConfessionOpen(false)}
        onSubmit={handleCreateConfession}
      />

      {/* Counselor Private Letter Lookup Modal */}
      <CounselorLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        confessions={confessions}
      />

      {/* Quiet Clean Footer */}
      <Footer
        onOpenSOS={() => setIsSOSOpen(true)}
        setActiveTab={setActiveTab}
        schoolSettings={schoolSettings}
      />
    </div>
  );
}

