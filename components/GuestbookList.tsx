import React from 'react';
import { GuestEntry } from '../types';

interface GuestbookListProps {
  entries: GuestEntry[];
  isLoading: boolean;
}

export const GuestbookList: React.FC<GuestbookListProps> = ({ entries, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6 opacity-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-l-2 border-neutral-700 pl-4 py-2 animate-pulse">
            <div className="h-4 bg-neutral-800 w-1/3 mb-2"></div>
            <div className="h-4 bg-neutral-900 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-neutral-800 text-neutral-600 font-mono tracking-widest">
        [ 未接收到任何讯号 ]
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {entries.map((entry, index) => (
        <div 
          key={entry.id || index} 
          className="relative pl-6 border-l-2 border-neutral-700 hover:border-white transition-colors duration-300 group"
        >
          {/* Metadata Header */}
          <div className="flex flex-wrap items-baseline gap-x-3 mb-2 font-mono text-xs uppercase tracking-wider">
            <span className="font-bold text-white group-hover:text-glow">
              {entry.name}
            </span>
            <span className="text-neutral-500">
              [来自 {entry.date}]
            </span>
            {entry.oc && (
              <span className="text-neutral-400 bg-neutral-900 px-2 py-0.5 border border-neutral-800">
                设定: {entry.oc}
              </span>
            )}
          </div>

          {/* Message Body */}
          <p className="text-neutral-300 font-sans text-lg leading-relaxed whitespace-pre-wrap break-words opacity-90 group-hover:opacity-100 transition-opacity">
            {entry.message}
          </p>
          
          {/* Decorative Dot */}
          <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-black border border-neutral-500 group-hover:bg-white transition-colors" />
        </div>
      ))}
    </div>
  );
};