export interface Fraction {
  whole: number;
  numerator: number;
  denominator: number;
}

export interface FractionInput {
  fraction1: Fraction;
  operation: "add" | "subtract" | "multiply" | "divide" | "simplify" | "to-decimal";
  fraction2?: Fraction;
}

export interface FractionResult {
  result: Fraction; // simplified mixed number
  improper: { numerator: number; denominator: number };
  decimal: number;
  steps: string[];
}

// Greatest Common Divisor
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Least Common Multiple
export function lcm(a: number, b: number): number {
  return (Math.abs(a * b)) / gcd(a, b);
}

// Convert mixed fraction to improper fraction
export function toImproper(f: Fraction) {
  const sign = f.whole < 0 ? -1 : 1;
  const absWhole = Math.abs(f.whole);
  const numerator = sign * (absWhole * f.denominator + f.numerator);
  return {
    numerator,
    denominator: f.denominator,
  };
}

// Simplify improper fraction to simplified mixed fraction
export function toMixed(num: number, den: number): Fraction {
  if (den === 0) throw new Error("Denominator cannot be zero.");
  
  // Normalize sign
  let n = num;
  let d = den;
  if (d < 0) {
    n = -n;
    d = -d;
  }

  const common = gcd(n, d);
  n = n / common;
  d = d / common;

  const whole = Math.trunc(n / d);
  const remNum = Math.abs(n % d);

  return {
    whole,
    numerator: remNum,
    denominator: d,
  };
}

