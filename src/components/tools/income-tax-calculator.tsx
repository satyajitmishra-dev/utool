"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateIncomeTax, IncomeTaxInput } from "@/lib/calculators/income-tax";
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
import { Landmark, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "utool-history-tax-calculator";
const PREF_KEY = "utool-pref-tax-calculator";

const schema = z.object({
  annualIncome: z.number({ message: "Enter annual income." }).min(0),
  deductions: z.number({ message: "Enter deductions." }).min(0),
  country: z.enum(["usa", "uk", "canada", "india", "custom"]),
  filingStatus: z.enum(["single", "married"]),
});

type FormData = z.infer<typeof schema>;

function IncomeTaxCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");

  const defaultValues: FormData = {
    annualIncome: 1200000,
    deductions: 75000,
    country: "india",
    filingStatus: "single",
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

    const income = searchParams.get("annualIncome");
    const deductions = searchParams.get("deductions");
    const country = searchParams.get("country");
    const filing = searchParams.get("filingStatus");

    if (income) setValue("annualIncome", parseFloat(income));
    if (deductions) setValue("deductions", parseFloat(deductions));
    if (country) setValue("country", country as any);
    if (filing) setValue("filingStatus", filing as any);
  }, [searchParams, setValue]);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(formValues));
    } catch (e) {
      console.error(e);
    }
  }, [formValues]);

  const results = calculateIncomeTax(formValues as IncomeTaxInput);

  const handleReset = () => {
    Object.entries(defaultValues).forEach(([key, val]) => {
      setValue(key as any, val);
    });
  };

  const handleSave = () => {
    const title = `Income Tax (${formValues.country.toUpperCase()}, $${formValues.annualIncome.toLocaleString()} Income)`;
    saveHistory(STORAGE_KEY, title, formValues, results);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    Object.entries(inputs).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setActiveTab("calculate");
  };

  const reportText = `=== PROGRESSIVE INCOME TAX ESTIMATE ===
Country Preset: ${formValues.country.toUpperCase()}
Filing Status: ${formValues.filingStatus}
Annual Income: ${results.currencySymbol}${formValues.annualIncome.toLocaleString()}
Standard / Custom Deductions: ${results.currencySymbol}${formValues.deductions.toLocaleString()}
Taxable Income: ${results.currencySymbol}${results.taxableIncome.toLocaleString()}

Estimated Tax Owed: ${results.currencySymbol}${results.estimatedTaxPayable.toLocaleString()}
Effective Tax Rate: ${results.effectiveTaxRate.toFixed(2)}%
Net Take-Home Pay: ${results.currencySymbol}${results.netIncome.toLocaleString()}`;

  const insights = [
    { label: "Taxable Base", value: `${results.currencySymbol}${Math.round(results.taxableIncome).toLocaleString()}` },
    { label: "Net Take-Home Pay", value: `${results.currencySymbol}${Math.round(results.netIncome).toLocaleString()}` },
    { label: "Effective Tax Rate", value: `${results.effectiveTaxRate.toFixed(2)}%` },
  ];

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Income Tax Calculator"
          description="Estimate your federal income tax liabilities, progressive tax bracket distributions, and net take-home salary."
        />
      }
      inputs={
        <form className="space-y-4">
          <Controller
            name="annualIncome"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Gross Annual Income"
                type="number"
                value={value}
                onChange={onChange}
                prefixText={results.currencySymbol}
                error={errors.annualIncome?.message}
                exampleValue={85000}
                onExampleClick={onChange}
              />
            )}
          />

          <Controller
            name="deductions"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Standard & Itemized Deductions"
                type="number"
                value={value}
                onChange={onChange}
                prefixText={results.currencySymbol}
                error={errors.deductions?.message}
                exampleValue={14600}
                onExampleClick={onChange}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CalculatorSelect
                  label="Country / Brackets Preset"
                  options={[
                    { label: "United States (US)", value: "usa" },
                    { label: "United Kingdom (UK)", value: "uk" },
                    { label: "Canada (CA)", value: "canada" },
                    { label: "India (IN New Regime)", value: "india" },
                  ]}
                  {...field}
                />
              )}
            />

            {formValues.country === "usa" ? (
              <Controller
                name="filingStatus"
                control={control}
                render={({ field }) => (
                  <CalculatorSelect
                    label="Filing Status"
                    options={[
                      { label: "Single", value: "single" },
                      { label: "Married Filing Jointly", value: "married" },
                    ]}
                    {...field}
                  />
                )}
              />
            ) : (
              <div className="flex flex-col space-y-1.5 opacity-50 select-none">
                <span className="text-xs font-bold text-foreground">Filing Status</span>
                <div className="rounded-xl border border-border bg-card/40 px-4 py-2.5 text-xs text-muted-foreground">
                  N/A for this region
                </div>
              </div>
            )}
          </div>
        </form>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={`${results.currencySymbol}${Math.round(results.estimatedTaxPayable).toLocaleString()}`}
            resultLabel="Estimated Income Tax Owed"
            summary={`Based on ${formValues.country.toUpperCase()} tax rules, you owe ${
              results.currencySymbol
            }${Math.round(results.estimatedTaxPayable).toLocaleString()} in income taxes. Your estimated effective tax rate is ${results.effectiveTaxRate.toFixed(
              2
            )}%.`}
            insights={insights}
            onReset={handleReset}
            onSave={handleSave}
            reportText={reportText}
            inputs={formValues}
          />

          {/* Tax bracket list distribution visualizer */}
          {results.taxableIncome > 0 && (
            <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <Landmark className="h-4.5 w-4.5 text-primary" /> Tax Incurred by Bracket
              </h4>
              <div className="space-y-3">
                {results.bracketBreakdown.map((row, idx) => {
                  const maxAmt = results.taxableIncome || 1;
                  const fillPct = (row.taxableInBracket / maxAmt) * 100;
                  if (row.taxableInBracket === 0) return null;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                        <span>
                          Bracket {row.range} ({row.rate}%)
                        </span>
                        <span>
                          Taxed: {results.currencySymbol}
                          {Math.round(row.taxableInBracket).toLocaleString()} → Tax: {results.currencySymbol}
                          {Math.round(row.taxInBracket).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.max(2, fillPct)}%` }}
                          className="bg-indigo-500 h-full rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Disclaimer section */}
          <div className="border border-amber-100 dark:border-amber-950/20 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl p-4 flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
              <strong>Disclaimer:</strong> This calculator provides an estimate of federal taxes for illustrative purposes. It does not account for state, local, municipal, or regional taxes, specific tax deductions, credits, or surcharges. Please consult a qualified tax professional or CPA for filing guidance.
            </p>
          </div>

          <CalculationSteps
            steps={[
              `Subtract standard/itemized deductions ($${formValues.deductions.toLocaleString()}) from gross annual income ($${formValues.annualIncome.toLocaleString()}) to compute taxable income: $${results.taxableIncome.toLocaleString()}.`,
              `Pass taxable income progressively through marginal brackets: ${results.bracketBreakdown
                .filter((r) => r.taxableInBracket > 0)
                .map((r) => `${r.rate}% on first $${Math.round(r.taxableInBracket).toLocaleString()}`)
                .join(", ")}.`,
              `Sum the taxes calculated in each bracket to determine your total estimated tax: ${
                results.currencySymbol
              }${Math.round(results.estimatedTaxPayable).toLocaleString()}.`,
            ]}
          />

          <FormulaCard
            formula="Taxable Income = Income - Deductions | Tax = Sum(Taxable_Bracket_i * Rate_i)"
            variables={[
              { variable: "Income", name: "Gross Salary", desc: "Total annual salary before taxes." },
              { variable: "Deductions", name: "Reductions", desc: "Tax write-offs and standard allowances." },
              { variable: "Rate_i", name: "Marginal Rate", desc: "Tax rate for bracket level i." },
            ]}
            workedExample={{
              expression: "USA 2025 brackets progressive evaluation",
              result: "$11,600 taxed at 10%, balance taxed at 12%",
              explanation: "Progressive taxing means only the money falling into a bracket is taxed at that rate.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function IncomeTaxCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Tax Calculator...</div>}>
      <IncomeTaxCalculatorInner />
    </Suspense>
  );
}
export default IncomeTaxCalculator;
