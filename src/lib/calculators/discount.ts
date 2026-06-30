export interface DiscountInput {
  originalPrice: number;
  discountPct: number; // main discount %
  additionalDiscountPct?: number; // stacked discount %
  taxPct?: number; // tax %
}

export interface DiscountResult {
  originalPrice: number;
  firstDiscountedPrice: number;
  secondDiscountedPrice: number;
  savings: number;
  taxAmount: number;
  finalPrice: number;
  totalDiscountPct: number;
  effectiveDiscountPct: number;
}

export function calculateDiscount(input: DiscountInput): DiscountResult {
  const price = Math.max(0, input.originalPrice);
  const d1 = Math.max(0, Math.min(100, input.discountPct));
  const d2 = Math.max(0, Math.min(100, input.additionalDiscountPct || 0));
  const tax = Math.max(0, input.taxPct || 0);

  const firstDiscountedPrice = price * (1 - d1 / 100);
  const secondDiscountedPrice = firstDiscountedPrice * (1 - d2 / 100);

  const savings = price - secondDiscountedPrice;
  const taxAmount = secondDiscountedPrice * (tax / 100);
  const finalPrice = secondDiscountedPrice + taxAmount;

  const totalDiscountPct = price > 0 ? (savings / price) * 100 : 0;
  const effectiveDiscountPct = price > 0 ? ((price - finalPrice) / price) * 100 : 0;

  return {
    originalPrice: price,
    firstDiscountedPrice,
    secondDiscountedPrice,
    savings,
    taxAmount,
    finalPrice,
    totalDiscountPct,
    effectiveDiscountPct,
  };
}
