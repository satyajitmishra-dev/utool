"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Copy, Check, DollarSign, Percent, ArrowDownUp, Info } from "lucide-react";
import { toast } from "sonner";

export function GstCalculator() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [isExclusive, setIsExclusive] = useState(true); // true = Add GST (Exclusive), false = Remove GST (Inclusive)

  const [netAmount, setNetAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [grossAmount, setGrossAmount] = useState(0);

  const [copiedText, setCopiedText] = useState(false);

  const calculateGst = () => {
    const P = amount;
    const R = gstRate;

    if (P <= 0 || R < 0) {
      setNetAmount(0);
      setGstAmount(0);
      setGrossAmount(0);
      return;
    }

    if (isExclusive) {
      // Add GST (Tax Exclusive)
      const gst = P * (R / 100);
      const gross = P + gst;
      setNetAmount(P);
      setGstAmount(gst);
      setGrossAmount(gross);
    } else {
      // Remove GST (Tax Inclusive)
      const net = P / (1 + R / 100);
      const gst = P - net;
      setNetAmount(net);
      setGstAmount(gst);
      setGrossAmount(P);
    }
  };

  useEffect(() => {
    calculateGst();
  }, [amount, gstRate, isExclusive]);

  const handleCopyReport = () => {
    const modeText = isExclusive ? "GST Addition (Tax Exclusive)" : "GST Extraction (Tax Inclusive)";
    const reportText = `=== GST TAX REPORT (${modeText}) ===
Base Amount: $${netAmount.toFixed(2)}
GST Rate: ${gstRate}%
GST Amount: $${gstAmount.toFixed(2)} (CGST: $${(gstAmount / 2).toFixed(2)}, SGST: $${(gstAmount / 2).toFixed(2)})
Total Amount: $${grossAmount.toFixed(2)}`;

    navigator.clipboard.writeText(reportText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    toast.success("GST Report copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-h2 font-extrabold text-foreground tracking-tight">GST Tax Calculator</h2>
        <p className="text-body-s text-muted-foreground mt-0.5">
          Calculate Goods and Services Tax (GST) easily by adding or extracting GST from standard rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Inputs */}
        <GlassCard className="p-5 space-y-5 lg:col-span-1">
          <span className="text-xs font-bold text-foreground block">GST Parameters</span>

          {/* Mode Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-muted-foreground">Calculation Type</span>
            <div className="grid grid-cols-2 border border-border rounded-xl p-0.5 bg-muted/20">
              <button
                onClick={() => setIsExclusive(true)}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  isExclusive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Add GST
              </button>
              <button
                onClick={() => setIsExclusive(false)}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  !isExclusive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Remove GST
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-primary" /> Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-border bg-muted/40 p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pl-9 font-bold"
              />
              <div className="absolute left-3 top-3.5 text-muted-foreground/60 text-xs font-bold">$</div>
            </div>
          </div>

          {/* GST Rate input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Percent className="h-3.5 w-3.5 text-indigo-500" /> GST Rate
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setGstRate(rate)}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    gstRate === rate
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-muted/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>

            <div className="relative mt-2">
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(Math.max(0, Number(e.target.value)))}
                placeholder="Custom GST Rate"
                className="w-full rounded-xl border border-border bg-muted/40 p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pl-9 font-bold"
              />
              <div className="absolute left-3 top-3.5 text-muted-foreground/60 text-xs font-bold">%</div>
            </div>
          </div>

          <div className="p-3 bg-muted/20 border border-border rounded-xl flex gap-2 items-start">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              <strong>Add GST</strong>: Calculating tax on net value. <br />
              <strong>Remove GST</strong>: Extracting base cost from tax inclusive total.
            </p>
          </div>
        </GlassCard>

        {/* Right Side: Outputs */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Calculation Results</span>
              <button
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-2.5 py-1.5 rounded-lg bg-muted/40 hover:bg-muted/80"
              >
                {copiedText ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Tax Report
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Net Price Card */}
              <div className="p-4 rounded-2xl border border-border bg-card flex flex-col space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Base Amount (Net)</span>
                <span className="text-xl font-black text-foreground">
                  ${netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[8px] text-muted-foreground/60">Pre-tax amount</span>
              </div>

              {/* GST Tax Card */}
              <div className="p-4 rounded-2xl border border-border bg-card flex flex-col space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">GST Tax ({gstRate}%)</span>
                <span className="text-xl font-black text-indigo-500">
                  ${gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[8px] text-muted-foreground/60">
                  CGST: ${(gstAmount / 2).toLocaleString(undefined, { maximumFractionDigits: 2 })}, SGST: ${(gstAmount / 2).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Gross Price Card */}
              <div className="p-4 rounded-2xl border border-border bg-card flex flex-col space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Total Amount (Gross)</span>
                <span className="text-xl font-black text-foreground">
                  ${grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[8px] text-muted-foreground/60">Tax inclusive total</span>
              </div>
            </div>

            {/* Visual split bar */}
            <div className="space-y-2 mt-4 pt-4 border-t border-border/40">
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                <span>Base Cost: {Math.round((netAmount / grossAmount) * 100 || 0)}%</span>
                <span>GST Tax: {Math.round((gstAmount / grossAmount) * 100 || 0)}%</span>
              </div>
              <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(netAmount / grossAmount) * 100 || 0}%` }}
                />
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${(gstAmount / grossAmount) * 100 || 0}%` }}
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
