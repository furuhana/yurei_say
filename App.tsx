import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { GuestbookForm } from './components/GuestbookForm';
import { GuestbookList } from './components/GuestbookList';
import { UserProfileModal } from './components/UserProfileModal';
import { fetchMessages, postMessage, deleteMessage } from './services/guestbookService';
import { GuestEntry } from './types';
import { Ghost } from 'lucide-react';

interface UserProfile {
  name: string;
  date: string;
  oc: string;
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
    <path d="M1777.69 1344.13C1732.33 1298.77 1679.49 1263.15 1620.63 1238.25C1612.34 1234.74 1603.98 1231.48 1595.55 1228.44C1609.28 1288.1 1624.63 1347.45 1641.57 1406.42C1717.11 1462.7 1769.79 1548.04 1782.89 1645.75C1783.37 1649.32 1786.58 1651.85 1790.17 1651.58C1810.49 1650.03 1830.95 1649.25 1851.53 1649.25C1872.11 1649.25 1892.38 1650.02 1912.62 1651.56C1916.87 1651.88 1920.38 1648.31 1919.96 1644.07C1915.08 1594.83 1902.92 1546.94 1883.56 1501.18C1858.67 1442.33 1823.05 1389.48 1777.68 1344.12L1777.69 1344.13Z" fill="currentColor"/>
    <path d="M1199.16 2093.41C1196.52 2088.94 1190.06 2088.94 1187.42 2093.41L1128.83 2192.6C1127.13 2195.48 1123.38 2196.43 1120.53 2194.68C952.3 2091 839.94 1905.05 840.02 1693.34C840.12 1419.37 1029.12 1188.21 1283.4 1123.43C1292.88 1075.39 1301.34 1027.17 1308.75 978.79C1253.02 988.03 1198.66 1003.79 1146.21 1025.98C1059.92 1062.48 982.44 1114.71 915.92 1181.23C849.4 1247.75 797.17 1325.23 760.67 1411.52C722.87 1500.89 703.7 1595.79 703.7 1693.57C703.7 1791.35 722.87 1886.25 760.67 1975.62C797.17 2061.91 849.4 2139.39 915.92 2205.91C956.99 2246.98 1002.25 2282.6 1051.17 2312.44C1053.98 2314.15 1054.9 2317.79 1053.23 2320.62L983.4 2438.84C980.72 2443.38 983.99 2449.12 989.27 2449.12H1397.33C1402.61 2449.12 1405.88 2443.38 1403.2 2438.84L1199.17 2093.43L1199.16 2093.41Z" fill="currentColor"/>
  </svg>
);

// Hook for complicated flickering logic
const useBrokenLightEffect = () => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let isActive = true;

    const scheduleNextEvent = () => {
      if (!isActive) return;
      const isMode2 = Math.random() > 0.7;
      if (isMode2) {
        runMode2();
      } else {
        runMode1();
      }
    };

    const runMode1 = () => {
      const modeDuration = 2000 + Math.random() * 3000; 
      const startTime = Date.now();

      const flicker = () => {
        if (!isActive) return;
        
        const now = Date.now();
        if (now - startTime > modeDuration) {
          scheduleNextEvent(); 
          return;
        }
        setOpacity(0.85 + Math.random() * 0.15);
        timeoutId = setTimeout(flicker, 50 + Math.random() * 150);
      };
      flicker();
    };

    const runMode2 = () => {
      if (!isActive) return;
      setOpacity(0.6);
      timeoutId = setTimeout(() => {
        if (!isActive) return;
        const jitterDuration = 1000;
        const jitterStart = Date.now();
        const jitter = () => {
          if (!isActive) return;
          const now = Date.now();
          if (now - jitterStart > jitterDuration) {
            setOpacity(1);
            timeoutId = setTimeout(scheduleNextEvent, 500 + Math.random() * 1000);
            return;
          }
          setOpacity(0.85 + Math.random() * 0.05);
          timeoutId = setTimeout(jitter, 50 + Math.random() * 100);
        };
        jitter();
      }, 3000);
    };

    scheduleNextEvent();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return opacity;
};

