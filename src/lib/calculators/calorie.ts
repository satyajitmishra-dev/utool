export interface CalorieInput {
  gender: "male" | "female";
  age: number;
  height: number; // in cm or inches depending on heightUnit
  weight: number; // in kg or lbs depending on weightUnit
  heightUnit: "cm" | "in";
  weightUnit: "kg" | "lb";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "extra";
  goal: "lose-mild" | "lose-normal" | "lose-extreme" | "maintain" | "gain-mild" | "gain-normal";
}

export interface CalorieResult {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  waterIntakeLiters: number;
  proteinGrams: number;
  healthyWeightMin: number;
  healthyWeightMax: number;
  macros: {
    protein: { grams: number; calories: number; pct: number };
    carbs: { grams: number; calories: number; pct: number };
    fats: { grams: number; calories: number; pct: number };
  };
}

export function calculateCalorie(input: CalorieInput): CalorieResult {
  const { gender, age, height, weight, heightUnit, weightUnit, activityLevel, goal } = input;

  // Convert height to cm
  const heightCm = heightUnit === "in" ? height * 2.54 : height;

  // Convert weight to kg
  const weightKg = weightUnit === "lb" ? weight * 0.45359237 : weight;

  // 1. BMI Calculation
  const heightMeters = heightCm / 100;
  const bmi = heightMeters > 0 ? weightKg / (heightMeters * heightMeters) : 0;

  let bmiCategory = "Normal weight";
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi >= 25 && bmi < 30) bmiCategory = "Overweight";
  else if (bmi >= 30) bmiCategory = "Obese";

  // 2. BMR Calculation (Mifflin-St Jeor)
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // 3. TDEE Calculation
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  };
  const factor = activityFactors[activityLevel] || 1.2;
  const tdee = bmr * factor;

  // 4. Target Calories
  let targetCalories = tdee;
  if (goal === "lose-mild") targetCalories = tdee - 250;
  else if (goal === "lose-normal") targetCalories = tdee - 500;
  else if (goal === "lose-extreme") targetCalories = tdee - 1000;
  else if (goal === "gain-mild") targetCalories = tdee + 250;
  else if (goal === "gain-normal") targetCalories = tdee + 500;

  // Safety caps: absolute minimum calories
  const safetyCap = gender === "female" ? 1200 : 1500;
  if (targetCalories < safetyCap) {
    targetCalories = safetyCap;
  }

  // 5. Water Intake (approx 35 ml per kg, adjusted for activity level)
  let waterMl = weightKg * 35;
  if (activityLevel === "active") waterMl += 500;
  else if (activityLevel === "extra") waterMl += 1000;
  const waterIntakeLiters = waterMl / 1000;

  // 6. Macro Distributions
  // Lose weight: High protein (35% protein, 35% carb, 30% fat)
  // Gain weight: Higher carb (25% protein, 55% carb, 20% fat)
  // Maintain: Balanced (30% protein, 45% carb, 25% fat)
  let proteinPct = 30;
  let carbPct = 45;
  let fatPct = 25;

  if (goal.startsWith("lose")) {
    proteinPct = 35;
    carbPct = 35;
    fatPct = 30;
  } else if (goal.startsWith("gain")) {
    proteinPct = 25;
    carbPct = 55;
    fatPct = 20;
  }

  const pCals = targetCalories * (proteinPct / 100);
  const cCals = targetCalories * (carbPct / 100);
  const fCals = targetCalories * (fatPct / 100);

  const proteinGrams = pCals / 4;
  const carbGrams = cCals / 4;
  const fatGrams = fCals / 9;

  // 7. Healthy Weight Range (BMI 18.5 - 24.9)
  const healthyWeightMinKg = 18.5 * (heightMeters * heightMeters);
  const healthyWeightMaxKg = 24.9 * (heightMeters * heightMeters);

  const healthyWeightMin = weightUnit === "lb" ? healthyWeightMinKg / 0.45359237 : healthyWeightMinKg;
  const healthyWeightMax = weightUnit === "lb" ? healthyWeightMaxKg / 0.45359237 : healthyWeightMaxKg;

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    targetCalories,
    waterIntakeLiters,
    proteinGrams,
    healthyWeightMin,
    healthyWeightMax,
    macros: {
      protein: { grams: proteinGrams, calories: pCals, pct: proteinPct },
      carbs: { grams: carbGrams, calories: cCals, pct: carbPct },
      fats: { grams: fatGrams, calories: fCals, pct: fatPct },
    },
  };
}
