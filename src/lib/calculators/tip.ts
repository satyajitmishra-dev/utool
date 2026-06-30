export interface TipInput {
  billAmount: number;
  tipPct: number; // in %
  numberOfPeople: number;
  roundMode: "none" | "tip" | "total" | "per-person";
}

export interface TipResult {
  tipAmount: number;
  totalBill: number;
  tipPerPerson: number;
  totalPerPerson: number;
  savingsOrDiff: number; // in case of rounding, records the rounding difference
}

export function calculateTip(input: TipInput): TipResult {
  const bill = Math.max(0, input.billAmount);
  const pct = Math.max(0, input.tipPct);
  const people = Math.max(1, input.numberOfPeople);
  const mode = input.roundMode;

  let tipAmount = bill * (pct / 100);
  let totalBill = bill + tipAmount;

  if (mode === "tip") {
    tipAmount = Math.ceil(tipAmount);
    totalBill = bill + tipAmount;
  } else if (mode === "total") {
    totalBill = Math.ceil(totalBill);
    tipAmount = totalBill - bill;
  }

  let tipPerPerson = tipAmount / people;
  let totalPerPerson = totalBill / people;

  if (mode === "per-person") {
    totalPerPerson = Math.ceil(totalPerPerson);
    // Adjust total and tip based on rounded per person
    const newTotal = totalPerPerson * people;
    tipAmount = Math.max(0, newTotal - bill);
    totalBill = newTotal;
    tipPerPerson = tipAmount / people;
  }

  return {
    tipAmount,
    totalBill,
    tipPerPerson,
    totalPerPerson,
    savingsOrDiff: 0,
  };
}
