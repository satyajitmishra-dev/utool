"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { IndianRupee, Percent, Calendar, HelpCircle, ChevronDown, ChevronUp, Table } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AmortizationRow {
  period: number; // Year or Month index
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export function EmiCalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(15);
  const [isTenureYears, setIsTenureYears] = useState(true);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [breakdown, setBreakdown] = useState({ principalPct: 50, interestPct: 50 });
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleView, setScheduleView] = useState<"yearly" | "monthly">("yearly");

  const calculateEmi = () => {
    const P = principal;
    const rAnn = interestRate;
    const y = tenure;

    if (P <= 0 || rAnn <= 0 || y <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(0);
      setSchedule([]);
      return;
    }

    const r = rAnn / 12 / 100; // Monthly interest rate
    const n = isTenureYears ? y * 12 : y; // Total number of months

    let monthlyEmi = 0;
    if (r === 0) {
      monthlyEmi = P / n;
    } else {
      monthlyEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPay = monthlyEmi * n;
    const totalInt = totalPay - P;

    const principalPct = Math.round((P / totalPay) * 100);
    const interestPct = 100 - principalPct;

    setEmi(monthlyEmi);
    setTotalInterest(totalInt);
    setTotalPayment(totalPay);
    setBreakdown({ principalPct, interestPct });

    // Generate amortization schedule (month-by-month first)
    let balance = P;
    const monthlySchedule: AmortizationRow[] = [];

    for (let month = 1; month <= n; month++) {
      const interestPaid = balance * r;
      const principalPaid = monthlyEmi - interestPaid;
      balance = Math.max(0, balance - principalPaid);

      monthlySchedule.push({
        period: month,
        emi: monthlyEmi,
        principal: principalPaid,
        interest: interestPaid,
        balance: balance,
      });
    }

    // Generate yearly schedule if yearly view is selected
    if (isTenureYears && scheduleView === "yearly") {
      const yearlySchedule: AmortizationRow[] = [];
      let tempBalance = P;

      for (let year = 1; year <= y; year++) {
        let yearEmi = 0;
        let yearPrincipal = 0;
        let yearInterest = 0;

        const startIdx = (year - 1) * 12;
        const endIdx = Math.min(startIdx + 12, monthlySchedule.length);

        for (let i = startIdx; i < endIdx; i++) {
          yearEmi += monthlySchedule[i].emi;
          yearPrincipal += monthlySchedule[i].principal;
          yearInterest += monthlySchedule[i].interest;
        }

        tempBalance = Math.max(0, tempBalance - yearPrincipal);

        yearlySchedule.push({
          period: year,
          emi: yearEmi,
          principal: yearPrincipal,
          interest: yearInterest,
          balance: tempBalance,
        });
      }
      setSchedule(yearlySchedule);
    } else {
      setSchedule(monthlySchedule);
    }
  };

  useEffect(() => {
    calculateEmi();
  }, [principal, interestRate, tenure, isTenureYears, scheduleView]);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-h2 font-extrabold text-foreground tracking-tight">EMI Loan Calculator</h2>
        <p className="text-body-s text-muted-foreground mt-0.5">
          Estimate your monthly installments, total interest, and see a year-by-year payment schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Sliders & Inputs Box */}
        <GlassCard className="p-5 space-y-6 lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-5">
            <span className="text-xs font-bold text-foreground block">Loan Inputs</span>

            {/* Principal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-primary" /> Loan Amount
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                  className="w-28 text-right rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="50000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-bold">
                <span>₹1 Lakh</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Percent className="h-3.5 w-3.5 text-indigo-500" /> Interest Rate (p.a.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                  className="w-20 text-right rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-bold">
                <span>1%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-pink-500" /> Loan Tenure
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Math.max(1, Number(e.target.value)))}
                    className="w-16 text-right rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex border border-border rounded-lg overflow-hidden p-0.5 bg-muted/20">
                    <button
                      onClick={() => {
                        setIsTenureYears(true);
                        setTenure(Math.min(40, Math.max(1, Math.round(tenure / 12) || 1)));
                      }}
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                        isTenureYears ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Yr
                    </button>
                    <button
                      onClick={() => {
                        setIsTenureYears(false);
                        setTenure(tenure * 12);
                      }}
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                        !isTenureYears ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Mo
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max={isTenureYears ? 40 : 360}
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-bold">
                <span>1 {isTenureYears ? "Yr" : "Mo"}</span>
                <span>{isTenureYears ? "40 Yrs" : "360 Mos"}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted/20 border border-border rounded-xl mt-4 flex gap-2 items-start">
            <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              EMI is a fixed monthly payment that includes a principal repayment part and an interest payment part. Set inputs above to recalculate.
            </p>
          </div>
        </GlassCard>

        {/* Results Panel */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-6">
          {/* Top Row: Monthly EMI */}
          <GlassCard className="p-6 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10 flex flex-col justify-center items-center text-center space-y-2">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              Equated Monthly Installment (EMI)
            </span>
            <div className="text-4xl md:text-5xl font-black text-foreground">
              ₹{emi.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">per month</p>
          </GlassCard>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-2xl bg-card flex flex-col justify-center space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Principal Loan</span>
              <span className="text-base font-extrabold text-foreground">₹{principal.toLocaleString("en-IN")}</span>
            </div>
            <div className="p-4 border border-border rounded-2xl bg-card flex flex-col justify-center space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Total Interest</span>
              <span className="text-base font-extrabold text-foreground">
                ₹{totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="p-4 border border-border rounded-2xl bg-card flex flex-col justify-center space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Total Payment</span>
              <span className="text-base font-extrabold text-foreground">
                ₹{totalPayment.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Breakdown progress bar chart */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Principal ({breakdown.principalPct}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Interest ({breakdown.interestPct}%)
              </span>
            </div>
            <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden flex">
              <div className="h-full bg-primary" style={{ width: `${breakdown.principalPct}%` }} />
              <div className="h-full bg-indigo-500" style={{ width: `${breakdown.interestPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Area */}
      <div className="border border-border rounded-3xl bg-card overflow-hidden">
        <button
          onClick={() => setIsScheduleOpen(!isScheduleOpen)}
          className="w-full p-5 flex justify-between items-center hover:bg-muted/10 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Table className="h-4.5 w-4.5 text-primary" />
            <span className="text-sm font-bold text-foreground">Amortization Schedule (Repayment Table)</span>
          </div>
          {isScheduleOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {isScheduleOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="p-5 space-y-4">
                {isTenureYears && (
                  <div className="flex border border-border rounded-lg overflow-hidden p-0.5 bg-muted/20 w-fit">
                    <button
                      onClick={() => setScheduleView("yearly")}
                      className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                        scheduleView === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Yearly
                    </button>
                    <button
                      onClick={() => setScheduleView("monthly")}
                      className={`px-3 py-1.5 text-xs font-bold rounded transition ${
                        scheduleView === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/20 font-bold text-muted-foreground text-[10px] uppercase">
                        <th className="py-2.5 px-3">{scheduleView === "yearly" ? "Year" : "Month"}</th>
                        <th className="py-2.5 px-3">Total Payment</th>
                        <th className="py-2.5 px-3">Principal Paid</th>
                        <th className="py-2.5 px-3">Interest Paid</th>
                        <th className="py-2.5 px-3">Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-medium">
                      {schedule.map((row) => (
                        <tr key={row.period} className="hover:bg-muted/10">
                          <td className="py-2 px-3 font-bold text-foreground">{row.period}</td>
                          <td className="py-2 px-3">₹{row.emi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                          <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">
                            ₹{row.principal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </td>
                          <td className="py-2 px-3 text-rose-600 dark:text-rose-400">
                            ₹{row.interest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </td>
                          <td className="py-2 px-3 text-foreground">₹{row.balance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
