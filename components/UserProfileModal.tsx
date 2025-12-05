
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
  "Passenger_42", "Void_Walker", "Static_Ghost", "Echo_Unit", 
  "Memory_Fragment", "Data_Drifter", "Time_Tourist", "Null_Pointer"
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#F5F3EF]/90 backdrop-blur-sm">
      <div className="bg-[#F5F3EF] border border-[#00A651] w-full max-w-md shadow-[10px_10px_0px_#00A651]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00A651] bg-[#00A651] text-[#F5F3EF]">
          <div className="flex items-center gap-3">
             <Ghost className="w-5 h-5" />
             <h2 className="text-lg font-bold tracking-widest uppercase">IDENTITY_CONFIG</h2>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-[#F5F3EF] hover:text-[#00A651] p-1 transition-colors border border-transparent hover:border-[#00A651]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-1">
            <label className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#00A651]">
              <span>GHOST_ID (NAME)</span>
              <span>*REQ</span>
            </label>
            <div className="flex gap-0 border border-[#00A651]">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="flex-1 bg-transparent text-[#00A651] px-4 py-3 focus:outline-none font-bold"
                placeholder="WHO_ARE_YOU?"
              />
              <button
                type="button"
                onClick={handleRandomName}
                className="bg-[#00A651]/10 text-[#00A651] px-4 hover:bg-[#00A651] hover:text-[#F5F3EF] transition-colors border-l border-[#00A651]"
              >
                <Dice5 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#00A651]">
              TIMELINE / ORIGIN
            </label>
            <div className="border border-[#00A651]">
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-transparent text-[#00A651] px-4 py-3 focus:outline-none font-bold"
                placeholder="YYYY-MM-DD OR LOCATION"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#00A651]">
              PARAMETERS (OC)
            </label>
            <div className="border border-[#00A651]">
              <textarea
                value={formData.oc}
                onChange={(e) => setFormData({...formData, oc: e.target.value})}
                rows={3}
                className="w-full bg-transparent text-[#00A651] px-4 py-3 focus:outline-none font-bold resize-none"
                placeholder="ADDITIONAL_DATA..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00A651] hover:bg-[#008c44] text-[#F5F3EF] font-black py-4 px-4 flex items-center justify-center gap-2 uppercase tracking-widest border border-[#00A651] shadow-[4px_4px_0px_#00A651/30] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>SAVE_CONFIGURATION</span>
          </button>
        </form>
      </div>
    </div>
  );
};