export default function App() {
  const { data: entries, isLoading, mutate } = useSWR<GuestEntry[]>(
    '/api/guestbook',
    fetchMessages,
    { refreshInterval: 10000, fallbackData: [] }
  );

  const [profile, setProfile] = useState<UserProfile>({
    name: '迷途幽灵_' + Math.floor(Math.random() * 1000),
    date: '',
    oc: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });
  const titleOpacity = useBrokenLightEffect();

  useEffect(() => {
    const saved = localStorage.getItem('ghostTramProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
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
    const optimisticEntry: GuestEntry = {
      id: Math.random().toString(36),
      name: profile.name,
      message: messageText,
      date: profile.date,
      oc: profile.oc
    };
    const currentEntries = entries || [];
    await mutate([optimisticEntry, ...currentEntries], false);
    await postMessage(profile.name, messageText, profile.date, profile.oc);
    await mutate();
    showToast("讯号已映射到集体意识 / SIGNAL BROADCASTED");
  };

  const handleDeleteMessage = async (entry: GuestEntry) => {
    if (!confirm('确定要从集体意识中抹除此记忆吗？\nDELETE MEMORY?')) return;
    const currentEntries = entries || [];
    const updatedEntries = currentEntries.filter(e => e.id !== entry.id);
    await mutate(updatedEntries, false);
    await deleteMessage(entry.id, profile.name);
    await mutate();
    showToast("记忆已抹除 / MEMORY DELETED");
  };

  return (
    <div className="h-screen w-screen bg-[#050505] p-2 md:p-6 flex flex-col overflow-hidden selection:bg-[#00D47E] selection:text-black font-sans relative z-10">
      
      {/* Root Grid Container - Floating "Sheet" effect */}
      <div className="flex-1 border border-[#00D47E] flex flex-col relative shadow-[0_0_20px_rgba(0,212,126,0.1)]">
        
        {/* ROW 1: Header Grid (12 cols) */}
        <header className="grid grid-cols-12 h-32 md:h-48 border-b border-[#00D47E] shrink-0">
          {/* Cell 1: Main Title Area (75% / 9 cols) */}
          <div className="col-span-9 p-4 md:p-8 flex flex-col justify-between relative border-r border-[#00D47E]">
            <div className="absolute top-2 left-2 text-[10px] opacity-60 font-mono tracking-widest">
              SYS_VER_2.0
            </div>
            
            <div className="flex items-center gap-4 h-full" style={{ opacity: titleOpacity }}>
              <GhostTramLogo className="w-10 md:w-16 h-auto text-[#00D47E] shrink-0" />
              <div>
                <h1 className="text-3xl md:text-7xl font-black tracking-tighter text-[#00D47E] uppercase leading-none">
                  幽灵電车
                </h1>
                <h2 className="text-xs md:text-sm font-mono text-[#00D47E]/70 tracking-[0.3em] mt-2 pl-1">
                  来自各种时空中的幽灵们
                </h2>
              </div>
            </div>
          </div>

          {/* Cell 2: Profile Trigger (25% / 3 cols) */}
          <div className="col-span-3 bg-diagonal-stripes relative group cursor-pointer hover:bg-[#00D47E]/10 transition-colors"
               onClick={() => setIsModalOpen(true)}>
            <div className="absolute top-2 right-2 text-[10px] opacity-60 font-mono tracking-widest bg-black px-1 border border-[#00D47E]/50">
              UID_ACCESS
            </div>
            
            <div className="h-full w-full flex items-center justify-center">
              <div className="p-3 border border-[#00D47E] bg-black group-hover:bg-[#00D47E] group-hover:text-black transition-all">
                <Ghost className="w-6 h-6 md:w-8 md:h-8" />
              </div>
            </div>
          </div>
        </header>

        {/* ROW 2: Main Content (Scrollable) */}
        <main className="relative flex-1 overflow-hidden flex flex-col">
          {/* Decorative Labels for Main Area */}
          <div className="absolute top-0 right-0 p-2 text-[10px] text-[#00D47E]/40 font-mono z-20 pointer-events-none">
            VIEWPORT_MAIN
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             <GuestbookList 
              entries={entries || []} 
              isLoading={isLoading} 
              isAdmin={profile.name === '露西'}
              onDelete={handleDeleteMessage}
            />
          </div>
        </main>

        {/* ROW 3: Footer Input Grid */}
        <div className="h-20 border-t border-[#00D47E] relative shrink-0">
           <GuestbookForm 
            onSendMessage={handleSendMessage} 
            disabled={isLoading} 
          />
        </div>

      </div>

      {/* Modals & Overlays */}
      <UserProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfile={profile}
        onSave={handleSaveProfile}
      />

      {/* Retro Toast */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[70] transition-all duration-200 transform ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#00D47E] text-black px-4 py-2 font-bold font-mono border border-[#00D47E] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          {">"} {toast.message}
        </div>
      </div>

    </div>
  );
}