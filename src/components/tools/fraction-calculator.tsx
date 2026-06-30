"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateFraction, FractionInput } from "@/lib/calculators/fraction";
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
import { Activity } from "lucide-react";

const STORAGE_KEY = "utool-history-fraction-calculator";
const PREF_KEY = "utool-pref-fraction-calculator";

const fractionPartSchema = z.object({
  whole: z.number(),
  numerator: z.number().min(0),
  denominator: z.number().min(1),
});

const schema = z.object({
  fraction1: fractionPartSchema,
  operation: z.enum(["add", "subtract", "multiply", "divide", "simplify", "to-decimal"]),
  fraction2: fractionPartSchema,
});

type FormData = z.infer<typeof schema>;

function FractionCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");

  const defaultValues: FormData = {
    fraction1: { whole: 0, numerator: 1, denominator: 2 },
    operation: "add",
    fraction2: { whole: 0, numerator: 1, denominator: 3 },
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

    const w1 = searchParams.get("w1");
    const n1 = searchParams.get("n1");
    const d1 = searchParams.get("d1");
    const op = searchParams.get("op");
    const w2 = searchParams.get("w2");
    const n2 = searchParams.get("n2");
    const d2 = searchParams.get("d2");

    if (w1) setValue("fraction1.whole", parseInt(w1));
    if (n1) setValue("fraction1.numerator", parseInt(n1));
    if (d1) setValue("fraction1.denominator", parseInt(d1));
    if (op) setValue("operation", op as any);
    if (w2) setValue("fraction2.whole", parseInt(w2));
    if (n2) setValue("fraction2.numerator", parseInt(n2));
    if (d2) setValue("fraction2.denominator", parseInt(d2));
  }, [searchParams, setValue]);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(formValues));
    } catch (e) {
      console.error(e);
    }
  }, [formValues]);

  const results = calculateFraction(formValues as FractionInput);

  const handleReset = () => {
    Object.entries(defaultValues).forEach(([key, val]) => {
      setValue(key as any, val);
    });
  };

  const handleSave = () => {
    const f1Str = `${formValues.fraction1.whole ? `${formValues.fraction1.whole} ` : ""}${formValues.fraction1.numerator}/${formValues.fraction1.denominator}`;
    const f2Str = `${formValues.fraction2.whole ? `${formValues.fraction2.whole} ` : ""}${formValues.fraction2.numerator}/${formValues.fraction2.denominator}`;
    const title = `Fraction (${f1Str} ${formValues.operation} ${formValues.operation !== "simplify" && formValues.operation !== "to-decimal" ? f2Str : ""})`;
    saveHistory(STORAGE_KEY, title, formValues, results);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    Object.entries(inputs).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setActiveTab("calculate");
  };

  const formattedResult =
    results.result.whole === 0 && results.result.numerator === 0
      ? "0"
      : `${results.result.whole !== 0 ? `${results.result.whole} ` : ""}${
          results.result.numerator > 0 ? `${results.result.numerator}/${results.result.denominator}` : ""
        }`.trim();

  const reportText = `=== FRACTION COMPUTATION REPORT ===
Operation: ${formValues.operation}
Fraction 1: ${formValues.fraction1.whole ? `${formValues.fraction1.whole} ` : ""}${formValues.fraction1.numerator}/${formValues.fraction1.denominator}
Fraction 2: ${formValues.fraction2.whole ? `${formValues.fraction2.whole} ` : ""}${formValues.fraction2.numerator}/${formValues.fraction2.denominator}

Simplified Result: ${formattedResult}
Improper Fraction: ${results.improper.numerator}/${results.improper.denominator}
Decimal Equivalent: ${results.decimal.toFixed(6).replace(/\.?0+$/, "")}`;

  const insights = [
    { label: "Improper Form", value: `${results.improper.numerator}/${results.improper.denominator}` },
    { label: "Decimal Value", value: results.decimal.toFixed(6).replace(/\.?0+$/, "") },
  ];

  const needsSecondFraction = !["simplify", "to-decimal"].includes(formValues.operation);

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Fraction Calculator"
          description="Perform basic arithmetic (add, subtract, multiply, divide) on proper, improper, or mixed fractions with step-by-step simplification."
        />
      }
      inputs={
        <form className="space-y-6">
          <div className="space-y-3">
            <span className="block text-xs font-bold text-foreground">Fraction 1</span>
            <div className="grid grid-cols-3 gap-2">
              <Controller
                name="fraction1.whole"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CalculatorInput label="Whole" type="number" value={value} onChange={onChange} />
                )}
              />
              <Controller
                name="fraction1.numerator"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CalculatorInput label="Numerator" type="number" value={value} onChange={onChange} />
                )}
              />
              <Controller
                name="fraction1.denominator"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CalculatorInput label="Denominator" type="number" value={value} onChange={onChange} />
                )}
              />
            </div>
            {errors.fraction1?.denominator && (
              <p className="text-[10px] text-error font-semibold">Denominator cannot be zero.</p>
            )}
          </div>

          <Controller
            name="operation"
            control={control}
            render={({ field }) => (
              <CalculatorSelect
                label="Operation"
                options={[
                  { label: "Add (+)", value: "add" },
                  { label: "Subtract (-)", value: "subtract" },
                  { label: "Multiply (×)", value: "multiply" },
                  { label: "Divide (÷)", value: "divide" },
                  { label: "Simplify", value: "simplify" },
                  { label: "Convert to Decimal", value: "to-decimal" },
                ]}
                {...field}
              />
            )}
          />

          {needsSecondFraction && (
            <div className="space-y-3">
              <span className="block text-xs font-bold text-foreground">Fraction 2</span>
              <div className="grid grid-cols-3 gap-2">
                <Controller
                  name="fraction2.whole"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CalculatorInput label="Whole" type="number" value={value} onChange={onChange} />
                  )}
                />
                <Controller
                  name="fraction2.numerator"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CalculatorInput label="Numerator" type="number" value={value} onChange={onChange} />
                  )}
                />
                <Controller
                  name="fraction2.denominator"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CalculatorInput label="Denominator" type="number" value={value} onChange={onChange} />
                  )}
                />
              </div>
              {errors.fraction2?.denominator && (
                <p className="text-[10px] text-error font-semibold">Denominator cannot be zero.</p>
              )}
            </div>
          )}
        </form>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={formattedResult}
            resultLabel="Simplified Answer"
            summary={`The result of the operation resolves to the simplified form: ${formattedResult}.`}
            insights={insights}
            onReset={handleReset}
            onSave={handleSave}
            reportText={reportText}
            inputs={formValues}
          />

          <CalculationSteps steps={results.steps} />

          <FormulaCard
            formula="a/b ± c/d = (ad ± bc)/bd | (a/b) * (c/d) = ac/bd | (a/b) ÷ (c/d) = ad/bc"
            variables={[
              { variable: "a, c", name: "Numerators", desc: "Top numbers in fractions." },
              { variable: "b, d", name: "Denominators", desc: "Bottom numbers in fractions (cannot be zero)." },
            ]}
            workedExample={{
              expression: "1/2 + 1/3",
              result: "5/6",
              explanation: "Find common denominator 6. Convert to 3/6 + 2/6 = 5/6.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function FractionCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Fraction Calculator...</div>}>
      <FractionCalculatorInner />
    </Suspense>
  );
}
export default FractionCalculator;
