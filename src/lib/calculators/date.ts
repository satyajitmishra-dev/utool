import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  addDays,
  subDays,
  isLeapYear,
  isWeekend,
  eachDayOfInterval,
  parseISO,
  format,
} from "date-fns";

export interface DateDiffInput {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  includeEndDate: boolean;
}

export interface DateDiffResult {
  totalDays: number;
  businessDays: number;
  weekendDays: number;
  weeks: number;
  months: number;
  years: number;
  breakdownString: string;
  isStartLeap: boolean;
  isEndLeap: boolean;
}

export interface DateAdjustInput {
  startDate: string; // YYYY-MM-DD
  amount: number;
  unit: "days" | "business-days" | "weeks" | "months" | "years";
  operation: "add" | "subtract";
}

export interface DateAdjustResult {
  resultDate: string; // YYYY-MM-DD
  dayOfWeek: string;
  isLeap: boolean;
  explanation: string;
}

// Check if a date is a weekend day (Saturday/Sunday)
function isBusinessDay(date: Date): boolean {
  return !isWeekend(date);
}

export function calculateDateDiff(input: DateDiffInput): DateDiffResult {
  const start = parseISO(input.startDate);
  const end = parseISO(input.endDate);

  // If start is after end, let's keep it clean
  const isReverse = start > end;
  const actualStart = isReverse ? end : start;
  const actualEnd = isReverse ? start : end;

  let totalDays = differenceInDays(actualEnd, actualStart);
  if (input.includeEndDate) {
    totalDays += 1;
  }

  // Count business days
  let businessDays = 0;
  let weekendDays = 0;

  if (totalDays > 0) {
    try {
      const days = eachDayOfInterval({ start: actualStart, end: input.includeEndDate ? actualEnd : subDays(actualEnd, 1) });
      days.forEach((day) => {
        if (isBusinessDay(day)) {
          businessDays++;
        } else {
          weekendDays++;
        }
      });
    } catch (e) {
      // Fallback if interval is too huge to loop
      // Approximate business days (5/7 of total days)
      businessDays = Math.round((totalDays * 5) / 7);
      weekendDays = totalDays - businessDays;
    }
  }

  const weeks = differenceInWeeks(actualEnd, actualStart);
  const months = differenceInMonths(actualEnd, actualStart);
  const years = differenceInYears(actualEnd, actualStart);

  // Custom detailed breakdown string: e.g. "1 year, 3 months, 2 days"
  let tempDate = actualStart;
  const diffYears = differenceInYears(actualEnd, tempDate);
  tempDate = addDays(tempDate, diffYears * 365); // simple approx for display, or we can use precise additions
  
  // Precise remaining months and days
  const yearsPrecise = differenceInYears(actualEnd, actualStart);
  const remainingDateAfterYears = addDays(actualStart, yearsPrecise * 365); // approximation or calendar addition
  // Better: use direct addition
  let pDate = actualStart;
  // Year step
  const yr = differenceInYears(actualEnd, pDate);
  // We can add yr years, but standard JS Date addition:
  const pDateYears = new Date(pDate);
  pDateYears.setFullYear(pDateYears.getFullYear() + yr);
  
  const mth = differenceInMonths(actualEnd, pDateYears);
  const pDateMonths = new Date(pDateYears);
  pDateMonths.setMonth(pDateMonths.getMonth() + mth);
  
  const dy = differenceInDays(actualEnd, pDateMonths);

  const parts = [];
  if (yr > 0) parts.push(`${yr} year${yr > 1 ? "s" : ""}`);
  if (mth > 0) parts.push(`${mth} month${mth > 1 ? "s" : ""}`);
  if (dy > 0 || parts.length === 0) parts.push(`${dy} day${dy > 1 ? "s" : ""}`);
  const breakdownString = parts.join(", ");

  return {
    totalDays: isReverse ? -totalDays : totalDays,
    businessDays: isReverse ? -businessDays : businessDays,
    weekendDays: isReverse ? -weekendDays : weekendDays,
    weeks,
    months,
    years,
    breakdownString,
    isStartLeap: isLeapYear(start),
    isEndLeap: isLeapYear(end),
  };
}

export function adjustDate(input: DateAdjustInput): DateAdjustResult {
  const start = parseISO(input.startDate);
  const amt = Math.max(0, input.amount);
  const isAdd = input.operation === "add";

  let result = new Date(start);

  if (input.unit === "days") {
    result = isAdd ? addDays(start, amt) : subDays(start, amt);
  } else if (input.unit === "weeks") {
    result = isAdd ? addDays(start, amt * 7) : subDays(start, amt * 7);
  } else if (input.unit === "months") {
    const currentMonth = result.getMonth();
    result.setMonth(currentMonth + (isAdd ? amt : -amt));
  } else if (input.unit === "years") {
    const currentYear = result.getFullYear();
    result.setFullYear(currentYear + (isAdd ? amt : -amt));
  } else if (input.unit === "business-days") {
    // Add/subtract business days by stepping day by day
    let step = 0;
    while (step < amt) {
      result = isAdd ? addDays(result, 1) : subDays(result, 1);
      if (isBusinessDay(result)) {
        step++;
      }
    }
  }

  const resultFormatted = format(result, "yyyy-MM-dd"); // formatted ISO
  const resultFormattedProper = result.toISOString().split("T")[0]; // safe fallback
  const dayOfWeek = format(result, "EEEE");
  const isLeap = isLeapYear(result);

  const explanation = `${isAdd ? "Added" : "Subtracted"} ${amt} ${
    input.unit === "business-days" ? "business day" : input.unit.slice(0, -1)
  }${amt !== 1 ? (input.unit === "business-days" ? "s" : "s") : ""} from ${format(start, "MMMM d, yyyy")}.`;

  return {
    resultDate: resultFormattedProper,
    dayOfWeek,
    isLeap,
    explanation,
  };
}
