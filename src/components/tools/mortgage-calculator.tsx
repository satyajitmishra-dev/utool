"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateMortgage, MortgageInput } from "@/lib/calculators/mortgage";
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
import { DollarSign, Table } from "lucide-react";
import Papa from "papaparse";

const STORAGE_KEY = "utool-history-mortgage-calculator";
const PREF_KEY = "utool-pref-mortgage-calculator";

const schema = z.object({
  homePrice: z.number({ message: "Enter home value." }).min(1),
  downPayment: z.number({ message: "Enter down payment." }).min(0),
  isDownPaymentPct: z.boolean(),
  interestRate: z.number({ message: "Enter interest rate." }).min(0).max(100),
  loanTermYears: z.number().min(1).max(50),
  propertyTaxRate: z.number({ message: "Enter tax rate." }).min(0).max(100),
  insuranceAnnual: z.number({ message: "Enter annual insurance." }).min(0),
  hoaMonthly: z.number({ message: "Enter HOA fees." }).min(0),
  extraPaymentMonthly: z.number({ message: "Enter extra payments." }).min(0),
});

type FormData = z.infer<typeof schema>;

function MortgageCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");
  const [showSchedule, setShowSchedule] = useState(false);

  const defaultValues: FormData = {
    homePrice: 400000,
    downPayment: 20,
    isDownPaymentPct: true,
    interestRate: 6.5,
    loanTermYears: 30,
    propertyTaxRate: 1.2,
    insuranceAnnual: 1200,
    hoaMonthly: 150,
    extraPaymentMonthly: 200,
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

    const price = searchParams.get("homePrice");
    const dp = searchParams.get("downPayment");
    const isPct = searchParams.get("isDownPaymentPct");
    const rate = searchParams.get("interestRate");
    const term = searchParams.get("loanTermYears");
    const tax = searchParams.get("propertyTaxRate");
    const ins = searchParams.get("insuranceAnnual");
    const hoa = searchParams.get("hoaMonthly");
    const extra = searchParams.get("extraPaymentMonthly");

    if (price) setValue("homePrice", parseFloat(price));
    if (dp) setValue("downPayment", parseFloat(dp));
    if (isPct) setValue("isDownPaymentPct", isPct === "true");
    if (rate) setValue("interestRate", parseFloat(rate));
    if (term) setValue("loanTermYears", parseInt(term));
    if (tax) setValue("propertyTaxRate", parseFloat(tax));
    if (ins) setValue("insuranceAnnual", parseFloat(ins));
    if (hoa) setValue("hoaMonthly", parseFloat(hoa));
    if (extra) setValue("extraPaymentMonthly", parseFloat(extra));
  }, [searchParams, setValue]);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(formValues));
    } catch (e) {
      console.error(e);
    }
  }, [formValues]);

  const results = calculateMortgage(formValues as MortgageInput);

  const handleReset = () => {
    Object.entries(defaultValues).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setShowSchedule(false);
  };

  const handleSave = () => {
    const title = `Mortgage (₹${formValues.homePrice.toLocaleString()}, ${formValues.interestRate}%, ${formValues.loanTermYears}y)`;
    saveHistory(STORAGE_KEY, title, formValues, results);
  };

  const handleDownloadCsv = () => {
    const csvData = results.schedule.map((row) => ({
      Month: row.month,
      "Payment (₹)": row.payment.toFixed(2),
      "Principal Paid (₹)": row.principalPaid.toFixed(2),
      "Interest Paid (₹)": row.interestPaid.toFixed(2),
      "Remaining Balance (₹)": row.balance.toFixed(2),
      "Cumulative Interest (₹)": row.cumulativeInterest.toFixed(2),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mortgage_amortization_schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    Object.entries(inputs).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setActiveTab("calculate");
  };

  const reportText = `=== HOME MORTGAGE ESTIMATION ===
Home Valuation Price: ₹${formValues.homePrice.toLocaleString()}
Down Payment: ₹${(formValues.isDownPaymentPct ? formValues.homePrice * (formValues.downPayment / 100) : formValues.downPayment).toLocaleString()}
Loan Principal Amount: ₹${results.loanAmount.toLocaleString()}
Interest Rate: ${formValues.interestRate}%
Loan Term: ${formValues.loanTermYears} years

Standard Monthly Payment: ₹${results.totalMonthlyPayment.toFixed(2)}
- Principal & Interest: ₹${results.monthlyPrincipalAndInterest.toFixed(2)}
- Property Taxes: ₹${results.monthlyTax.toFixed(2)}
- Home Insurance: ₹${results.monthlyInsurance.toFixed(2)}
- HOA Dues: ₹${results.monthlyHOA.toFixed(2)}

With Extra Principal (₹${formValues.extraPaymentMonthly}/month):
- Total Monthly Pay: ₹${results.totalMonthlyPaymentWithExtra.toFixed(2)}
- Interest Saved: ₹${results.savingsInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- Time Saved: ${Math.floor(results.timeSavedMonths / 12)} years, ${results.timeSavedMonths % 12} months`;

  const insights: { label: string; value: string; badge?: string }[] = [
    { label: "Loan Principal", value: `₹${Math.round(results.loanAmount).toLocaleString()}` },
    { label: "Total Interest Paid", value: `₹${Math.round(results.totalInterestPaid).toLocaleString()}` },
    { label: "Total Paid (Principal+Int)", value: `₹${Math.round(results.totalPayments).toLocaleString()}` },
  ];

  if (formValues.extraPaymentMonthly > 0) {
    insights.push({
      label: "Extra Payment Savings",
      value: `₹${Math.round(results.savingsInterest).toLocaleString()}`,
      badge: `${Math.floor(results.timeSavedMonths / 12)}y ${results.timeSavedMonths % 12}m saved`,
    });
  }

  // Monthly breakdown for Donut chart
  const pni = results.monthlyPrincipalAndInterest;
  const tax = results.monthlyTax;
  const ins = results.monthlyInsurance;
  const hoa = results.monthlyHOA;
  const totalBill = pni + tax + ins + hoa;

  const pniPct = totalBill > 0 ? (pni / totalBill) * 100 : 0;
  const taxPct = totalBill > 0 ? (tax / totalBill) * 100 : 0;
  const insPct = totalBill > 0 ? (ins / totalBill) * 100 : 0;
  const hoaPct = totalBill > 0 ? (hoa / totalBill) * 100 : 0;

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Mortgage Loan Calculator"
          description="Model monthly house payments, taxes, insurance, and HOA dues, and compare results with extra monthly principal allocations."
        />
      }
      inputs={
        <form className="space-y-4">
          <Controller
            name="homePrice"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Home Valuation Price"
                type="number"
                value={value}
                onChange={onChange}
                prefixText="₹"
                error={errors.homePrice?.message}
                exampleValue={350000}
                onExampleClick={onChange}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="isDownPaymentPct"
              control={control}
              render={({ field }) => (
                <CalculatorSelect
                  label="Down Payment Type"
                  options={[
                    { label: "Percentage (%)", value: "true" },
                    { label: "Absolute Cash ($)", value: "false" },
                  ]}
                  value={String(field.value)}
                  onChange={(val) => field.onChange(val === "true")}
                />
              )}
            />
            <Controller
              name="downPayment"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorInput
                  label="Down Payment Value"
                  type="number"
                  value={value}
                  onChange={onChange}
                  suffixText={formValues.isDownPaymentPct ? "%" : "₹"}
                  error={errors.downPayment?.message}
                  exampleValue={formValues.isDownPaymentPct ? 20 : 70000}
                  onExampleClick={onChange}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="interestRate"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorInput
                  label="Interest Rate"
                  type="number"
                  value={value}
                  onChange={onChange}
                  suffixText="%"
                  error={errors.interestRate?.message}
                  exampleValue={6.875}
                  onExampleClick={onChange}
                />
              )}
            />

            <Controller
              name="loanTermYears"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorSelect
                  label="Loan Term"
                  options={[
                    { label: "30 Years", value: "30" },
                    { label: "20 Years", value: "20" },
                    { label: "15 Years", value: "15" },
                    { label: "10 Years", value: "10" },
                  ]}
                  value={String(value)}
                  onChange={(val) => onChange(parseInt(val))}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Controller
              name="propertyTaxRate"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorInput
                  label="Prop Tax"
                  type="number"
                  value={value}
                  onChange={onChange}
                  suffixText="%"
                  error={errors.propertyTaxRate?.message}
                  exampleValue={1.25}
                  onExampleClick={onChange}
                />
              )}
            />

            <Controller
              name="insuranceAnnual"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorInput
                  label="Home Ins (Yr)"
                  type="number"
                  value={value}
                  onChange={onChange}
                  prefixText="₹"
                  error={errors.insuranceAnnual?.message}
                  exampleValue={1500}
                  onExampleClick={onChange}
                />
              )}
            />

            <Controller
              name="hoaMonthly"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CalculatorInput
                  label="HOA (Mo)"
                  type="number"
                  value={value}
                  onChange={onChange}
                  prefixText="₹"
                  error={errors.hoaMonthly?.message}
                  exampleValue={200}
                  onExampleClick={onChange}
                />
              )}
            />
          </div>

          <Controller
            name="extraPaymentMonthly"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Extra Monthly Principal Payment"
                type="number"
                value={value}
                onChange={onChange}
                prefixText="₹"
                error={errors.extraPaymentMonthly?.message}
                exampleValue={250}
                onExampleClick={onChange}
              />
            )}
          />
        </form>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={`₹${Math.round(results.totalMonthlyPayment).toLocaleString()}`}
            resultLabel="Est. Monthly Payment"
            summary={`Your regular monthly payment resolves to ₹${Math.round(
              results.totalMonthlyPayment
            ).toLocaleString()} (P&I: ₹${Math.round(pni)}, Tax: ₹${Math.round(tax)}, Ins: ₹${Math.round(
              ins
            )}, HOA: ₹${Math.round(hoa)}).`}
            insights={insights}
            onReset={handleReset}
            onSave={handleSave}
            onDownloadCsv={handleDownloadCsv}
            reportText={reportText}
            inputs={formValues}
          />

          {/* SVG Donut Chart for Monthly Bill Split */}
          {results.totalMonthlyPayment > 0 && (
            <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <DollarSign className="h-4.5 w-4.5 text-primary" /> Monthly Payment Breakdown
              </h4>

              <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                {/* SVG Donut */}
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--border)" strokeWidth="3" />
                    
                    {/* P&I Segment */}
                    <circle
                      cx="18" cy="18" r="15.915"
                      fill="transparent"
                      stroke="var(--color-primary)"
                      strokeWidth="3.5"
                      strokeDasharray={`${pniPct} ${100 - pniPct}`}
                      strokeDashoffset="100"
                    />

                    {/* Tax Segment */}
                    <circle
                      cx="18" cy="18" r="15.915"
                      fill="transparent"
                      stroke="rgb(244, 63, 94)" // Rose-500
                      strokeWidth="3.5"
                      strokeDasharray={`${taxPct} ${100 - taxPct}`}
                      strokeDashoffset={`${100 - pniPct}`}
                    />

                    {/* Insurance Segment */}
                    <circle
                      cx="18" cy="18" r="15.915"
                      fill="transparent"
                      stroke="rgb(16, 185, 129)" // Emerald-500
                      strokeWidth="3.5"
                      strokeDasharray={`${insPct} ${100 - insPct}`}
                      strokeDashoffset={`${100 - pniPct - taxPct}`}
                    />

                    {/* HOA Segment */}
                    <circle
                      cx="18" cy="18" r="15.915"
                      fill="transparent"
                      stroke="rgb(245, 158, 11)" // Amber-500
                      strokeWidth="3.5"
                      strokeDasharray={`${hoaPct} ${100 - hoaPct}`}
                      strokeDashoffset={`${100 - pniPct - taxPct - insPct}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Bill</span>
                    <span className="text-sm font-black text-foreground">₹{Math.round(totalBill)}</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="text-[11px] font-bold text-foreground space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-muted-foreground">Principal & Interest:</span>
                    <span>₹{Math.round(pni)} ({pniPct.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-muted-foreground">Property Taxes:</span>
                    <span>₹{Math.round(tax)} ({taxPct.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-muted-foreground">Home Insurance:</span>
                    <span>₹{Math.round(ins)} ({insPct.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-muted-foreground">HOA Dues:</span>
                    <span>₹{Math.round(hoa)} ({hoaPct.toFixed(0)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Amortization Table toggle */}
          <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full flex justify-between items-center text-sm font-bold text-foreground focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <Table className="h-4.5 w-4.5 text-primary" />
                <span>Amortization Schedule</span>
              </div>
              <span className="text-xs text-primary font-bold hover:underline">
                {showSchedule ? "Hide Schedule" : "Show Schedule"}
              </span>
            </button>

            {showSchedule && (
              <div className="overflow-x-auto pt-2 max-h-[300px]">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-bold">
                      <th className="py-2 pr-4">Month</th>
                      <th className="py-2 pr-4">Payment</th>
                      <th className="py-2 pr-4">Principal Paid</th>
                      <th className="py-2 pr-4">Interest Paid</th>
                      <th className="py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.schedule.slice(0, 120).map((row) => (
                      <tr key={row.month} className="border-b border-border/40 hover:bg-muted/10">
                        <td className="py-2 pr-4 font-bold text-foreground">Month {row.month}</td>
                        <td className="py-2 pr-4 text-muted-foreground">₹{Math.round(row.payment).toLocaleString()}</td>
                        <td className="py-2 pr-4 text-indigo-500">+₹{Math.round(row.principalPaid).toLocaleString()}</td>
                        <td className="py-2 pr-4 text-rose-500 font-medium">₹{Math.round(row.interestPaid).toLocaleString()}</td>
                        <td className="py-2 font-bold text-foreground">₹{Math.round(row.balance).toLocaleString()}</td>
                      </tr>
                    ))}
                    {results.schedule.length > 120 && (
                      <tr>
                        <td colSpan={5} className="py-3 text-center text-muted-foreground text-[10px] font-semibold italic">
                          Showing first 120 months. Export CSV to view the full amortization schedule.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <CalculationSteps
            steps={[
              `Principal loan amount is calculated by subtracting down payment from home price: ₹${formValues.homePrice.toLocaleString()} - ₹${(
                formValues.homePrice - results.loanAmount
              ).toLocaleString()} = ₹${results.loanAmount.toLocaleString()}.`,
              `Monthly principal and interest (P&I) is calculated using the amortization formula: ₹${results.monthlyPrincipalAndInterest.toFixed(
                2
              )}/month.`,
              `Add monthly escrow items: tax (₹${results.monthlyTax.toFixed(2)}), insurance (₹${results.monthlyInsurance.toFixed(
                2
              )}), and HOA (₹${results.monthlyHOA.toFixed(2)}) for total monthly payment: ₹${results.totalMonthlyPayment.toFixed(
                2
              )}.`,
            ]}
          />

          <FormulaCard
            formula="M = P * [r(1+r)^n] / [(1+r)^n - 1]"
            variables={[
              { variable: "M", name: "Monthly Payment", desc: "Monthly principal and interest." },
              { variable: "P", name: "Principal Amount", desc: "Starting loan balance." },
              { variable: "r", name: "Monthly Interest", desc: "Annual interest rate divided by 12." },
              { variable: "n", name: "Payments Count", desc: "Total loan term in months." },
            ]}
            workedExample={{
              expression: "300000 * [0.005(1.005)^360] / [(1.005)^360 - 1]",
              result: "₹1,896",
              explanation: "A ₹300,000 principal loan at 6% interest for 30 years costs ₹1,896 in monthly principal and interest.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function MortgageCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Mortgage Calculator...</div>}>
      <MortgageCalculatorInner />
    </Suspense>
  );
}
export default MortgageCalculator;
