export interface DetectedIngredient {
  name: string;
  weight: string;
  calories: number;
}

export interface BoundingBox {
  label: string;
  x: number;       // percentage 0-100
  y: number;       // percentage 0-100
  width: number;   // percentage 0-100
  height: number;  // percentage 0-100
  confidence: number;
}

export interface FoodItem {
  id: string;
  name: string;
  cuisine: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  servingWeightGrams: number;
  healthGrade: 'A' | 'B' | 'C' | 'D';
  glycemicIndex: 'Low' | 'Medium' | 'High';
  ingredients: DetectedIngredient[];
  boundingBoxes: BoundingBox[];
  tags: string[];
  imageUrl?: string;
  description?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntry {
  id: string;
  foodItem: FoodItem;
  portionMultiplier: number;
  timestamp: string;
  mealType: MealType;
  computedCalories: number;
  computedProtein: number;
  computedCarbs: number;
  computedFat: number;
}

export interface UserGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterGoalMl: number;
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'athlete';
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintenance';
}

export interface PresetFoodSample {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  foodData: FoodItem;
}

export type TabType = 'today' | 'scanner' | 'log' | 'insights' | 'profile';
