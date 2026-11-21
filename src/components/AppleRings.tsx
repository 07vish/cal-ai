import React from 'react';
import { Flame, Beef, Wheat, Droplets } from 'lucide-react';

interface AppleRingsProps {
  calories: number;
  caloriesGoal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fat: number;
  fatGoal: number;
  size?: number;
  strokeWidth?: number;
  isDarkMode?: boolean;
}

export const AppleRings: React.FC<AppleRingsProps> = ({
  calories,
  caloriesGoal,
  protein,
  proteinGoal,
  carbs,
  carbsGoal,
  fat,
  fatGoal,
  size = 220,
  strokeWidth = 14,
  isDarkMode = true
}) => {
  const center = size / 2;
  const gap = 3;

  // Ring 1: Calories (Outer Ring)
  const r1 = center - strokeWidth / 2 - 4;
  const circ1 = 2 * Math.PI * r1;
  const pct1 = Math.min(calories / (caloriesGoal || 1), 1.75);
  const offset1 = circ1 - Math.min(pct1, 1) * circ1;

  // Ring 2: Protein (Middle Ring)
  const r2 = r1 - strokeWidth - gap;
  const circ2 = 2 * Math.PI * r2;
  const pct2 = Math.min(protein / (proteinGoal || 1), 1.75);
  const offset2 = circ2 - Math.min(pct2, 1) * circ2;

  // Ring 3: Carbs (Inner Ring)
  const r3 = r2 - strokeWidth - gap;
  const circ3 = 2 * Math.PI * r3;
  const pct3 = Math.min(carbs / (carbsGoal || 1), 1.75);
  const offset3 = circ3 - Math.min(pct3, 1) * circ3;

  // Ring 4: Fat (Core Ring)
  const r4 = r3 - strokeWidth - gap;
  const circ4 = 2 * Math.PI * r4;
  const pct4 = Math.min(fat / (fatGoal || 1), 1.75);
  const offset4 = circ4 - Math.min(pct4, 1) * circ4;

  const remainingCals = Math.max(0, caloriesGoal - calories);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            {/* Calories Gradient */}
            <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FA114F" />
              <stop offset="100%" stopColor="#FF5277" />
            </linearGradient>
            {/* Protein Gradient */}
            <linearGradient id="proGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8FF00" />
              <stop offset="100%" stopColor="#76D600" />
            </linearGradient>
            {/* Carbs Gradient */}
            <linearGradient id="carbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#0A84FF" />
            </linearGradient>
            {/* Fat Gradient */}
            <linearGradient id="fatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#FF9500" />
            </linearGradient>
          </defs>

          {/* Background Tracks */}
          <circle cx={center} cy={center} r={r1} stroke="#FA114F" strokeWidth={strokeWidth} strokeOpacity={0.18} fill="none" />
          <circle cx={center} cy={center} r={r2} stroke="#A8FF00" strokeWidth={strokeWidth} strokeOpacity={0.18} fill="none" />
          <circle cx={center} cy={center} r={r3} stroke="#00F0FF" strokeWidth={strokeWidth} strokeOpacity={0.18} fill="none" />
          <circle cx={center} cy={center} r={r4} stroke="#FF9500" strokeWidth={strokeWidth} strokeOpacity={0.18} fill="none" />

          {/* Active Animated Progress Rings */}
          <circle
            cx={center}
            cy={center}
            r={r1}
            stroke="url(#calGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circ1}
            strokeDashoffset={offset1}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx={center}
            cy={center}
            r={r2}
            stroke="url(#proGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circ2}
            strokeDashoffset={offset2}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx={center}
            cy={center}
            r={r3}
            stroke="url(#carbGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circ3}
            strokeDashoffset={offset3}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx={center}
            cy={center}
            r={r4}
            stroke="url(#fatGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circ4}
            strokeDashoffset={offset4}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Display: Apple Calorie Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <Flame className="w-5 h-5 text-apple-ringCalories mb-0.5 fill-current animate-pulse-subtle" />
          <span className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            {calories}
          </span>
          <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">
            / {caloriesGoal} kcal
          </span>
          <span className="text-[9px] font-medium text-apple-ringCalories mt-0.5">
            {remainingCals} left
          </span>
        </div>
      </div>

      {/* Macro Legend Pills with Apple Health Style */}
      <div className="grid grid-cols-4 gap-2 w-full mt-4 px-2">
        <div className={`flex flex-col items-center p-2 rounded-2xl ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-neutral-100'}`}>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-apple-ringCalories mb-0.5">
            <Flame className="w-3 h-3 fill-current" />
            <span>Energy</span>
          </div>
          <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{calories}</span>
          <span className="text-[9px] text-neutral-400">{Math.round((calories / caloriesGoal) * 100)}%</span>
        </div>

        <div className={`flex flex-col items-center p-2 rounded-2xl ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-neutral-100'}`}>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-apple-ringProtein mb-0.5">
            <Beef className="w-3 h-3" />
            <span>Protein</span>
          </div>
          <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{Math.round(protein)}g</span>
          <span className="text-[9px] text-neutral-400">{Math.round((protein / proteinGoal) * 100)}%</span>
        </div>

        <div className={`flex flex-col items-center p-2 rounded-2xl ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-neutral-100'}`}>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-apple-ringCarbs mb-0.5">
            <Wheat className="w-3 h-3" />
            <span>Carbs</span>
          </div>
          <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{Math.round(carbs)}g</span>
          <span className="text-[9px] text-neutral-400">{Math.round((carbs / carbsGoal) * 100)}%</span>
        </div>

        <div className={`flex flex-col items-center p-2 rounded-2xl ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-neutral-100'}`}>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-apple-ringFat mb-0.5">
            <Droplets className="w-3 h-3 fill-current" />
            <span>Fat</span>
          </div>
          <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{Math.round(fat)}g</span>
          <span className="text-[9px] text-neutral-400">{Math.round((fat / fatGoal) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
