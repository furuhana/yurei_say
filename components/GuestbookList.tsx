
import React from 'react';
import { GuestEntry } from '../types';
import { Trash2, Reply } from 'lucide-react';

interface GuestbookListProps {
  entries: GuestEntry[];
  isLoading: boolean;
  isAdmin: boolean;
  onDelete: (entry: GuestEntry) => void;
  onReply: (entry: GuestEntry) => void;
}

// Helper to render a single message card
const MessageCard: React.FC<{
  entry: GuestEntry;
  isAdmin: boolean;
  isReply?: boolean;
  onDelete: (entry: GuestEntry) => void;
  onReply: (entry: GuestEntry) => void;
}> = ({ entry, isAdmin, isReply, onDelete, onReply }) => (
  <div 
    className={`w-full border-b border-[#00A651] p-4 hover:bg-[#00A651]/5 transition-colors group relative ${isReply ? 'bg-[#00A651]/5 pl-8 md:pl-12 border-l border-l-[#00A651]' : ''}`}
  >
    {/* Metadata Row */}
    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 text-xs md:text-sm font-bold uppercase tracking-wider text-[#00A651]/70">
      <span className={`px-2 py-0.5 ${isReply ? 'bg-transparent border border-[#00A651] text-[#00A651]' : 'bg-[#00A651] text-[#F5F3EF]'}`}>
        {entry.name}
      </span>
      <span className="font-mono text-[10px] md:text-xs">
        {entry.date}
      </span>
      {entry.oc && (
          <span className="border border-[#00A651] px-2 py-0.5 text-[10px]">
          {entry.oc}
        </span>
      )}
    </div>

    {/* Message Content */}
    <p className="text-[#00A651] text-base md:text-lg font-medium leading-snug break-words mb-2">
      {entry.message}
    </p>

    {/* Actions Row */}
    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
       <button 
        onClick={(e) => { e.stopPropagation(); onReply(entry); }}
        className="flex items-center gap-1 hover:text-[#00A651] hover:underline"
      >
        <Reply className="w-3 h-3" /> REPLY
      </button>

      {isAdmin && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(entry); }}
          className="text-red-500 hover:text-red-600 flex items-center gap-1 ml-auto"
        >
          <Trash2 className="w-3 h-3" /> DELETE
        </button>
      )}

      <span className="ml-auto font-mono text-[#00A651]/30">
        IDX_{entry.id.slice(-4).toUpperCase()}
      </span>
    </div>
  </div>
);

export const GuestbookList: React.FC<GuestbookListProps> = ({ entries, isLoading, isAdmin, onDelete, onReply }) => {
  
  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-b border-[#00A651] p-6 animate-pulse bg-[#00A651]/5 h-32"></div>
        ))}
      </div>
    );
  }

  // Group messages into threads
  const rootMessages = entries.filter(e => !e.replyTo);
  const replies = entries.filter(e => e.replyTo);

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
      {rootMessages.map((root) => {
        // Find direct replies to this root
        const threadReplies = replies.filter(r => r.replyTo === root.id);
        // Sort replies by time (ascending - oldest first for standard threading) generally, 
        // but here our list is new->old. Let's keep replies in the order they come (new->old) or reverse.
        // Usually replies are read top-down. Let's reverse them to be Old -> New for chat flow, 
        // OR keep them New -> Old. Let's stick to list order (New -> Old) for now to match main stream.
        
        return (
          <div key={root.id} className="flex flex-col">
            <MessageCard 
              entry={root} 
              isAdmin={isAdmin} 
              onDelete={onDelete} 
              onReply={onReply} 
            />
            {threadReplies.map(reply => (
              <MessageCard 
                key={reply.id} 
                entry={reply} 
                isAdmin={isAdmin} 
                isReply={true}
                onDelete={onDelete} 
                onReply={onReply} // Reply to a reply -> Replies to Parent (Root) usually, or nesting. 
                                  // For simplicity, let's keep 1-level nesting. 
                                  // Or user can reply to a reply, targeting that reply ID. 
                                  // The nesting UI handles it visually.
              />
            ))}
          </div>
        );
      })}
      
      {/* Footer Filler to visual end the list */}
      <div className="flex-1 bg-diagonal-stripes min-h-[100px] border-b border-[#00A651]"></div>
    </div>
  );
};
