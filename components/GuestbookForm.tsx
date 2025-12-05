
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
      <form onSubmit={handleSubmit} className="grid grid-cols-6 w-full h-full">
        {/* Cell 1: Input Field (5/6 cols ~ 83%) */}
        <div className="col-span-5 relative border-r border-[#00D47E]">
           <div className="absolute top-1 left-2 text-[8px] md:text-[10px] text-[#00D47E]/50 font-mono tracking-widest pointer-events-none">
            INPUT_TERMINAL_01
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled || isSending}
            placeholder="想起来了什么？"
            className="w-full h-full bg-black text-[#00D47E] px-4 pt-4 pb-2 focus:outline-none placeholder-[#00D47E]/30 font-mono text-lg"
            autoFocus
          />
        </div>

        {/* Cell 2: Submit Button (1/6 cols ~ 17%) */}
        <button
          type="submit"
          disabled={disabled || isSending || !message.trim()}
          className="col-span-1 bg-black hover:bg-[#00D47E] text-[#00D47E] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center group relative"
        >
          <div className="absolute top-1 right-2 text-[8px] md:text-[10px] opacity-50 font-mono tracking-widest group-hover:text-black">
            SEND_CMD
          </div>
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CornerDownLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
};
