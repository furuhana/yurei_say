import React, { useEffect, useState } from 'react';
import { GuestEntry } from '../types';
import { Trash2 } from 'lucide-react';

interface GuestbookListProps {
  entries: GuestEntry[];
  isLoading: boolean;
  isAdmin: boolean;
  onDelete: (entry: GuestEntry) => void;
}

// Component for a single floating character
const FloatingChar: React.FC<{ char: string }> = ({ char }) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    top: '50%',
    left: '50%',
    opacity: 0,
  });

  useEffect(() => {
    const randomize = () => {
      const top = Math.random() * 80 + 10 + '%';
      const left = Math.random() * 80 + 10 + '%';
      const opacity = Math.random() > 0.5 ? 1 : 0;
      
      setStyle({
        top,
        left,
        opacity,
        transform: `scale(${0.8 + Math.random() * 0.4})`,
        color: '#00D47E',
      });
    };

    const initialDelay = Math.random() * 1000;
    let intervalId: ReturnType<typeof setTimeout>;

    const runLoop = () => {
      randomize();
      intervalId = setTimeout(runLoop, 2000 + Math.random() * 2000);
    };

    const startTimeout = setTimeout(runLoop, initialDelay);
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(intervalId);
    };
  }, []);

  return (
    <span 
      style={style} 
      className="absolute font-serif text-xl md:text-3xl transition-all duration-[1500ms] pointer-events-none select-none text-[#00D47E]/60"
    >
      {char}
    </span>
  );
};

export const GuestbookList: React.FC<GuestbookListProps> = ({ entries, isLoading, isAdmin, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-[#00D47E]/30 p-4 animate-pulse bg-[#00D47E]/5">
            <div className="h-4 bg-[#00D47E]/20 w-1/3 mb-2"></div>
            <div className="h-4 bg-[#00D47E]/10 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    const chars = "它们不再言语".split('');
    return (
      <div className="relative w-full h-full bg-diagonal-stripes overflow-hidden">
         <div className="absolute inset-0 z-0 pointer-events-none">
           {chars.map((char, index) => (
             <FloatingChar key={index} char={char} />
           ))}
         </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {entries.map((entry, index) => (
        <div 
          key={entry.id || index} 
          className="border-b border-[#00D47E] p-4 md:p-6 hover:bg-[#00D47E]/5 transition-colors group relative"
        >
          {/* Row Number / ID Label */}
          <div className="absolute top-2 right-2 text-[9px] font-mono text-[#00D47E]/30">
            IDX_{index.toString().padStart(3, '0')}
          </div>

          {/* Metadata Header */}
          <div className="flex flex-wrap items-baseline gap-x-4 mb-3 font-mono text-xs uppercase tracking-wider">
            <span className="font-bold text-[#00D47E] bg-[#00D47E]/10 px-1">
              {entry.name}
            </span>
            <span className="text-[#00D47E]/60">
              LOC: {entry.date}
            </span>
            {entry.oc && (
              <span className="text-[#00D47E]/50 border border-[#00D47E]/30 px-2 py-px text-[10px]">
                {entry.oc}
              </span>
            )}
            
            {isAdmin && (
               <button 
                onClick={(e) => { e.stopPropagation(); onDelete(entry); }}
                className="ml-auto opacity-0 group-hover:opacity-100 bg-red-900/20 text-red-500 border border-red-500/50 px-2 py-px hover:bg-red-500 hover:text-black transition-all flex items-center gap-1 text-[10px]"
              >
                <Trash2 className="w-3 h-3" />
                PURGE
              </button>
            )}
          </div>

          {/* Message Body */}
          <p className="text-[#00D47E] font-sans text-lg md:text-xl leading-relaxed whitespace-pre-wrap break-words opacity-90">
            {entry.message}
          </p>
        </div>
      ))}
      
      {/* Decorative empty space filler at bottom if list is short */}
      <div className="flex-1 min-h-[100px] bg-diagonal-stripes opacity-50"></div>
    </div>
  );
};