import { RegistryTool } from '@/types/tool-registry';
import { generateIntentVariants } from '../intent-generator';

// ─── Percentage Calculator ─────────────────────────────────────────────────
export const percentageCalcVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    actionPhrase: 'calculate percentages',
    description: 'Calculate percentages, percentage change, and percent of totals instantly.',
    category: 'Calculators',
    primaryTag: 'Calculators',
    iconTag: 'Scale',
    relatedTools: ['gst-calculator', 'roi-calculator', 'bmi-calculator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'mobile' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── BMI Calculator ────────────────────────────────────────────────────────
export const bmiCalculatorVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    actionPhrase: 'calculate body mass index',
    description: 'Calculate your Body Mass Index (BMI) and healthy weight range.',
    category: 'Calculators',
    primaryTag: 'Calculators',
    iconTag: 'Activity',
    relatedTools: ['percentage-calculator', 'age-calculator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'mobile' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Age Calculator ────────────────────────────────────────────────────────
export const ageCalculatorVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    actionPhrase: 'calculate age',
    description: 'Calculate exact age in years, months, and days from a birth date.',
    category: 'Calculators',
    primaryTag: 'Calculators',
    iconTag: 'Scale',
    relatedTools: ['percentage-calculator', 'bmi-calculator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'mobile' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── EMI Calculator ────────────────────────────────────────────────────────
export const emiCalculatorVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'emi-calculator',
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    actionPhrase: 'calculate EMI',
    description: 'Calculate monthly EMI payments for home, car, and personal loans.',
    category: 'Calculators',
    primaryTag: 'Calculators',
    iconTag: 'Scale',
    relatedTools: ['amortization-schedule', 'simple-interest', 'roi-calculator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'mobile' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── GST Calculator ────────────────────────────────────────────────────────
export const gstCalculatorVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'gst-calculator',
    slug: 'gst-calculator',
    name: 'GST Calculator',
    actionPhrase: 'calculate GST',
    description: 'Calculate GST amounts, inclusive and exclusive of tax, for any rate.',
    category: 'Calculators',
    primaryTag: 'Calculators',
    iconTag: 'Scale',
    relatedTools: ['percentage-calculator', 'emi-calculator', 'roi-calculator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'mobile' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Export all Calculator-cluster variants ────────────────────────────────
export const CALCULATOR_CLUSTER_VARIANTS: RegistryTool[] = [
  ...percentageCalcVariants,
  ...bmiCalculatorVariants,
  ...ageCalculatorVariants,
  ...emiCalculatorVariants,
  ...gstCalculatorVariants,
];
