import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isFrameMode: boolean;
  isDarkMode: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  isFrameMode,
  isDarkMode,
}) => {
  if (!isFrameMode) {
    return (
      <div className={`min-h-screen w-full transition-colors ${isDarkMode ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-900'}`}>
        <div className="max-w-md mx-auto min-h-screen relative shadow-2xl flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex items-center justify-center py-6 px-2 transition-colors ${
      isDarkMode ? 'bg-neutral-950 text-white' : 'bg-neutral-200 text-neutral-900'
    }`}>
      {/* Outer Titanium Phone Shell */}
      <div className="relative w-full max-w-[430px] h-[915px] bg-[#1a1a1c] p-[10px] rounded-[56px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-white/10 flex flex-col">
        {/* Hardware buttons on phone edge */}
        {/* Action Button & Volume */}
        <div className="absolute -left-[14px] top-[140px] w-[4px] h-[32px] bg-[#3a3a3c] rounded-l-md" />
        <div className="absolute -left-[14px] top-[190px] w-[4px] h-[58px] bg-[#3a3a3c] rounded-l-md" />
        <div className="absolute -left-[14px] top-[260px] w-[4px] h-[58px] bg-[#3a3a3c] rounded-l-md" />
        {/* Power Button */}
        <div className="absolute -right-[14px] top-[200px] w-[4px] h-[78px] bg-[#3a3a3c] rounded-r-md" />

        {/* Screen Bezel & Display */}
        <div className={`relative w-full h-full rounded-[48px] overflow-hidden flex flex-col border-[3px] border-black transition-colors ${
          isDarkMode ? 'bg-black text-white' : 'bg-neutral-50 text-neutral-900'
        }`}>
          {children}

          {/* Bottom Home Indicator Bar (iOS) */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
