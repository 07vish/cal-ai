import React from 'react';
import type { MealEntry, UserGoals } from '../types';
import { TrendingUp, Beef, Wheat, Droplets, Target, Award } from 'lucide-react';

interface AnalyticsViewProps {
  meals: MealEntry[];
  goals: UserGoals;
  isDarkMode?: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  meals,
  goals,
  isDarkMode = true,
}) => {
  // Compute today's values
  const todayCalories = meals.reduce((sum, m) => sum + m.computedCalories, 0);
  const todayProtein = meals.reduce((sum, m) => sum + m.computedProtein, 0);
  const todayCarbs = meals.reduce((sum, m) => sum + m.computedCarbs, 0);
  const todayFat = meals.reduce((sum, m) => sum + m.computedFat, 0);

  // Simulated 7-day trend data incorporating today
  const weeklyDays = [
    { day: 'Mon', calories: 2150, target: goals.calories },
    { day: 'Tue', calories: 1980, target: goals.calories },
    { day: 'Wed', calories: 2310, target: goals.calories },
    { day: 'Thu', calories: 2050, target: goals.calories },
    { day: 'Fri', calories: 2190, target: goals.calories },
    { day: 'Sat', calories: 2420, target: goals.calories },
    { day: 'Today', calories: todayCalories || 1850, target: goals.calories },
  ];

  const maxCal = Math.max(...weeklyDays.map(d => Math.max(d.calories, d.target))) * 1.15;

  const totalMacroCal = (todayProtein * 4) + (todayCarbs * 4) + (todayFat * 9) || 1;
  const proteinPct = Math.round(((todayProtein * 4) / totalMacroCal) * 100);
  const carbsPct = Math.round(((todayCarbs * 4) / totalMacroCal) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  return (
    <div className="space-y-5 pb-24 select-none">
      {/* Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-apple-gray1">
            Trends & Nutrition
          </span>
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            Insights
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-green/15 text-apple-green border border-apple-green/30 text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Optimal Range</span>
        </div>
      </div>

      {/* 7-Day Calorie History Chart (Apple Fitness Style) */}
      <div
        className={`p-5 rounded-3xl transition-all ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold tracking-tight">Energy Expenditure vs Intake</h3>
            <p className="text-xs text-neutral-400">Past 7 Days vs Goal ({goals.calories} kcal)</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-apple-ringCalories" /> Intake
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" /> Goal
            </span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1 border-b border-white/5">
          {weeklyDays.map((item, idx) => {
            const barHeightPct = Math.min(100, Math.round((item.calories / maxCal) * 100));
            const isToday = idx === weeklyDays.length - 1;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Calories tooltip / value on hover or today */}
                <span className="text-[9px] font-bold text-neutral-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.calories}
                </span>

                <div className="w-full max-w-[28px] h-full flex items-end relative">
                  {/* Goal marker line */}
                  <div
                    className="absolute w-full border-t border-dashed border-white/30 z-10"
                    style={{ bottom: `${(item.target / maxCal) * 100}%` }}
                  />

                  {/* Colored progress bar */}
                  <div
                    className={`w-full rounded-t-xl transition-all duration-700 ${
                      isToday
                        ? 'bg-gradient-to-t from-apple-ringCalories to-rose-400 shadow-glow-calories'
                        : item.calories > item.target
                        ? 'bg-apple-orange/80'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>

                <span className={`text-[10px] font-semibold mt-2 ${isToday ? 'text-apple-ringCalories font-bold' : 'text-neutral-400'}`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Macro Ratio Breakdown */}
      <div
        className={`p-5 rounded-3xl transition-all ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <h3 className="text-sm font-bold tracking-tight mb-1">Macronutrient Distribution</h3>
        <p className="text-xs text-neutral-400 mb-4">Caloric contribution from macros today</p>

        {/* Stacked Horizontal Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex mb-4 bg-white/5">
          <div
            className="h-full bg-apple-ringProtein transition-all duration-700"
            style={{ width: `${proteinPct}%` }}
            title={`Protein ${proteinPct}%`}
          />
          <div
            className="h-full bg-apple-ringCarbs transition-all duration-700"
            style={{ width: `${carbsPct}%` }}
            title={`Carbs ${carbsPct}%`}
          />
          <div
            className="h-full bg-apple-ringFat transition-all duration-700"
            style={{ width: `${fatPct}%` }}
            title={`Fat ${fatPct}%`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-bold text-apple-ringProtein">
              <Beef className="w-3.5 h-3.5" />
              <span>Protein</span>
            </div>
            <span className="text-lg font-bold mt-1">{proteinPct}%</span>
            <span className="text-[10px] text-neutral-400">{todayProtein}g total</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-bold text-apple-ringCarbs">
              <Wheat className="w-3.5 h-3.5" />
              <span>Carbs</span>
            </div>
            <span className="text-lg font-bold mt-1">{carbsPct}%</span>
            <span className="text-[10px] text-neutral-400">{todayCarbs}g total</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-bold text-apple-ringFat">
              <Droplets className="w-3.5 h-3.5 fill-current" />
              <span>Fat</span>
            </div>
            <span className="text-lg font-bold mt-1">{fatPct}%</span>
            <span className="text-[10px] text-neutral-400">{todayFat}g total</span>
          </div>
        </div>
      </div>

      {/* Quality of Diet & Health Score */}
      <div
        className={`p-5 rounded-3xl transition-all ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-apple-green to-emerald-400 flex items-center justify-center text-black font-extrabold text-xl shadow-lg">
            A
          </div>
          <div>
            <h4 className="text-sm font-bold">Overall Diet Quality Score</h4>
            <p className="text-xs text-neutral-400">High in micronutrients, optimal protein purity</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-neutral-300">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-apple-green" />
            <span>Target Calorie Adherence: <strong>94%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-apple-ringCalories" />
            <span>Fiber Density: <strong>High</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
