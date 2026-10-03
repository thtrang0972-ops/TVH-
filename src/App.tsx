// src/App.tsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  arrayUnion, 
  increment,
  serverTimestamp,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from './firebase'; // Import Firestore database

// Import components (Giữ nguyên như cũ)
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
import { DEFAULT_SCHOOL_SETTINGS } from './data/mockData';

// Hook hỗ trợ lưu trữ trạng thái Like/Reaction ở thiết bị người dùng (vì chưa có Auth)
const useLocalInteractions = (key: string) => {
  const [interactions, setInteractions] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : {};
  });

  const saveInteraction = (id: string, data: any) => {
    const newInteractions = { ...interactions, [id]: data };
    setInteractions(newInteractions);
    localStorage.setItem(key, JSON.stringify(newInteractions));
  };

  return { interactions, saveInteraction };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'confessions' | 'wishbox' | 'wall_of_hope' | 'counseling'>('confessions');

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isWriteConfessionOpen, setIsWriteConfessionOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  const schoolSettings = DEFAULT_SCHOOL_SETTINGS;

  // Firebase Data States
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [hopeNotes, setHopeNotes] = useState<HopeNote[]>([]);
  
  // Local interaction states (để người dùng thấy họ đã bấm like/hug chưa)
  const { interactions: localReactions, saveInteraction: setLocalReaction } = useLocalInteractions('local_reactions');
  const { interactions: localUpvotes, saveInteraction: setLocalUpvote } = useLocalInteractions('local_upvotes');
  const { interactions: localLikes, saveInteraction: setLocalLike } = useLocalInteractions('local_likes');

  // Lắng nghe dữ liệu Realtime từ Firebase
  useEffect(() => {
    // 1. Confessions
    const qConfessions = query(collection(db, 'confessions'), orderBy('createdAt', 'desc'));
    const unsubConfessions = onSnapshot(qConfessions, (snapshot) => {
      const confData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        // Gắn thêm trạng thái reaction local vào dữ liệu trả về cho UI
        userReactions: localReactions[doc.id] || {}
      })) as Confession[];
      setConfessions(confData);
    });

    // 2. Wishes
    const qWishes = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubWishes = onSnapshot(qWishes, (snapshot) => {
      const wishData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        hasUpvoted: !!localUpvotes[doc.id]
      })) as WishItem[];
      setWishes(wishData);
    });

    // 3. Hope Notes
    const qNotes = query(collection(db, 'hope_notes'), orderBy('createdAt', 'desc'));
    const unsubNotes = onSnapshot(qNotes, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        hasLiked: !!localLikes[doc.id]
      })) as HopeNote[];
      setHopeNotes(notesData);
    });

    // Cleanup listeners khi component unmount
    return () => {
      unsubConfessions();
      unsubWishes();
      unsubNotes();
    };
  }, [localReactions, localUpvotes, localLikes]);

  // --- CÁC HÀM XỬ LÝ GHI DỮ LIỆU LÊN FIREBASE ---

  const handleAddReaction = async (confessionId: string, reactionType: 'hug' | 'sympathy' | 'cheer' | 'sparkle') => {
    const currentReactions = localReactions[confessionId] || {};
    const hasReacted = currentReactions[reactionType];
    const diff = hasReacted ? -1 : 1; // Nếu đã react thì trừ 1, chưa thì cộng 1

    // Cập nhật Local
    setLocalReaction(confessionId, { ...currentReactions, [reactionType]: !hasReacted });

    // Cập nhật Firebase
    const confRef = doc(db, 'confessions', confessionId);
    await updateDoc(confRef, {
      [`reactions.${reactionType}`]: increment(diff)
    });
  };

  const handleAddComment = async (confessionId: string, commentText: string, authorNickname = 'Bạn học quan tâm') => {
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      authorNickname,
      content: commentText,
      createdAt: new Date().toISOString(), // Dùng ISO string để dễ format
    };

    const confRef = doc(db, 'confessions', confessionId);
    await updateDoc(confRef, {
      comments: arrayUnion(newComment) // Thêm comment vào mảng comments
    });
  };

  const handleCreateConfession = async (newConf: Omit<Confession, 'id' | 'createdAt' | 'reactions' | 'userReactions' | 'comments'>) => {
    const trackingCode = newConf.isPrivateToCounselor
      ? `TL-${Math.floor(1000 + Math.random() * 9000)}`
      : undefined;

    await addDoc(collection(db, 'confessions'), {
      ...newConf,
      trackingCode,
      createdAt: serverTimestamp(),
      reactions: { hug: 0, sympathy: 0, cheer: 0, sparkle: 0 },
      comments: [],
    });

    return { trackingCode };
  };

  const handleUpvoteWish = async (wishId: string) => {
    const hasUpvoted = !!localUpvotes[wishId];
    const diff = hasUpvoted ? -1 : 1;

    setLocalUpvote(wishId, !hasUpvoted);

    const wishRef = doc(db, 'wishes', wishId);
    await updateDoc(wishRef, {
      upvotes: increment(diff)
    });
  };

  const handleCreateWish = async (newWish: Omit<WishItem, 'id' | 'createdAt' | 'upvotes' | 'hasUpvoted' | 'status' | 'schoolReply'>) => {
    await addDoc(collection(db, 'wishes'), {
      ...newWish,
      createdAt: serverTimestamp(),
      upvotes: 1,
      status: 'received',
      schoolReply: {
        authorRole: 'Ban Thư Ký Nhà Trường',
        content: 'Đã tiếp nhận ý kiến đóng góp của em và đưa vào danh sách tổng hợp gửi Ban Giám Hiệu.',
        date: new Date().toISOString(),
      },
    });
  };

  const handleLikeHopeNote = async (noteId: string) => {
    const hasLiked = !!localLikes[noteId];
    const diff = hasLiked ? -1 : 1;

    setLocalLike(noteId, !hasLiked);

    const noteRef = doc(db, 'hope_notes', noteId);
    await updateDoc(noteRef, {
      likes: increment(diff)
    });
  };

  const handleCreateHopeNote = async (newNote: Omit<HopeNote, 'id' | 'likes' | 'hasLiked' | 'createdAt'>) => {
    await addDoc(collection(db, 'hope_notes'), {
      ...newNote,
      likes: 1,
      createdAt: serverTimestamp(),
    });
  };

  const handleSubmitSOS = async (alertData: Omit<SOSAlert, 'id' | 'timestamp' | 'status'>) => {
    await addDoc(collection(db, 'sos_alerts'), {
      ...alertData,
      timestamp: serverTimestamp(),
      status: 'pending',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-rose-100 selection:text-rose-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenSOS={() => setIsSOSOpen(true)} schoolName={schoolSettings.schoolName} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grow w-full">
        <HeroSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSOS={() => setIsSOSOpen(true)}
          onOpenWriteModal={() => setIsWriteConfessionOpen(true)}
          schoolSettings={schoolSettings}
        />

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

      <FloatingSOSButton onOpenSOS={() => setIsSOSOpen(true)} />

      <EmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onSubmitSOS={handleSubmitSOS}
        schoolSettings={schoolSettings}
      />

      <ConfessionModal
        isOpen={isWriteConfessionOpen}
        onClose={() => setIsWriteConfessionOpen(false)}
        onSubmit={handleCreateConfession}
      />

      <CounselorLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        confessions={confessions}
      />

      <Footer onOpenSOS={() => setIsSOSOpen(true)} setActiveTab={setActiveTab} schoolSettings={schoolSettings} />
    </div>
  );
}
