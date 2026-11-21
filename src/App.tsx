import React, { useState, useEffect } from 'react';
import type { FoodItem, MealEntry, MealType, TabType, UserGoals } from './types';
import { PRESET_FOOD_SAMPLES } from './services/foodRecognition';
import { DynamicIsland } from './components/DynamicIsland';
import { StatusBar } from './components/StatusBar';
import { TabBar } from './components/TabBar';
import { DashboardView } from './components/DashboardView';
import { CameraScanner } from './components/CameraScanner';
import { FoodLogView } from './components/FoodLogView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProfileView } from './components/ProfileView';
import { FoodAnalysisSheet } from './components/FoodAnalysisSheet';
import { QuickAddModal } from './components/QuickAddModal';
import { DeviceFrame } from './components/DeviceFrame';

export const App: React.FC = () => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<TabType>('today');

  // Preferences & Appearance
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('calovision_gemini_key') || '';
  });

  // User Goals
  const [goals, setGoals] = useState<UserGoals>(() => {
    const saved = localStorage.getItem('calovision_goals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      calories: 2200,
      protein: 145,
      carbs: 220,
      fat: 65,
      waterGoalMl: 2500,
      weightKg: 74,
      targetWeightKg: 70,
      heightCm: 178,
      age: 26,
      gender: 'male',
      activityLevel: 'moderate',
      fitnessGoal: 'maintenance'
    };
  });

  // Meals List (Seed with two delicious sample meals to start)
  const [meals, setMeals] = useState<MealEntry[]>(() => {
    const saved = localStorage.getItem('calovision_meals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    const sampleAvocado = PRESET_FOOD_SAMPLES[0].foodData;
    const sampleChicken = PRESET_FOOD_SAMPLES[2].foodData;

    return [
      {
        id: 'seed_breakfast',
        foodItem: { ...sampleAvocado, imageUrl: PRESET_FOOD_SAMPLES[0].imageUrl },
        portionMultiplier: 1.0,
        timestamp: '8:30 AM',
        mealType: 'breakfast',
        computedCalories: sampleAvocado.calories,
        computedProtein: sampleAvocado.protein,
        computedCarbs: sampleAvocado.carbs,
        computedFat: sampleAvocado.fat,
      },
      {
        id: 'seed_lunch',
        foodItem: { ...sampleChicken, imageUrl: PRESET_FOOD_SAMPLES[2].imageUrl },
        portionMultiplier: 1.0,
        timestamp: '1:15 PM',
        mealType: 'lunch',
        computedCalories: sampleChicken.calories,
        computedProtein: sampleChicken.protein,
        computedCarbs: sampleChicken.carbs,
        computedFat: sampleChicken.fat,
      }
    ];
  });

  // Water Intake
  const [waterIntake, setWaterIntake] = useState<number>(() => {
    const saved = localStorage.getItem('calovision_water');
    return saved ? parseInt(saved) : 1250;
  });

  // Modals & Detection sheets
  const [detectedFood, setDetectedFood] = useState<FoodItem | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('calovision_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('calovision_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('calovision_water', waterIntake.toString());
  }, [waterIntake]);

  // Handlers
  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('calovision_gemini_key', key);
  };

  const handleAddWater = (amountMl: number) => {
    setWaterIntake(prev => prev + amountMl);
  };

  const handleFoodDetected = (food: FoodItem) => {
    setDetectedFood(food);
    setIsAnalysisOpen(true);
  };

  const handleLogMeal = (food: FoodItem, portion: number, mealType: MealType) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: MealEntry = {
      id: 'meal_' + Date.now(),
      foodItem: food,
      portionMultiplier: portion,
      timestamp: timeStr,
      mealType,
      computedCalories: Math.round(food.calories * portion),
      computedProtein: +(food.protein * portion).toFixed(1),
      computedCarbs: +(food.carbs * portion).toFixed(1),
      computedFat: +(food.fat * portion).toFixed(1),
    };

    setMeals(prev => [newEntry, ...prev]);
    setCurrentTab('today');
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const totalCalories = meals.reduce((sum, m) => sum + m.computedCalories, 0);
  const remainingCalories = Math.max(0, goals.calories - totalCalories);

  return (
    <DeviceFrame isFrameMode={isFrameMode} isDarkMode={isDarkMode}>
      {/* Top Apple System Shell */}
      <header className="sticky top-0 z-40 w-full pt-1 bg-inherit backdrop-blur-xl">
        <StatusBar isDarkMode={isDarkMode} />
        <DynamicIsland
          remainingCalories={remainingCalories}
          isScanning={currentTab === 'scanner'}
        />
      </header>

      {/* Main Screen Views Content */}
      <main className="flex-1 px-4 pt-3 overflow-y-auto no-scrollbar">
        {currentTab === 'today' && (
          <DashboardView
            meals={meals}
            goals={goals}
            waterIntake={waterIntake}
            onAddWater={handleAddWater}
            onNavigateTab={setCurrentTab}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'scanner' && (
          <div className="pb-24 pt-1 animate-in fade-in duration-300">
            <CameraScanner
              onFoodDetected={handleFoodDetected}
              geminiApiKey={geminiApiKey}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {currentTab === 'log' && (
          <FoodLogView
            meals={meals}
            onDeleteMeal={handleDeleteMeal}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'insights' && (
          <AnalyticsView
            meals={meals}
            goals={goals}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            goals={goals}
            onUpdateGoals={setGoals}
            geminiApiKey={geminiApiKey}
            onSaveApiKey={handleSaveApiKey}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            isFrameMode={isFrameMode}
            onToggleFrameMode={() => setIsFrameMode(!isFrameMode)}
          />
        )}
      </main>

      {/* Apple Cupertino Frosted Bottom Tab Bar */}
      <TabBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDarkMode={isDarkMode}
      />

      {/* Slide-up Food Analysis Modal Sheet */}
      {detectedFood && (
        <FoodAnalysisSheet
          foodItem={detectedFood}
          isOpen={isAnalysisOpen}
          onClose={() => setIsAnalysisOpen(false)}
          onLogMeal={handleLogMeal}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Manual Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddMeal={(meal) => {
          setMeals(prev => [meal, ...prev]);
        }}
        isDarkMode={isDarkMode}
      />
    </DeviceFrame>
  );
};

export default App;
