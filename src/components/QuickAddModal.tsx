import React, { useState } from 'react';
import type { MealEntry, MealType } from '../types';
import { X, Check, Flame, Beef, Wheat, Droplets } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (meal: MealEntry) => void;
  isDarkMode?: boolean;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddMeal,
  isDarkMode = true,
}) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fat, setFat] = useState<string>('');
  const [mealType, setMealType] = useState<MealType>('snack');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cal = parseInt(calories) || 0;
    const pro = parseFloat(protein) || 0;
    const carb = parseFloat(carbs) || 0;
    const f = parseFloat(fat) || 0;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: MealEntry = {
      id: 'meal_manual_' + Date.now(),
      foodItem: {
        id: 'food_manual_' + Date.now(),
        name: name.trim(),
        cuisine: 'Quick Add',
        confidence: 1.0,
        calories: cal,
        protein: pro,
        carbs: carb,
        fat: f,
        fiber: 2,
        sugar: 2,
        sodium: 250,
        servingSize: '1 portion',
        servingWeightGrams: 200,
        healthGrade: 'A',
        glycemicIndex: 'Low',
        ingredients: [],
        boundingBoxes: [],
        tags: ['Quick Log'],
      },
      portionMultiplier: 1.0,
      timestamp: timeStr,
      mealType,
      computedCalories: cal,
      computedProtein: pro,
      computedCarbs: carb,
      computedFat: f,
    };

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#FA114F', '#BAFF1A', '#00D2FF'],
    });

    onAddMeal(newEntry);
    onClose();
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-sm rounded-[32px] p-6 shadow-2xl border transition-all ${
          isDarkMode ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-black/10 text-neutral-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold tracking-tight">Quick Add Food</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
              Food or Drink Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Protein Shake, Almonds, Latte..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-apple-ringCalories"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-apple-ringCalories uppercase tracking-wider flex items-center gap-1 mb-1">
                <Flame className="w-3 h-3 fill-current" /> Calories (kcal)
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="250"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-apple-ringCalories"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-apple-ringProtein uppercase tracking-wider flex items-center gap-1 mb-1">
                <Beef className="w-3 h-3" /> Protein (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="20"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-apple-ringProtein"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-apple-ringCarbs uppercase tracking-wider flex items-center gap-1 mb-1">
                <Wheat className="w-3 h-3" /> Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="25"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-apple-ringCarbs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-apple-ringFat uppercase tracking-wider flex items-center gap-1 mb-1">
                <Droplets className="w-3 h-3 fill-current" /> Fat (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="8"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-apple-ringFat"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Meal Slot
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setMealType(slot)}
                  className={`py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                    mealType === slot ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-apple-ringCalories to-rose-600 text-white font-bold text-sm shadow-glow-calories flex items-center justify-center gap-2 mt-4 hover:opacity-95"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Add to Log</span>
          </button>
        </form>
      </div>
    </div>
  );
};
