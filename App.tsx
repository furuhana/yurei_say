import React, { useState, useEffect, useRef, useMemo } from 'react';
import useSWR from 'swr';
import { GuestbookForm } from './components/GuestbookForm';
import { GuestbookList } from './components/GuestbookList';
import { UserProfileModal } from './components/UserProfileModal';
import { MagneticField, MagneticState } from './components/MagneticField';
import { fetchMessages, postMessage, deleteMessage } from './services/guestbookService';
import { GuestEntry } from './types';
import { Ghost, Volume2, AlertTriangle } from 'lucide-react';

interface UserProfile {
  name: string;
  date: string;
  oc: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error Boundary Component to prevent white screen crashes
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#F5F3EF] flex items-center justify-center flex-col text-[#00A651]">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <h1 className="text-xl font-bold uppercase tracking-widest">SYSTEM_CRASH_DETECTED</h1>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 border border-[#00A651] px-4 py-2 hover:bg-[#00A651] hover:text-[#F5F3EF] transition-colors font-bold"
          >
            REBOOT_SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const GhostTramLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 2829 5067" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1386.26 4136V3310H840.76V3558H1027.96C1122.57 3558 1199.26 3634.7 1199.26 3729.3V4136H1386.26Z" fill="currentColor"/>
    <path d="M1470.26 3310V4136H1657.26V3729.3C1657.26 3634.69 1733.96 3558 1828.56 3558H2015.76V3310H1470.26Z" fill="currentColor"/>
    <path d="M657.21 827.32L571.4 725.05L563.74 731.48L649.55 833.74C652.09 831.59 654.66 829.45 657.22 827.32H657.21Z" fill="currentColor"/>
    <path d="M829.75 707.35L763.09 591.9L754.43 596.9L821.1 712.37C823.98 710.69 826.86 709.01 829.75 707.35Z" fill="currentColor"/>
    <path d="M222.76 1754C222.76 1752.33 222.78 1750.67 222.79 1749H89.2598V1759H222.79C222.79 1757.33 222.76 1755.67 222.76 1754Z" fill="currentColor"/>
    <path d="M508 975.28L405.74 889.47L399.31 897.13L501.58 982.94C503.71 980.38 505.85 977.82 508 975.27V975.28Z" fill="currentColor"/>
    <path d="M296.89 1336.89L171.73 1291.33L168.31 1300.73L293.48 1346.29C294.61 1343.15 295.74 1340.02 296.89 1336.89Z" fill="currentColor"/>
    <path d="M386.63 1146.84L271.16 1080.17L266.16 1088.83L381.61 1155.49C383.27 1152.6 384.95 1149.72 386.63 1146.84Z" fill="currentColor"/>
    <path d="M241.76 1539.71L110.48 1516.56L108.74 1526.41L240.05 1549.56C240.61 1546.27 241.17 1542.98 241.76 1539.71Z" fill="currentColor"/>
    <path d="M1223.83 565.79L1200.68 434.48L1190.83 436.22L1213.98 567.5C1217.26 566.91 1220.55 566.35 1223.83 565.79Z" fill="currentColor"/>
    <path d="M1020.55 619.21L974.99 494.04L965.59 497.46L1011.15 622.62C1014.28 621.47 1017.41 620.34 1020.55 619.21Z" fill="currentColor"/>
    <path d="M2206.98 833.74L2292.79 731.48L2285.13 725.05L2199.32 827.32C2201.88 829.45 2204.44 831.59 2206.99 833.74H2206.98Z" fill="currentColor"/>
    <path d="M2474.92 1155.49L2590.37 1088.83L2585.37 1080.17L2469.9 1146.84C2471.58 1149.72 2473.26 1152.6 2474.92 1155.49Z" fill="currentColor"/>
    <path d="M2354.94 982.95L2457.21 897.14L2450.78 889.48L2348.52 975.29C2350.67 977.83 2352.81 980.39 2354.94 982.96V982.95Z" fill="currentColor"/>
    <path d="M2563.05 1346.29L2688.22 1300.73L2684.8 1291.33L2559.64 1336.89C2560.79 1340.02 2561.93 1343.15 2563.05 1346.29Z" fill="currentColor"/>
    <path d="M1845.37 622.63L1890.93 497.47L1881.53 494.05L1835.97 619.22C1839.11 620.35 1842.24 621.48 1845.37 622.63Z" fill="currentColor"/>
    <path d="M2035.42 712.36L2102.09 596.89L2093.43 591.89L2026.77 707.34C2029.66 709 2032.54 710.68 2035.42 712.36Z" fill="currentColor"/>
    <path d="M1642.55 567.49L1665.7 436.21L1655.85 434.47L1632.7 565.78C1635.99 566.34 1639.27 566.9 1642.55 567.49Z" fill="currentColor"/>
    <path d="M2616.48 1549.56L2747.79 1526.41L2746.05 1516.56L2614.77 1539.71C2615.36 1542.99 2615.92 1546.28 2616.48 1549.56Z" fill="currentColor"/>
    <path d="M2633.73 1749C2633.73 1750.67 2633.76 1752.33 2633.76 1754C2633.76 1755.67 2633.74 1757.33 2633.73 1759H2767.26V1749H2633.73Z" fill="currentColor"/>
    <path d="M1470.26 4292V4209H1386.26V4292H1237.03C1282.64 4362.12 1318.57 4437.91 1344.04 4517.78C1373.38 4609.8 1388.26 4705.42 1388.26 4802V5067H1468.26V4802C1468.26 4705.42 1483.14 4609.79 1512.48 4517.78C1537.95 4437.91 1573.88 4362.12 1619.49 4292H1470.26Z" fill="currentColor"/>
    <path d="M902.49 3721.83L847.85 3658.03L584.83 3906.62L490.24 3796.18C466.65 3876.43 432.47 3953.02 388.37 4024.32C337.57 4106.46 274.62 4179.97 201.27 4242.79L0 4415.19L52.04 4475.95L253.3 4303.57C326.65 4240.74 408.96 4189.84 497.93 4152.26C575.16 4119.64 656.1 4097.64 739.02 4086.66L639.46 3970.42L902.48 3721.83H902.49Z" fill="currentColor"/>
    <path d="M2551.52 4110.07C2558.36 4100.5 2565.09 4090.86 2571.66 4081.12C2621.47 4007.39 2664.26 3928.56 2698.83 3846.82C2770.78 3676.71 2807.26 3496.1 2807.26 3310H2507.26C2507.26 3490.21 2462.84 3660.24 2384.39 3809.73C2420.32 3920.39 2476.91 4021.92 2551.52 4110.06V4110.07Z" fill="currentColor"/>
    <path d="M2627.32 4242.81C2553.97 4179.98 2491.02 4106.48 2440.22 4024.34C2396.12 3953.04 2361.94 3876.45 2338.35 3796.2L2243.74 3906.66L1984.73 3662.05L1930.09 3725.85L2189.1 3970.46L2089.56 4086.68C2172.48 4097.65 2253.42 4119.66 2330.65 4152.28C2419.62 4189.85 2501.93 4240.76 2575.28 4303.59L2776.54 4475.97L2828.58 4415.21L2627.32 4242.83V4242.81Z" fill="currentColor"/>
    <path d="M2125.63 4132.72C1983.28 4253.57 1809.28 4338.21 1618 4372.28C1564.46 4469.88 1529.91 4575.96 1515.68 4686.26C1670.94 4676.61 1821.74 4641.19 1965.08 4580.57C2046.82 4545.99 2125.65 4503.21 2199.38 4453.4C2272.37 4404.09 2341 4347.47 2403.36 4285.1C2414.44 4274.02 2425.33 4262.72 2436.04 4251.25C2341.01 4192.61 2236.14 4152.51 2125.62 4132.72H2125.63Z" fill="currentColor"/>
    <path d="M284.86 4081.12C287.27 4084.68 289.71 4088.22 292.15 4091.76C366.81 3998.65 421.98 3891.49 454.71 3775.03C387.14 3634.14 349.26 3476.41 349.26 3310H49.2598C49.2598 3496.1 85.7398 3676.71 157.69 3846.82C192.27 3928.56 235.05 4007.39 284.86 4081.12Z" fill="currentColor"/>
    <path d="M1238.53 4372.28C1045.22 4337.85 869.56 4251.76 726.38 4128.85C614.21 4145.91 507.49 4183.72 410.49 4240.47C424.39 4255.67 438.61 4270.56 453.16 4285.1C515.53 4347.47 584.16 4404.09 657.14 4453.4C730.87 4503.21 809.7 4546 891.44 4580.57C1034.78 4641.2 1185.59 4676.61 1340.84 4686.26C1326.62 4575.96 1292.06 4469.88 1238.52 4372.28H1238.53Z" fill="currentColor"/>
    <path d="M1386.26 1506V1620H1470.26V1506H1629.84C1522.61 1166.97 1468.26 814.89 1468.26 459.11V0H1388.26V459.11C1388.26 814.88 1333.9 1166.96 1226.68 1506H1386.26Z" fill="currentColor"/>
  </svg>
);

