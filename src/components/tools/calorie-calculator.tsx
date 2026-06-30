"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateCalorie, CalorieInput } from "@/lib/calculators/calorie";
import {
  CalculatorLayout,
  CalculatorHeader,
  CalculatorInput,
  CalculatorSelect,
  CalculatorResult,
  CalculationSteps,
  FormulaCard,
  HistoryPanel,
  saveHistory,
} from "./shared/calculator";
import { Heart } from "lucide-react";

const STORAGE_KEY = "utool-history-calorie-calculator";
const PREF_KEY = "utool-pref-calorie-calculator";

const schema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.number({ message: "Please enter a valid age." }).min(1).max(120),
  height: z.number({ message: "Please enter a valid height." }).min(10).max(300),
  weight: z.number({ message: "Please enter a valid weight." }).min(2).max(1000),
  heightUnit: z.enum(["cm", "in"]),
  weightUnit: z.enum(["kg", "lb"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "extra"]),
  goal: z.enum(["lose-mild", "lose-normal", "lose-extreme", "maintain", "gain-mild", "gain-normal"]),
});

type FormData = z.infer<typeof schema>;

function CalorieCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");

  // Default values
  const defaultValues: FormData = {
    gender: "male",
    age: 28,
    height: 175,
    weight: 75,
    heightUnit: "cm",
    weightUnit: "kg",
    activityLevel: "moderate",
    goal: "maintain",
  };

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const formValues = watch();

  // Load URL params & preferences
  useEffect(() => {
    // 1. First check localStorage for previous inputs
    try {
      const savedPrefs = localStorage.getItem(PREF_KEY);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        Object.entries(parsed).forEach(([key, val]) => {
          setValue(key as any, val);
        });
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Override with URL search params if present
    const gender = searchParams.get("gender");
    const age = searchParams.get("age");
    const height = searchParams.get("height");
    const weight = searchParams.get("weight");
    const heightUnit = searchParams.get("heightUnit");
    const weightUnit = searchParams.get("weightUnit");
    const activityLevel = searchParams.get("activityLevel");
    const goal = searchParams.get("goal");

    if (gender) setValue("gender", gender as any);
    if (age) setValue("age", parseInt(age));
    if (height) setValue("height", parseFloat(height));
    if (weight) setValue("weight", parseFloat(weight));
    if (heightUnit) setValue("heightUnit", heightUnit as any);
    if (weightUnit) setValue("weightUnit", weightUnit as any);
    if (activityLevel) setValue("activityLevel", activityLevel as any);
    if (goal) setValue("goal", goal as any);
  }, [searchParams, setValue]);

  // Auto-save form preferences
  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(formValues));
    } catch (e) {
      console.error(e);
    }
  }, [formValues]);

  // Compute live results
  const results = calculateCalorie(formValues as CalorieInput);

  const handleReset = () => {
    Object.entries(defaultValues).forEach(([key, val]) => {
      setValue(key as any, val);
    });
  };

  const handleSave = () => {
    const title = `Calorie (${formValues.gender === "male" ? "M" : "F"}, ${formValues.age}y, ${formValues.weight}${formValues.weightUnit})`;
    saveHistory(STORAGE_KEY, title, formValues, results);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    Object.entries(inputs).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setActiveTab("calculate");
  };

  const reportText = `=== DAILY CALORIE REPORT ===
Gender: ${formValues.gender}
Age: ${formValues.age} years
Height: ${formValues.height} ${formValues.heightUnit}
Weight: ${formValues.weight} ${formValues.weightUnit}
Activity Level: ${formValues.activityLevel}
Goal: ${formValues.goal}

BMR (Basal Metabolic Rate): ${Math.round(results.bmr)} kcal
TDEE (Maintenance): ${Math.round(results.tdee)} kcal
Target Daily Intake: ${Math.round(results.targetCalories)} kcal
BMI: ${results.bmi.toFixed(1)} (${results.bmiCategory})
Recommended Water Intake: ${results.waterIntakeLiters.toFixed(1)} L/day
Macros Distribution:
- Protein: ${Math.round(results.macros.protein.grams)}g (${results.macros.protein.pct}%)
- Carbs: ${Math.round(results.macros.carbs.grams)}g (${results.macros.carbs.pct}%)
- Fats: ${Math.round(results.macros.fats.grams)}g (${results.macros.fats.pct}%)`;

  const insights = [
    { label: "BMI Value", value: `${results.bmi.toFixed(1)} (${results.bmiCategory})` },
    { label: "BMR (Basal Burn)", value: `${Math.round(results.bmr)} kcal/day` },
    { label: "Daily Water Goal", value: `${results.waterIntakeLiters.toFixed(1)} Liters` },
    { label: "Healthy Weight Limits", value: `${Math.round(results.healthyWeightMin)} - ${Math.round(results.healthyWeightMax)} ${formValues.weightUnit}` },
  ];

  const nextSteps = [
    `Consume around ${Math.round(results.targetCalories)} kcal per day to align with your goal.`,
    `Track your protein intake (${Math.round(results.proteinGrams)}g) to preserve muscle mass.`,
    `Aim for ${results.waterIntakeLiters.toFixed(1)} liters of water per day.`,
    `Aim for standard activity levels to improve cardiovascular health.`,
  ];

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Daily Calorie Calculator"
          description="Calculate BMI, BMR, daily maintenance calories (TDEE), and macro-nutrient targets optimized for weight loss, maintenance, or muscle gain."
        />
      }
      inputs={
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <CalculatorSelect
                  label="Gender"
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  {...field}
                />
              )}
            />

            <Controller
              name="age"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorInput
                  label="Age"
                  type="number"
                  value={value}
                  onChange={onChange}
                  error={errors.age?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="heightUnit"
              control={control}
              render={({ field }) => (
                <CalculatorSelect
                  label="Height Unit"
                  options={[
                    { label: "Centimeters (cm)", value: "cm" },
                    { label: "Inches (in)", value: "in" },
                  ]}
                  {...field}
                />
              )}
            />
            <Controller
              name="height"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorInput
                  label="Height"
                  type="number"
                  value={value}
                  onChange={onChange}
                  suffixText={formValues.heightUnit}
                  error={errors.height?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="weightUnit"
              control={control}
              render={({ field }) => (
                <CalculatorSelect
                  label="Weight Unit"
                  options={[
                    { label: "Kilograms (kg)", value: "kg" },
                    { label: "Pounds (lb)", value: "lb" },
                  ]}
                  {...field}
                />
              )}
            />
            <Controller
              name="weight"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorInput
                  label="Weight"
                  type="number"
                  value={value}
                  onChange={onChange}
                  suffixText={formValues.weightUnit}
                  error={errors.weight?.message}
                />
              )}
            />
          </div>

          <Controller
            name="activityLevel"
            control={control}
            render={({ field }) => (
              <CalculatorSelect
                label="Activity Level"
                options={[
                  { label: "Sedentary (desk job, no exercise)", value: "sedentary" },
                  { label: "Light Active (exercise 1-3 days/week)", value: "light" },
                  { label: "Moderate Active (exercise 3-5 days/week)", value: "moderate" },
                  { label: "Very Active (hard exercise 6-7 days/week)", value: "active" },
                  { label: "Extra Active (physical job & double workouts)", value: "extra" },
                ]}
                {...field}
              />
            )}
          />

          <Controller
            name="goal"
            control={control}
            render={({ field }) => (
              <CalculatorSelect
                label="Weight Goal"
                options={[
                  { label: "Maintain Weight", value: "maintain" },
                  { label: "Mild Weight Loss (0.25 kg / 0.5 lb weekly)", value: "lose-mild" },
                  { label: "Moderate Weight Loss (0.5 kg / 1 lb weekly)", value: "lose-normal" },
                  { label: "Extreme Weight Loss (1 kg / 2 lb weekly)", value: "lose-extreme" },
                  { label: "Mild Weight Gain (0.25 kg / 0.5 lb weekly)", value: "gain-mild" },
                  { label: "Moderate Weight Gain (0.5 kg / 1 lb weekly)", value: "gain-normal" },
                ]}
                {...field}
              />
            )}
          />
        </form>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={`${Math.round(results.targetCalories)} kcal`}
            resultLabel="Target Daily Intake"
            summary={`To reach your objective, consume ${Math.round(results.targetCalories)} calories daily. Your estimated maintenance calories (TDEE) is ${Math.round(results.tdee)} kcal/day.`}
            insights={insights}
            nextSteps={nextSteps}
            onReset={handleReset}
            onSave={handleSave}
            reportText={reportText}
            inputs={formValues}
          />

          {/* SVG Macro breakdown bar chart */}
          <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
              <Heart className="h-4.5 w-4.5 text-primary" /> Daily Macro Breakdown
            </h4>
            <div className="space-y-3">
              <div className="w-full h-5 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${results.macros.carbs.pct}%` }}
                  className="bg-sky-500 h-full hover:opacity-90 transition-opacity"
                  title={`Carbs: ${results.macros.carbs.pct}%`}
                />
                <div
                  style={{ width: `${results.macros.protein.pct}%` }}
                  className="bg-emerald-500 h-full hover:opacity-90 transition-opacity"
                  title={`Protein: ${results.macros.protein.pct}%`}
                />
                <div
                  style={{ width: `${results.macros.fats.pct}%` }}
                  className="bg-amber-500 h-full hover:opacity-90 transition-opacity"
                  title={`Fats: ${results.macros.fats.pct}%`}
                />
              </div>

              <div className="grid grid-cols-3 text-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-sky-500 font-extrabold uppercase">Carbohydrates</span>
                  <span className="text-xs font-bold text-foreground">
                    {Math.round(results.macros.carbs.grams)}g
                  </span>
                  <span className="text-[9px] text-muted-foreground">({results.macros.carbs.pct}%)</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-emerald-500 font-extrabold uppercase">Protein</span>
                  <span className="text-xs font-bold text-foreground">
                    {Math.round(results.macros.protein.grams)}g
                  </span>
                  <span className="text-[9px] text-muted-foreground">({results.macros.protein.pct}%)</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase">Fats</span>
                  <span className="text-xs font-bold text-foreground">
                    {Math.round(results.macros.fats.grams)}g
                  </span>
                  <span className="text-[9px] text-muted-foreground">({results.macros.fats.pct}%)</span>
                </div>
              </div>
            </div>
          </div>

          <CalculationSteps
            steps={[
              `Mifflin-St Jeor BMR Equation for ${formValues.gender}: ${
                formValues.gender === "male"
                  ? `BMR = 10 * Weight (${Math.round(results.bmr - 6.25*175 + 5*28 - 5)}) + 6.25 * Height - 5 * Age + 5`
                  : `BMR = 10 * Weight + 6.25 * Height - 5 * Age - 161`
              } = ${Math.round(results.bmr)} kcal.`,
              `Multiply BMR by physical activity multiplier (${
                formValues.activityLevel === "sedentary"
                  ? "1.2"
                  : formValues.activityLevel === "light"
                  ? "1.375"
                  : formValues.activityLevel === "moderate"
                  ? "1.55"
                  : formValues.activityLevel === "active"
                  ? "1.725"
                  : "1.9"
              }) to calculate Total Daily Energy Expenditure (TDEE): ${Math.round(results.tdee)} kcal.`,
              `Apply deficit/surplus corresponding to weight goal (${formValues.goal}): Target Intake = ${Math.round(
                results.targetCalories
              )} kcal.`,
            ]}
          />

          <FormulaCard
            formula="BMR (Male) = 10W + 6.25H - 5A + 5 | BMR (Female) = 10W + 6.25H - 5A - 161"
            variables={[
              { variable: "W", name: "Weight", desc: "Body weight in kilograms." },
              { variable: "H", name: "Height", desc: "Body height in centimeters." },
              { variable: "A", name: "Age", desc: "Current age in years." },
            ]}
            workedExample={{
              expression: "10 * 70kg + 6.25 * 175cm - 5 * 25y + 5",
              result: "1672 kcal",
              explanation: "A 25-year-old male measuring 175cm and weighing 70kg has a Basal Metabolic Rate of 1,672 kcal.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function CalorieCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Calorie Calculator...</div>}>
      <CalorieCalculatorInner />
    </Suspense>
  );
}
