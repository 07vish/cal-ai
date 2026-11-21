import React, { useState } from 'react';
import type { FoodItem, MealType } from '../types';
import { X, Check, Beef, Wheat, Droplets, Sparkles, Scale, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FoodAnalysisSheetProps {
  foodItem: FoodItem;
  isOpen: boolean;
  onClose: () => void;
  onLogMeal: (food: FoodItem, portion: number, mealType: MealType) => void;
  isDarkMode?: boolean;
}

export const FoodAnalysisSheet: React.FC<FoodAnalysisSheetProps> = ({
  foodItem,
  isOpen,
  onClose,
  onLogMeal,
  isDarkMode = true,
}) => {
  const [portion, setPortion] = useState<number>(1.0);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');

  if (!isOpen) return null;

  // Compute scaled values
  const currentCalories = Math.round(foodItem.calories * portion);
  const currentProtein = +(foodItem.protein * portion).toFixed(1);
  const currentCarbs = +(foodItem.carbs * portion).toFixed(1);
  const currentFat = +(foodItem.fat * portion).toFixed(1);
  const currentFiber = +(foodItem.fiber * portion).toFixed(1);
  const currentSodium = Math.round(foodItem.sodium * portion);
  const currentWeightGrams = Math.round(foodItem.servingWeightGrams * portion);

  const handleConfirm = () => {
    // Fire celebratory Apple Health rings confetti!
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FA114F', '#BAFF1A', '#00D2FF', '#FF9500'],
    });

    onLogMeal(foodItem, portion, selectedMeal);
    onClose();
  };

  const getHealthGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'B': return 'bg-lime-500/20 text-lime-400 border-lime-500/30';
      case 'C': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div
        className={`w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar rounded-t-[36px] border-t p-6 shadow-2xl transition-transform animate-in slide-in-from-bottom duration-300 ${
          isDarkMode
            ? 'bg-neutral-900/95 border-white/15 text-white'
            : 'bg-white/95 border-black/10 text-neutral-900'
        }`}
      >
        {/* Apple Sheet Pull Handle */}
        <div className="w-12 h-1.5 bg-neutral-500/40 rounded-full mx-auto mb-4" />

        {/* Top Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-gray1">
                {foodItem.cuisine}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getHealthGradeColor(foodItem.healthGrade)}`}>
                Nutri-Score {foodItem.healthGrade}
              </span>
              <span className="text-[10px] font-medium bg-white/10 text-neutral-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-apple-green" />
                {Math.round(foodItem.confidence * 100)}% Match
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{foodItem.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800/60 hover:bg-neutral-700/60 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Food Image with bounding badges */}
        {foodItem.imageUrl && (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-lg">
            <img
              src={foodItem.imageUrl}
              alt={foodItem.name}
              className="w-full h-full object-cover"
            />
            {/* Visual AI Detection Markers */}
            {foodItem.boundingBoxes?.map((box, idx) => (
              <div
                key={idx}
                className="absolute border-2 border-apple-green bg-apple-green/10 rounded-lg pointer-events-none transition-all flex flex-col justify-start p-1"
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
              >
                <span className="bg-black/80 backdrop-blur-md text-apple-green text-[9px] font-bold px-1.5 py-0.5 rounded shadow w-max border border-apple-green/30">
                  {box.label} ({Math.round(box.confidence * 100)}%)
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Calorie & Macro Dashboard Grid */}
        <div className={`p-4 rounded-3xl mb-5 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-neutral-100 border border-neutral-200'}`}>
          <div className="flex items-baseline justify-between mb-3 border-b border-white/10 pb-3">
            <div>
              <p className="text-xs text-neutral-400 font-medium">Estimated Energy</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-apple-ringCalories tracking-tight">
                  {currentCalories}
                </span>
                <span className="text-sm font-semibold text-neutral-400">kcal</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-neutral-400">Total Serving</span>
              <p className="text-sm font-bold text-neutral-200 flex items-center justify-end gap-1">
                <Scale className="w-3.5 h-3.5 text-apple-gray1" />
                {currentWeightGrams}g ({portion}x)
              </p>
            </div>
          </div>

          {/* 3 Macro Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-2.5 rounded-2xl flex flex-col items-center ${isDarkMode ? 'bg-neutral-800/80 border border-apple-ringProtein/20' : 'bg-white'}`}>
              <div className="flex items-center gap-1 text-[11px] font-bold text-apple-ringProtein">
                <Beef className="w-3.5 h-3.5" />
                <span>Protein</span>
              </div>
              <span className="text-lg font-bold mt-0.5">{currentProtein}g</span>
              <span className="text-[10px] text-neutral-400">
                {Math.round((currentProtein * 4 / Math.max(1, currentCalories)) * 100)}% cal
              </span>
            </div>

            <div className={`p-2.5 rounded-2xl flex flex-col items-center ${isDarkMode ? 'bg-neutral-800/80 border border-apple-ringCarbs/20' : 'bg-white'}`}>
              <div className="flex items-center gap-1 text-[11px] font-bold text-apple-ringCarbs">
                <Wheat className="w-3.5 h-3.5" />
                <span>Carbs</span>
              </div>
              <span className="text-lg font-bold mt-0.5">{currentCarbs}g</span>
              <span className="text-[10px] text-neutral-400">
                {Math.round((currentCarbs * 4 / Math.max(1, currentCalories)) * 100)}% cal
              </span>
            </div>

            <div className={`p-2.5 rounded-2xl flex flex-col items-center ${isDarkMode ? 'bg-neutral-800/80 border border-apple-ringFat/20' : 'bg-white'}`}>
              <div className="flex items-center gap-1 text-[11px] font-bold text-apple-ringFat">
                <Droplets className="w-3.5 h-3.5 fill-current" />
                <span>Fat</span>
              </div>
              <span className="text-lg font-bold mt-0.5">{currentFat}g</span>
              <span className="text-[10px] text-neutral-400">
                {Math.round((currentFat * 9 / Math.max(1, currentCalories)) * 100)}% cal
              </span>
            </div>
          </div>

          {/* Micronutrients row */}
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-around text-[11px] text-neutral-400">
            <span>Fiber: <strong className="text-white">{currentFiber}g</strong></span>
            <span>Sodium: <strong className="text-white">{currentSodium}mg</strong></span>
            <span>GI: <strong className="text-white">{foodItem.glycemicIndex}</strong></span>
          </div>
        </div>

        {/* Portion Sizing Slider (Apple Style) */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Adjust Portion Size
            </label>
            <span className="text-xs font-bold text-apple-green bg-apple-green/10 px-2 py-0.5 rounded-full">
              {portion.toFixed(1)}x ({currentWeightGrams} grams)
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={portion}
            onChange={(e) => setPortion(parseFloat(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-apple-green"
          />

          <div className="flex justify-between text-[11px] text-neutral-500 font-medium mt-1">
            <button onClick={() => setPortion(0.5)} className="hover:text-white">0.5x (Snack)</button>
            <button onClick={() => setPortion(1.0)} className="hover:text-white font-bold text-neutral-300">1.0x (Regular)</button>
            <button onClick={() => setPortion(1.5)} className="hover:text-white">1.5x (Large)</button>
            <button onClick={() => setPortion(2.0)} className="hover:text-white">2.0x (Feast)</button>
          </div>
        </div>

        {/* Meal Category Selection */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
            Log To Meal
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((meal) => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                  selectedMeal === meal
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {meal}
              </button>
            ))}
          </div>
        </div>

        {/* Identified Ingredients Breakdown */}
        {foodItem.ingredients && foodItem.ingredients.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              Detected Ingredients Breakdown
            </h4>
            <div className="space-y-1.5">
              {foodItem.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <span className="font-medium text-neutral-200">{ing.name}</span>
                  <div className="flex items-center gap-3 text-neutral-400">
                    <span>{ing.weight}</span>
                    <span className="font-semibold text-apple-ringCalories">{ing.calories} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-apple-ringCalories to-rose-600 text-white font-bold text-base shadow-glow-calories flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Log {currentCalories} kcal to {selectedMeal}</span>
        </button>
      </div>
    </div>
  );
};
