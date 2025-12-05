import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { GuestbookList } from './components/GuestbookList';
import { UserProfileModal } from './components/UserProfileModal';
import { fetchMessages, postMessage } from './services/guestbookService';
import { GuestEntry, UserProfile } from './types';
import { Ghost, Send } from 'lucide-react';

export default function App() {
  // 1. User Profile State (Persisted in localStorage ideally, here just state)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    date: '', // Will default to client time on mount
    oc: ''
  });

  // Initialize date on client side to avoid hydration mismatch
  useEffect(() => {
    const now = new Date().toLocaleString('zh-CN', { hour12: false });
    setUserProfile(prev => ({ ...prev, date: now }));
  }, []);

  // 2. Toast State
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  // 3. SWR Data Fetching (Auto-refresh every 10s)
  const { data: entries, isLoading } = useSWR<GuestEntry[]>(
    '/api/guestbook',
    fetchMessages,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    }
  );

  // 4. Handle Sending Message
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!userProfile.name) {
      setIsModalOpen(true);
      showToast('请先设定你的幽灵身份 >');
      return;
    }

    setIsSending(true);
    
    // Optimistic Update
    const optimisticEntry: GuestEntry = {
      id: Math.random().toString(),
      name: userProfile.name,
      message: inputValue,
      date: userProfile.date,
      oc: userProfile.oc
    };
    
    // Update UI immediately
    await mutate('/api/guestbook', (currentData: GuestEntry[] = []) => {
      return [optimisticEntry, ...currentData];
    }, false);

    try {
      // Send to backend
      await postMessage(userProfile.name, inputValue, userProfile.date, userProfile.oc);
      showToast('已映射到集体意识中');
      setInputValue('');
      mutate('/api/guestbook'); // Re-validate to get real data
    } catch (error) {
      console.error(error);
      showToast('信号传输失败...');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 font-mono selection:bg-white selection:text-black overflow-x-hidden relative">
      
      {/* --- Visual Noise Overlay (Retro Effect) --- */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.15] mix-blend-overlay"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             animation: 'noise 0.2s infinite'
           }}
      />
      
      {/* --- Scanlines Effect --- */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] bg-repeat" />

      {/* --- Header --- */}
      <header className="pt-12 pb-8 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-2 uppercase" style={{ textShadow: '4px 4px 0px #404040' }}>
          幽灵電车
        </h1>
        <h2 className="text-sm md:text-base text-neutral-400 tracking-[0.5em] uppercase">
          来自各种时空中的幽灵们
        </h2>
        
        {/* User Profile Trigger */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="absolute top-8 right-8 p-3 hover:bg-neutral-800 rounded-full transition-colors group border border-transparent hover:border-neutral-600"
          title="编辑身份"
        >
          <Ghost className="w-6 h-6 text-neutral-400 group-hover:text-white" />
        </button>
      </header>

      {/* --- Main Content (List) --- */}
      <main className="max-w-2xl mx-auto px-4 pb-32 relative z-10">
        <GuestbookList entries={entries || []} isLoading={isLoading} />
      </main>

      {/* --- Bottom Input Bar --- */}
      <div className="fixed bottom-0 left-0 w-full p-4 pb-8 bg-gradient-to-t from-neutral-900 via-neutral-900 to-transparent z-30">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <div className="flex-1 bg-black border border-neutral-700 p-2 shadow-[4px_4px_0px_0px_rgba(40,40,40,1)] focus-within:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-shadow group">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="输入讯息..."
              className="w-full bg-transparent border-none text-white focus:ring-0 resize-none h-12 py-2 placeholder:text-neutral-600"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isSending}
            className="h-14 w-14 flex items-center justify-center bg-white text-black border border-neutral-600 shadow-[4px_4px_0px_0px_rgba(60,60,60,1)] active:translate-y-1 active:shadow-none transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- Modals & Overlays --- */}
      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        profile={userProfile}
        onSave={(newProfile) => {
          setUserProfile(newProfile);
          showToast('身份档案已更新');
          setIsModalOpen(false);
        }}
      />

      {/* --- Retro Toast Notification (Fixed) --- */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[70] transition-all duration-500 transform ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className="bg-white text-black px-6 py-3 font-bold font-mono border-2 border-neutral-400 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2">
          {/* 修复点：将原来的 > 改为 {'>'} */}
          <span>{'>'}</span> 
          {toast.message}
        </div>
      </div>

      {/* --- Global Styles for Animations --- */}
      <style>{`
        @keyframes noise {
          0% { transform: translate(0,0) }
          10% { transform: translate(-5%,-5%) }
          20% { transform: translate(-10%,5%) }
          30% { transform: translate(5%,-10%) }
          40% { transform: translate(-5%,15%) }
          50% { transform: translate(-10%,5%) }
          60% { transform: translate(15%,0) }
          70% { transform: translate(0,10%) }
          80% { transform: translate(-15%,0) }
          90% { transform: translate(10%,5%) }
          100% { transform: translate(5%,0) }
        }
      `}</style>
    </div>
  );
}