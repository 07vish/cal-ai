import React, { useState } from 'react';
import type { UserGoals } from '../types';
import {
  Key,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Sparkles,
  Smartphone,
  Sun,
  Moon,
  Check
} from 'lucide-react';

interface ProfileViewProps {
  goals: UserGoals;
  onUpdateGoals: (newGoals: UserGoals) => void;
  geminiApiKey: string;
  onSaveApiKey: (key: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  goals,
  onUpdateGoals,
  geminiApiKey,
  onSaveApiKey,
  isDarkMode,
  onToggleDarkMode,
  isFrameMode,
  onToggleFrameMode,
}) => {
  const [tempKey, setTempKey] = useState(geminiApiKey);
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [localGoals, setLocalGoals] = useState<UserGoals>(goals);

  const handleSaveKey = () => {
    onSaveApiKey(tempKey);
    setIsKeySaved(true);
    setTimeout(() => setIsKeySaved(false), 2500);
  };

  const handleGoalChange = (field: keyof UserGoals, value: number) => {
    const updated = { ...localGoals, [field]: value };
    setLocalGoals(updated);
    onUpdateGoals(updated);
  };

  const handleFitnessGoal = (goal: 'weight_loss' | 'muscle_gain' | 'maintenance') => {
    let newCal = 2200;
    let newProtein = 140;
    let newCarbs = 220;
    let newFat = 70;

    if (goal === 'weight_loss') {
      newCal = 1800;
      newProtein = 150;
      newCarbs = 160;
      newFat = 55;
    } else if (goal === 'muscle_gain') {
      newCal = 2650;
      newProtein = 175;
      newCarbs = 290;
      newFat = 80;
    }

    const updated: UserGoals = {
      ...localGoals,
      fitnessGoal: goal,
      calories: newCal,
      protein: newProtein,
      carbs: newCarbs,
      fat: newFat,
    };
    setLocalGoals(updated);
    onUpdateGoals(updated);
  };

  return (
    <div className="space-y-5 pb-24 select-none">
      {/* Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-apple-gray1">
            Personalization
          </span>
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            Profile & Goals
          </h1>
        </div>
      </div>

      {/* Target Goal Preset Selector */}
      <div
        className={`p-5 rounded-3xl transition-all ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <h3 className="text-sm font-bold tracking-tight mb-1">Target Fitness Program</h3>
        <p className="text-xs text-neutral-400 mb-3">Calculates optimal macro targets automatically</p>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleFitnessGoal('weight_loss')}
            className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all ${
              localGoals.fitnessGoal === 'weight_loss'
                ? 'bg-apple-ringCalories text-white border-apple-ringCalories shadow-md'
                : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
            }`}
          >
            🔥 Weight Loss
          </button>
          <button
            onClick={() => handleFitnessGoal('maintenance')}
            className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all ${
              localGoals.fitnessGoal === 'maintenance'
                ? 'bg-apple-blue text-white border-apple-blue shadow-md'
                : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
            }`}
          >
            ⚖️ Maintain
          </button>
          <button
            onClick={() => handleFitnessGoal('muscle_gain')}
            className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all ${
              localGoals.fitnessGoal === 'muscle_gain'
                ? 'bg-apple-ringProtein text-black border-apple-ringProtein shadow-md'
                : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
            }`}
          >
            💪 Build Muscle
          </button>
        </div>
      </div>

      {/* Macro Goals Sliders */}
      <div
        className={`p-5 rounded-3xl transition-all ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <h3 className="text-sm font-bold tracking-tight mb-4">Daily Nutrition Targets</h3>

        {/* Calories */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="flex items-center gap-1 text-apple-ringCalories">
              <Flame className="w-3.5 h-3.5 fill-current" /> Daily Calories
            </span>
            <span className="font-bold">{localGoals.calories} kcal</span>
          </div>
          <input
            type="range"
            min="1200"
            max="3800"
            step="50"
            value={localGoals.calories}
            onChange={(e) => handleGoalChange('calories', parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-apple-ringCalories"
          />
        </div>

        {/* Protein */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="flex items-center gap-1 text-apple-ringProtein">
              <Beef className="w-3.5 h-3.5" /> Protein Target
            </span>
            <span className="font-bold">{localGoals.protein}g</span>
          </div>
          <input
            type="range"
            min="60"
            max="260"
            step="5"
            value={localGoals.protein}
            onChange={(e) => handleGoalChange('protein', parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-apple-ringProtein"
          />
        </div>

        {/* Carbs */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="flex items-center gap-1 text-apple-ringCarbs">
              <Wheat className="w-3.5 h-3.5" /> Carbs Target
            </span>
            <span className="font-bold">{localGoals.carbs}g</span>
          </div>
          <input
            type="range"
            min="50"
            max="400"
            step="10"
            value={localGoals.carbs}
            onChange={(e) => handleGoalChange('carbs', parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-apple-ringCarbs"
          />
        </div>

        {/* Fat */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="flex items-center gap-1 text-apple-ringFat">
              <Droplets className="w-3.5 h-3.5 fill-current" /> Fat Target
            </span>
            <span className="font-bold">{localGoals.fat}g</span>
          </div>
          <input
            type="range"
            min="30"
            max="120"
            step="5"
            value={localGoals.fat}
            onChange={(e) => handleGoalChange('fat', parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-apple-ringFat"
          />
        </div>
      </div>

      {/* Gemini Multimodal Vision API Key Setup */}
      <div
        className={`p-5 rounded-3xl transition-all ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-4 h-4 text-apple-green" />
          <h3 className="text-sm font-bold tracking-tight">Google Gemini Vision API (Optional)</h3>
        </div>
        <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
          The app includes built-in offline neural vision detection. You can also paste your Gemini API key to enable live Gemini 1.5/2.0 Flash multimodal recognition for any custom uploaded photos!
        </p>

        <div className="flex gap-2">
          <input
            type="password"
            placeholder="AIzaSy..."
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-apple-green"
          />
          <button
            onClick={handleSaveKey}
            className="px-4 py-2.5 rounded-2xl bg-apple-green text-black font-bold text-xs flex items-center gap-1 hover:bg-emerald-400 transition-colors"
          >
            {isKeySaved ? <Check className="w-4 h-4" /> : 'Save'}
          </button>
        </div>
        {tempKey && (
          <p className="text-[10px] text-apple-green mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Live Gemini Vision API Enabled
          </p>
        )}
      </div>

      {/* App Appearance & Frame Toggles */}
      <div
        className={`p-5 rounded-3xl transition-all ${
          isDarkMode
            ? 'bg-neutral-900/70 border border-white/10 backdrop-blur-2xl'
            : 'bg-white border border-black/5 shadow-apple-light'
        }`}
      >
        <h3 className="text-sm font-bold tracking-tight mb-3">Display & Experience</h3>

        <div className="space-y-3">
          {/* Light / Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-4 h-4 text-apple-indigo" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="text-xs font-semibold">Dark / Light Mode</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                isDarkMode ? 'bg-apple-green' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* iPhone Frame Mockup Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-apple-cyan" />
              <span className="text-xs font-semibold">iPhone 16 Pro Frame Mockup</span>
            </div>
            <button
              onClick={onToggleFrameMode}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                isFrameMode ? 'bg-apple-green' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isFrameMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
