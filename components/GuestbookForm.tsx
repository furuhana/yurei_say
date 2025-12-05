import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

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
    <div className="fixed bottom-0 left-0 w-full z-40 px-4 pb-6 pt-4 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-0 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled || isSending}
            placeholder="向集体意识广播讯号..."
            className="flex-1 bg-black border-2 border-neutral-600 border-r-0 text-white px-4 py-3 focus:outline-none focus:border-white focus:ring-0 transition-all font-mono placeholder-neutral-600"
            autoFocus
          />
          <button
            type="submit"
            disabled={disabled || isSending || !message.trim()}
            className="bg-neutral-800 border-2 border-neutral-600 border-l-0 text-white px-6 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center group"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};