"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateGpa, GpaInput, STANDARD_GRADE_POINTS } from "@/lib/calculators/gpa";
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
import { Plus, Trash2, GraduationCap, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "utool-history-gpa-calculator";
const PREF_KEY = "utool-pref-gpa-calculator";

const subjectSchema = z.object({
  name: z.string().optional(),
  grade: z.string().min(1),
  credits: z.number().min(0.5, "Credits must be >= 0.5").max(20),
});

const schema = z.object({
  scale: z.enum(["4.0", "4.33"]),
  subjects: z.array(subjectSchema).min(1, "Add at least one subject."),
});

type FormData = z.infer<typeof schema>;

function GpaCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");

  const defaultValues: FormData = {
    scale: "4.0",
    subjects: [
      { name: "Mathematics", grade: "A", credits: 3 },
      { name: "Physics", grade: "B+", credits: 4 },
      { name: "English Lit", grade: "A-", credits: 3 },
    ],
  };

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  const formValues = watch();

  useEffect(() => {
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

    const scale = searchParams.get("scale");
    const subjsParam = searchParams.get("subjects");

    if (scale) setValue("scale", scale as any);
    if (subjsParam) {
      try {
        const parsed = JSON.parse(subjsParam);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setValue("subjects", parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(formValues));
    } catch (e) {
      console.error(e);
    }
  }, [formValues]);

  const results = calculateGpa(formValues as GpaInput);

  const handleReset = () => {
    setValue("scale", defaultValues.scale);
    setValue("subjects", defaultValues.subjects);
  };

  const handleSave = () => {
    const title = `GPA (${results.gpa.toFixed(2)} on ${formValues.scale} Scale, ${results.totalCredits} credits)`;
    saveHistory(STORAGE_KEY, title, formValues, results);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    Object.entries(inputs).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setActiveTab("calculate");
  };

  const reportText = `=== CUMULATIVE GPA REPORT ===
Grading Scale: ${formValues.scale} Scale
Total Credits Attempted: ${results.totalCredits}
Cumulative Grade Points: ${results.totalPoints.toFixed(2)}
Calculated GPA: ${results.gpa.toFixed(3)}

Subject Breakdown:
${results.gradePointsList.map(s => `- ${s.name}: Grade ${s.grade} (${s.credits} Credits)`).join("\n")}`;

  const gradeOptions = Object.keys(STANDARD_GRADE_POINTS).map((g) => ({
    label: g,
    value: g,
  }));

  const baseGradesList = ["A", "B", "C", "D", "F"];

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="GPA Semester Calculator"
          description="Translate your letter grades and credit hours into a cumulative weighted GPA with subject level breakdowns."
        />
      }
      inputs={
        <form className="space-y-6">
          <Controller
            name="scale"
            control={control}
            render={({ field }) => (
              <CalculatorSelect
                label="Grading Scale"
                options={[
                  { label: "Standard 4.0 Scale", value: "4.0" },
                  { label: "Weighted 4.33 Scale", value: "4.33" },
                ]}
                {...field}
              />
            )}
          />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-foreground">Subjects List</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", grade: "A", credits: 3 })}
                className="h-8 px-3 text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Course
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-end border border-border/40 p-3 rounded-xl bg-muted/5 relative group"
                >
                  <div className="col-span-5">
                    <Controller
                      name={`subjects.${idx}.name`}
                      control={control}
                      render={({ field }) => (
                        <CalculatorInput
                          label="Course Name"
                          placeholder={`Course ${idx + 1}`}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-3">
                    <Controller
                      name={`subjects.${idx}.grade`}
                      control={control}
                      render={({ field }) => (
                        <CalculatorSelect label="Grade" options={gradeOptions} {...field} />
                      )}
                    />
                  </div>
                  <div className="col-span-3">
                    <Controller
                      name={`subjects.${idx}.credits`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CalculatorInput
                          label="Credits"
                          type="number"
                          step="0.5"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => fields.length > 1 && remove(idx)}
                      className="p-2 hover:bg-error/15 text-muted-foreground hover:text-error rounded-lg transition shrink-0"
                      disabled={fields.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {errors.subjects?.message && (
              <p className="text-[10px] text-error font-semibold">{errors.subjects.message}</p>
            )}
          </div>
        </form>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={results.gpa.toFixed(2)}
            resultLabel="Cumulative GPA"
            summary={`Your calculated GPA is ${results.gpa.toFixed(3)} across ${
              results.totalCredits
            } credits with a total of ${results.totalPoints.toFixed(1)} earned grade points.`}
            insights={[
              { label: "Total Credit Hours", value: `${results.totalCredits} credits` },
              { label: "Total Grade Points", value: results.totalPoints.toFixed(2) },
            ]}
            onReset={handleReset}
            onSave={handleSave}
            reportText={reportText}
            inputs={formValues}
          />

          {/* GPA grade distribution visualizer */}
          {results.totalCredits > 0 && (
            <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <BarChart className="h-4.5 w-4.5 text-primary" /> Grade Distribution
              </h4>
              <div className="space-y-2.5">
                {baseGradesList.map((grade) => {
                  const count = results.gradeDistribution[grade] || 0;
                  const totalCourses = formValues.subjects.length;
                  const pct = totalCourses > 0 ? (count / totalCourses) * 100 : 0;
                  return (
                    <div key={grade} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                        <span>Grade {grade}</span>
                        <span>
                          {count} course{count !== 1 ? "s" : ""} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="bg-primary h-full rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <CalculationSteps
            steps={[
              `Map grades to point values: ${results.gradePointsList
                .map((s) => `${s.grade} = ${(s.points / (s.credits || 1)).toFixed(2)}`)
                .slice(0, 3)
                .join(", ")}${results.gradePointsList.length > 3 ? "..." : ""}.`,
              `Multiply grade point values by credit hours to compute credit points per course: total cumulative points = ${results.totalPoints.toFixed(
                2
              )}.`,
              `Divide cumulative points by total credit hours (${results.totalCredits}) to obtain the final GPA: ${results.gpa.toFixed(
                3
              )}.`,
            ]}
          />

          <FormulaCard
            formula="GPA = Sum(Grade Points * Credits) / Sum(Credits)"
            variables={[
              { variable: "Grade Points", name: "Value Weight", desc: "Numerical value mapped to letter grades (e.g. A=4.0)." },
              { variable: "Credits", name: "Weight Size", desc: "Credits allotted to the course." },
            ]}
            workedExample={{
              expression: "(4.0 * 3 + 3.0 * 4) / (3 + 4)",
              result: "3.43 GPA",
              explanation: "Having an A (3 credits) and a B (4 credits) yields a GPA of 3.43.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function GpaCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading GPA Calculator...</div>}>
      <GpaCalculatorInner />
    </Suspense>
  );
}
export default GpaCalculator;
