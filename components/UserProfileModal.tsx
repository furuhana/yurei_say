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

  // Sync state when profile changes or modal opens
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
      <div className="bg-neutral-900 border-2 border-neutral-600 w-full max-w-md p-6 relative shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-8 border-b border-neutral-700 pb-4">
          <div className="p-2 bg-neutral-800 border border-neutral-600 rounded">
            <Ghost className="w-6 h-6 text-neutral-200" />
          </div>
          <h2 className="text-xl font-bold tracking-widest uppercase text-white">幽灵身份设定</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-400">
              代号 (名字)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="flex-1 bg-black border border-neutral-600 text-white px-4 py-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
                placeholder="你是谁？"
              />
              <button
                type="button"
                onClick={handleRandomName}
                className="bg-neutral-800 border border-neutral-600 text-white px-3 hover:bg-neutral-700 hover:border-white transition-colors"
                title="随机生成名字"
              >
                <Dice5 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-400">
              时空坐标 (日期/地点)
            </label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-black border border-neutral-600 text-white px-4 py-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
              placeholder="身处何地/何时？"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-400">
              补充设定 (OC)
            </label>
            <textarea
              value={formData.oc}
              onChange={(e) => setFormData({...formData, oc: e.target.value})}
              rows={3}
              className="w-full bg-black border border-neutral-600 text-white px-4 py-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono resize-none"
              placeholder="描述你当前的状态..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-200 hover:bg-white text-black font-bold py-3 px-4 flex items-center justify-center gap-2 transition-transform active:scale-95 uppercase tracking-wider border-2 border-transparent hover:border-black"
          >
            <Save className="w-4 h-4" />
            <span>保存身份</span>
          </button>
        </form>
      </div>
    </div>
  );
};