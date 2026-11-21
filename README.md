# 🍎 CaloVision - Apple UI Calorie & Macro AI Scanner

A food detection and macronutrient tracking web application designed with the **Apple iOS 18 Design System**, featuring Apple Health Activity Rings, Cupertino frosted glass aesthetics, an interactive camera scanner with AI food vision, real-time bounding boxes, dynamic portion scaling, and comprehensive daily nutrient tracking.

---

## ✨ Key Features

### 1. 🍏 Apple iOS Design System
- **Dynamic Island**: Displays real-time activities (e.g. remaining daily calories, scanning status, AI status) with smooth expand/collapse animations.
- **Apple Health Activity Rings**:
  - 🔴 **Energy Ring** (`#FA114F` / Move calories)
  - 🟢 **Protein Ring** (`#A8FF00` / Lean muscle recovery)
  - 🔵 **Carbs Ring** (`#00F0FF` / Glycogen fuel)
  - 🟡 **Fat Ring** (`#FF9500` / Essential fatty acids)
  - SVG rings with glow filters, live percentage completions, and remaining calorie counter.
- **Cupertino Frosted Glass Navigation**: Translucent bottom tab bar (`backdrop-blur-2xl`), SF Pro typography, haptic confetti celebrations, and native iOS modal sheet handles.
- **iPhone 16 Pro Frame Mockup**: Toggle between an iPhone 16 Pro frame with titanium finish and a responsive full-screen experience.

### 2. 📸 AI Vision Food & Macro Detection
- **Apple Camera Scanner**:
  - Live camera video viewfinder (`getUserMedia`) with grid lines toggle, flashlight simulation, and front/back camera switching.
  - **Animated Laser Scanning Line**: Real-time laser sweep and target focus reticle.
  - **Instant Sample Gallery**: 8 high-accuracy preloaded dishes (*Avocado Toast with Poached Egg, Grilled Atlantic Salmon & Quinoa, Mediterranean Chicken Caesar Salad, Acai Superfood Bowl, Neapolitan Pepperoni Pizza, Double Smash Cheeseburger, Authentic Tonkotsu Ramen, Greek Yogurt & Berry Parfait*) for zero-effort, 1-click testing.
  - **Photo Library Upload**: Upload custom images from your camera roll or device files.
  - **Dual Engine AI**:
    - **Intelligent Vision Engine (Instant & Offline)**: Identifies dishes, ingredients breakdown, confidence scores, Nutri-Scores (A-D), and glycemic indexes.
    - **Google Gemini Multimodal Vision API**: Optionally enter your Gemini API key in Profile to get real-time Gemini 1.5/2.0 Flash multimodal image recognition for any dish!

### 3. 📊 Interactive Apple Sheet (Analysis & Portion Slider)
- **Real-Time Portion Scaler**: Slide between 0.5x (Snack) up to 2.5x (Feast) or exact grams — dynamically recalculates calories, protein, carbs, fat, fiber, and sodium.
- **Detected Ingredients List**: Shows individual ingredient items (e.g. Sourdough 70g, Avocado 85g, Poached Egg 55g) with calorie contributions.
- **Meal Segmented Selector**: Categorize to *Breakfast, Lunch, Dinner, or Snacks*.
- **Celebratory Confetti**: Triggers Apple Health celebration upon logging.

### 4. 📅 Daily Food Log & Hydration
- Categorized meal timeline (Breakfast, Lunch, Dinner, Snacks) with timestamps and macro tags.
- Water tracker with 1-tap `+250ml` and `+500ml` quick logging.
- Manual Quick Add modal for custom foods, coffee, or snacks.

### 5. 📈 Insights & Analytics
- 7-Day Calorie Expenditure & Intake bar chart with daily target threshold line.
- Macronutrient distribution percentage bar (Protein % : Carbs % : Fat %).
- AI dietary coach insights and diet quality scoring.

---

## 🚀 Running Locally

The app is running on your machine:
```bash
# Start development server
npm run dev

# Open in browser:
http://127.0.0.1:5173/
```

To build for production:
```bash
npm run build
```
