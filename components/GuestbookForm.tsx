
import React, { useState } from 'react';
import { CornerDownLeft, Loader2 } from 'lucide-react';

interface InputBarProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled: boolean;
}

export const GuestbookForm: React.FC<InputBarProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSendMessage(message);
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full h-full">
      <form onSubmit={handleSubmit} className="flex w-full h-full">
        {/* Input Field (Flex Grow) */}
        <div className="flex-1 relative border-r border-[#00A651]">
           <div className="absolute top-1 left-2 text-[8px] text-[#00A651] font-bold tracking-widest pointer-events-none">
            INPUT_TERMINAL_01
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled || isSending}
            placeholder="TYPE_MESSAGE..."
            className="w-full h-full bg-[#F5F3EF] text-[#00A651] px-4 pt-4 pb-2 focus:outline-none placeholder-[#00A651]/40 text-lg font-bold uppercase"
            autoFocus
          />
        </div>

        {/* Submit Button (Fixed Width) */}
        <button
          type="submit"
          disabled={disabled || isSending || !message.trim()}
          className="w-20 md:w-32 bg-[#F5F3EF] hover:bg-[#00A651] text-[#00A651] hover:text-[#F5F3EF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center group relative border-l-0"
        >
          {isSending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <CornerDownLeft className="w-8 h-8 group-hover:scale-90 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
};
