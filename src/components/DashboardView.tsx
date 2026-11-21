import React from 'react';
import type { MealEntry, UserGoals, TabType } from '../types';
import { AppleRings } from './AppleRings';
import {
  Camera,
  Plus,
  Droplet,
  ChevronRight,
  Sparkles,
  Flame,
  Award,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  meals: MealEntry[];
  goals: UserGoals;
  waterIntake: number;
  onAddWater: (amountMl: number) => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenQuickAdd: () => void;
  isDarkMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  meals,
  goals,
  waterIntake,
  onAddWater,
  onNavigateTab,
  onOpenQuickAdd,
  isDarkMode = true,
}) => {
  // Compute totals
  const totalCalories = meals.reduce((acc, m) => acc + m.computedCalories, 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.computedProtein, 0);
  const totalCarbs = meals.reduce((acc, m) => acc + m.computedCarbs, 0);
  const totalFat = meals.reduce((acc, m) => acc + m.computedFat, 0);

  const remainingCalories = Math.max(0, goals.calories - totalCalories);
  const waterPercent = Math.min(100, Math.round((waterIntake / goals.waterGoalMl) * 100));

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-5 pb-24 select-none">
      {/* Apple Health Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-apple-gray1">
            {todayDateString}
          </span>
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            Summary
          </h1>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-apple-ringCalories/15 text-apple-ringCalories border border-apple-ringCalories/30 text-xs font-bold hover:bg-apple-ringCalories/25 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Quick Add</span>
        </button>
      </div>

      {/* Main Apple Health Activity Rings Card */}
      <div
        className={`p-5 rounded-3xl transition-all shadow-xl ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-apple-ringCalories animate-pulse" />
            <h2 className="text-sm font-bold tracking-tight uppercase text-neutral-400">Activity Rings</h2>
          </div>
          <span className="text-xs font-semibold text-neutral-400">
            {remainingCalories > 0 ? `${remainingCalories} kcal left` : 'Goal Hit! 🎉'}
          </span>
        </div>

        <AppleRings
          calories={totalCalories}
          caloriesGoal={goals.calories}
          protein={totalProtein}
          proteinGoal={goals.protein}
          carbs={totalCarbs}
          carbsGoal={goals.carbs}
          fat={totalFat}
          fatGoal={goals.fat}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* AI Camera Scan Feature Callout Banner */}
      <div
        onClick={() => onNavigateTab('scanner')}
        className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white shadow-glow-calories cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="max-w-[210px]">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/90 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Instant AI Vision</span>
            </div>
            <h3 className="text-xl font-bold leading-tight">Snap & Detect Food</h3>
            <p className="text-xs text-white/80 mt-1">
              Point your camera to detect calories, protein, carbs & fat instantly.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
            <Camera className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </div>

      {/* Hydration Tracker Card */}
      <div
        className={`p-5 rounded-3xl transition-all ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-apple-cyan/20 border border-apple-cyan/40 flex items-center justify-center text-apple-cyan">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Hydration Tracker</h3>
              <p className="text-[11px] text-neutral-400">
                {waterIntake} / {goals.waterGoalMl} ml ({waterPercent}%)
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => onAddWater(250)}
              className="px-3 py-1 rounded-xl bg-apple-cyan/15 text-apple-cyan hover:bg-apple-cyan/25 font-bold text-xs transition-colors flex items-center gap-1"
            >
              +250 ml
            </button>
            <button
              onClick={() => onAddWater(500)}
              className="px-3 py-1 rounded-xl bg-apple-cyan/15 text-apple-cyan hover:bg-apple-cyan/25 font-bold text-xs transition-colors"
            >
              +500 ml
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-apple-cyan to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${waterPercent}%` }}
          />
        </div>
      </div>

      {/* Recent Logged Meals Summary */}
      <div
        className={`p-5 rounded-3xl transition-all ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Today's Meals</h3>
          <button
            onClick={() => onNavigateTab('log')}
            className="text-xs font-semibold text-apple-blue flex items-center gap-0.5 hover:underline"
          >
            <span>View All ({meals.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {meals.length === 0 ? (
          <div className="py-8 text-center text-neutral-500">
            <Camera className="w-8 h-8 mx-auto mb-2 opacity-40 text-apple-gray1" />
            <p className="text-sm font-semibold">No food logged yet today</p>
            <p className="text-xs mt-0.5">Use the scanner to log your first delicious meal!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {meals.slice(0, 3).map((meal) => (
              <div
                key={meal.id}
                className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  isDarkMode ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {meal.foodItem.imageUrl ? (
                    <img
                      src={meal.foodItem.imageUrl}
                      alt={meal.foodItem.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-apple-ringCalories/20 flex items-center justify-center text-apple-ringCalories font-bold text-lg">
                      <Flame className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-neutral-200 line-clamp-1">{meal.foodItem.name}</h4>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span>{meal.timestamp}</span>
                      <span>•</span>
                      <span className="capitalize">{meal.mealType}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-apple-ringCalories">
                    {meal.computedCalories} kcal
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                    <span>P: <strong className="text-apple-ringProtein">{meal.computedProtein}g</strong></span>
                    <span>C: <strong className="text-apple-ringCarbs">{meal.computedCarbs}g</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Dietary Coach Tip */}
      <div className={`p-4 rounded-3xl border flex items-start gap-3 ${
        isDarkMode ? 'bg-apple-green/10 border-apple-green/20 text-neutral-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="w-8 h-8 rounded-full bg-apple-green/20 text-apple-green flex items-center justify-center shrink-0">
          <Award className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <p className="font-bold text-apple-green mb-0.5">Nutritional Coach Insight</p>
          <p className="leading-relaxed">
            {totalProtein >= goals.protein * 0.7
              ? 'Excellent protein distribution today! You are on pace for optimal muscle recovery.'
              : 'Add lean protein sources like eggs, salmon, chicken, or Greek yogurt to hit your daily target.'}
          </p>
        </div>
      </div>
    </div>
  );
};
