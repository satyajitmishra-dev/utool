"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateTip, TipInput } from "@/lib/calculators/tip";
import {
  CalculatorLayout,
  CalculatorHeader,
  CalculatorInput,
  CalculatorSelect,
  CalculatorSlider,
  CalculatorResult,
  CalculationSteps,
  FormulaCard,
  HistoryPanel,
  saveHistory,
} from "./shared/calculator";
import { Coins } from "lucide-react";

const STORAGE_KEY = "utool-history-tip-calculator";
const PREF_KEY = "utool-pref-tip-calculator";

const schema = z.object({
  billAmount: z.number({ message: "Enter bill total." }).min(0),
  tipPct: z.number({ message: "Enter tip percentage." }).min(0).max(100),
  numberOfPeople: z.number({ message: "Enter group size." }).min(1),
  roundMode: z.enum(["none", "tip", "total", "per-person"]),
});

type FormData = z.infer<typeof schema>;

function TipCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");

  const defaultValues: FormData = {
    billAmount: 120,
    tipPct: 15,
    numberOfPeople: 4,
    roundMode: "none",
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

    const bill = searchParams.get("billAmount");
    const tip = searchParams.get("tipPct");
    const people = searchParams.get("numberOfPeople");
    const round = searchParams.get("roundMode");

    if (bill) setValue("billAmount", parseFloat(bill));
    if (tip) setValue("tipPct", parseFloat(tip));
    if (people) setValue("numberOfPeople", parseInt(people));
    if (round) setValue("roundMode", round as any);
  }, [searchParams, setValue]);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(formValues));
    } catch (e) {
      console.error(e);
    }
  }, [formValues]);

  const results = calculateTip(formValues as TipInput);

  const handleReset = () => {
    Object.entries(defaultValues).forEach(([key, val]) => {
      setValue(key as any, val);
    });
  };

  const handleSave = () => {
    const title = `Tip split ($${formValues.billAmount} bill, ${formValues.tipPct}% tip, ${formValues.numberOfPeople} people)`;
    saveHistory(STORAGE_KEY, title, formValues, results);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    Object.entries(inputs).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setActiveTab("calculate");
  };

  const reportText = `=== TIP & BILL SPLIT REPORT ===
Base Bill Amount: ₹${formValues.billAmount.toFixed(2)}
Tip Percentage: ${formValues.tipPct}%
Number of People: ${formValues.numberOfPeople}
Rounding Mode: ${formValues.roundMode}

Total Tip Owed: ₹${results.tipAmount.toFixed(2)}
Total Overall Bill: ₹${results.totalBill.toFixed(2)}
Tip per Person: ₹${results.tipPerPerson.toFixed(2)}
Total Payment per Person: ₹${results.totalPerPerson.toFixed(2)}`;

  const insights = [
    { label: "Total Tip Owed", value: `₹${results.tipAmount.toFixed(2)}` },
    { label: "Total Combined Bill", value: `₹${results.totalBill.toFixed(2)}` },
    { label: "Tip per Person", value: `₹${results.tipPerPerson.toFixed(2)}` },
  ];

  const billPct = results.totalBill > 0 ? (formValues.billAmount / results.totalBill) * 100 : 100;
  const tipPctOfTotal = 100 - billPct;

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Gratuity Tip & Split Calculator"
          description="Evaluate restaurant dining tips, group splitting parameters, and customize rounding options."
        />
      }
      inputs={
        <form className="space-y-4">
          <Controller
            name="billAmount"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Base Bill Total"
                type="number"
                value={value}
                onChange={onChange}
                prefixText="₹"
                error={errors.billAmount?.message}
                exampleValue={85}
                onExampleClick={onChange}
              />
            )}
          />

          <div className="space-y-3">
            <span className="block text-xs font-bold text-foreground">Tip Percentage</span>
            
            {/* Quick preset buttons */}
            <div className="grid grid-cols-4 gap-2 print:hidden">
              {[10, 15, 18, 20].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setValue("tipPct", pct)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    formValues.tipPct === pct
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <Controller
              name="tipPct"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorSlider
                  label="Custom Tip Rate"
                  value={value}
                  onChange={onChange}
                  min={0}
                  max={50}
                  suffixText="%"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="numberOfPeople"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorInput
                  label="Split Bill By (People)"
                  type="number"
                  value={value}
                  onChange={onChange}
                  error={errors.numberOfPeople?.message}
                  exampleValue={4}
                  onExampleClick={onChange}
                />
              )}
            />

            <Controller
              name="roundMode"
              control={control}
              render={({ field }) => (
                <CalculatorSelect
                  label="Rounding Options"
                  options={[
                    { label: "No Rounding", value: "none" },
                    { label: "Round Up Tip Amount", value: "tip" },
                    { label: "Round Up Total Bill", value: "total" },
                    { label: "Round Up Per-Person Payment", value: "per-person" },
                  ]}
                  {...field}
                />
              )}
            />
          </div>
        </form>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={`₹${results.totalPerPerson.toFixed(2)}`}
            resultLabel="Payment per Person"
            summary={`Each of the ${formValues.numberOfPeople} guests pays ₹${results.totalPerPerson.toFixed(
              2
            )} (includes ₹${results.tipPerPerson.toFixed(2)} tip). The total combined bill is ₹${results.totalBill.toFixed(
              2
            )}.`}
            insights={insights}
            onReset={handleReset}
            onSave={handleSave}
            reportText={reportText}
            inputs={formValues}
          />

          {/* Custom SVG bill vs tip horizontal visualizer */}
          {results.totalBill > 0 && (
            <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <Coins className="h-4.5 w-4.5 text-primary" /> Bill vs. Tip Proportion
              </h4>
              <div className="space-y-3">
                <div className="w-full h-5 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${billPct}%` }}
                    className="bg-primary h-full hover:opacity-90 transition-opacity"
                    title={`Base Bill: ${billPct.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${tipPctOfTotal}%` }}
                    className="bg-emerald-500 h-full hover:opacity-90 transition-opacity"
                    title={`Tip: ${tipPctOfTotal.toFixed(1)}%`}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-primary">Base Bill: ₹${formValues.billAmount.toFixed(2)} ({billPct.toFixed(0)}%)</span>
                  <span className="text-emerald-500">Gratuity Tip: ₹${results.tipAmount.toFixed(2)} ({tipPctOfTotal.toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          )}

          <CalculationSteps
            steps={[
              `Calculate raw tip based on tip percentage: ₹${formValues.billAmount.toFixed(2)} × ${
                formValues.tipPct
              }% = ₹${(formValues.billAmount * (formValues.tipPct / 100)).toFixed(2)}.`,
              `Apply rounding adjustments: tip = ₹${results.tipAmount.toFixed(2)}, total = ₹${results.totalBill.toFixed(2)}.`,
              `Divide values by group size (${formValues.numberOfPeople}): tip per person = ₹${results.tipPerPerson.toFixed(
                2
              )}, total per person = ₹${results.totalPerPerson.toFixed(2)}.`,
            ]}
          />

          <FormulaCard
            formula="Tip = Bill * (Tip% / 100) | Total = Bill + Tip | Per Person = Total / People"
            variables={[
              { variable: "Bill", name: "Base Total", desc: "Total price of meal before tip." },
              { variable: "Tip%", name: "Gratuity Rate", desc: "Percentage rate reward." },
              { variable: "People", name: "Split Size", desc: "Number of guests sharing the bill." },
            ]}
            workedExample={{
              expression: "(100 * 1.15) / 4",
              result: "₹28.75 per person",
              explanation: "A ₹100 bill with 15% tip (₹15) split by 4 people costs ₹28.75 per person.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function TipCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Tip Calculator...</div>}>
      <TipCalculatorInner />
    </Suspense>
  );
}
export default TipCalculator;
