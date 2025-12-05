import React, { useState, useEffect } from 'react';
import { X, Save, Ghost, Dice5 } from 'lucide-react';

interface UserProfile {
  name: string;
  date: string;
  oc: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const RANDOM_NAMES = [
  "迷途旅人", "时间观测者", "赛博亡灵", "第42号乘客", 
  "来自深渊", "数据幽灵", "虚空行者", "最后的模拟人格",
  "二进制诗人", "故障体", "褪色记忆", "未命名档案",
  "熵增熵减", "量子纠缠体", "逆流之鱼", "旧日幻影"
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  currentProfile, 
  onSave 
}) => {
  const [formData, setFormData] = useState(currentProfile);

  useEffect(() => {
    setFormData(currentProfile);
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleRandomName = () => {
    const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    setFormData(prev => ({ ...prev, name: randomName }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-none">
      <div className="bg-black border border-[#00D47E] w-full max-w-md relative shadow-[0_0_0_1px_rgba(0,212,126,0.3)]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00D47E]">
          <div className="flex items-center gap-3">
             <div className="p-1 border border-[#00D47E] bg-[#00D47E]/10">
               <Ghost className="w-5 h-5 text-[#00D47E]" />
             </div>
             <div className="flex flex-col leading-none">
               <h2 className="text-lg font-bold tracking-widest uppercase text-[#00D47E]">幽灵证件</h2>
               <span className="text-[10px] font-mono text-[#00D47E]/60">ID_CONFIGURATION</span>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#00D47E] hover:bg-[#00D47E] hover:text-black p-1 transition-colors border border-transparent hover:border-[#00D47E]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 bg-diagonal-stripes">
          <form onSubmit={handleSubmit} className="space-y-6 bg-black p-6 border border-[#00D47E]">
            
            <div className="space-y-1">
              <label className="flex justify-between text-[10px] uppercase tracking-wider text-[#00D47E]/70 font-mono">
                <span>名为 / ALIAS</span>
                <span>REQ*</span>
              </label>
              <div className="flex gap-0 border border-[#00D47E]">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="flex-1 bg-black text-[#00D47E] px-4 py-3 focus:outline-none focus:bg-[#00D47E]/10 transition-colors font-mono"
                  placeholder="你是谁？"
                />
                <button
                  type="button"
                  onClick={handleRandomName}
                  className="bg-[#00D47E]/10 text-[#00D47E] px-4 hover:bg-[#00D47E] hover:text-black transition-colors border-l border-[#00D47E]"
                  title="RANDOM"
                >
                  <Dice5 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#00D47E]/70 font-mono">
                时空坐标 / SPACE-TIME
              </label>
              <div className="border border-[#00D47E]">
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-black text-[#00D47E] px-4 py-3 focus:outline-none focus:bg-[#00D47E]/10 transition-colors font-mono"
                  placeholder="身处何地？"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#00D47E]/70 font-mono">
                设定 / SETTING (OC)
              </label>
              <div className="border border-[#00D47E]">
                <textarea
                  value={formData.oc}
                  onChange={(e) => setFormData({...formData, oc: e.target.value})}
                  rows={3}
                  className="w-full bg-black text-[#00D47E] px-4 py-3 focus:outline-none focus:bg-[#00D47E]/10 transition-colors font-mono resize-none"
                  placeholder="状态描述..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00D47E] hover:bg-[#00ff41] text-black font-bold py-3 px-4 flex items-center justify-center gap-2 uppercase tracking-widest border border-[#00D47E] mt-4"
            >
              <Save className="w-4 h-4" />
              <span>OVERWRITE_DATA</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};