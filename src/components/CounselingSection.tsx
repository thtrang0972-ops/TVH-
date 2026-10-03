import React, { useState, useEffect, useRef } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  PhoneCall, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  MessageCircle,
  HelpCircle,
  User,
  Lock
} from 'lucide-react';
import { SchoolSettings, CounselorChatMessage, CounselorProfile } from '../types';
import { DEFAULT_SCHOOL_SETTINGS } from '../data/mockData';

interface CounselingSectionProps {
  onOpenSOS: () => void;
  onOpenWriteModal: () => void;
  schoolSettings?: SchoolSettings;
}

const INITIAL_CHAT_MESSAGES: CounselorChatMessage[] = [
  {
    id: 'msg-1',
    counselorId: 'counselor-1',
    sender: 'counselor',
    authorName: 'Thầy Đặng Quốc Hoàng',
    content: 'Chào em! Thầy luôn trực tại Phòng 204 để lắng nghe em. Dù là áp lực thi cử, định hướng tương lai hay những trăn trở khó giãi bày, em cứ thoải mái gửi câu hỏi cho thầy nhé. Thầy và em sẽ cùng tìm ra hướng giải quyết.',
    timestamp: '08:00',
  },
  {
    id: 'msg-2',
    counselorId: 'counselor-2',
    sender: 'counselor',
    authorName: 'Cô Vũ Hoài Phương',
    content: 'Chào em yêu thương! Cô rất vui vì em đã ghé thăm trạm lắng nghe. Nếu em đang cảm thấy cô đơn, bất hòa với bạn bè hay nặng lòng chuyện gia đình, hãy nhắn cho cô nhé. Cô luôn ở đây cùng em!',
    timestamp: '08:00',
  },
];

const SUGGESTED_QUESTIONS = [
  'Thầy ơi, em bị áp lực điểm số nặng nề trước kỳ thi thì nên làm gì ạ?',
  'Cô ơi, làm thế nào để vượt qua cảm giác bị nhóm bạn thân cô lập ạ?',
  'Làm sao để giãi bày với bố mẹ khi bố mẹ không ủng hộ đam mê của em?',
  'Mỗi lần chuẩn bị kiểm tra là tim em đập rất nhanh và hoảng sợ, cô có cách nào giúp em bình tâm không ạ?',
  'Em cảm thấy mất động lực học tập và trống rỗng, em nên bắt đầu lại từ đâu ạ?',
];

