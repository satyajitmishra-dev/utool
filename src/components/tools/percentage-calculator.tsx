"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Percent, HelpCircle, ArrowRightLeft } from "lucide-react";

export function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3" | "tab4" | "tab5">("tab1");

  // State for calculations
  // Tab 1: What is X% of Y?
  const [t1X, setT1X] = useState<number | string>(15);
  const [t1Y, setT1Y] = useState<number | string>(200);
  const [t1Result, setT1Result] = useState<any | null>(null);

  // Tab 2: X is what percent of Y?
  const [t2X, setT2X] = useState<number | string>(30);
  const [t2Y, setT2Y] = useState<number | string>(150);
  const [t2Result, setT2Result] = useState<any | null>(null);

  // Tab 3: Percentage change from X to Y
  const [t3X, setT3X] = useState<number | string>(50);
  const [t3Y, setT3Y] = useState<number | string>(80);
  const [t3Result, setT3Result] = useState<any | null>(null);

  // Tab 4: X is Y% of what?
  const [t4X, setT4X] = useState<number | string>(20);
  const [t4Y, setT4Y] = useState<number | string>(10);
  const [t4Result, setT4Result] = useState<any | null>(null);

  // Tab 5: Add/Subtract X% from Y
  const [t5X, setT5X] = useState<number | string>(20);
  const [t5Y, setT5Y] = useState<number | string>(150);
  const [t5IsAdd, setT5IsAdd] = useState(true);
  const [t5Result, setT5Result] = useState<any | null>(null);

  // Math formatting helper
  const parseNum = (val: number | string): number => {
    const parsed = parseFloat(String(val));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateTab1 = () => {
    const x = parseNum(t1X);
    const y = parseNum(t1Y);
    const result = (x / 100) * y;
    setT1Result({
      val: result,
      explanation: `(${x} / 100) × ${y} = ${x / 100} × ${y} = ${result.toFixed(4).replace(/\.?0+$/, "")}`
    });
  };

  const calculateTab2 = () => {
    const x = parseNum(t2X);
    const y = parseNum(t2Y);
    if (y === 0) {
      setT2Result({ error: "Cannot calculate percentage relative to zero." });
      return;
    }
    const result = (x / y) * 100;
    setT2Result({
      val: result,
      explanation: `(${x} / ${y}) × 100 = ${((x / y) * 100).toFixed(4).replace(/\.?0+$/, "")}%`
    });
  };

  const calculateTab3 = () => {
    const x = parseNum(t3X);
    const y = parseNum(t3Y);
    if (x === 0) {
      setT3Result({ error: "Original value (from) cannot be zero." });
      return;
    }
    const diff = y - x;
    const result = (diff / x) * 100;
    const isIncrease = diff >= 0;
    setT3Result({
      val: result,
      isIncrease,
      explanation: `Change = ${y} - ${x} = ${diff}\nPercentage Change = (${diff} / ${x}) × 100 = ${result.toFixed(4).replace(/\.?0+$/, "")}% (${isIncrease ? "Increase" : "Decrease"})`
    });
  };

  const calculateTab4 = () => {
    const x = parseNum(t4X);
    const y = parseNum(t4Y);
    if (y === 0) {
      setT4Result({ error: "Percentage value cannot be zero." });
      return;
    }
    const result = x / (y / 100);
    setT4Result({
      val: result,
      explanation: `${x} / (${y} / 100) = ${x} / ${y / 100} = ${result.toFixed(4).replace(/\.?0+$/, "")}`
    });
  };

  const calculateTab5 = () => {
    const x = parseNum(t5X);
    const y = parseNum(t5Y);
    const pctVal = (x / 100) * y;
    const result = t5IsAdd ? y + pctVal : y - pctVal;
    setT5Result({
      val: result,
      explanation: `${x}% of ${y} is ${pctVal}\nResult = ${y} ${t5IsAdd ? "+" : "-"} ${pctVal} = ${result.toFixed(4).replace(/\.?0+$/, "")}`
    });
  };

  useEffect(() => {
    calculateTab1();
  }, [t1X, t1Y]);

  useEffect(() => {
    calculateTab2();
  }, [t2X, t2Y]);

  useEffect(() => {
    calculateTab3();
  }, [t3X, t3Y]);

  useEffect(() => {
    calculateTab4();
  }, [t4X, t4Y]);

  useEffect(() => {
    calculateTab5();
  }, [t5X, t5Y, t5IsAdd]);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Percentage Calculator</h2>
        <p className="text-body-s text-muted-foreground mt-0.5">
          Solve standard percentage math tasks instantly with beginner-friendly breakdowns.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex overflow-x-auto border-b border-border gap-2 pb-0.5 select-none">
        {[
          { id: "tab1", label: "Percentage of Value" },
          { id: "tab2", label: "Proportion Ratio" },
          { id: "tab3", label: "Percentage Change" },
          { id: "tab4", label: "Base Value" },
          { id: "tab5", label: "Add/Subtract Pct" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calculation Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Tab Inputs Panel */}
        <GlassCard className="p-5 space-y-4 lg:col-span-1">
          <span className="text-xs font-bold text-foreground block">Inputs</span>

          {/* TAB 1 */}
          {activeTab === "tab1" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Percentage (%)</label>
                <input
                  type="number"
                  value={t1X}
                  onChange={(e) => setT1X(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Of Total Value</label>
                <input
                  type="number"
                  value={t1Y}
                  onChange={(e) => setT1Y(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
            </div>
          )}

          {/* TAB 2 */}
          {activeTab === "tab2" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Part Value (X)</label>
                <input
                  type="number"
                  value={t2X}
                  onChange={(e) => setT2X(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Total Value (Y)</label>
                <input
                  type="number"
                  value={t2Y}
                  onChange={(e) => setT2Y(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
            </div>
          )}

          {/* TAB 3 */}
          {activeTab === "tab3" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Original Value (From)</label>
                <input
                  type="number"
                  value={t3X}
                  onChange={(e) => setT3X(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">New Value (To)</label>
                <input
                  type="number"
                  value={t3Y}
                  onChange={(e) => setT3Y(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
            </div>
          )}

          {/* TAB 4 */}
          {activeTab === "tab4" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Part Value (X)</label>
                <input
                  type="number"
                  value={t4X}
                  onChange={(e) => setT4X(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Is What Percent (%) (Y)</label>
                <input
                  type="number"
                  value={t4Y}
                  onChange={(e) => setT4Y(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
            </div>
          )}

          {/* TAB 5 */}
          {activeTab === "tab5" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-muted-foreground">Action</span>
                <div className="grid grid-cols-2 border border-border rounded-xl p-0.5 bg-muted/20">
                  <button
                    onClick={() => setT5IsAdd(true)}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      t5IsAdd ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setT5IsAdd(false)}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      !t5IsAdd ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Subtract
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Percentage (%)</label>
                <input
                  type="number"
                  value={t5X}
                  onChange={(e) => setT5X(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">To/From Value</label>
                <input
                  type="number"
                  value={t5Y}
                  onChange={(e) => setT5Y(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>
            </div>
          )}
        </GlassCard>

        {/* Tab Outputs Panel */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-6 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
            {/* Show error if any */}
            {activeTab === "tab2" && t2Result?.error && (
              <div className="text-center text-xs text-rose-500 font-semibold">{t2Result.error}</div>
            )}
            {activeTab === "tab3" && t3Result?.error && (
              <div className="text-center text-xs text-rose-500 font-semibold">{t3Result.error}</div>
            )}
            {activeTab === "tab4" && t4Result?.error && (
              <div className="text-center text-xs text-rose-500 font-semibold">{t4Result.error}</div>
            )}

            {/* Calculations display */}
            {((activeTab === "tab1" && t1Result) ||
              (activeTab === "tab2" && t2Result && !t2Result.error) ||
              (activeTab === "tab3" && t3Result && !t3Result.error) ||
              (activeTab === "tab4" && t4Result && !t4Result.error) ||
              (activeTab === "tab5" && t5Result)) && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">
                    Calculated Result
                  </span>
                  <div className="text-4xl md:text-5xl font-black text-foreground">
                    {activeTab === "tab1" && t1Result.val.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {activeTab === "tab2" && `${t2Result.val.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`}
                    {activeTab === "tab3" && (
                      <span className={t3Result.isIncrease ? "text-emerald-500" : "text-rose-500"}>
                        {t3Result.val > 0 ? "+" : ""}
                        {t3Result.val.toLocaleString(undefined, { maximumFractionDigits: 4 })}%
                      </span>
                    )}
                    {activeTab === "tab4" && t4Result.val.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    {activeTab === "tab5" && t5Result.val.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </div>
                  {activeTab === "tab3" && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${t3Result.isIncrease ? "text-emerald-500" : "text-rose-500"}`}>
                      {t3Result.isIncrease ? "Value Increased" : "Value Decreased"}
                    </span>
                  )}
                </div>

                {/* Mathematical Formula breakdown */}
                <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-primary" /> Step-by-Step Explanation
                  </span>
                  <div className="font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed select-text bg-card/40 p-3 rounded-xl border border-border/20">
                    {activeTab === "tab1" && (
                      <>
                        Formula: (Percentage / 100) × Value{"\n"}
                        Calculation: {t1Result.explanation}
                      </>
                    )}
                    {activeTab === "tab2" && (
                      <>
                        Formula: (Part / Total) × 100{"\n"}
                        Calculation: {t2Result.explanation}
                      </>
                    )}
                    {activeTab === "tab3" && (
                      <>
                        Formula: ((New - Original) / Original) × 100{"\n"}
                        Calculation: {t3Result.explanation}
                      </>
                    )}
                    {activeTab === "tab4" && (
                      <>
                        Formula: Part / (Percentage / 100){"\n"}
                        Calculation: {t4Result.explanation}
                      </>
                    )}
                    {activeTab === "tab5" && (
                      <>
                        Formula: Value {t5IsAdd ? "+" : "-"} (Percentage% of Value){"\n"}
                        Calculation: {t5Result.explanation}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
