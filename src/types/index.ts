export type ConfessionCategory = 'academic' | 'friends' | 'family' | 'personal';

export interface ConfessionReaction {
  hug: number; // 🫂 Ôm bạn
  sympathy: number; // 💙 Đồng cảm
  cheer: number; // 🌻 Cố lên nhé
  sparkle: number; // ✨ Năng lượng tích cực
}

export interface ConfessionComment {
  id: string;
  authorNickname: string;
  content: string;
  createdAt: string;
  isCounselor?: boolean;
}

export interface Confession {
  id: string;
  title: string;
  content: string;
  category: ConfessionCategory;
  authorNickname: string; // "Ẩn danh" or nickname
  avatarSeed?: string;
  createdAt: string;
  isPrivateToCounselor: boolean;
  trackingCode?: string; // e.g. "TL-4829" for private counselor retrieval
  counselorReply?: {
    counselorName: string;
    replyContent: string;
    repliedAt: string;
  };
  reactions: ConfessionReaction;
  userReactions: {
    hug?: boolean;
    sympathy?: boolean;
    cheer?: boolean;
    sparkle?: boolean;
  };
  comments: ConfessionComment[];
}

export type WishCategory = 'facilities' | 'activities' | 'learning' | 'canteen';
export type WishStatus = 'received' | 'reviewing' | 'in_progress' | 'completed';

export interface SchoolReply {
  authorRole: string; // e.g., "Ban Giám Hiệu", "Đoàn Trường"
  content: string;
  date: string;
}

export interface WishItem {
  id: string;
  title: string;
  description: string;
  category: WishCategory;
  proposerNickname: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  status: WishStatus;
  schoolReply?: SchoolReply;
  impactScore?: string; // e.g. "Toàn trường", "Khối 10, 11, 12"
}

export interface HopeNote {
  id: string;
  sender: string; // e.g. "Gửi bạn lớp 12", "Ẩn danh K62"
  recipientTag: string; // e.g. "Thi cử", "Tình bạn", "Chữa lành"
  message: string;
  themeColor: 'amber' | 'emerald' | 'rose' | 'sky' | 'purple';
  icon: string;
  likes: number;
  hasLiked?: boolean;
  createdAt: string;
}

export interface SOSAlert {
  id: string;
  urgencyLevel: 'immediate' | 'high' | 'consultation';
  contactOrLocation: string;
  note: string;
  timestamp: string;
  status: 'pending' | 'addressed';
}

export interface CounselorProfile {
  id: string;
  name: string;
  title: string;
  specialty: string;
  schedule: string;
  room: string;
  email: string;
  phone?: string;
  initials?: string;
}

export interface SchoolSettings {
  schoolName: string;
  subTitle: string;
  counselingRoom: string;
  hotlinePhone: string;
  counselors: CounselorProfile[];
}

export interface CounselorChatMessage {
  id: string;
  counselorId: string;
  sender: 'student' | 'counselor';
  authorName: string;
  content: string;
  timestamp: string;
}


