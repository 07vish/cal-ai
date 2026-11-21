import React, { useState } from 'react';
import { Sparkles, Utensils, Flame } from 'lucide-react';

interface DynamicIslandProps {
  statusText?: string;
  isScanning?: boolean;
  caloriesLogged?: number;
  remainingCalories?: number;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  statusText,
  isScanning = false,
  remainingCalories = 1450,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full flex justify-center pt-2.5 pb-1 relative z-50 select-none">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`bg-black text-white rounded-full transition-all duration-300 ease-out cursor-pointer border border-white/10 flex items-center shadow-2xl ${
          isExpanded
            ? 'w-[90%] h-16 px-4 justify-between rounded-3xl'
            : isScanning
            ? 'w-52 h-8 px-3 justify-between'
            : 'w-32 h-7 px-3 justify-between hover:w-36'
        }`}
      >
        {isExpanded ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-apple-ringCalories/20 border border-apple-ringCalories/40 flex items-center justify-center text-apple-ringCalories">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/90">Daily Energy Balance</p>
                <p className="text-[11px] text-white/60">
                  <span className="text-apple-ringCalories font-bold">{remainingCalories}</span> kcal remaining
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-apple-green text-[11px] font-medium bg-apple-green/10 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>AI Vision Ready</span>
            </div>
          </div>
        ) : isScanning ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-apple-green animate-ping" />
              <span className="text-[11px] font-medium tracking-tight text-white/90">
                {statusText || 'Analyzing Food...'}
              </span>
            </div>
            <div className="w-4 h-4 rounded-full border border-apple-green border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="w-2.5 h-2.5 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-apple-ringCalories" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium tracking-tight text-white/90">
              <Utensils className="w-3 h-3 text-apple-ringProtein" />
              <span>CaloVision</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-apple-green/80 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
