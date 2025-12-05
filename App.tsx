import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { GuestbookForm } from './components/GuestbookForm';
import { GuestbookList } from './components/GuestbookList';
import { UserProfileModal } from './components/UserProfileModal';
import { fetchMessages, postMessage } from './services/guestbookService';
import { GuestEntry } from './types';
import { Ghost, Settings2 } from 'lucide-react';

interface UserProfile {
  name: string;
  date: string;
  oc: string;
}

// Hook for complicated flickering logic
const useBrokenLightEffect = () => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let isActive = true;

    // Helper to start the next event loop
    const scheduleNextEvent = () => {
      if (!isActive) return;

      // Randomly choose between Mode 1 (General Jitter) and Mode 2 (Deep Dip)
      // Weighting: 70% Mode 1, 30% Mode 2
      const isMode2 = Math.random() > 0.7;

      if (isMode2) {
        runMode2();
      } else {
        runMode1();
      }
    };

    // Mode 1: 85% - 100% random jitter, random speed
    const runMode1 = () => {
      const modeDuration = 2000 + Math.random() * 3000; // Run for 2-5 seconds
      const startTime = Date.now();

      const flicker = () => {
        if (!isActive) return;
        
        const now = Date.now();
        if (now - startTime > modeDuration) {
          scheduleNextEvent(); // Done with Mode 1
          return;
        }

        // Opacity: 0.85 to 1.00
        setOpacity(0.85 + Math.random() * 0.15);
        
        // Random speed: 50ms to 200ms
        timeoutId = setTimeout(flicker, 50 + Math.random() * 150);
      };

      flicker();
    };

    // Mode 2: Drop to 60% (3s) -> Jitter 85-90% (1s) -> 100%
    const runMode2 = () => {
      if (!isActive) return;

      // Step 1: Drop to 60%
      setOpacity(0.6);

      // Wait 3 seconds
      timeoutId = setTimeout(() => {
        if (!isActive) return;

        // Step 2: Jitter 85-90% for 1 second
        const jitterDuration = 1000;
        const jitterStart = Date.now();

        const jitter = () => {
          if (!isActive) return;
          const now = Date.now();
          if (now - jitterStart > jitterDuration) {
            // Step 3: Back to 100%
            setOpacity(1);
            // Wait a random short time before next major event
            timeoutId = setTimeout(scheduleNextEvent, 500 + Math.random() * 1000);
            return;
          }

          // Opacity: 0.85 to 0.90
          setOpacity(0.85 + Math.random() * 0.05);
          timeoutId = setTimeout(jitter, 50 + Math.random() * 100);
        };

        jitter();

      }, 3000);
    };

    // Start
    scheduleNextEvent();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return opacity;
};

export default function App() {
  // Data Fetching
  const { data: entries, isLoading, mutate } = useSWR<GuestEntry[]>(
    '/api/guestbook',
    fetchMessages,
    { refreshInterval: 10000, fallbackData: [] }
  );

  // User State
  const [profile, setProfile] = useState<UserProfile>({
    name: '迷途幽灵_' + Math.floor(Math.random() * 1000),
    date: '', // Will be set on mount
    oc: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Toast Notification State
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });

  // Title Flickering Opacity
  const titleOpacity = useBrokenLightEffect();

  // Load profile from local storage on mount (if you were persisting it, optional here)
  useEffect(() => {
    // Ideally check localStorage here
    const saved = localStorage.getItem('ghostTramProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      // Set initial dynamic date client-side
      setProfile(p => ({...p, date: new Date().toLocaleString('zh-CN')}));
    }
  }, []);

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('ghostTramProfile', JSON.stringify(newProfile));
    showToast("身份设定已覆写 / IDENTITY OVERWRITTEN");
  };

  const handleSendMessage = async (messageText: string) => {
    // Optimistic Update
    const optimisticEntry: GuestEntry = {
      id: Math.random().toString(36),
      name: profile.name,
      message: messageText,
      date: profile.date,
      oc: profile.oc
    };

    const currentEntries = entries || [];
    await mutate([optimisticEntry, ...currentEntries], false);
    
    // API Call
    await postMessage(profile.name, messageText, profile.date, profile.oc);
    
    // Revalidate & Feedback
    await mutate();
    showToast("讯号已映射到集体意识 / SIGNAL BROADCASTED");
  };

  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black">
      
      {/* Header Area */}
      <header className="fixed top-0 left-0 w-full z-30 bg-gradient-to-b from-[#050505] to-transparent pt-8 pb-12 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div>
            <h1 
              className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2 uppercase transition-opacity duration-75"
              style={{ opacity: titleOpacity }}
            >
              幽灵電车
            </h1>
            <h2 className="text-sm md:text-base font-mono text-neutral-400 tracking-[0.2em] border-l-2 border-neutral-600 pl-3">
              来自各种时空中的幽灵们
            </h2>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex flex-col items-center gap-1 text-neutral-400 hover:text-white transition-colors"
          >
            <div className="p-2 border-2 border-neutral-600 group-hover:border-white rounded-full transition-all bg-black">
              <Ghost className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              身份设定
            </span>
          </button>
        </div>
      </header>

      {/* Main Content (Scrollable) */}
      <main className="relative z-10 pt-48 px-6 max-w-3xl mx-auto">
        <GuestbookList entries={entries || []} isLoading={isLoading} />
      </main>

      {/* Fixed Bottom Input */}
      <GuestbookForm 
        onSendMessage={handleSendMessage} 
        disabled={isLoading} 
      />

      {/* Modals & Overlays */}
      <UserProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfile={profile}
        onSave={handleSaveProfile}
      />

      {/* Retro Toast */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[70] transition-all duration-500 transform ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className="bg-white text-black px-6 py-3 font-bold font-mono border-2 border-neutral-400 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          {">"} {toast.message}
        </div>
      </div>

    </div>
  );
}