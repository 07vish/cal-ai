import React from 'react';
import type { TabType } from '../types';
import { Flame, Camera, BookOpen, BarChart3, User } from 'lucide-react';

interface TabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isDarkMode?: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onSelectTab, isDarkMode = true }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-6 pt-2 pointer-events-none">
      <nav
        className={`pointer-events-auto rounded-[32px] px-3 py-2 flex items-center justify-around shadow-2xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-neutral-900/80 border border-white/10 backdrop-blur-2xl text-neutral-400'
            : 'bg-white/85 border border-black/5 backdrop-blur-2xl text-neutral-500 shadow-apple-light'
        }`}
      >
        {/* Today Tab */}
        <button
          onClick={() => onSelectTab('today')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
            currentTab === 'today'
              ? isDarkMode
                ? 'text-apple-ringCalories scale-105'
                : 'text-apple-ringCalories scale-105'
              : 'hover:text-neutral-200'
          }`}
        >
          <Flame className={`w-5 h-5 ${currentTab === 'today' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-semibold tracking-tight">Today</span>
        </button>

        {/* Log Tab */}
        <button
          onClick={() => onSelectTab('log')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
            currentTab === 'log'
              ? isDarkMode
                ? 'text-apple-ringCarbs scale-105'
                : 'text-apple-blue scale-105'
              : 'hover:text-neutral-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight">Log</span>
        </button>

        {/* Central Scan Camera Action */}
        <button
          onClick={() => onSelectTab('scanner')}
          aria-label="Scan Food"
          className="relative -top-3 p-1 rounded-full group transition-transform active:scale-95"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-apple-ringCalories via-rose-500 to-amber-400 p-[2px] shadow-glow-calories">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
              <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-apple-ringCalories uppercase tracking-wider">
            Scan
          </span>
        </button>

        {/* Insights Tab */}
        <button
          onClick={() => onSelectTab('insights')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
            currentTab === 'insights'
              ? isDarkMode
                ? 'text-apple-ringProtein scale-105'
                : 'text-emerald-600 scale-105'
              : 'hover:text-neutral-200'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight">Insights</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
            currentTab === 'profile'
              ? isDarkMode
                ? 'text-apple-purple scale-105'
                : 'text-purple-600 scale-105'
              : 'hover:text-neutral-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight">Profile</span>
        </button>
      </nav>
    </div>
  );
};