export const CounselingSection: React.FC<CounselingSectionProps> = ({ 
  onOpenSOS, 
  schoolSettings = DEFAULT_SCHOOL_SETTINGS,
}) => {
  const counselors = schoolSettings.counselors || DEFAULT_SCHOOL_SETTINGS.counselors;
  const [selectedCounselorId, setSelectedCounselorId] = useState<string>(counselors[0]?.id || 'counselor-1');
  
  // Chat state with LocalStorage persistence
  const [messages, setMessages] = useState<CounselorChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('tram_lang_nghe_counselor_chat');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [inputQuestion, setInputQuestion] = useState('');
  const [studentNickname, setStudentNickname] = useState('Học sinh ẩn danh');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Booking state
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [counselorPref, setCounselorPref] = useState(counselors[0]?.name || 'Thầy Đặng Quốc Hoàng');
  const [preferredSlot, setPreferredSlot] = useState('16:30 - Thứ Ba');
  const [alias, setAlias] = useState('');
  const [concern, setConcern] = useState('');

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('tram_lang_nghe_counselor_chat', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, selectedCounselorId]);

  const currentCounselor: CounselorProfile = counselors.find((c) => c.id === selectedCounselorId) || counselors[0];

  // Filter messages for current counselor
  const currentChat = messages.filter((m) => m.counselorId === selectedCounselorId);

  // Counselor intelligent empathetic response generator
  const generateCounselorReply = (question: string, counselor: CounselorProfile) => {
    const qLower = question.toLowerCase();
    let reply = '';

    if (qLower.includes('điểm số') || qLower.includes('thi') || qLower.includes('học tập') || qLower.includes('kiểm tra')) {
      reply = counselor.name.includes('Hoàng')
        ? `Thầy rất hiểu cảm giác này của em. Áp lực thi cử là điều hầu hết học sinh đều gặp phải, nhưng em hãy nhớ: Một bài kiểm tra chỉ đánh giá kiến thức tại một thời điểm, chứ không quyết định giá trị con người em. Thầy khuyên em: 1) Chia nhỏ mục tiêu học tập thành từng chặng 30 phút, 2) Ngủ đủ 7 tiếng trước ngày thi để não bộ xử lý thông tin, 3) Dành 10 phút đi bộ thư giãn. Nếu em cần lập lại kế hoạch ôn thi, thầy có thể cùng em ngồi lại tại phòng 204 nhé!`
        : `Em của cô đã vất vả nhiều rồi! Đừng quá khắt khe với bản thân nhé. Điểm số quan trọng, nhưng sức khỏe tinh thần của em còn quý giá hơn nhiều lần. Khi thấy hoảng sợ, em hãy thử hít thở sâu theo nhịp 4-7-8, uống một ngụm nước ấm và tự nhủ: "Mình đang làm hết sức có thể". Em luôn có sự ủng hộ của cô!`;
    } else if (qLower.includes('bạn') || qLower.includes('cô lập') || qLower.includes('tẩy chay') || qLower.includes('hiểu lầm')) {
      reply = counselor.name.includes('Hoàng')
        ? `Mâu thuẫn bạn bè ở tuổi học trò thường để lại tổn thương rất sâu. Thầy khuyên em đừng vội tự trách bản thân rằng mình có lỗi. Đôi khi sự khác biệt về sở thích hoặc tin đồn vô căn cứ làm mối quan hệ xa cách. Em hãy thử tìm một người bạn em tin tưởng nhất để nói chuyện thẳng thắn, hoặc mở rộng giao lưu ở các CLB mới. Thầy luôn sẵn lòng làm cầu nối hòa giải nếu em cần.`
        : `Cô ôm em một cái thật chặt nhé! Cảm giác bị bạn bè xa lánh thật sự rất đau lòng. Nhưng em hãy nhớ rằng em không làm gì sai để phải chịu đựng điều đó cả. Em là một bạn nhỏ rất đáng trân trọng. Đừng vì những lời nói hay hành động vô tâm của người khác mà đánh mất niềm tin vào tình bạn. Cô luôn ở đây lắng nghe em.`;
    } else if (qLower.includes('bố mẹ') || qLower.includes('gia đình') || qLower.includes('cha mẹ') || qLower.includes('mắng')) {
      reply = counselor.name.includes('Hoàng')
        ? `Bất đồng với bố mẹ về định hướng tương lai là vấn đề rất phổ biến. Bố mẹ thường mong muốn sự an toàn và ổn định cho con cái theo góc nhìn của thế hệ trước. Thay vì tranh cãi khi cả hai bên đang căng thẳng, em hãy chuẩn bị một bức thư ngắn hoặc bản kế hoạch cụ thể về ước mơ của em và chọn một buổi tối cuối tuần thong thả để trò chuyện cùng bố mẹ nhé.`
        : `Cô thấu hiểu nỗi lòng khó nói của em với bố mẹ. Bố mẹ yêu em, nhưng đôi khi cách thể hiện tình yêu vô tình tạo thành gánh nặng. Em có thể bắt đầu bằng việc cảm ơn bố mẹ đã lo lắng cho em, sau đó chia sẻ nhẹ nhàng cảm xúc của mình. Em có muốn cô cùng đóng vai tập dượt cách nói chuyện với bố mẹ trước không?`;
    } else {
      reply = counselor.name.includes('Hoàng')
        ? `Thầy đã đọc kỹ câu hỏi của em. Thầy rất trân trọng khi em đã chủ động mở lời chia sẻ điều này. Những trăn trở này hoàn toàn tự nhiên ở lứa tuổi các em. Em không cần phải chịu đựng một mình, thầy sẽ luôn đồng hành cùng em. Em có thể đến phòng 204 bất kỳ lúc nào để chúng mình cùng trò chuyện sâu hơn nhé!`
        : `Cảm ơn em đã tin tưởng và gửi gắm tâm sự cho cô. Cô luôn ở bên em để sẻ chia. Đừng ngần ngại cho cô biết thêm chi tiết nếu em muốn, hoặc ghé phòng tư vấn 204 bất cứ lúc nào giờ ra chơi em nhé!`;
    }

    return reply;
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputQuestion).trim();
    if (!content) return;

    const studentMsg: CounselorChatMessage = {
      id: `msg-${Date.now()}`,
      counselorId: selectedCounselorId,
      sender: 'student',
      authorName: studentNickname.trim() || 'Học sinh ẩn danh',
      content,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputQuestion('');
    setIsTyping(true);

    // Simulate thoughtful counselor response after brief realistic delay
    setTimeout(() => {
      const replyContent = generateCounselorReply(content, currentCounselor);
      const counselorReply: CounselorChatMessage = {
        id: `msg-${Date.now() + 1}`,
        counselorId: selectedCounselorId,
        sender: 'counselor',
        authorName: currentCounselor.name,
        content: replyContent,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, counselorReply]);
      setIsTyping(false);
    }, 1200);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setAlias('');
      setConcern('');
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-white to-rose-50/60 p-6 sm:p-7 rounded-2xl border border-indigo-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <HeartHandshake className="w-4 h-4" />
              <span>{schoolSettings.counselingRoom} · {schoolSettings.schoolName}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Góc Trò Chuyện & Hỏi Đáp Cùng Thầy Cô Tư Vấn
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Các em học sinh có toàn quyền gửi câu hỏi thắc mắc, trò chuyện bảo mật 1-1 và nhận lời khuyên chân thành từ đội ngũ giáo viên tâm lý của nhà trường.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={onOpenSOS}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline khẩn cấp 24/7</span>
            </button>
          </div>
        </div>

        {/* Core Principles & Safe Notice */}
        <div className="mt-5 pt-4 border-t border-indigo-100/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Bảo mật tuyệt đối:</strong> Cuộc trò chuyện được giữ kín hoàn toàn, học sinh có thể dùng biệt danh.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Quy chuẩn học đường:</strong> Tên trường và giáo viên tư vấn do Nhà trường thiết lập cố định để bảo vệ học sinh.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Hỗ trợ 24/7:</strong> Em có thể gửi câu hỏi bất cứ lúc nào và thầy cô sẽ phản hồi ân cần.
            </div>
          </div>
        </div>
      </div>

      {/* Counselor Team Profile Cards (Fixed presets) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Đội Ngũ Giáo Viên Tư Vấn Tâm Lý Cố Định
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {schoolSettings.schoolName}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {counselors.map((counselor) => {
            const isSelected = counselor.id === selectedCounselorId;
            return (
              <div
                key={counselor.id}
                onClick={() => setSelectedCounselorId(counselor.id)}
                className={`p-5 sm:p-6 bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-serif text-lg font-bold uppercase shrink-0">
                        {counselor.initials || counselor.name.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-slate-900">{counselor.name}</h3>
                        <p className="text-xs text-indigo-700 font-medium">{counselor.title}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        Đang chọn trò chuyện
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {counselor.specialty}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Lịch trực: {counselor.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Địa điểm: {counselor.room || schoolSettings.counselingRoom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Email: {counselor.email}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isSelected ? `Đang mở trò chuyện cùng ${counselor.name}` : `Chọn trò chuyện cùng ${counselor.name}`}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE DIRECT CHAT / Q&A ROOM FOR STUDENTS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        {/* Chat header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-serif text-base font-bold text-white border border-white/20">
              {currentCounselor.initials || currentCounselor.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-white">{currentCounselor.name}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Đang trực tuyến" />
                <span className="text-[11px] text-emerald-300">Trực tuyến</span>
              </div>
              <p className="text-xs text-indigo-200">{currentCounselor.title} · {schoolSettings.counselingRoom}</p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-white/70 block">Bảo mật trò chuyện 1-1</span>
            <span className="text-xs text-emerald-300 font-medium">Không định danh học sinh</span>
          </div>
        </div>

        {/* Quick suggested questions */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] shrink-0 flex items-center gap-1 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>Câu hỏi gợi ý:</span>
          </span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-slate-700 text-[11px] transition-colors whitespace-nowrap shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages viewport */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[420px] min-h-[280px] overflow-y-auto bg-slate-50/50">
          {currentChat.map((msg) => {
            const isCounselor = msg.sender === 'counselor';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCounselor ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                  <span className="font-semibold text-slate-700">{msg.authorName}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isCounselor
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-tr-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 max-w-[200px] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-600 font-medium">{currentCounselor.name} đang phản hồi...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat input controls */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white space-y-2.5">
          {/* Nickname chooser */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 text-[11px] flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              <span>Biệt danh của em:</span>
            </span>
            <input
              type="text"
              value={studentNickname}
              onChange={(e) => setStudentNickname(e.target.value)}
              placeholder="VD: Mèo Cam, Sao Nhỏ, hoặc Học sinh 11A..."
              className="px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[200px]"
            />
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              (Thầy cô cam kết bảo mật mọi thông tin)
            </span>
          </div>

          {/* Input text & send button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              required
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={`Gửi câu hỏi hoặc trò chuyện trực tiếp cùng ${currentCounselor.name}...`}
              className="grow px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isTyping}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi câu hỏi</span>
            </button>
          </form>
        </div>
      </div>

      {/* Appointment Booking Card (Offline meeting at counseling room) */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Hẹn Gặp Trò Chuyện Trực Tiếp (1-1)</span>
          </div>
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Dành 30 Phút Uống Trà Cùng Thầy/Cô Tại {schoolSettings.counselingRoom}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Nếu em muốn gặp mặt trực tiếp để tâm sự trong không gian yên tĩnh, em có thể đăng ký khung giờ bên dưới.
          </p>

          {bookedSuccess ? (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã ghi nhận lịch hẹn của em thành công!</span>
              </div>
              <p>
                Thầy cô đã giữ lịch hẹn <strong>{preferredSlot}</strong> với <strong>{counselorPref}</strong> tại {schoolSettings.counselingRoom}. Em chỉ cần đến đúng giờ nhé.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Thầy/Cô em muốn gặp:
                  </label>
                  <select
                    value={counselorPref}
                    onChange={(e) => setCounselorPref(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {counselors.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Bất kỳ thầy cô nào tiện lịch">Bất kỳ thầy cô nào tiện lịch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Khung giờ mong muốn:
                  </label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="11:30 - Giờ nghỉ trưa Thứ Hai">11:30 - Giờ nghỉ trưa Thứ Hai</option>
                    <option value="16:30 - Sau giờ tan trường Thứ Ba">16:30 - Sau giờ tan trường Thứ Ba</option>
                    <option value="09:15 - Giờ ra chơi lớn Thứ Tư">09:15 - Giờ ra chơi lớn Thứ Tư</option>
                    <option value="16:30 - Sau giờ tan trường Thứ Năm">16:30 - Sau giờ tan trường Thứ Năm</option>
                    <option value="15:00 - Chiều Thứ Bảy">15:00 - Chiều Thứ Bảy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Biệt danh hoặc cách gọi em khi gặp:
                </label>
                <input
                  type="text"
                  required
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="VD: Bạn áo xanh, Mèo Cam, hoặc tên của em..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Điều em muốn chia sẻ (tùy chọn):
                </label>
                <input
                  type="text"
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  placeholder="VD: Em cảm thấy kiệt sức vì ôn thi, hoặc em đang gặp rắc rối với bạn..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Xác nhận hẹn gặp riêng tư</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
