"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { calculateScientific } from "@/lib/calculators/scientific";
import {
  CalculatorLayout,
  CalculatorHeader,
  CalculatorSelect,
  CalculatorResult,
  CalculationSteps,
  FormulaCard,
  HistoryPanel,
  saveHistory,
} from "./shared/calculator";
import { Grid, Eye } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "utool-history-scientific-calculator";
const PREF_KEY = "utool-pref-scientific-calculator";

export function ScientificCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");

  const [expression, setExpression] = useState("");
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("rad");
  const [memory, setMemory] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load url query & preferences
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(PREF_KEY);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.expression) setExpression(parsed.expression);
        if (parsed.angleMode) setAngleMode(parsed.angleMode);
        if (parsed.memory) setMemory(parsed.memory);
      }
    } catch (e) {
      console.error(e);
    }

    const exp = searchParams.get("expression");
    const mode = searchParams.get("angleMode");

    if (exp) setExpression(decodeURIComponent(exp));
    if (mode) setAngleMode(mode as any);
  }, [searchParams]);

  // Auto save preferences
  useEffect(() => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify({ expression, angleMode, memory }));
    } catch (e) {
      console.error(e);
    }
  }, [expression, angleMode, memory]);

  const results = calculateScientific({ expression, angleMode });

  const handleReset = () => {
    setExpression("");
  };

  const handleSave = () => {
    if (results.result === null) {
      toast.error("Nothing to save.");
      return;
    }
    saveHistory(STORAGE_KEY, `${expression} = ${results.result}`, { expression, angleMode }, results);
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    if (inputs.expression !== undefined) setExpression(inputs.expression);
    if (inputs.angleMode !== undefined) setAngleMode(inputs.angleMode);
    setActiveTab("calculate");
  };

  const handleBtnClick = (val: string) => {
    setExpression((prev) => prev + val);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setExpression("");
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleEvaluate = () => {
    if (results.error) {
      toast.error(results.error);
    } else if (results.result !== null) {
      setExpression(String(results.result));
    }
  };

  // Memory keys handlers
  const handleMemory = (op: "MC" | "MR" | "MS" | "M+" | "M-") => {
    const current = results.result !== null ? results.result : 0;
    switch (op) {
      case "MC":
        setMemory(0);
        toast.success("Memory cleared");
        break;
      case "MR":
        setExpression((prev) => prev + String(memory));
        break;
      case "MS":
        setMemory(current);
        toast.success(`Saved ${current} to memory`);
        break;
      case "M+":
        setMemory((prev) => prev + current);
        toast.success(`Added current result to memory`);
        break;
      case "M-":
        setMemory((prev) => prev - current);
        toast.success(`Subtracted current result from memory`);
        break;
    }
  };

  const reportText = `=== SCIENTIFIC CALCULATION REPORT ===
Expression: ${expression}
Angle Mode: ${angleMode.toUpperCase()}

Evaluation Result: ${results.result !== null ? results.result : "N/A"}
Status: ${results.error ? `Error: ${results.error}` : "Success"}`;

  // Keyboard button categories
  const keyRows = [
    ["MC", "MR", "M+", "M-", "MS"],
    ["sin", "cos", "tan", "ln", "log"],
    ["asin", "acos", "atan", "sqrt", "^"],
    ["pi", "e", "cbrt", "!", "%"],
    ["(", ")", "/", "*", "-"],
    ["7", "8", "9", "+", "C"],
    ["4", "5", "6", ".", "⌫"],
    ["1", "2", "3", "0", "="],
  ];

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Advanced Scientific Calculator"
          description="Evaluate trigonometric equations, logarithms, custom powers, postfix factorials, and constants using buttons or keyboard entry."
        />
      }
      inputs={
        <div className="space-y-6">
          {/* Anglemode & Memory status banner */}
          <div className="flex justify-between items-center bg-muted/15 border border-border/40 p-2.5 rounded-xl text-[10px] font-bold">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAngleMode("rad")}
                className={`px-2.5 py-1 rounded-md transition ${
                  angleMode === "rad" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                RAD
              </button>
              <button
                type="button"
                onClick={() => setAngleMode("deg")}
                className={`px-2.5 py-1 rounded-md transition ${
                  angleMode === "deg" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                DEG
              </button>
            </div>

            {memory !== 0 && (
              <span className="text-primary uppercase tracking-wider">
                Memory M: {memory.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </span>
            )}
          </div>

          {/* Typing Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">Mathematical Expression</label>
            <input
              type="text"
              ref={inputRef}
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. sin(pi/4) * (2^3 + 5)"
              onKeyDown={(e) => e.key === "Enter" && handleEvaluate()}
              className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Custom keypad grid */}
          <div className="grid grid-cols-5 gap-2 select-none">
            {keyRows.flat().map((key) => {
              let btnClass = "bg-muted/30 border border-border text-foreground hover:bg-muted font-mono font-bold text-xs p-2.5 rounded-xl transition duration-150 active:scale-95";
              if (["=", "C", "⌫"].includes(key)) {
                btnClass =
                  key === "="
                    ? "bg-primary text-primary-foreground hover:opacity-90 font-mono font-black text-sm p-2.5 rounded-xl transition duration-150 active:scale-95 col-span-1"
                    : "bg-error/10 hover:bg-error/15 border border-error/20 text-error font-mono font-bold text-xs p-2.5 rounded-xl transition duration-150 active:scale-95";
              } else if (["MC", "MR", "M+", "M-", "MS"].includes(key)) {
                btnClass = "bg-primary/5 hover:bg-primary/10 border border-primary/10 text-primary font-mono font-bold text-[10px] p-2.5 rounded-xl transition duration-150 active:scale-95";
              }

              const handleClick = () => {
                if (key === "=") handleEvaluate();
                else if (key === "C") handleClear();
                else if (key === "⌫") handleBackspace();
                else if (["MC", "MR", "M+", "M-", "MS"].includes(key)) handleMemory(key as any);
                else if (["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt"].includes(key)) {
                  handleBtnClick(`${key}(`);
                } else {
                  handleBtnClick(key);
                }
              };

              return (
                <button key={key} type="button" onClick={handleClick} className={btnClass}>
                  {key}
                </button>
              );
            })}
          </div>
        </div>
      }
      results={
        <div className="space-y-6">
          <CalculatorResult
            primaryResult={
              results.result !== null
                ? results.result.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })
                : "Enter Math"
            }
            resultLabel="Evaluation Result"
            summary={results.error ? `Syntax Status: ${results.error}` : `The expression evaluates successfully.`}
            onReset={handleReset}
            onSave={handleSave}
            reportText={reportText}
            inputs={{ expression, angleMode }}
          />

          <CalculationSteps
            steps={[
              `Accept user formula string: "${expression}".`,
              `Translate functions and mathematical constants (e.g. pi = ${Math.PI.toFixed(4)}, e = ${Math.E.toFixed(4)}).`,
              `Transform tokens to Reverse Polish Notation (RPN) via Shunting-Yard to maintain proper precedence (PEMDAS).`,
              `Evaluate RPN queue values on the stack using ${angleMode.toUpperCase()} trig modes: ${
                results.result !== null ? results.result : "N/A"
              }.`,
            ]}
          />

          <FormulaCard
            formula="PEMDAS: Parentheses → Exponents → Multiplication/Division → Addition/Subtraction"
            variables={[
              { variable: "sin, cos, tan", name: "Trigonometric", desc: "Angle functions (Degrees or Radians)." },
              { variable: "ln, log", name: "Logarithmic", desc: "Natural log (base e) and standard log (base 10)." },
              { variable: "pi, e", name: "Constants", desc: "Archimedes' constant (~3.1415) and Euler's number (~2.7182)." },
            ]}
            workedExample={{
              expression: "sin(pi/2) + 2^3",
              result: "9",
              explanation: "sin(pi/2) evaluates to 1, 2^3 evaluates to 8. 1 + 8 = 9.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function ScientificCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Scientific Calculator...</div>}>
      <ScientificCalculatorInner />
    </Suspense>
  );
}
export default ScientificCalculator;
