export interface CompoundInterestInput {
  initialInvestment: number;
  monthlyContribution: number;
  interestRate: number; // in %
  compoundFrequency: "annually" | "semi-annually" | "quarterly" | "monthly" | "daily";
  investmentPeriod: number; // in years
}

export interface CompoundInterestScheduleRow {
  year: number;
  totalContributions: number;
  interestEarned: number;
  balance: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalInvested: number;
  totalInterest: number;
  schedule: CompoundInterestScheduleRow[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { initialInvestment, monthlyContribution, interestRate, compoundFrequency, investmentPeriod } = input;

  const P = Math.max(0, initialInvestment);
  const PMT = Math.max(0, monthlyContribution);
  const r = Math.max(0, interestRate) / 100;
  const t = Math.max(0, investmentPeriod);

  // Map frequency to number of compound periods per year
  const frequencyMap = {
    annually: 1,
    "semi-annually": 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };
  const n = frequencyMap[compoundFrequency] || 12;

  let balance = P;
  let totalInvested = P;
  const schedule: CompoundInterestScheduleRow[] = [];

  // Year-by-year compounding simulation (we will run monthly updates internally to maintain correctness)
  // Monthly interest rate
  const monthlyRate = r / 12;

  // Let's compound month by month for 't' years (12 * t months)
  const totalMonths = Math.round(t * 12);
  let accumulatedInterest = 0;
  let currentYearContributions = 0;
  let currentYearInterest = 0;

  // Initial row at Year 0
  schedule.push({
    year: 0,
    totalContributions: P,
    interestEarned: 0,
    balance: P,
  });

  for (let m = 1; m <= totalMonths; m++) {
    // Add monthly contribution at start of month
    balance += PMT;
    currentYearContributions += PMT;
    totalInvested += PMT;

    // Calculate monthly interest based on frequency compounding
    // To make daily/monthly compounding exact, we can use the compound formula for the month.
    // However, simulating month-by-month is standard for financial planners with monthly contributions.
    // If compounding is monthly: balance * (1 + r/12)
    // In general, we adjust the monthly interest factor based on n.
    // Let's use the compound rate per compounding period: (1 + r/n)^(n/12) - 1
    const ratePerMonth = Math.pow(1 + r / n, n / 12) - 1;
    const interest = balance * ratePerMonth;
    balance += interest;
    currentYearInterest += interest;
    accumulatedInterest += interest;

    if (m % 12 === 0) {
      const year = m / 12;
      schedule.push({
        year,
        totalContributions: totalInvested,
        interestEarned: accumulatedInterest,
        balance,
      });
      currentYearContributions = 0;
      currentYearInterest = 0;
    }
  }

  // If there's a partial year (e.g. 2.5 years, though form only allows integers, we handle it just in case)
  const remainingMonths = totalMonths % 12;
  if (remainingMonths > 0) {
    const year = Math.ceil(totalMonths / 12);
    schedule.push({
      year,
      totalContributions: totalInvested,
      interestEarned: accumulatedInterest,
      balance,
    });
  }

  return {
    finalBalance: balance,
    totalInvested,
    totalInterest: accumulatedInterest,
    schedule,
  };
}
