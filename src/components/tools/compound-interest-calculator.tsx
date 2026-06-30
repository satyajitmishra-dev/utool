"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateCompoundInterest, CompoundInterestInput } from "@/lib/calculators/compound-interest";
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
import { BarChart3, Table } from "lucide-react";
import Papa from "papaparse";

const STORAGE_KEY = "utool-history-compound-calculator";
const PREF_KEY = "utool-pref-compound-calculator";

const schema = z.object({
  initialInvestment: z.number({ message: "Enter initial amount." }).min(0),
  monthlyContribution: z.number({ message: "Enter monthly addition." }).min(0),
  interestRate: z.number({ message: "Enter interest rate." }).min(0).max(100),
  compoundFrequency: z.enum(["annually", "semi-annually", "quarterly", "monthly", "daily"]),
  investmentPeriod: z.number().min(1).max(50),
});

type FormData = z.infer<typeof schema>;

function CompoundInterestCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");
  const [showSchedule, setShowSchedule] = useState(false);

  const defaultValues: FormData = {
    initialInvestment: 10000,
    monthlyContribution: 200,
    interestRate: 8,
    compoundFrequency: "monthly",
    investmentPeriod: 10,
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

    const init = searchParams.get("initialInvestment");
    const contribution = searchParams.get("monthlyContribution");
    const rate = searchParams.get("interestRate");
    const freq = searchParams.get("compoundFrequency");
    const period = searchParams.get("investmentPeriod");

    if (init) setValue("initialInvestment", parseFloat(init));
    if (contribution) setValue("monthlyContribution", parseFloat(contribution));
    if (rate) setValue("interestRate", parseFloat(rate));
    if (freq) setValue("compoundFrequency", freq as any);
    if (period) setValue("investmentPeriod", parseInt(period));
  }, [searchParams, setValue]);

  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(formValues));
    } catch (e) {
      console.error(e);
    }
  }, [formValues]);

  const results = calculateCompoundInterest(formValues as CompoundInterestInput);

  const handleReset = () => {
    Object.entries(defaultValues).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setShowSchedule(false);
  };

  const handleSave = () => {
    const title = `Compound (₹${formValues.initialInvestment.toLocaleString()}, ${formValues.interestRate}%, ${formValues.investmentPeriod}y)`;
    saveHistory(STORAGE_KEY, title, formValues, results);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    Object.entries(inputs).forEach(([key, val]) => {
      setValue(key as any, val);
    });
    setActiveTab("calculate");
  };

  const handleDownloadCsv = () => {
    const csvData = results.schedule.map((row) => ({
      Year: row.year,
      "Total Invested (₹)": row.totalContributions.toFixed(2),
      "Interest Earned (₹)": row.interestEarned.toFixed(2),
      "End Balance (₹)": row.balance.toFixed(2),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `compound_interest_schedule_${formValues.investmentPeriod}y.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportText = `=== COMPOUND INTEREST GROWTH REPORT ===
Initial Principal: ₹${formValues.initialInvestment.toLocaleString()}
Monthly Deposit: ₹${formValues.monthlyContribution.toLocaleString()}
Annual Interest Rate: ${formValues.interestRate}%
Compounding Frequency: ${formValues.compoundFrequency}
Period: ${formValues.investmentPeriod} years

Total Invested Capital: ₹${results.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Total Interest Earned: ₹${results.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Final Growth Balance: ₹${results.finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // SVG Chart Dimensions & Computations
  const width = 500;
  const height = 220;
  const padding = 35;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(results.finalBalance, 1000);
  const totalYears = results.schedule.length - 1;

  // Build SVG polygon points
  const pointsBalance: string[] = [];
  const pointsInvested: string[] = [];

  results.schedule.forEach((row) => {
    const x = padding + (row.year / totalYears) * chartWidth;
    const yBalance = padding + chartHeight - (row.balance / maxVal) * chartHeight;
    const yInvested = padding + chartHeight - (row.totalContributions / maxVal) * chartHeight;

    pointsBalance.push(`${x},${yBalance}`);
    pointsInvested.push(`${x},${yInvested}`);
  });

  const pathBalance = pointsBalance.join(" ");
  const pathInvested = pointsInvested.join(" ");
  const areaBalance = `${padding},${padding + chartHeight} ${pathBalance} ${padding + chartWidth},${padding + chartHeight}`;
  const areaInvested = `${padding},${padding + chartHeight} ${pathInvested} ${padding + chartWidth},${padding + chartHeight}`;

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Compound Interest Calculator"
          description="Model your portfolio's growth over time under compounding rates of return with optional recurring monthly additions."
        />
      }
      inputs={
        <form className="space-y-4">
          <Controller
            name="initialInvestment"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Initial Investment"
                type="number"
                value={value}
                onChange={onChange}
                prefixText="₹"
                error={errors.initialInvestment?.message}
                exampleValue={10000}
                onExampleClick={onChange}
              />
            )}
          />

          <Controller
            name="monthlyContribution"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Monthly Contribution"
                type="number"
                value={value}
                onChange={onChange}
                prefixText="₹"
                error={errors.monthlyContribution?.message}
                exampleValue={250}
                onExampleClick={onChange}
              />
            )}
          />

          <Controller
            name="interestRate"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CalculatorInput
                label="Annual Interest Rate"
                type="number"
                value={value}
                onChange={onChange}
                suffixText="%"
                error={errors.interestRate?.message}
                exampleValue={7.5}
                onExampleClick={onChange}
              />
            )}
          />

          <Controller
            name="compoundFrequency"
            control={control}
            render={({ field }) => (
              <CalculatorSelect
                label="Compounding Frequency"
                options={[
                  { label: "Annually", value: "annually" },
                  { label: "Semi-Annually", value: "semi-annually" },
                  { label: "Quarterly", value: "quarterly" },
                  { label: "Monthly", value: "monthly" },
                  { label: "Daily", value: "daily" },
                ]}
                {...field}
              />
            )}
          />

          <Controller
            name="investmentPeriod"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="space-y-2">
                <CalculatorSlider
                  label="Investment Period (Years)"
                  value={value}
                  onChange={onChange}
                  min={1}
                  max={50}
                  suffixText=" years"
                />
              </div>
            )}
          />
        </form>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={`₹${Math.round(results.finalBalance).toLocaleString()}`}
            resultLabel="Estimated Future Value"
            summary={`Over ${formValues.investmentPeriod} years, your portfolio grows to ₹${Math.round(
              results.finalBalance
            ).toLocaleString()}. You invested ₹${Math.round(
              results.totalInvested
            ).toLocaleString()} and earned ₹${Math.round(results.totalInterest).toLocaleString()} in cumulative compound interest.`}
            insights={[
              { label: "Principal Saved", value: `₹${Math.round(results.totalInvested).toLocaleString()}` },
              { label: "Total Yield", value: `₹${Math.round(results.totalInterest).toLocaleString()}` },
              { label: "Effective Return", value: `+${((results.totalInterest / results.totalInvested) * 100).toFixed(0)}%` },
            ]}
            onReset={handleReset}
            onSave={handleSave}
            onDownloadCsv={handleDownloadCsv}
            reportText={reportText}
            inputs={formValues}
          />

          {/* Custom SVG growth Area chart */}
          {results.finalBalance > 0 && (
            <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-primary" /> Growth Chart over Time
              </h4>
              <div className="w-full overflow-hidden flex justify-center">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[500px]">
                  {/* Grid Lines */}
                  <line
                    x1={padding}
                    y1={padding + chartHeight}
                    x2={padding + chartWidth}
                    y2={padding + chartHeight}
                    stroke="var(--border)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={padding + chartHeight}
                    stroke="var(--border)"
                    strokeWidth="1.5"
                  />

                  {/* Areas */}
                  <polygon points={areaBalance} fill="rgba(99, 102, 241, 0.12)" />
                  <polygon points={areaInvested} fill="rgba(168, 85, 247, 0.08)" />

                  {/* Lines */}
                  <polyline points={pathBalance} fill="none" stroke="var(--color-primary)" strokeWidth="3" />
                  <polyline points={pathInvested} fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeDasharray="3,3" />

                  {/* Axes labels */}
                  <text x={padding} y={padding + chartHeight + 15} fontSize="9" fill="var(--muted-foreground)" textAnchor="middle">
                    Year 0
                  </text>
                  <text x={padding + chartWidth / 2} y={padding + chartHeight + 15} fontSize="9" fill="var(--muted-foreground)" textAnchor="middle">
                    Year {Math.round(totalYears / 2)}
                  </text>
                  <text x={padding + chartWidth} y={padding + chartHeight + 15} fontSize="9" fill="var(--muted-foreground)" textAnchor="middle">
                    Year {totalYears}
                  </text>

                  {/* Max Y Label */}
                  <text x={padding - 5} y={padding + 5} fontSize="9" fill="var(--muted-foreground)" textAnchor="end">
                    ₹{Math.round(maxVal / 1000)}k
                  </text>
                </svg>
              </div>
              <div className="flex justify-center gap-6 text-[10px] font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-indigo-500 rounded-xs" /> Total Balance
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border border-dashed border-purple-500 rounded-xs" /> Contributions
                </div>
              </div>
            </div>
          )}

          {/* Year-by-year Growth schedule */}
          <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full flex justify-between items-center text-sm font-bold text-foreground focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <Table className="h-4.5 w-4.5 text-primary" />
                <span>Year-by-Year Growth Table</span>
              </div>
              <span className="text-xs text-primary font-bold hover:underline">
                {showSchedule ? "Hide Table" : "Show Table"}
              </span>
            </button>

            {showSchedule && (
              <div className="overflow-x-auto pt-2 max-h-[300px]">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-bold">
                      <th className="py-2 pr-4">Year</th>
                      <th className="py-2 pr-4">Contributions</th>
                      <th className="py-2 pr-4">Interest Earned</th>
                      <th className="py-2">Ending Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.schedule.map((row) => (
                      <tr key={row.year} className="border-b border-border/40 hover:bg-muted/10">
                        <td className="py-2 pr-4 font-bold text-foreground">Year {row.year}</td>
                        <td className="py-2 pr-4 text-muted-foreground">₹{Math.round(row.totalContributions).toLocaleString()}</td>
                        <td className="py-2 pr-4 text-emerald-500 font-medium">+₹{Math.round(row.interestEarned).toLocaleString()}</td>
                        <td className="py-2 font-bold text-foreground">₹{Math.round(row.balance).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <CalculationSteps
            steps={[
              `Start with an initial principal of ₹${formValues.initialInvestment.toLocaleString()}.`,
              `Calculate interest compounding based on frequency (${formValues.compoundFrequency}) alongside monthly contributions (₹${formValues.monthlyContribution}/month).`,
              `Year-by-year compounding builds your ending balance to ₹${Math.round(
                results.finalBalance
              ).toLocaleString()} after ${formValues.investmentPeriod} years.`,
            ]}
          />

          <FormulaCard
            formula="A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]"
            variables={[
              { variable: "A", name: "Future Value", desc: "Total accumulated balance." },
              { variable: "P", name: "Principal", desc: "Initial investment capital." },
              { variable: "r", name: "Interest Rate", desc: "Annual interest percentage." },
              { variable: "n", name: "Compounding Periods", desc: "Number of compound cycles annually." },
              { variable: "t", name: "Term", desc: "Number of years." },
              { variable: "PMT", name: "Contribution", desc: "Monthly deposit value." },
            ]}
            workedExample={{
              expression: "10000 * (1 + 0.05/12)^(12 * 5)",
              result: "₹12,833",
              explanation: "An initial ₹10,000 compound interest at 5% for 5 years with no additions grows to ₹12,833.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function CompoundInterestCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Growth Calculator...</div>}>
      <CompoundInterestCalculatorInner />
    </Suspense>
  );
}
export default CompoundInterestCalculator;
