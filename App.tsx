import React, { useState, useEffect, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { UserProfileModal } from './components/UserProfileModal';
import { MagneticFieldSystem } from './components/MagneticFieldSystem';
import { fetchMessages, postMessage } from './services/guestbookService';
import { GuestEntry, UserProfile } from './types';
import { Ghost, Send, Reply, X } from 'lucide-react';

// --- 1. ASCII Art 常量 (已转义) ---
// 注意：这里所有的 \ 都变成了 \\，所有的 ` 都变成了 \`，这是防止报错的关键
const ASCII_LOGO = `
                         _  .-')     ('-.                      .-')     ('-.                 
                        ( \\( -O )  _(  OO)                    ( OO ).  ( OO ).-.             
  ,--.   ,--.,--. ,--.   ,------. (,------.  ,-.-')          (_)---\\_) / . --. /  ,--.   ,--.
   \\  \`.'  / |  | |  |   |   /\`. ' |  .---'  |  |OO)   .-')  /    _ |  | \\-.  \\    \\  \`.'  / 
 .-')     /  |  | | .-') |  /  | | |  |      |  |  \\ _(  OO) \\  :\` \`..-'-'  |  | .-')     /  
(OO  \\   /   |  |_|( OO )|  |_.' |(|  '--.   |  |(_/(,------. '..\`''.)\\| |_.'  |(OO  \\   /   
 |   /  /\\_  |  | | \`-' /|  .  '.' |  .--'  ,|  |_.' '------'.-._)   \\ |  .-.  | |   /  /\\_  
 \`-./  /.__)('  '-'(_.-' |  |\\  \\  |  \`---.(_|  |            \\       / |  | |  | \`-./  /.__) 
   \`--'       \`-----'    \`--' '--' \`------'  \`--'             \`-----'  \`--' \`--'   \`--'      
`;

export default function App() {
  // --- 2. 数据状态 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    date: '',
    oc: ''
  });

  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date().toLocaleString('zh-CN', { hour12: false });
    setUserProfile(prev => ({ ...prev, date: now }));
  }, []);

  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const { data: rawEntries, isLoading } = useSWR<GuestEntry[]>(
    '/api/guestbook',
    fetchMessages,
    { refreshInterval: 5000 }
  );

  // --- 3. 数据处理 ---
  const structuredEntries = useMemo(() => {
    if (!rawEntries) return [];
    const roots = rawEntries.filter(e => !e.reply_to);
    return roots.map(root => {
      const replies = rawEntries.filter(e => e.reply_to === root.id);
      replies.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return { ...root, replies };
    });
  }, [rawEntries]);

  // --- 4. 磁场系统逻辑 ---
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const uniqueCharacters = useMemo(() => {
    if (!rawEntries) return [];
    const names = Array.from(new Set(rawEntries.map(e => e.name)));
    return names;
  }, [rawEntries]);

  const currentCharacterName = uniqueCharacters[currentCharIndex] || null;

  const isCharacterActive = useMemo(() => {
    if (!rawEntries || !currentCharacterName) return false;
    const myMessageIds = rawEntries.filter(e => e.name === currentCharacterName).map(e => e.id);
    const hasReplies = rawEntries.some(e => myMessageIds.includes(e.reply_to || ''));
    return hasReplies;
  }, [rawEntries, currentCharacterName]);

  const handleNextChar = () => {
    setCurrentCharIndex(prev => (prev + 1) % uniqueCharacters.length);
  };
  const handlePrevChar = () => {
    setCurrentCharIndex(prev => (prev - 1 + uniqueCharacters.length) % uniqueCharacters.length);
  };

  // --- 5. 发送逻辑 ---
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
    try {
      await postMessage(
        userProfile.name, 
        inputValue, 
        userProfile.date, 
        userProfile.oc, 
        replyTargetId || undefined
      );
      showToast('已映射到集体意识中');
      setInputValue('');
      setReplyTargetId(null);
      mutate('/api/guestbook');
    } catch (error) {
      console.error(error);
      showToast('信号传输失败...');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-screen bg-[#E9E9E9] text-emerald-700 font-mono overflow-hidden flex flex-col">
      
      {/* 顶部 Header */}
      <header className="h-32 bg-[#E9E9E9] border-b border-emerald-600 flex shrink-0">
        <div className="w-2/3 border-r border-emerald-600 p-4 flex items-center justify-between overflow-hidden relative">
           
           {/* ASCII Art Logo (隐藏在超小屏幕上，中大屏幕显示) */}
           <div className="absolute inset-0 flex items-center justify-start pl-4 opacity-10 pointer-events-none md:opacity-100 md:static md:pointer-events-auto">
             <pre className="text-[6px] leading-[6px] font-bold text-emerald-800 whitespace-pre">
               {ASCII_LOGO}
             </pre>
           </div>
           
           {/* 文本标题 (作为 ASCII 的补充或替代) */}
           <div className="absolute right-6 top-1/2 -translate-y-1/2 text-right md:hidden">
             <h1 className="text-2xl font-black tracking-tighter uppercase">幽灵電车</h1>
           </div>

           {/* 音频模块占位 */}
           <div className="absolute top-4 right-4 md:static border border-emerald-600 px-4 py-2 text-xs font-bold bg-[#E9E9E9] z-10">
             [ AUDIO MODULE ]
           </div>
        </div>
        
        {/* Profile Button Area */}
        <div className="w-1/3 p-6 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="w-12 h-12 border border-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
           >
             <Ghost className="w-6 h-6" />
           </button>
        </div>
      </header>

      {/* 中间主要区域 */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 左侧：消息列表 */}
        <main className="w-2/3 border-r border-emerald-600 overflow-y-auto bg-[#E9E9E9] custom-scrollbar relative">
           {replyTargetId && (
             <div className="sticky top-0 z-20 bg-emerald-600 text-white px-4 py-2 flex justify-between items-center shadow-md">
               <span className="text-sm font-bold">正在回复某条讯息...</span>
               <button onClick={() => setReplyTargetId(null)}><X className="w-4 h-4"/></button>
             </div>
           )}

           <div className="p-6 space-y-6 pb-32">
             {structuredEntries.map((entry: any) => (
               <div key={entry.id} className="border border-emerald-600 bg-[#E9E9E9] p-4 shadow-[4px_4px_0px_#00A651]">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                       <span className="bg-emerald-600 text-white px-1 text-xs font-bold mr-2">{entry.name}</span>
                       <span className="text-xs opacity-50">{entry.date}</span>
                       {entry.oc && <span className="ml-2 border border-emerald-600 px-1 text-[10px] rounded-full">{entry.oc}</span>}
                     </div>
                     <button 
                       onClick={() => setReplyTargetId(entry.id)}
                       className="text-emerald-600 hover:bg-emerald-100 p-1 rounded transition-colors"
                       title="回复"
                     >
                       <Reply className="w-4 h-4" />
                     </button>
                  </div>
                  <p className="text-lg font-bold leading-relaxed">{entry.message}</p>

                  {entry.replies && entry.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-emerald-600/30 space-y-3">
                      {entry.replies.map((reply: any) => (
                        <div key={reply.id} className="bg-emerald-600/5 p-3 text-sm">
                           <div className="flex items-center mb-1">
                             <span className="font-bold mr-2">↳ {reply.name}</span>
                             <span className="text-[10px] opacity-50">{reply.date}</span>
                           </div>
                           <p>{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
             ))}
             <div className="h-20"></div>
           </div>

           <div className="absolute bottom-0 left-0 w-full p-4 bg-[#E9E9E9] border-t border-emerald-600">
             <div className="flex gap-0 border border-emerald-600 h-14 bg-white">
                <div className="w-12 flex items-center justify-center border-r border-emerald-600 bg-[#E9E9E9] text-xs font-bold text-emerald-600 writing-vertical">
                   INPUT
                </div>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={replyTargetId ? "输入回复内容..." : "TYPE_MESSAGE..."}
                  className="flex-1 px-4 bg-transparent outline-none text-emerald-900 placeholder:text-emerald-600/30 font-bold"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="w-16 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
             </div>
           </div>
        </main>

        {/* 右侧：角色磁场系统 */}
        <aside className="w-1/3 bg-[#F5F5F5] relative">
           <MagneticFieldSystem 
             isEmpty={!rawEntries || rawEntries.length === 0}
             characterName={currentCharacterName}
             hasReplies={isCharacterActive}
             onNext={handleNextChar}
             onPrev={handlePrevChar}
           />
        </aside>

      </div>

      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        profile={userProfile} 
        onSave={setUserProfile} 
      />
      
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 transition-all duration-300 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="bg-emerald-600 text-white px-6 py-3 font-bold shadow-lg border-2 border-white">
          <span>{'>'}</span> {toast.message}
        </div>
      </div>
    </div>
  );
}