export function calculateFraction(input: FractionInput): FractionResult {
  const { fraction1, operation, fraction2 } = input;

  if (fraction1.denominator === 0 || (fraction2 && fraction2.denominator === 0)) {
    return {
      result: { whole: 0, numerator: 0, denominator: 1 },
      improper: { numerator: 0, denominator: 1 },
      decimal: 0,
      steps: ["Error: Denominator cannot be zero."],
    };
  }

  const f1Imp = toImproper(fraction1);
  const steps: string[] = [];

  steps.push(`First fraction: ${fraction1.whole !== 0 ? fraction1.whole + " " : ""}${fraction1.numerator}/${fraction1.denominator} = ${f1Imp.numerator}/${f1Imp.denominator}`);

  if (operation === "simplify" || operation === "to-decimal") {
    const common = gcd(f1Imp.numerator, f1Imp.denominator);
    const simplifiedNum = f1Imp.numerator / common;
    const simplifiedDen = f1Imp.denominator / common;
    const mixed = toMixed(f1Imp.numerator, f1Imp.denominator);
    const decimal = f1Imp.numerator / f1Imp.denominator;

    if (operation === "simplify") {
      steps.push(`Find Greatest Common Divisor (GCD) of ${f1Imp.numerator} and ${f1Imp.denominator}, which is ${common}.`);
      steps.push(`Divide numerator and denominator by GCD: (${f1Imp.numerator} ÷ ${common}) / (${f1Imp.denominator} ÷ ${common}) = ${simplifiedNum}/${simplifiedDen}`);
      if (mixed.whole !== 0) {
        steps.push(`Convert back to mixed number: ${mixed.whole} ${mixed.numerator}/${mixed.denominator}`);
      }
    } else {
      steps.push(`Divide numerator by denominator: ${f1Imp.numerator} ÷ ${f1Imp.denominator} = ${decimal.toFixed(6).replace(/\.?0+$/, "")}`);
    }

    return {
      result: mixed,
      improper: { numerator: simplifiedNum, denominator: simplifiedDen },
      decimal,
      steps,
    };
  }

  if (!fraction2) {
    return {
      result: toMixed(f1Imp.numerator, f1Imp.denominator),
      improper: f1Imp,
      decimal: f1Imp.numerator / f1Imp.denominator,
      steps: [...steps, "Error: Second fraction is required for this operation."],
    };
  }

  const f2Imp = toImproper(fraction2);
  steps.push(`Second fraction: ${fraction2.whole !== 0 ? fraction2.whole + " " : ""}${fraction2.numerator}/${fraction2.denominator} = ${f2Imp.numerator}/${f2Imp.denominator}`);

  let resNum = 0;
  let resDen = 1;

  switch (operation) {
    case "add": {
      const commonDen = lcm(f1Imp.denominator, f2Imp.denominator);
      const m1 = commonDen / f1Imp.denominator;
      const m2 = commonDen / f2Imp.denominator;
      const term1 = f1Imp.numerator * m1;
      const term2 = f2Imp.numerator * m2;
      resNum = term1 + term2;
      resDen = commonDen;

      steps.push(`Find Least Common Multiple (LCM) of denominators ${f1Imp.denominator} and ${f2Imp.denominator}, which is ${commonDen}.`);
      steps.push(`Adjust numerators: (${f1Imp.numerator} × ${m1}) / ${commonDen} + (${f2Imp.numerator} × ${m2}) / ${commonDen}`);
      steps.push(`Add numerators: (${term1} + ${term2}) / ${commonDen} = ${resNum}/${resDen}`);
      break;
    }
    case "subtract": {
      const commonDen = lcm(f1Imp.denominator, f2Imp.denominator);
      const m1 = commonDen / f1Imp.denominator;
      const m2 = commonDen / f2Imp.denominator;
      const term1 = f1Imp.numerator * m1;
      const term2 = f2Imp.numerator * m2;
      resNum = term1 - term2;
      resDen = commonDen;

      steps.push(`Find Least Common Multiple (LCM) of denominators ${f1Imp.denominator} and ${f2Imp.denominator}, which is ${commonDen}.`);
      steps.push(`Adjust numerators: (${f1Imp.numerator} × ${m1}) / ${commonDen} - (${f2Imp.numerator} × ${m2}) / ${commonDen}`);
      steps.push(`Subtract numerators: (${term1} - ${term2}) / ${commonDen} = ${resNum}/${resDen}`);
      break;
    }
    case "multiply": {
      resNum = f1Imp.numerator * f2Imp.numerator;
      resDen = f1Imp.denominator * f2Imp.denominator;
      steps.push(`Multiply numerators: ${f1Imp.numerator} × ${f2Imp.numerator} = ${resNum}`);
      steps.push(`Multiply denominators: ${f1Imp.denominator} × ${f2Imp.denominator} = ${resDen}`);
      steps.push(`Combined Result: ${resNum}/${resDen}`);
      break;
    }
    case "divide": {
      if (f2Imp.numerator === 0) {
        return {
          result: { whole: 0, numerator: 0, denominator: 1 },
          improper: { numerator: 0, denominator: 1 },
          decimal: 0,
          steps: [...steps, "Error: Cannot divide by zero fraction."],
        };
      }
      resNum = f1Imp.numerator * f2Imp.denominator;
      resDen = f1Imp.denominator * f2Imp.numerator;
      steps.push(`Reciprocate divisor: ${f2Imp.numerator}/${f2Imp.denominator} becomes ${f2Imp.denominator}/${f2Imp.numerator}`);
      steps.push(`Multiply first fraction by reciprocal: (${f1Imp.numerator} × ${f2Imp.denominator}) / (${f1Imp.denominator} × ${f2Imp.numerator}) = ${resNum}/${resDen}`);
      break;
    }
  }

  const common = gcd(resNum, resDen);
  const simpNum = resNum / common;
  const simpDen = resDen / common;
  const mixed = toMixed(resNum, resDen);
  const decimal = resNum / resDen;

  steps.push(`Simplify: GCD of ${resNum} and ${resDen} is ${common}. Divided: ${simpNum}/${simpDen}`);
  if (mixed.whole !== 0 && mixed.numerator > 0) {
    steps.push(`Convert to mixed fraction: ${mixed.whole} ${mixed.numerator}/${mixed.denominator}`);
  }

  return {
    result: mixed,
    improper: { numerator: simpNum, denominator: simpDen },
    decimal,
    steps,
  };
}
