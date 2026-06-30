export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  isDownPaymentPct: boolean;
  interestRate: number; // annual interest rate in %
  loanTermYears: number; // e.g. 30
  propertyTaxRate: number; // annual tax rate in % of home value
  insuranceAnnual: number; // annual homeowners insurance in $
  hoaMonthly: number; // monthly HOA in $
  extraPaymentMonthly?: number; // optional monthly extra principal
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
  cumulativeInterest: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalMonthlyPaymentWithExtra: number;
  
  // Totals
  totalInterestPaid: number;
  totalInterestPaidWithExtra: number;
  totalPayments: number;
  totalPaymentsWithExtra: number;

  // Payoff times
  payoffMonthsStandard: number;
  payoffMonthsWithExtra: number;
  savingsInterest: number;
  timeSavedMonths: number;

  schedule: AmortizationRow[];
  scheduleWithExtra: AmortizationRow[];
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const price = Math.max(0, input.homePrice);
  const dpValue = Math.max(0, input.downPayment);
  const rAnn = Math.max(0, input.interestRate);
  const termY = Math.max(1, input.loanTermYears);
  const taxRate = Math.max(0, input.propertyTaxRate);
  const insAnnual = Math.max(0, input.insuranceAnnual);
  const hoa = Math.max(0, input.hoaMonthly);
  const extra = Math.max(0, input.extraPaymentMonthly || 0);

  // 1. Calculate Down Payment and Loan Amount
  const downPayment = input.isDownPaymentPct ? price * (dpValue / 100) : dpValue;
  const loanAmount = Math.max(0, price - downPayment);

  // 2. Monthly Rates
  const r = rAnn / 12 / 100; // Monthly interest rate
  const n = termY * 12; // Total months

  // 3. Principal & Interest Payment (Standard)
  let monthlyPrincipalAndInterest = 0;
  if (loanAmount > 0) {
    if (r === 0) {
      monthlyPrincipalAndInterest = loanAmount / n;
    } else {
      monthlyPrincipalAndInterest = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  // 4. Escrow payments
  const monthlyTax = (price * (taxRate / 100)) / 12;
  const monthlyInsurance = insAnnual / 12;
  const monthlyHOA = hoa;

  const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + monthlyHOA;
  const totalMonthlyPaymentWithExtra = totalMonthlyPayment + extra;

  // 5. Build Amortization Schedule (Standard)
  let balanceStandard = loanAmount;
  let cumInterestStandard = 0;
  const schedule: AmortizationRow[] = [];

  for (let m = 1; m <= n; m++) {
    if (balanceStandard <= 0) break;

    const interestPaid = balanceStandard * r;
    let principalPaid = monthlyPrincipalAndInterest - interestPaid;

    if (principalPaid > balanceStandard) {
      principalPaid = balanceStandard;
    }

    balanceStandard -= principalPaid;
    cumInterestStandard += interestPaid;

    schedule.push({
      month: m,
      payment: interestPaid + principalPaid,
      principalPaid,
      interestPaid,
      balance: balanceStandard,
      cumulativeInterest: cumInterestStandard,
    });
  }

  const totalInterestPaid = cumInterestStandard;
  const totalPayments = loanAmount + totalInterestPaid;
  const payoffMonthsStandard = schedule.length;

  // 6. Build Amortization Schedule (With Extra Payments)
  let balanceExtra = loanAmount;
  let cumInterestExtra = 0;
  const scheduleWithExtra: AmortizationRow[] = [];
  let monthIndex = 1;

  while (balanceExtra > 0 && monthIndex <= n) {
    const interestPaid = balanceExtra * r;
    let principalPaid = monthlyPrincipalAndInterest - interestPaid + extra;

    if (principalPaid > balanceExtra) {
      principalPaid = balanceExtra;
    }

    balanceExtra -= principalPaid;
    cumInterestExtra += interestPaid;

    scheduleWithExtra.push({
      month: monthIndex,
      payment: interestPaid + principalPaid,
      principalPaid,
      interestPaid,
      balance: balanceExtra,
      cumulativeInterest: cumInterestExtra,
    });

    monthIndex++;
  }

  const totalInterestPaidWithExtra = cumInterestExtra;
  const totalPaymentsWithExtra = loanAmount + totalInterestPaidWithExtra;
  const payoffMonthsWithExtra = scheduleWithExtra.length;

  const savingsInterest = Math.max(0, totalInterestPaid - totalInterestPaidWithExtra);
  const timeSavedMonths = Math.max(0, payoffMonthsStandard - payoffMonthsWithExtra);

  return {
    loanAmount,
    monthlyPrincipalAndInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyHOA,
    totalMonthlyPayment,
    totalMonthlyPaymentWithExtra,
    totalInterestPaid,
    totalInterestPaidWithExtra,
    totalPayments,
    totalPaymentsWithExtra,
    payoffMonthsStandard,
    payoffMonthsWithExtra,
    savingsInterest,
    timeSavedMonths,
    schedule,
    scheduleWithExtra,
  };
}
