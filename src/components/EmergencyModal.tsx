import React, { useState, useEffect } from 'react';
import { X, PhoneCall, ShieldAlert, Heart, Wind, Compass, Send, CheckCircle2, AlertTriangle, Clock, MapPin, UserCheck } from 'lucide-react';
import { SOSAlert, SchoolSettings } from '../types';
import { DEFAULT_SCHOOL_SETTINGS } from '../data/mockData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSOS: (alert: Omit<SOSAlert, 'id' | 'timestamp' | 'status'>) => void;
  schoolSettings?: SchoolSettings;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmitSOS,
  schoolSettings = DEFAULT_SCHOOL_SETTINGS
}) => {
  const [activeTab, setActiveTab] = useState<'hotlines' | 'breathing' | 'grounding' | 'sos'>('hotlines');
  
  const counselors = schoolSettings.counselors || DEFAULT_SCHOOL_SETTINGS.counselors;
  const counselorNamesStr = counselors.map((c) => c.name).join(' & ');
  
  // 4-7-8 Breathing state
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'ready'>('ready');
  const [countdown, setCountdown] = useState<number>(0);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathCount, setBreathCount] = useState<number>(0);

  // SOS Form state
  const [urgencyLevel, setUrgencyLevel] = useState<'immediate' | 'high' | 'consultation'>('immediate');
  const [contactOrLocation, setContactOrLocation] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Breathing cycle logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isBreathingActive) {
      setBreathPhase('ready');
      return;
    }

    if (breathPhase === 'ready') {
      setBreathPhase('inhale');
      setCountdown(4);
    } else if (countdown > 1) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 1) {
      timer = setTimeout(() => {
        if (breathPhase === 'inhale') {
          setBreathPhase('hold');
          setCountdown(7);
        } else if (breathPhase === 'hold') {
          setBreathPhase('exhale');
          setCountdown(8);
        } else if (breathPhase === 'exhale') {
          setBreathCount((prev) => prev + 1);
          setBreathPhase('inhale');
          setCountdown(4);
        }
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [isBreathingActive, breathPhase, countdown]);

  if (!isOpen) return null;

  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    onSubmitSOS({
      urgencyLevel,
      contactOrLocation: contactOrLocation.trim() || 'Học sinh ẩn danh (cần hỗ trợ)',
      note: note.trim(),
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with reassuring tone */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">Cổng Hỗ Trợ Khẩn Cấp & Tham Vấn Tâm Lý</h2>
              <p className="text-xs text-rose-100">Bảo mật thông tin tuyệt đối · Luôn có người lắng nghe em 24/7</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng cửa sổ hỗ trợ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassuring banner */}
        <div className="px-5 py-2.5 bg-rose-50 border-b border-rose-100 flex items-center gap-2 text-xs text-rose-900 shrink-0">
          <Heart className="w-4 h-4 text-rose-500 shrink-0" />
          <span>
            <strong>Em đang an toàn.</strong> Hãy cho phép mình hít thở sâu. Mọi khó khăn hay cảm xúc hoảng loạn này đều có cách giải quyết.
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-200 bg-slate-50/70 text-xs font-medium overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('hotlines')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'hotlines' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Đường dây nóng cứu hộ</span>
          </button>
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'breathing' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Kỹ thuật thở 4-7-8</span>
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'grounding' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Neo đậu cảm xúc 5-4-3-2-1</span>
          </button>
          <button
            onClick={() => setActiveTab('sos')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'sos' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi tín hiệu SOS kín đáo</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 grow">
          {/* TAB 1: HOTLINES */}
          {activeTab === 'hotlines' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 111 Hotline */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-rose-700">Tổng đài Quốc Gia</span>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">Miễn phí 24/7</span>
                    </div>
                    <div className="text-2xl font-bold font-serif text-slate-900 mb-1">111</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Tổng đài Quốc gia Bảo vệ Trẻ em. Tiếp nhận mọi thông tin về bạo lực học đường, tổn thương thể chất/tinh thần hoặc khủng hoảng.
                    </p>
                  </div>
                  <a
                    href="tel:111"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Gọi ngay 111
                  </a>
                </div>

                {/* Đường dây Ngày Mai */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-amber-800">Đường Dây Nóng Ngày Mai</span>
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">Tư vấn trầm cảm</span>
                    </div>
                    <div className="text-2xl font-bold font-serif text-slate-900 mb-1">1900 6440</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Hỗ trợ lắng nghe, xoa dịu những bạn học sinh đang trải qua nỗi buồn dai dẳng, kiệt sức, hoặc có ý định tự hại.
                    </p>
                  </div>
                  <a
                    href="tel:19006440"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Gọi 1900 6440
                  </a>
                </div>

                {/* Phòng tư vấn tâm lý trường */}
                <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-sky-800">Phòng Tư Vấn Trường</span>
                      <span className="text-[11px] font-medium text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full">{schoolSettings.counselingRoom}</span>
                    </div>
                    <div className="text-xl font-bold font-serif text-slate-900 mb-1">{schoolSettings.hotlinePhone}</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {counselorNamesStr} trực tiếp hỗ trợ. Luôn sẵn sàng lắng nghe và bảo vệ học sinh {schoolSettings.schoolName}.
                    </p>
                  </div>
                  <a
                    href={`tel:${schoolSettings.hotlinePhone.replace(/[^0-9+]/g, '')}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Gọi cô thầy tư vấn
                  </a>
                </div>

                {/* Cấp cứu Y tế 115 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700">Cấp cứu y tế khẩn cấp</span>
                      <span className="text-[11px] font-medium text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full">Y tế</span>
                    </div>
                    <div className="text-2xl font-bold font-serif text-slate-900 mb-1">115</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Sử dụng khi có nguy cơ đe dọa trực tiếp đến tính mạng hoặc chấn thương y tế nghiêm trọng cần xe cấp cứu.
                    </p>
                  </div>
                  <a
                    href="tel:115"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Gọi cấp cứu 115
                  </a>
                </div>
              </div>

              {/* Counselor Duty Information */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cam kết đạo đức từ Phòng Tư vấn Học đường:</span>
                </div>
                <p>
                  1. Mọi điều em chia sẻ tại đây đều được giữ kín tuyệt đối, không chia sẻ cho bạn bè, giáo viên bộ môn hay bất kỳ ai khi chưa có sự đồng ý của em.
                </p>
                <p>
                  2. Em hoàn toàn có quyền chọn nói chuyện bằng giọng nói, nhắn tin ẩn danh, hoặc chỉ đơn giản là đến ngồi yên lặng uống một cốc trà ấm tại phòng 204.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: BREATHING 4-7-8 */}
          {activeTab === 'breathing' && (
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-5">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
                  Bài Tập Hít Thở 4-7-8 Giảm Căng Thẳng Tức Thì
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Kỹ thuật này kích hoạt hệ thần kinh phó giao cảm, làm giảm nhịp tim và ngăn chặn cơn hoảng loạn trong vòng 2 phút.
                </p>
              </div>

              {/* Animated Breathing Visualizer */}
              <div className="relative flex items-center justify-center w-52 h-52">
                {/* Outer pulsing ring */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                    breathPhase === 'inhale'
                      ? 'scale-100 bg-rose-200/50'
                      : breathPhase === 'hold'
                      ? 'scale-105 bg-amber-200/50'
                      : breathPhase === 'exhale'
                      ? 'scale-75 bg-sky-200/50'
                      : 'scale-90 bg-slate-100'
                  }`}
                />

                {/* Main animated circle */}
                <div
                  className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform ${
                    breathPhase === 'inhale'
                      ? 'scale-100 duration-[4000ms] bg-gradient-to-tr from-rose-500 to-rose-400 text-white'
                      : breathPhase === 'hold'
                      ? 'scale-105 duration-[7000ms] bg-gradient-to-tr from-amber-500 to-amber-400 text-white'
                      : breathPhase === 'exhale'
                      ? 'scale-75 duration-[8000ms] bg-gradient-to-tr from-sky-500 to-sky-400 text-white'
                      : 'scale-90 duration-500 bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-xs uppercase font-bold tracking-wider mb-1">
                    {breathPhase === 'ready' && 'Sẵn sàng'}
                    {breathPhase === 'inhale' && 'Hít vào bằng mũi'}
                    {breathPhase === 'hold' && 'Giữ hơi thở'}
                    {breathPhase === 'exhale' && 'Thở ra từ từ'}
                  </span>
                  <span className="font-serif text-3xl font-extrabold tabular-nums">
                    {isBreathingActive ? countdown : '4-7-8'}
                  </span>
                </div>
              </div>

              {/* Breath Count & Controls */}
              <div className="space-y-3">
                <div className="text-xs text-slate-500">
                  Chu kỳ hoàn thành: <span className="font-semibold text-slate-800">{breathCount}</span> lần
                </div>
                <div className="flex items-center gap-2 justify-center">
                  {!isBreathingActive ? (
                    <button
                      onClick={() => setIsBreathingActive(true)}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-transform active:scale-95"
                    >
                      Bắt đầu hít thở cùng bạn
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsBreathingActive(false);
                        setBreathPhase('ready');
                      }}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Tạm dừng bài tập
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs text-slate-600 max-w-md">
                <span className="font-semibold text-slate-800">Mẹo thực hiện:</span> Ngồi thẳng lưng, đặt đầu lưỡi chạm vào vòm miệng ngay sau răng cửa trên. Hít vào nhẹ nhàng bằng mũi và thở ra tạo âm thanh êm dịu bằng miệng.
              </div>
            </div>
          )}

          {/* TAB 3: GROUNDING 5-4-3-2-1 */}
          {activeTab === 'grounding' && (
            <div className="space-y-3.5">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900 mb-0.5">
                  Kỹ Thuật Neo Đậu Cảm Xúc 5-4-3-2-1
                </h3>
                <p className="text-xs text-slate-500">
                  Khi tâm trí bị cuốn vào nỗi sợ hay quá khứ, hãy dùng 5 giác quan để kéo bạn trở về với hiện tại an toàn.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0">5</span>
                  <div>
                    <h4 className="text-xs font-bold text-rose-950">5 điều bạn có thể NHÌN THẤY xung quanh</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Ví dụ: Màu sắc viên gạch dưới chân, một chiếc lá ngoài cửa sổ, chiếc bút bi, vết xước trên bàn, ánh nắng.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">4 điều bạn có thể CHẠM VÀO</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Ví dụ: Độ mềm của tay áo, bề mặt mát lạnh của bình nước, tóc của bạn, chiếc vòng tay.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">3 âm thanh bạn có thể NGHE THẤY</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Ví dụ: Tiếng quạt trần quay đều, tiếng chim hót xa xa, tiếng bước chân hành lang.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h4 className="text-xs font-bold text-sky-950">2 mùi hương bạn có thể NGỬI THẤY</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Ví dụ: Mùi trang sách mới, mùi mưa, mùi nước hoa thoang thoảng hoặc mùi dầu gió.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-purple-500 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h4 className="text-xs font-bold text-purple-950">1 điều tích cực về CHÍNH BẢN THÂN BẠN</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Ví dụ: "Hôm nay mình đã dũng cảm đối diện", "Mình có một trái tim biết quan tâm", "Mình đang cố gắng từng ngày".</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOS FORM */}
          {activeTab === 'sos' && (
            <div className="space-y-4">
              {isSubmitted ? (
                <div className="py-10 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-emerald-950">Tín hiệu SOS đã được gửi thành công!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thầy cô phụ trách phòng tâm lý đã nhận được cảnh báo ưu tiên và sẽ liên hệ/đến hỗ trợ em ngay tức thì. Em hãy tìm nơi an toàn ngồi nghỉ nhé!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendSOS} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Mức độ cần hỗ trợ:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setUrgencyLevel('immediate')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                          urgencyLevel === 'immediate'
                            ? 'border-red-500 bg-red-50 text-red-950 font-semibold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-red-600 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Khẩn cấp ngay</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">Cần người đến ngay lập tức</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUrgencyLevel('high')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                          urgencyLevel === 'high'
                            ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Trong giờ giải lao</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">Gặp riêng giờ ra chơi hôm nay</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUrgencyLevel('consultation')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                          urgencyLevel === 'consultation'
                            ? 'border-sky-500 bg-sky-50 text-sky-950 font-semibold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-sky-600 mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Hẹn tại phòng 204</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">Trò chuyện sau giờ học</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Vị trí em đang đứng HOẶC cách liên hệ ẩn danh (Zalo / SĐT nếu muốn):
                    </label>
                    <input
                      type="text"
                      value={contactOrLocation}
                      onChange={(e) => setContactOrLocation(e.target.value)}
                      placeholder="VD: Cầu thang tầng 3 nhà B, hoặc SĐT 09xx..., hoặc Ẩn danh tại lớp 11A2"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Tình trạng hiện tại của em (viết ngắn gọn điều em đang trải qua):
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Em đang cảm thấy quá hoảng loạn / bị đe dọa / khó thở / cần có người ngồi cùng..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Mọi tín hiệu được bảo mật 100%
                    </span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Gửi tín hiệu SOS đến Thầy Cô
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 shrink-0">
          Trực ban hỗ trợ: {schoolSettings.counselingRoom} ({schoolSettings.schoolName}) · Hotline thường trực: {schoolSettings.hotlinePhone}
        </div>
      </div>
    </div>
  );
};
