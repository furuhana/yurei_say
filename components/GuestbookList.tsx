
import React from 'react';
import { GuestEntry } from '../types';
import { Trash2 } from 'lucide-react';

interface GuestbookListProps {
  entries: GuestEntry[];
  isLoading: boolean;
  isAdmin: boolean;
  onDelete: (entry: GuestEntry) => void;
}

export const GuestbookList: React.FC<GuestbookListProps> = ({ entries, isLoading, isAdmin, onDelete }) => {
  
  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-b border-[#00A651] p-6 animate-pulse bg-[#00A651]/5 h-32">
            <div className="h-4 bg-[#00A651]/20 w-1/3 mb-4"></div>
            <div className="h-4 bg-[#00A651]/10 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-diagonal-stripes">
         <div className="bg-[#F5F3EF] border border-[#00A651] p-8 text-[#00A651] font-bold text-xl uppercase tracking-widest">
           NO_DATA_FOUND
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-full bg-[#F5F3EF]">
      {entries.map((entry) => (
        <div 
          key={entry.id} 
          className="w-full border-b border-[#00A651] p-4 md:p-6 hover:bg-[#00A651]/5 transition-colors group relative"
        >
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 mb-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#00A651]/70">
            <span className="bg-[#00A651] text-[#F5F3EF] px-2 py-0.5">
              {entry.name}
            </span>
            <span className="font-mono">
              LOC: {entry.date}
            </span>
            {entry.oc && (
               <span className="border border-[#00A651] px-2 py-0.5 text-[10px]">
                {entry.oc}
              </span>
            )}

            {/* Admin Delete */}
            {isAdmin && (
               <button 
                onClick={(e) => { e.stopPropagation(); onDelete(entry); }}
                className="ml-auto text-red-500 hover:bg-red-500 hover:text-white border border-transparent hover:border-red-500 px-2 transition-all"
              >
                [DELETE]
              </button>
            )}
          </div>

          {/* Message Content */}
          <p className="text-[#00A651] text-lg md:text-xl font-medium leading-tight max-w-[90%] break-words">
            {entry.message}
          </p>

          {/* ID decoration */}
          <div className="absolute top-4 right-4 text-[10px] text-[#00A651]/30 font-mono">
            IDX_{entry.id.slice(-4).toUpperCase()}
          </div>
        </div>
      ))}
      
      {/* Footer Filler to visual end the list */}
      <div className="flex-1 bg-diagonal-stripes min-h-[100px] border-b border-[#00A651]"></div>
    </div>
  );
};
