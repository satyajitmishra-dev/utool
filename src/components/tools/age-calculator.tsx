"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Sparkles, RotateCcw, Info, Gift, Compass } from "lucide-react";
import { motion } from "framer-motion";

export function AgeCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [birthDate, setBirthDate] = useState("1995-06-15");
  const [targetDate, setTargetDate] = useState(todayStr);
  const [result, setResult] = useState<any | null>(null);

  const calculateAge = () => {
    if (!birthDate || !targetDate) return;

    const bDate = new Date(birthDate);
    const tDate = new Date(targetDate);

    if (isNaN(bDate.getTime()) || isNaN(tDate.getTime())) {
      setResult({ error: "Invalid date format." });
      return;
    }

    if (bDate > tDate) {
      setResult({ error: "Birth date cannot be after the target calculation date!" });
      return;
    }

    let years = tDate.getFullYear() - bDate.getFullYear();
    let months = tDate.getMonth() - bDate.getMonth();
    let days = tDate.getDate() - bDate.getDate();

    if (days < 0) {
      months--;
      // Get the number of days in the previous month relative to target date
      const prevMonth = new Date(tDate.getFullYear(), tDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total stats
    const diffTime = tDate.getTime() - bDate.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDaysAfterWeeks = totalDays % 7;
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Day of birth
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const bornDay = weekdays[bDate.getDay()];

    // Next Birthday countdown
    let nextBday = new Date(tDate.getFullYear(), bDate.getMonth(), bDate.getDate());
    if (nextBday < tDate) {
      nextBday.setFullYear(tDate.getFullYear() + 1);
    }
    const diffNextBday = nextBday.getTime() - tDate.getTime();
    const nextBdayDays = Math.ceil(diffNextBday / (1000 * 60 * 60 * 24));
    const nextBdayDayOfWeek = weekdays[nextBday.getDay()];

    // Zodiac and Chinese Zodiac
    const zodiac = getZodiacSign(bDate.getMonth() + 1, bDate.getDate());
    const chineseZodiac = getChineseZodiac(bDate.getFullYear());

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingDaysAfterWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      bornDay,
      nextBdayDays,
      nextBdayDayOfWeek,
      zodiac,
      chineseZodiac,
    });
  };

  const getZodiacSign = (month: number, day: number) => {
    const signs = [
      { name: "Capricorn ♑", start: [12, 22], end: [1, 19] },
      { name: "Aquarius ♒", start: [1, 20], end: [2, 18] },
      { name: "Pisces ♓", start: [2, 19], end: [3, 20] },
      { name: "Aries ♈", start: [3, 21], end: [4, 19] },
      { name: "Taurus ♉", start: [4, 20], end: [5, 20] },
      { name: "Gemini ♊", start: [5, 21], end: [6, 20] },
      { name: "Cancer ♋", start: [6, 21], end: [7, 22] },
      { name: "Leo ♌", start: [7, 23], end: [8, 22] },
      { name: "Virgo ♍", start: [8, 23], end: [9, 22] },
      { name: "Libra ♎", start: [9, 23], end: [10, 22] },
      { name: "Scorpio ♏", start: [10, 23], end: [11, 21] },
      { name: "Sagittarius ♐", start: [11, 22], end: [12, 21] },
    ];

    for (const sign of signs) {
      const [sm, sd] = sign.start;
      const [em, ed] = sign.end;
      if (
        (month === sm && day >= sd) ||
        (month === em && day <= ed) ||
        (sm > em && (month === sm || month === em)) // wrap around Dec-Jan
      ) {
        return sign.name;
      }
    }
    return "Unknown";
  };

  const getChineseZodiac = (year: number) => {
    const animals = [
      "Rat 🐀", "Ox 🐂", "Tiger 🐅", "Rabbit 🐇", 
      "Dragon 🐉", "Snake 🐍", "Horse 🐎", "Goat 🐐", 
      "Monkey 🐒", "Rooster 🐓", "Dog 🐕", "Pig 🐖"
    ];
    // 1900 was Year of the Rat
    const index = (year - 1900) % 12;
    return index >= 0 ? animals[index] : animals[(index + 12) % 12];
  };

  useEffect(() => {
    calculateAge();
  }, [birthDate, targetDate]);

  const handleReset = () => {
    setBirthDate("1995-06-15");
    setTargetDate(todayStr);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Age Calculator</h2>
        <p className="text-body-s text-muted-foreground mt-0.5">
          Find your exact age, next birthday countdown, and fun lifetime milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Input Card */}
        <GlassCard className="p-5 space-y-4 lg:col-span-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">Select Dates</span>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded hover:bg-muted/40"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Date of Birth
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/40 p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-indigo-500" />
                Age at Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/40 p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
              />
            </div>
          </div>
        </GlassCard>

        {/* Results Card */}
        <div className="lg:col-span-2 space-y-6">
          {result && result.error ? (
            <GlassCard className="p-6 border-red-500/20 bg-red-500/5 text-center">
              <p className="text-sm font-semibold text-red-500">{result.error}</p>
            </GlassCard>
          ) : result ? (
            <div className="space-y-6">
              {/* Main Age Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 bg-gradient-to-br from-indigo-500/5 via-transparent to-primary/5 border-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Compass className="h-28 w-28" />
                  </div>

                  <div className="space-y-3 relative z-10">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="h-3 w-3 animate-pulse" /> Exact Age
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="text-4xl md:text-5xl font-black text-foreground">
                        {result.years} <span className="text-lg md:text-xl font-medium text-muted-foreground">years</span>
                      </span>
                      <span className="text-4xl md:text-5xl font-black text-foreground">
                        {result.months} <span className="text-lg md:text-xl font-medium text-muted-foreground">months</span>
                      </span>
                      <span className="text-4xl md:text-5xl font-black text-foreground">
                        {result.days} <span className="text-lg md:text-xl font-medium text-muted-foreground">days</span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Born on a <strong className="text-foreground">{result.bornDay}</strong>
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Countdown & Fun Facts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Birthday Countdown */}
                <GlassCard className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Next Birthday</span>
                    {result.nextBdayDays === 365 || result.nextBdayDays === 0 ? (
                      <p className="text-sm font-bold text-foreground">Happy Birthday! 🎉 Today is the day!</p>
                    ) : (
                      <p className="text-sm font-bold text-foreground">
                        In {result.nextBdayDays} days <span className="text-xs font-normal text-muted-foreground">({result.nextBdayDayOfWeek})</span>
                      </p>
                    )}
                  </div>
                </GlassCard>

                {/* Horoscope/Zodiac */}
                <GlassCard className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Zodiac Sign</span>
                      <p className="text-sm font-bold text-foreground">{result.zodiac}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Chinese Zodiac</span>
                      <p className="text-sm font-bold text-foreground">{result.chineseZodiac}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Statistics Grid */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Lifetime Statistics</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Total Years", val: result.years },
                    { label: "Total Months", val: result.totalMonths },
                    { label: "Total Weeks", val: `${result.totalWeeks} wks, ${result.remainingDaysAfterWeeks} days` },
                    { label: "Total Days", val: result.totalDays.toLocaleString() },
                    { label: "Total Hours", val: result.totalHours.toLocaleString() },
                    { label: "Total Seconds", val: result.totalSeconds.toLocaleString() },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-border bg-card/40 flex flex-col space-y-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">{stat.label}</span>
                      <span className="text-base font-black text-foreground">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-muted-foreground italic">
              Loading calculations...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
