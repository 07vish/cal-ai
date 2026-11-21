import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

interface StatusBarProps {
  isDarkMode?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ isDarkMode = true }) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full px-7 pt-1 flex justify-between items-center text-xs font-semibold select-none z-40 transition-colors ${
        isDarkMode ? 'text-white' : 'text-neutral-900'
      }`}
    >
      <span className="tracking-tight text-[13px] font-medium ml-1">{time}</span>
      <div className="flex items-center space-x-2 mr-1">
        {/* Signal Bars */}
        <div className="flex items-end gap-[1.5px] h-3">
          <div className="w-[3px] h-1.5 bg-current rounded-xs" />
          <div className="w-[3px] h-2 bg-current rounded-xs" />
          <div className="w-[3px] h-2.5 bg-current rounded-xs" />
          <div className="w-[3px] h-3 bg-current rounded-xs" />
        </div>
        {/* 5G label */}
        <span className="text-[10px] font-bold tracking-tighter">5G</span>
        {/* Wifi Icon */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        {/* Battery with 100% inside */}
        <div className="flex items-center gap-0.5">
          <div className="w-5 h-2.5 rounded-[4px] border border-current p-[1px] flex items-center">
            <div className="h-full w-full bg-apple-green rounded-[2px]" />
          </div>
          <div className="w-[1.5px] h-1 bg-current rounded-r-xs" />
        </div>
      </div>
    </div>
  );
};
