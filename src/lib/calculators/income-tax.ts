export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number; // in %
}

export interface IncomeTaxInput {
  annualIncome: number;
  deductions: number;
  country: "usa" | "uk" | "canada" | "india" | "custom";
  filingStatus?: "single" | "married";
  customBrackets?: TaxBracket[];
}

export interface BracketBreakdownRow {
  rate: number;
  range: string;
  taxableInBracket: number;
  taxInBracket: number;
}

export interface IncomeTaxResult {
  taxableIncome: number;
  estimatedTaxPayable: number;
  effectiveTaxRate: number;
  netIncome: number;
  bracketBreakdown: BracketBreakdownRow[];
  currencySymbol: string;
}

const COUNTRY_CURRENCY: Record<string, string> = {
  usa: "$",
  uk: "£",
  canada: "$",
  india: "₹",
  custom: "₹",
};

export const USA_SINGLE_BRACKETS: TaxBracket[] = [
  { min: 0, max: 11600, rate: 10 },
  { min: 11600, max: 47150, rate: 12 },
  { min: 47150, max: 100525, rate: 22 },
  { min: 100525, max: 191950, rate: 24 },
  { min: 191950, max: 243725, rate: 32 },
  { min: 243725, max: 609350, rate: 35 },
  { min: 609350, max: null, rate: 37 },
];

export const USA_MARRIED_BRACKETS: TaxBracket[] = [
  { min: 0, max: 23200, rate: 10 },
  { min: 23200, max: 94300, rate: 12 },
  { min: 94300, max: 201050, rate: 22 },
  { min: 201050, max: 383900, rate: 24 },
  { min: 383900, max: 487450, rate: 32 },
  { min: 487450, max: 1000000, rate: 35 },
  { min: 1000000, max: null, rate: 37 },
];

export const UK_BRACKETS: TaxBracket[] = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12570, max: 50270, rate: 20 },
  { min: 50270, max: 125140, rate: 40 },
  { min: 125140, max: null, rate: 45 },
];

export const CANADA_BRACKETS: TaxBracket[] = [
  { min: 0, max: 15705, rate: 0 }, // Basic personal amount
  { min: 15705, max: 57375, rate: 15 },
  { min: 57375, max: 114750, rate: 20.5 },
  { min: 114750, max: 177882, rate: 26 },
  { min: 177882, max: 253414, rate: 29 },
  { min: 253414, max: null, rate: 33 },
];

// India FY 2025-26 New Tax Regime Brackets
export const INDIA_BRACKETS: TaxBracket[] = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 5 },
  { min: 700000, max: 1000000, rate: 10 },
  { min: 1000000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: null, rate: 30 },
];

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const { annualIncome, deductions, country, filingStatus = "single", customBrackets } = input;

  const grossIncome = Math.max(0, annualIncome);
  const totalDeductions = Math.max(0, deductions);
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  const currencySymbol = COUNTRY_CURRENCY[country] || "$";

  // Select brackets
  let brackets: TaxBracket[] = USA_SINGLE_BRACKETS;
  if (country === "usa") {
    brackets = filingStatus === "married" ? USA_MARRIED_BRACKETS : USA_SINGLE_BRACKETS;
  } else if (country === "uk") {
    brackets = UK_BRACKETS;
  } else if (country === "canada") {
    brackets = CANADA_BRACKETS;
  } else if (country === "india") {
    brackets = INDIA_BRACKETS;
  } else if (country === "custom" && customBrackets) {
    brackets = customBrackets;
  }

  let estimatedTaxPayable = 0;
  const bracketBreakdown: BracketBreakdownRow[] = [];

  // Progressive Tax Calculation
  brackets.forEach((b) => {
    const min = b.min;
    const max = b.max;
    const rate = b.rate;

    if (taxableIncome > min) {
      const upper = max === null ? taxableIncome : Math.min(taxableIncome, max);
      const taxableInBracket = upper - min;
      const taxInBracket = taxableInBracket * (rate / 100);

      estimatedTaxPayable += taxInBracket;

      const rangeStr = max === null ? `${currencySymbol}${min}+` : `${currencySymbol}${min} - ${currencySymbol}${max}`;

      bracketBreakdown.push({
        rate,
        range: rangeStr,
        taxableInBracket,
        taxInBracket,
      });
    } else {
      const rangeStr = max === null ? `${currencySymbol}${min}+` : `${currencySymbol}${min} - ${currencySymbol}${max}`;
      bracketBreakdown.push({
        rate,
        range: rangeStr,
        taxableInBracket: 0,
        taxInBracket: 0,
      });
    }
  });

  // India Specific Rebate under Section 87A: Tax is rebated if taxable income (after standard deduction) is <= ₹7,00,000 (under new regime)
  // Standard Deduction in India is ₹75,000 for FY 2025-26. We assume deductions already covers standard deductions.
  if (country === "india" && grossIncome - totalDeductions <= 700000) {
    estimatedTaxPayable = 0;
    bracketBreakdown.forEach((row) => {
      row.taxInBracket = 0;
    });
  }

  const effectiveTaxRate = grossIncome > 0 ? (estimatedTaxPayable / grossIncome) * 100 : 0;
  const netIncome = grossIncome - estimatedTaxPayable;

  return {
    taxableIncome,
    estimatedTaxPayable,
    effectiveTaxRate,
    netIncome,
    bracketBreakdown,
    currencySymbol,
  };
}