// BACKGROUND MUSIC COMPONENT
const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/bgm.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Playback prevented:", e));
      setIsPlaying(true);
    }
  };

  return (
    <div 
      onClick={toggleAudio}
      className="w-32 md:w-48 h-full border-l border-[#00A651] relative cursor-pointer hover:bg-[#00A651] hover:text-[#F5F3EF] group transition-colors flex flex-col items-center justify-center select-none"
    >
      <div className="absolute top-1 left-2 text-[8px] font-bold tracking-widest">
        AUDIO_MODULE
      </div>
      
      <div className="flex items-center gap-2">
        {isPlaying ? (
          <div className="flex items-end gap-1 h-4">
             <div className="eq-bar h-2 w-1 bg-current"></div>
             <div className="eq-bar h-4 w-1 bg-current"></div>
             <div className="eq-bar h-3 w-1 bg-current"></div>
          </div>
        ) : (
          <Volume2 className="w-5 h-5 opacity-50" />
        )}
        <span className="font-bold text-sm tracking-widest">
          {isPlaying ? '[ON]' : '[OFF]'}
        </span>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { data: entries, isLoading, mutate } = useSWR<GuestEntry[]>(
    '/api/guestbook',
    fetchMessages,
    { refreshInterval: 10000, fallbackData: [] }
  );

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Ghost_' + Math.floor(Math.random() * 1000),
    date: '',
    oc: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });
  const [replyTo, setReplyTo] = useState<GuestEntry | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ghostTramProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setProfile(p => ({...p, date: new Date().toLocaleString('zh-CN')}));
    }
  }, []);

  // Determine Magnetic State
  const magneticState = useMemo(() => {
    if (!entries) return MagneticState.OFF;

    // Filter messages posted by current user
    const myMessages = entries.filter(e => e.name === profile.name);
    
    if (myMessages.length === 0) {
      return MagneticState.OFF; // State 3 (User has no posts)
    }

    // Check if any of my messages have replies
    const myMessageIds = new Set(myMessages.map(e => e.id));
    const hasReplies = entries.some(e => e.replyTo && myMessageIds.has(e.replyTo));

    return hasReplies ? MagneticState.ACTIVE : MagneticState.INACTIVE; // State 1 or 2
  }, [entries, profile.name]);


  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('ghostTramProfile', JSON.stringify(newProfile));
    showToast("IDENTITY UPDATED");
  };

  const handleSendMessage = async (messageText: string) => {
    // Optimistic ID must match what backend might produce or be temporary. 
    // Backend uses Date.now + random, which is consistent with frontend gen here.
    const optimisticEntry: GuestEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: profile.name,
      message: messageText,
      date: profile.date,
      oc: profile.oc,
      replyTo: replyTo?.id
    };
    
    const currentEntries = entries || [];
    // Prepend (though list rendering logic will handle sorting)
    await mutate([optimisticEntry, ...currentEntries], false);
    
    await postMessage(profile.name, messageText, profile.date, profile.oc, replyTo?.id);
    await mutate();
    showToast("MESSAGE TRANSMITTED");
    setReplyTo(null);
  };

  const handleDeleteMessage = async (entry: GuestEntry) => {
    if (!confirm('PERMANENTLY DELETE RECORD?')) return;
    const currentEntries = entries || [];
    const updatedEntries = currentEntries.filter(e => e.id !== entry.id);
    await mutate(updatedEntries, false);
    await deleteMessage(entry.id, profile.name);
    await mutate();
    showToast("RECORD DELETED");
  };

  return (
    <div className="h-[100dvh] w-screen bg-[#F5F3EF] flex flex-col overflow-hidden selection:bg-[#00A651] selection:text-[#F5F3EF] font-sans relative">
      
      {/* 1. Header Grid Row */}
      <header className="flex h-24 md:h-32 border-b border-[#00A651] shrink-0 bg-[#F5F3EF] z-20">
        
        {/* Title Area (Flex Grow) */}
        <div className="flex-1 p-4 md:p-6 flex items-center gap-4 md:gap-6 relative overflow-hidden">
          <GhostTramLogo className="w-12 md:w-16 h-auto text-[#00A651] shrink-0" />
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#00A651] uppercase leading-[0.9] -ml-1">
              幽灵電车
            </h1>
            <h2 className="text-xs md:text-sm font-bold text-[#00A651] tracking-[0.2em] mt-1">
              GHOST TRAM // SWISS GRID
            </h2>
          </div>
          {/* ASCII Art Decor */}
          <div className="hidden xl:flex ml-auto mr-8 flex-col items-end text-[#00A651] text-[10px] leading-[0.8] font-mono tracking-tighter opacity-80">
            <pre className="whitespace-pre">
{`.+------+ +------+ +------+ +------+ +------+.
.' | .'| /| /| | | |\\ |\\ |. |.
+---+--+' | +-+----+ | +------+ | +----+-+ | +--+---+ | | | | | | | | | | | | | | | | | | | ,+--+---+ | +----+-+ +------+ +-+----+ | +---+--+ | |.' | .' |/ |/ | | | |. | . | +------+' +------+ +------+ +------++------+`}
            </pre>
          </div>
        </div>

        {/* Audio Module (Fixed) */}
        <BackgroundMusic />

        {/* Profile Trigger (Fixed) */}
        <div 
          className="w-32 md:w-48 h-full border-l border-[#00A651] bg-[#F5F3EF] relative group cursor-pointer hover:bg-[#00A651] hover:text-[#F5F3EF] transition-colors shrink-0 flex items-center justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="absolute top-1 right-2 text-[8px] font-bold tracking-widest bg-[#F5F3EF] px-1 border border-[#00A651] text-[#00A651]">
            ID_CARD
          </div>
          <div className="p-4 border border-[#00A651] bg-[#F5F3EF] group-hover:bg-[#00A651] group-hover:text-[#F5F3EF] transition-colors">
            <Ghost className="w-8 h-8" />
          </div>
        </div>
      </header>

      {/* Filler Bar below Header */}
      <div className="h-[6px] w-full bg-[#F5F3EF] border-b border-[#00A651] shrink-0"></div>

      {/* 2. Main Layout (Split View) */}
      <main className="flex-1 min-h-0 flex relative">
        {/* Sidebar Decor - Left */}
        <div className="absolute left-0 top-0 bottom-0 w-4 md:w-8 border-r border-[#00A651] bg-[#F5F3EF] z-10 hidden md:block"></div>

        {/* 2a. Message Stream (Left Column) */}
        <div className="flex-1 min-w-0 flex flex-col md:border-r border-[#00A651]">
          {/* Container Scroll */}
          <div className="flex-1 overflow-y-auto md:ml-8 relative">
             <GuestbookList 
              entries={entries || []} 
              isLoading={isLoading} 
              isAdmin={profile.name === '露西'}
              onDelete={handleDeleteMessage}
              onReply={(entry) => setReplyTo(entry)}
            />
          </div>
          
          {/* Footer Input */}
          <div className="h-12 border-t border-[#00A651] shrink-0 relative z-20">
             <GuestbookForm 
              onSendMessage={handleSendMessage} 
              disabled={isLoading}
              replyToEntry={replyTo}
              onCancelReply={() => setReplyTo(null)}
            />
          </div>
        </div>

        {/* 2b. Magnetic Field Sidebar (Right Column - Desktop Only) */}
        <div className="hidden lg:flex w-[600px] xl:w-[965px] shrink-0 flex-col border-l border-[#00A651] relative z-0">
           {/* Visualizer */}
           <MagneticField state={magneticState} username={profile.name} />
           
           {/* Filler at bottom to match input bar height */}
           <div className="h-12 border-t border-[#00A651] flex items-center justify-between px-4 text-[#00A651] font-bold text-xs uppercase tracking-widest bg-[#F5F3EF]">
              <span>SYSTEM_STATUS</span>
              <span>ONLINE</span>
           </div>
        </div>
        
        {/* Sidebar Decor - Right (If Magnetic Field hidden) */}
        <div className="absolute right-0 top-0 bottom-0 w-4 md:w-8 border-l border-[#00A651] bg-[#F5F3EF] z-10 lg:hidden block"></div>

      </main>

      {/* Modals & Overlays */}
      <UserProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfile={profile}
        onSave={handleSaveProfile}
      />

      {/* Toast Notification */}
      <div className={`fixed bottom-20 right-8 z-[70] transition-all duration-300 transform ${toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#00A651] text-[#F5F3EF] px-6 py-3 font-bold text-sm uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
          {">"} {toast.message}
        </div>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}