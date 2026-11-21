import React from 'react';
import type { MealEntry, MealType } from '../types';
import { Trash2, Plus, Clock, Beef, Wheat, Droplets, Utensils } from 'lucide-react';

interface FoodLogViewProps {
  meals: MealEntry[];
  onDeleteMeal: (id: string) => void;
  onOpenQuickAdd: () => void;
  isDarkMode?: boolean;
}

export const FoodLogView: React.FC<FoodLogViewProps> = ({
  meals,
  onDeleteMeal,
  onOpenQuickAdd,
  isDarkMode = true,
}) => {
  const mealCategories: { type: MealType; label: string; icon: string; timeRange: string }[] = [
    { type: 'breakfast', label: 'Breakfast', icon: '🌅', timeRange: '6:00 AM - 11:00 AM' },
    { type: 'lunch', label: 'Lunch', icon: '☀️', timeRange: '11:30 AM - 3:00 PM' },
    { type: 'dinner', label: 'Dinner', icon: '🌙', timeRange: '6:00 PM - 9:30 PM' },
    { type: 'snack', label: 'Snacks & Extras', icon: '🍎', timeRange: 'Anytime' },
  ];

  const totalCalories = meals.reduce((sum, m) => sum + m.computedCalories, 0);

  return (
    <div className="space-y-5 pb-24 select-none">
      {/* Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-apple-gray1">
            Daily Food Timeline
          </span>
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            Food Log
          </h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-400 font-medium">Logged Today</span>
          <p className="text-xl font-extrabold text-apple-ringCalories">{totalCalories} kcal</p>
        </div>
      </div>

      {/* Meal Categories Sections */}
      <div className="space-y-4">
        {mealCategories.map((category) => {
          const categoryMeals = meals.filter((m) => m.mealType === category.type);
          const categoryCalories = categoryMeals.reduce((sum, m) => sum + m.computedCalories, 0);

          return (
            <div
              key={category.type}
              className={`p-4 rounded-3xl transition-all ${
                isDarkMode
                  ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
                  : 'bg-white border border-black/5 shadow-apple-light'
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">{category.label}</h3>
                    <p className="text-[10px] text-neutral-400">{category.timeRange}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-apple-ringCalories">
                    {categoryCalories} kcal
                  </span>
                </div>
              </div>

              {/* Logged Items */}
              {categoryMeals.length === 0 ? (
                <div className="py-4 text-center text-xs text-neutral-500 font-medium">
                  Nothing logged for {category.label.toLowerCase()}
                </div>
              ) : (
                <div className="space-y-2">
                  {categoryMeals.map((meal) => (
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
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-neutral-300">
                            <Utensils className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-neutral-200 line-clamp-1">
                            {meal.foodItem.name}
                          </h4>
                          <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            <span>{meal.timestamp}</span>
                            <span>•</span>
                            <span>{meal.portionMultiplier}x portion</span>
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                            <span className="flex items-center gap-0.5 text-apple-ringProtein">
                              <Beef className="w-2.5 h-2.5" /> {meal.computedProtein}g
                            </span>
                            <span className="flex items-center gap-0.5 text-apple-ringCarbs">
                              <Wheat className="w-2.5 h-2.5" /> {meal.computedCarbs}g
                            </span>
                            <span className="flex items-center gap-0.5 text-apple-ringFat">
                              <Droplets className="w-2.5 h-2.5 fill-current" /> {meal.computedFat}g
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-apple-ringCalories">
                          {meal.computedCalories} kcal
                        </span>
                        <button
                          onClick={() => onDeleteMeal(meal.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete meal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Quick Add Floating Action */}
      <button
        onClick={onOpenQuickAdd}
        className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Food Item Manually</span>
      </button>
    </div>
  );
};
