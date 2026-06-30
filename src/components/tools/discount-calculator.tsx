"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateDiscount, DiscountInput } from "@/lib/calculators/discount";
import {
  CalculatorLayout,
  CalculatorHeader,
  CalculatorInput,
  CalculatorResult,
  CalculationSteps,
  FormulaCard,
  HistoryPanel,
  saveHistory,
} from "./shared/calculator";
import { Tag } from "lucide-react";

const STORAGE_KEY = "utool-history-discount-calculator";
const PREF_KEY = "utool-pref-discount-calculator";

const schema = z.object({
  originalPrice: z.number({ message: "Enter original price." }).min(0),
  discountPct: z.number({ message: "Enter discount rate." }).min(0).max(100),
  additionalDiscountPct: z.number({ message: "Enter stacked discount rate." }).min(0).max(100),
  taxPct: z.number({ message: "Enter sales tax." }).min(0).max(100),
});

type FormData = z.infer<typeof schema>;

function DiscountCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");

  const defaultValues: FormData = {
    originalPrice: 150,
    discountPct: 20,
    additionalDiscountPct: 10,
    taxPct: 8.25,
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

    const price = searchParams.get("originalPrice");
    const d1 = searchParams.get("discountPct");
    const d2 = searchParams.get("additionalDiscountPct");
    const tax = searchParams.get("taxPct");

    if (price) setValue("originalPrice", parseFloat(price));
    if (d1) setValue("discountPct", parseFloat(d1));
    if (d2) setValue("additionalDiscountPct", parseFloat(d2));
    if (tax) setValue("taxPct", parseFloat(tax));
  }, [searchParams, setValue]);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(formValues));
    } catch (e) {
      console.error(e);
    }
  }, [formValues]);

  const results = calculateDiscount(formValues as DiscountInput);

  const handleReset = () => {
    Object.entries(defaultValues).forEach(([key, val]) => {
      setValue(key as any, val);
    });
  };

  const handleSave = () => {
    const title = `Discount ($${formValues.originalPrice.toLocaleString()}, -${formValues.discountPct}% ${formValues.additionalDiscountPct ? `+ -${formValues.additionalDiscountPct}%` : ""})`;
    saveHistory(STORAGE_KEY, title, formValues, results);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    Object.entries(inputs).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setActiveTab("calculate");
  };

  const reportText = `=== SALES DISCOUNT REPORT ===
Original Price: ₹${formValues.originalPrice.toFixed(2)}
Main Discount: ${formValues.discountPct}%
Additional Discount (Stacked): ${formValues.additionalDiscountPct}%
Sales Tax: ${formValues.taxPct}%

Total Savings: ₹${results.savings.toFixed(2)}
Sales Tax Amount: ₹${results.taxAmount.toFixed(2)}
Final Net Price: ₹${results.finalPrice.toFixed(2)}
Overall Discount Rate: ${results.totalDiscountPct.toFixed(1)}%`;

  const insights = [
    { label: "You Save", value: `₹${results.savings.toFixed(2)}`, badge: `-${results.totalDiscountPct.toFixed(0)}% Off` },
    { label: "Tax Amount", value: `₹${results.taxAmount.toFixed(2)}` },
    { label: "First Discounted Price", value: `₹${results.firstDiscountedPrice.toFixed(2)}` },
    { label: "Tax-Free Price", value: `₹${results.secondDiscountedPrice.toFixed(2)}` },
  ];

  const payPct = formValues.originalPrice > 0 ? (results.finalPrice / formValues.originalPrice) * 100 : 0;
  const savePct = 100 - payPct;

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Discount Price Calculator"
          description="Evaluate ultimate savings on sales items under single or double stacked percentages with local sales tax inclusions."
        />
      }
      inputs={
        <form className="space-y-4">
          <Controller
            name="originalPrice"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Original Regular Price"
                type="number"
                value={value}
                onChange={onChange}
                prefixText="₹"
                error={errors.originalPrice?.message}
                exampleValue={100}
                onExampleClick={onChange}
              />
            )}
          />

          <Controller
            name="discountPct"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Discount Percentage"
                type="number"
                value={value}
                onChange={onChange}
                suffixText="%"
                error={errors.discountPct?.message}
                exampleValue={25}
                onExampleClick={onChange}
              />
            )}
          />

          <Controller
            name="additionalDiscountPct"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Additional Stacked Discount (Optional)"
                type="number"
                value={value}
                onChange={onChange}
                suffixText="%"
                error={errors.additionalDiscountPct?.message}
                exampleValue={10}
                onExampleClick={onChange}
              />
            )}
          />

          <Controller
            name="taxPct"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Sales Tax Percentage"
                type="number"
                value={value}
                onChange={onChange}
                suffixText="%"
                error={errors.taxPct?.message}
                exampleValue={7.5}
                onExampleClick={onChange}
              />
            )}
          />
        </form>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={`₹${results.finalPrice.toFixed(2)}`}
            resultLabel="Final Price to Pay"
            summary={`You pay ₹${results.finalPrice.toFixed(2)} after saving ₹${results.savings.toFixed(
              2
            )} off the original price of ₹${formValues.originalPrice.toFixed(2)}.`}
            insights={insights}
            onReset={handleReset}
            onSave={handleSave}
            reportText={reportText}
            inputs={formValues}
          />

          {/* Stacked savings horizontal bar chart */}
          {formValues.originalPrice > 0 && (
            <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <Tag className="h-4.5 w-4.5 text-primary" /> Savings Visualization
              </h4>
              <div className="space-y-3">
                <div className="w-full h-5 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.max(0, Math.min(100, payPct))}%` }}
                    className="bg-primary h-full hover:opacity-90 transition-opacity"
                    title={`Paid: ${payPct.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${Math.max(0, Math.min(100, savePct))}%` }}
                    className="bg-emerald-500 h-full hover:opacity-90 transition-opacity"
                    title={`Saved: ${savePct.toFixed(1)}%`}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-primary">Paid: ₹${results.finalPrice.toFixed(2)} ({payPct.toFixed(0)}%)</span>
                  <span className="text-emerald-500">Saved: ₹${results.savings.toFixed(2)} ({savePct.toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          )}

          <CalculationSteps
            steps={[
              `Apply first discount: ₹${formValues.originalPrice.toFixed(2)} × (1 - ${formValues.discountPct / 100}) = ₹${results.firstDiscountedPrice.toFixed(2)}.`,
              `Apply stacked discount on markdown price: ₹${results.firstDiscountedPrice.toFixed(2)} × (1 - ${
                (formValues.additionalDiscountPct || 0) / 100
              }) = ₹${results.secondDiscountedPrice.toFixed(2)}.`,
              `Calculate tax: ₹${results.secondDiscountedPrice.toFixed(2)} × ${(formValues.taxPct || 0) / 100} = ₹${results.taxAmount.toFixed(2)}.`,
              `Final total price: ₹${results.secondDiscountedPrice.toFixed(2)} + ₹${results.taxAmount.toFixed(2)} = ₹${results.finalPrice.toFixed(2)}.`,
            ]}
          />

          <FormulaCard
            formula="P_final = [P_original * (1 - d1/100) * (1 - d2/100)] * (1 + tax/100)"
            variables={[
              { variable: "P_original", name: "Original Price", desc: "Starting retail tag price." },
              { variable: "d1", name: "First Discount", desc: "Primary reduction rate." },
              { variable: "d2", name: "Second Discount", desc: "Stacked markdown rate." },
              { variable: "tax", name: "Sales Tax", desc: "Percentage sales levy." },
            ]}
            workedExample={{
              expression: "[100 * (1 - 0.20) * (1 - 0.10)] * (1 + 0.08)",
              result: "₹77.76",
              explanation: "₹100 item with 20% off plus an extra 10% off and 8% tax totals ₹77.76.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function DiscountCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Discount Calculator...</div>}>
      <DiscountCalculatorInner />
    </Suspense>
  );
}
export default DiscountCalculator;
