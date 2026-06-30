"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateDateDiff, adjustDate, DateDiffInput, DateAdjustInput } from "@/lib/calculators/date";
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
import { CalendarRange } from "lucide-react";

const STORAGE_KEY = "utool-history-date-calculator";
const PREF_KEY = "utool-pref-date-calculator";

const schema = z.object({
  mode: z.enum(["diff", "adjust"]),
  // Diff fields
  startDate: z.string(),
  endDate: z.string(),
  includeEndDate: z.boolean(),
  // Adjust fields
  adjustStartDate: z.string(),
  amount: z.number({ message: "Enter an amount." }).min(0),
  unit: z.enum(["days", "business-days", "weeks", "months", "years"]),
  operation: z.enum(["add", "subtract"]),
});

type FormData = z.infer<typeof schema>;

function DateCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");

  const todayStr = new Date().toISOString().split("T")[0];
  const nextMonthStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const defaultValues: FormData = {
    mode: "diff",
    startDate: todayStr,
    endDate: nextMonthStr,
    includeEndDate: false,
    adjustStartDate: todayStr,
    amount: 10,
    unit: "days",
    operation: "add",
  };

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
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

    const mode = searchParams.get("mode");
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    const inc = searchParams.get("includeEndDate");
    const adjStart = searchParams.get("adjustStartDate");
    const amt = searchParams.get("amount");
    const unit = searchParams.get("unit");
    const op = searchParams.get("operation");

    if (mode) setValue("mode", mode as any);
    if (start) setValue("startDate", start);
    if (end) setValue("endDate", end);
    if (inc) setValue("includeEndDate", inc === "true");
    if (adjStart) setValue("adjustStartDate", adjStart);
    if (amt) setValue("amount", parseInt(amt));
    if (unit) setValue("unit", unit as any);
    if (op) setValue("operation", op as any);
  }, [searchParams, setValue]);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(formValues));
    } catch (e) {
      console.error(e);
    }
  }, [formValues]);

  // Perform Calculations
  const isDiffMode = formValues.mode === "diff";
  
  const diffResults = calculateDateDiff({
    startDate: formValues.startDate,
    endDate: formValues.endDate,
    includeEndDate: formValues.includeEndDate,
  });

  const adjustResults = adjustDate({
    startDate: formValues.adjustStartDate,
    amount: formValues.amount,
    unit: formValues.unit,
    operation: formValues.operation,
  });

  const handleReset = () => {
    Object.entries(defaultValues).forEach(([key, val]) => {
      setValue(key as any, val);
    });
  };

  const handleSave = () => {
    const title = isDiffMode
      ? `Date Diff (${formValues.startDate} to ${formValues.endDate})`
      : `Date Adjust (${formValues.adjustStartDate} ${formValues.operation === "add" ? "+" : "-"} ${formValues.amount} ${formValues.unit})`;
    const results = isDiffMode ? diffResults : adjustResults;
    saveHistory(STORAGE_KEY, title, formValues, results);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    Object.entries(inputs).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setActiveTab("calculate");
  };

  const reportText = isDiffMode
    ? `=== DATE DIFFERENCE REPORT ===
Start Date: ${formValues.startDate}
End Date: ${formValues.endDate}
Include End Date: ${formValues.includeEndDate ? "Yes" : "No"}

Total Duration: ${diffResults.totalDays} Days
Business Days (Mon-Fri): ${diffResults.businessDays} Days
Weekend Days: ${diffResults.weekendDays} Days
Weeks: ${diffResults.weeks}
Breakdown: ${diffResults.breakdownString}`
    : `=== DATE ADJUSTMENT REPORT ===
Start Date: ${formValues.adjustStartDate}
Operation: ${formValues.operation === "add" ? "Add" : "Subtract"}
Amount: ${formValues.amount} ${formValues.unit}

Resulting Date: ${adjustResults.resultDate} (${adjustResults.dayOfWeek})
Explanation: ${adjustResults.explanation}`;

  const insights = isDiffMode
    ? [
        { label: "Working Business Days", value: `${diffResults.businessDays} days` },
        { label: "Total Weekend Days", value: `${diffResults.weekendDays} days` },
        { label: "Calendar Duration", value: diffResults.breakdownString },
        { label: "Week/Month Breakdown", value: `${diffResults.weeks} weeks / ${diffResults.months} months` },
      ]
    : [
        { label: "Day of Week", value: adjustResults.dayOfWeek },
        { label: "Leap Year State", value: adjustResults.isLeap ? "Leap Year" : "Standard Year" },
      ];

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Date & Time Calculator"
          description="Determine the duration between calendar dates (excluding weekends) or compute a target date by adding or subtracting calendar offsets."
        />
      }
      inputs={
        <form className="space-y-4">
          <Controller
            name="mode"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5 w-full">
                <span className="block text-xs font-bold text-foreground">Calculator Mode</span>
                <div className="grid grid-cols-2 border border-border rounded-xl p-0.5 bg-muted/20">
                  <button
                    type="button"
                    onClick={() => field.onChange("diff")}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      isDiffMode ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Count Days
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("adjust")}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      !isDiffMode ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Add/Subtract
                  </button>
                </div>
              </div>
            )}
          />

          {isDiffMode ? (
            <>
              <Controller
                name="startDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CalculatorInput
                    label="Start Date"
                    type="date"
                    value={value}
                    onChange={onChange}
                    error={errors.startDate?.message}
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CalculatorInput
                    label="End Date"
                    type="date"
                    value={value}
                    onChange={onChange}
                    error={errors.endDate?.message}
                  />
                )}
              />

              <Controller
                name="includeEndDate"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="rounded border-border bg-card text-primary focus:ring-primary h-4 w-4"
                    />
                    Include end date in calculation (+1 day)
                  </label>
                )}
              />
            </>
          ) : (
            <>
              <Controller
                name="adjustStartDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CalculatorInput
                    label="Base Start Date"
                    type="date"
                    value={value}
                    onChange={onChange}
                    error={errors.adjustStartDate?.message}
                  />
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="operation"
                  control={control}
                  render={({ field }) => (
                    <CalculatorSelect
                      label="Operation"
                      options={[
                        { label: "Add", value: "add" },
                        { label: "Subtract", value: "subtract" },
                      ]}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <CalculatorSelect
                      label="Time Offset Unit"
                      options={[
                        { label: "Calendar Days", value: "days" },
                        { label: "Business Days", value: "business-days" },
                        { label: "Weeks", value: "weeks" },
                        { label: "Months", value: "months" },
                        { label: "Years", value: "years" },
                      ]}
                      {...field}
                    />
                  )}
                />
              </div>

              <Controller
                name="amount"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CalculatorInput
                    label="Quantity/Offset Value"
                    type="number"
                    value={value}
                    onChange={onChange}
                    error={errors.amount?.message}
                  />
                )}
              />
            </>
          )}
        </form>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={isDiffMode ? `${diffResults.totalDays} Days` : adjustResults.resultDate}
            resultLabel={isDiffMode ? "Total Days" : "Calculated Date"}
            summary={isDiffMode ? `Difference matches ${diffResults.breakdownString}.` : adjustResults.explanation}
            insights={insights}
            onReset={handleReset}
            onSave={handleSave}
            reportText={reportText}
            inputs={formValues}
          />

          <CalculationSteps
            steps={
              isDiffMode
                ? [
                    `Compute raw calendar difference: ${diffResults.totalDays} total days.`,
                    `Identify weekend days: ${diffResults.weekendDays} days, leaving ${diffResults.businessDays} business days.`,
                    `Convert intervals to standard weeks (${diffResults.weeks} weeks) and months (${diffResults.months} months).`,
                  ]
                : [
                    `Identify start date: ${formValues.adjustStartDate}.`,
                    `Apply mathematical shift of ${formValues.amount} ${formValues.unit} (${
                      formValues.operation === "add" ? "forward" : "backward"
                    }).`,
                    `Resulting date resolves to ${adjustResults.resultDate} (${adjustResults.dayOfWeek}).`,
                  ]
            }
          />

          <FormulaCard
            formula={isDiffMode ? "T_days = Date_2 - Date_1 (+ 1 if inclusive)" : "Date_res = Date_start ± Offset * Unit"}
            variables={[
              { variable: "Date_1", name: "Start Date", desc: "First calendar date point." },
              { variable: "Date_2", name: "End Date", desc: "Terminal calendar date point." },
              { variable: "Offset", name: "Quantity", desc: "Volume size of time adjustment." },
            ]}
            workedExample={{
              expression: "Dec 31, 2026 - Dec 25, 2026",
              result: "6 days",
              explanation: "Counting days from Christmas to New Year's Eve yields a difference of exactly 6 calendar days.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function DateCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Date Calculator...</div>}>
      <DateCalculatorInner />
    </Suspense>
  );
}
export default DateCalculator;
