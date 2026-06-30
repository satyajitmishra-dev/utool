"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { calculateMatrix, Matrix } from "@/lib/calculators/matrix";
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
import { Grid3X3 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "utool-history-matrix-calculator";
const PREF_KEY = "utool-pref-matrix-calculator";

// Standard schema
const schema = z.object({
  dimension: z.enum(["2", "3", "4"]),
  operation: z.enum(["add", "subtract", "multiply", "transpose", "determinant", "inverse", "rank"]),
});

type FormData = z.infer<typeof schema>;

function MatrixCalculatorInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calculate" | "history">("calculate");

  const [dimension, setDimension] = useState<number>(3);
  const [matrixA, setMatrixA] = useState<Matrix>(Array.from({ length: 4 }, () => Array(4).fill(0)));
  const [matrixB, setMatrixB] = useState<Matrix>(Array.from({ length: 4 }, () => Array(4).fill(0)));

  const defaultValues: FormData = {
    dimension: "3",
    operation: "determinant",
  };

  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const formValues = watch();

  // Load URL params & preferences
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(PREF_KEY);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        setValue("dimension", parsed.dimension);
        setValue("operation", parsed.operation);
        if (parsed.matrixA) setMatrixA(parsed.matrixA);
        if (parsed.matrixB) setMatrixB(parsed.matrixB);
        setDimension(parseInt(parsed.dimension));
      }
    } catch (e) {
      console.error(e);
    }

    const dim = searchParams.get("dimension");
    const op = searchParams.get("operation");
    const mA = searchParams.get("matrixA");
    const mB = searchParams.get("matrixB");

    if (dim) {
      setValue("dimension", dim as any);
      setDimension(parseInt(dim));
    }
    if (op) setValue("operation", op as any);
    if (mA) {
      try {
        setMatrixA(JSON.parse(mA));
      } catch (e) {}
    }
    if (mB) {
      try {
        setMatrixB(JSON.parse(mB));
      } catch (e) {}
    }
  }, [searchParams, setValue]);

  // Sync Dimension change
  useEffect(() => {
    const dimVal = parseInt(formValues.dimension);
    setDimension(dimVal);
  }, [formValues.dimension]);

  // Auto-save form preferences
  useEffect(() => {
    try {
      localStorage.setItem(
        PREF_KEY,
        JSON.stringify({
          dimension: formValues.dimension,
          operation: formValues.operation,
          matrixA,
          matrixB,
        })
      );
    } catch (e) {
      console.error(e);
    }
  }, [formValues, matrixA, matrixB]);

  const handleCellChange = (matrix: "A" | "B", r: number, c: number, val: string) => {
    const num = parseFloat(val);
    const safeVal = isNaN(num) ? 0 : num;
    if (matrix === "A") {
      const updated = matrixA.map((row, idxR) =>
        row.map((cell, idxC) => (idxR === r && idxC === c ? safeVal : cell))
      );
      setMatrixA(updated);
    } else {
      const updated = matrixB.map((row, idxR) =>
        row.map((cell, idxC) => (idxR === r && idxC === c ? safeVal : cell))
      );
      setMatrixB(updated);
    }
  };

  const handleReset = () => {
    setValue("dimension", defaultValues.dimension);
    setValue("operation", defaultValues.operation);
    setDimension(3);
    setMatrixA(Array.from({ length: 4 }, () => Array(4).fill(0)));
    setMatrixB(Array.from({ length: 4 }, () => Array(4).fill(0)));
  };

  // Build sliced matrices corresponding to current dimensions
  const sliceMatrix = (m: Matrix, dim: number): Matrix => {
    return m.slice(0, dim).map((row) => row.slice(0, dim));
  };

  const activeA = sliceMatrix(matrixA, dimension);
  const activeB = sliceMatrix(matrixB, dimension);

  // Compute live results
  const results = calculateMatrix({
    matrixA: activeA,
    matrixB: activeB,
    operation: formValues.operation,
  });

  const handleSave = () => {
    const title = `Matrix (${formValues.operation.toUpperCase()}, ${dimension}x${dimension})`;
    saveHistory(
      STORAGE_KEY,
      title,
      { dimension: formValues.dimension, operation: formValues.operation, matrixA, matrixB },
      results
    );
  };

  const loadFromHistory = (inputs: Record<string, any>) => {
    if (inputs.dimension) {
      setValue("dimension", inputs.dimension);
      setDimension(parseInt(inputs.dimension));
    }
    if (inputs.operation) setValue("operation", inputs.operation);
    if (inputs.matrixA) setMatrixA(inputs.matrixA);
    if (inputs.matrixB) setMatrixB(inputs.matrixB);
    setActiveTab("calculate");
  };

  const formatMatrixText = (m: Matrix | null): string => {
    if (!m) return "None";
    return m.map((row) => `[ ${row.map((cell) => cell.toFixed(2).replace(/\.00$/, "")).join(", ")} ]`).join("\n");
  };

  const reportText = `=== MATRIX COMPUTATION REPORT ===
Dimensions: ${dimension}x${dimension}
Operation: ${formValues.operation.toUpperCase()}

Matrix A:
${formatMatrixText(activeA)}

${results.error ? `Error: ${results.error}` : ""}
${results.resultScalar !== null ? `Result Scalar Value: ${results.resultScalar}` : ""}
${results.resultMatrix !== null ? `Result Matrix:\n${formatMatrixText(results.resultMatrix)}` : ""}`;

  const needsMatrixB = ["add", "subtract", "multiply"].includes(formValues.operation);

  return (
    <CalculatorLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      header={
        <CalculatorHeader
          title="Linear Algebra Matrix Calculator"
          description="Evaluate transpose, determinant, inverse, rank, addition, subtraction, or matrix multiplications up to 4x4 dimensions."
        />
      }
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="dimension"
              control={control}
              render={({ field }) => (
                <CalculatorSelect
                  label="Grid Size"
                  options={[
                    { label: "2 x 2", value: "2" },
                    { label: "3 x 3", value: "3" },
                    { label: "4 x 4", value: "4" },
                  ]}
                  {...field}
                />
              )}
            />

            <Controller
              name="operation"
              control={control}
              render={({ field }) => (
                <CalculatorSelect
                  label="Operation"
                  options={[
                    { label: "Determinant (det A)", value: "determinant" },
                    { label: "Matrix Inverse (A⁻¹)", value: "inverse" },
                    { label: "Transpose (Aᵀ)", value: "transpose" },
                    { label: "Matrix Rank", value: "rank" },
                    { label: "Add (A + B)", value: "add" },
                    { label: "Subtract (A - B)", value: "subtract" },
                    { label: "Multiply (A × B)", value: "multiply" },
                  ]}
                  {...field}
                />
              )}
            />
          </div>

          {/* Matrix A Inputs */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-foreground">Matrix A Values</span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${dimension}, minmax(0, 1fr))`,
                gap: "8px",
              }}
            >
              {Array.from({ length: dimension }).map((_, r) =>
                Array.from({ length: dimension }).map((_, c) => (
                  <input
                    key={`A-${r}-${c}`}
                    type="number"
                    value={matrixA[r]?.[c] ?? 0}
                    onChange={(e) => handleCellChange("A", r, c, e.target.value)}
                    className="block w-full text-center rounded-xl border border-border bg-card px-2 py-2 text-xs text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                ))
              )}
            </div>
          </div>

          {/* Matrix B Inputs (Conditional) */}
          {needsMatrixB && (
            <div className="space-y-2">
              <span className="block text-xs font-bold text-foreground">Matrix B Values</span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${dimension}, minmax(0, 1fr))`,
                  gap: "8px",
                }}
              >
                {Array.from({ length: dimension }).map((_, r) =>
                  Array.from({ length: dimension }).map((_, c) => (
                    <input
                      key={`B-${r}-${c}`}
                      type="number"
                      value={matrixB[r]?.[c] ?? 0}
                      onChange={(e) => handleCellChange("B", r, c, e.target.value)}
                      className="block w-full text-center rounded-xl border border-border bg-card px-2 py-2 text-xs text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      }
      results={
        <div className="space-y-6">
          {results.error ? (
            <div className="border border-error/20 bg-error/5 p-6 rounded-3xl text-center space-y-2">
              <span className="text-xs font-bold text-error uppercase tracking-wider">Calculation Error</span>
              <p className="text-xs text-muted-foreground font-semibold">{results.error}</p>
            </div>
          ) : (
            <div className="border border-border/60 rounded-3xl p-6 bg-card shadow-xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border/40">
                <span className="text-xs font-bold text-foreground uppercase tracking-widest">
                  Result Matrix Output
                </span>
                <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-foreground font-bold">
                  Reset
                </button>
              </div>

              {results.resultScalar !== null && (
                <div className="text-center md:text-left py-4 space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Scalar Value
                  </span>
                  <div className="text-display-md font-black text-foreground">{results.resultScalar}</div>
                </div>
              )}

              {results.resultMatrix && (
                <div className="flex flex-col items-center py-4">
                  <div className="border-l-2 border-r-2 border-foreground px-4 py-2 font-mono text-xs font-bold space-y-2 text-foreground">
                    {results.resultMatrix.map((row, rIdx) => (
                      <div key={rIdx} className="flex gap-4 justify-center">
                        {row.map((cell, cIdx) => (
                          <span key={cIdx} className="w-12 text-center">
                            {cell.toFixed(2).replace(/\.00$/, "")}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm hover:opacity-90 transition active:scale-[0.98]"
                >
                  Save Result
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(reportText);
                    toast.success("Matrix report copied to clipboard!");
                  }}
                  className="px-4 py-2 border border-border text-foreground hover:bg-muted text-xs font-bold rounded-full transition"
                >
                  Copy Report
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-border text-foreground hover:bg-muted text-xs font-bold rounded-full transition"
                >
                  Print Report
                </button>
              </div>
            </div>
          )}

          <CalculationSteps steps={results.steps} />

          <FormulaCard
            formula="det(2x2) = ad - bc | (A * B)[i][j] = Sum(A[i][k] * B[k][j]) | Aᵀ[i][j] = A[j][i]"
            variables={[
              { variable: "det(A)", name: "Determinant", desc: "Scaling factor for area/volume changes." },
              { variable: "Aᵀ", name: "Transpose", desc: "Reflection of matrix across its main diagonal." },
              { variable: "A⁻¹", name: "Matrix Inverse", desc: "Satisfies relationship: A * A⁻¹ = Identity Matrix." },
            ]}
            workedExample={{
              expression: "Transpose A=[[1, 2], [3, 4]]",
              result: "[[1, 3], [2, 4]]",
              explanation: "Swapping row 1 [1, 2] with column 1 [1, 3] gives the transposed matrix.",
            }}
          />
        </div>
      }
      historyPanel={<HistoryPanel storageKey={STORAGE_KEY} onLoad={loadFromHistory} />}
    />
  );
}

export function MatrixCalculator() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-muted-foreground font-semibold">Loading Matrix Calculator...</div>}>
      <MatrixCalculatorInner />
    </Suspense>
  );
}
export default MatrixCalculator;
