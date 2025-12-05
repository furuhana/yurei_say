
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { GuestEntry } from '../types';
import { Trash2 } from 'lucide-react';

interface GuestbookListProps {
  entries: GuestEntry[];
  isLoading: boolean;
  isAdmin: boolean;
  onDelete: (entry: GuestEntry) => void;
}

// Single Floating Card Component
const FloatingEntry: React.FC<{
  entry: GuestEntry;
  containerRef: React.RefObject<HTMLDivElement>;
  isAdmin: boolean;
  onDelete: (entry: GuestEntry) => void;
}> = ({ entry, containerRef, isAdmin, onDelete }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Physics state stored in refs to avoid re-renders
  const position = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);
  const animationFrameId = useRef<number>(0);
  const [isReady, setIsReady] = useState(false); // To prevent flash before positioning

  // Initialize random position and velocity
  useLayoutEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();

    // Random start position (with padding)
    position.current = {
      x: Math.random() * (container.width - card.width - 40) + 20,
      y: Math.random() * (container.height - card.height - 40) + 20,
    };

    // Random velocity (slow and smooth)
    const speed = 0.5; // Pixels per frame
    const angle = Math.random() * 2 * Math.PI;
    velocity.current = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };

    setIsReady(true);
  }, []);

  // Animation Loop
  useEffect(() => {
    const update = () => {
      if (!containerRef.current || !cardRef.current) return;
      
      if (!isHovered.current) {
        const container = containerRef.current.getBoundingClientRect();
        const card = cardRef.current.getBoundingClientRect();

        // Update position
        position.current.x += velocity.current.x;
        position.current.y += velocity.current.y;

        // Bounce checks (X axis)
        if (position.current.x <= 0) {
          position.current.x = 0;
          velocity.current.x *= -1;
        } else if (position.current.x >= container.width - card.width) {
          position.current.x = container.width - card.width;
          velocity.current.x *= -1;
        }

        // Bounce checks (Y axis)
        if (position.current.y <= 0) {
          position.current.y = 0;
          velocity.current.y *= -1;
        } else if (position.current.y >= container.height - card.height) {
          position.current.y = container.height - card.height;
          velocity.current.y *= -1;
        }
      }

      // Apply transform directly to DOM for performance
      cardRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
      
      animationFrameId.current = requestAnimationFrame(update);
    };

    animationFrameId.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
      style={{ opacity: isReady ? 1 : 0 }}
      className="absolute top-0 left-0 w-64 bg-black/95 border border-[#00D47E] p-4 shadow-[0_0_15px_rgba(0,212,126,0.1)] hover:shadow-[0_0_25px_rgba(0,212,126,0.4)] hover:z-50 hover:border-[#00D47E] transition-shadow cursor-default group"
    >
       {/* Metadata Header */}
       <div className="flex flex-wrap items-baseline gap-x-2 mb-2 font-mono text-[10px] uppercase tracking-wider border-b border-[#00D47E]/30 pb-2">
            <span className="font-bold text-[#00D47E] bg-[#00D47E]/10 px-1 truncate max-w-[100px]">
              {entry.name}
            </span>
            <span className="text-[#00D47E]/60 truncate flex-1">
              {entry.date}
            </span>
            
            {isAdmin && (
               <button 
                onClick={(e) => { e.stopPropagation(); onDelete(entry); }}
                className="ml-auto text-red-500 hover:bg-red-500 hover:text-black transition-all p-0.5"
                title="DELETE"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
      </div>

       {/* OC Tag */}
      {entry.oc && (
        <div className="absolute top-[-1px] right-[-1px] bg-[#00D47E] text-black text-[8px] font-bold px-1 font-mono">
          {entry.oc}
        </div>
      )}

      {/* Message Body */}
      <p className="text-[#00D47E] font-sans text-sm leading-relaxed break-words opacity-90">
        {entry.message}
      </p>

      {/* Decorative corners */}
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#00D47E]/50"></div>
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#00D47E]/50"></div>
    </div>
  );
};

// Component for empty state floating characters
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
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-diagonal-stripes/20">
      {entries.map((entry) => (
        <FloatingEntry 
          key={entry.id} 
          entry={entry} 
          containerRef={containerRef}
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
