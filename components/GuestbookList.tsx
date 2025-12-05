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
      // Random position within 10% - 90% of screen to avoid edges
      const top = Math.random() * 80 + 10 + '%';
      const left = Math.random() * 80 + 10 + '%';
      // Toggle visibility
      const opacity = Math.random() > 0.5 ? 1 : 0;
      
      setStyle({
        top,
        left,
        opacity,
        transform: `scale(${0.8 + Math.random() * 0.4})`, // slight scale var
        color: '#CCC3B1', // Ensure color matches
      });
    };

    // Initial random delay
    const initialDelay = Math.random() * 1000;
    let intervalId: ReturnType<typeof setTimeout>;

    const runLoop = () => {
      randomize();
      // Random interval between changes (2s to 4s)
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
      className="absolute font-serif text-xl md:text-3xl transition-all duration-[1500ms] pointer-events-none select-none text-[#CCC3B1]/60"
    >
      {char}
    </span>
  );
};

export const GuestbookList: React.FC<GuestbookListProps> = ({ entries, isLoading, isAdmin, onDelete }) => {
  if (isLoading) {
    return (
      <div className="space-y-6 opacity-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-l-2 border-[#CCC3B1]/20 pl-4 py-2 animate-pulse">
            <div className="h-4 bg-[#CCC3B1]/10 w-1/3 mb-2"></div>
            <div className="h-4 bg-[#CCC3B1]/5 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    const chars = "它们不再言语".split('');
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {chars.map((char, index) => (
           <FloatingChar key={index} char={char} />
         ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {entries.map((entry, index) => (
        <div 
          key={entry.id || index} 
          className="relative pl-6 border-l-2 border-[#CCC3B1]/30 hover:border-[#CCC3B1] transition-colors duration-300 group"
        >
          {/* Metadata Header */}
          <div className="flex flex-wrap items-baseline gap-x-3 mb-2 font-mono text-xs uppercase tracking-wider justify-between">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-bold text-[#CCC3B1] group-hover:text-glow">
                {entry.name}
              </span>
              <span className="text-[#CCC3B1]/60">
                [来自 {entry.date}]
              </span>
              {entry.oc && (
                <span className="text-[#CCC3B1]/50 bg-[#1a1a1a] px-2 py-0.5 border border-[#CCC3B1]/20">
                  {entry.oc}
                </span>
              )}
            </div>

            {isAdmin && (
              <button 
                onClick={() => onDelete(entry)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 font-bold text-[10px] border border-red-900/50 px-2 py-0.5 hover:bg-red-900/20 transition-all flex items-center gap-1"
                title="删除此消息 / DELETE"
              >
                <Trash2 className="w-3 h-3" />
                [删除]
              </button>
            )}
          </div>

          {/* Message Body */}
          <p className="text-[#CCC3B1] font-sans text-lg leading-relaxed whitespace-pre-wrap break-words opacity-90 group-hover:opacity-100 transition-opacity">
            {entry.message}
          </p>
          
          {/* Decorative Dot */}
          <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-black border border-[#CCC3B1]/60 group-hover:bg-[#CCC3B1] transition-colors" />
        </div>
      ))}
    </div>
  );
};