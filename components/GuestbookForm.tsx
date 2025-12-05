
import React, { useState, useEffect } from 'react';
import { CornerDownLeft, Loader2, X } from 'lucide-react';
import { GuestEntry } from '../types';

interface InputBarProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled: boolean;
  replyToEntry: GuestEntry | null;
  onCancelReply: () => void;
}

export const GuestbookForm: React.FC<InputBarProps> = ({ 
  onSendMessage, 
  disabled, 
  replyToEntry, 
  onCancelReply 
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSendMessage(message);
      setMessage('');
      if (replyToEntry) {
        onCancelReply();
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full h-full">
      <form onSubmit={handleSubmit} className="flex w-full h-full">
        {/* Input Field (Flex Grow) */}
        <div className="flex-1 relative border-r border-[#00A651] bg-[#F5F3EF]">
          
          {/* Reply Indicator Overlay */}
          {replyToEntry && (
            <div className="absolute top-0 left-0 right-0 h-6 bg-[#00A651] flex items-center justify-between px-2 text-[#F5F3EF] z-10">
              <span className="text-[10px] font-bold tracking-wider truncate">
                REPLYING TO: IDX_{replyToEntry.id.slice(-4).toUpperCase()} // {replyToEntry.name}
              </span>
              <button 
                type="button" 
                onClick={onCancelReply}
                className="hover:text-black transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

           <div className={`absolute left-2 text-[8px] text-[#00A651] font-bold tracking-widest pointer-events-none transition-all ${replyToEntry ? 'top-7' : 'top-1'}`}>
            {replyToEntry ? 'REPLY_TERMINAL' : 'INPUT_TERMINAL_01'}
          </div>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled || isSending}
            placeholder={replyToEntry ? "ENTER_RESPONSE..." : "TYPE_MESSAGE..."}
            className={`w-full h-full bg-[#F5F3EF] text-[#00A651] px-4 pb-2 focus:outline-none placeholder-[#00A651]/40 text-lg font-bold uppercase transition-all ${replyToEntry ? 'pt-8' : 'pt-4'}`}
            autoFocus
          />
        </div>

        {/* Submit Button (Fixed Width) */}
        <button
          type="submit"
          disabled={disabled || isSending || !message.trim()}
          className="w-16 md:w-24 bg-[#F5F3EF] hover:bg-[#00A651] text-[#00A651] hover:text-[#F5F3EF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center group relative border-l-0 shrink-0"
        >
          {isSending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <CornerDownLeft className="w-6 h-6 group-hover:scale-90 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
};
