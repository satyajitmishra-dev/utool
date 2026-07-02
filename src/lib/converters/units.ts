import { ToolRegistryEntry, RegistryUnit } from './registry';

// Standard multipliers and definitions for unit categories

export const ANGLE_UNITS: RegistryUnit[] = [
  { name: 'Degree', symbol: '°', multiplier: 1 },
  { name: 'Radian', symbol: 'rad', multiplier: 180 / Math.PI },
  { name: 'Gradian', symbol: 'grad', multiplier: 0.9 },
  { name: 'Minute of arc', symbol: 'MOA', multiplier: 1 / 60 },
  { name: 'Second of arc', symbol: 'SOA', multiplier: 1 / 3600 },
  { name: 'Turn', symbol: 'tr', multiplier: 360 },
];

export const AREA_UNITS: RegistryUnit[] = [
  { name: 'Square Meter', symbol: 'm²', multiplier: 1 },
  { name: 'Square Kilometer', symbol: 'km²', multiplier: 1e6 },
  { name: 'Square Mile', symbol: 'mi²', multiplier: 2.58998811e6 },
  { name: 'Square Foot', symbol: 'ft²', multiplier: 0.09290304 },
  { name: 'Square Yard', symbol: 'yd²', multiplier: 0.83612736 },
  { name: 'Acre', symbol: 'ac', multiplier: 4046.8564224 },
  { name: 'Hectare', symbol: 'ha', multiplier: 10000 },
  { name: 'Square Inch', symbol: 'in²', multiplier: 0.00064516 },
];

export const ENERGY_UNITS: RegistryUnit[] = [
  { name: 'Joule', symbol: 'J', multiplier: 1 },
  { name: 'Kilojoule', symbol: 'kJ', multiplier: 1000 },
  { name: 'Calorie', symbol: 'cal', multiplier: 4.184 },
  { name: 'Kilocalorie', symbol: 'kcal', multiplier: 4184 },
  { name: 'Watt Hour', symbol: 'Wh', multiplier: 3600 },
  { name: 'Kilowatt Hour', symbol: 'kWh', multiplier: 3.6e6 },
  { name: 'Electron Volt', symbol: 'eV', multiplier: 1.602176634e-19 },
  { name: 'BTU', symbol: 'BTU', multiplier: 1055.05585 },
];

export const POWER_UNITS: RegistryUnit[] = [
  { name: 'Watt', symbol: 'W', multiplier: 1 },
  { name: 'Kilowatt', symbol: 'kW', multiplier: 1000 },
  { name: 'Megawatt', symbol: 'MW', multiplier: 1e6 },
  { name: 'Horsepower', symbol: 'hp', multiplier: 745.699872 },
  { name: 'BTU/hour', symbol: 'BTU/h', multiplier: 0.29307107 },
];

export const PRESSURE_UNITS: RegistryUnit[] = [
  { name: 'Pascal', symbol: 'Pa', multiplier: 1 },
  { name: 'Bar', symbol: 'bar', multiplier: 100000 },
  { name: 'PSI', symbol: 'psi', multiplier: 6894.75729 },
  { name: 'Atmosphere', symbol: 'atm', multiplier: 101325 },
  { name: 'Torr', symbol: 'Torr', multiplier: 133.322368 },
  { name: 'mmHg', symbol: 'mmHg', multiplier: 133.322387 },
];

export const SPEED_UNITS: RegistryUnit[] = [
  { name: 'm/s', symbol: 'm/s', multiplier: 1 },
  { name: 'km/h', symbol: 'km/h', multiplier: 1 / 3.6 },
  { name: 'mph', symbol: 'mph', multiplier: 0.44704 },
  { name: 'knot', symbol: 'kt', multiplier: 0.514444444 },
  { name: 'Mach', symbol: 'Mach', multiplier: 343 },
];

// Helper to get Digital Storage Units based on the binary standard setting (base 1000 vs 1024)
export function getStorageUnits(isBinary: boolean): RegistryUnit[] {
  const base = isBinary ? 1024 : 1000;
  return [
    { name: 'Bit', symbol: 'b', multiplier: 0.125 },
    { name: 'Byte', symbol: 'B', multiplier: 1 },
    { name: isBinary ? 'Kibibyte' : 'Kilobyte', symbol: isBinary ? 'KiB' : 'KB', multiplier: base },
    { name: isBinary ? 'Mebibyte' : 'Megabyte', symbol: isBinary ? 'MiB' : 'MB', multiplier: Math.pow(base, 2) },
    { name: isBinary ? 'Gibibyte' : 'Gigabyte', symbol: isBinary ? 'GiB' : 'GB', multiplier: Math.pow(base, 3) },
    { name: isBinary ? 'Tebibyte' : 'Terabyte', symbol: isBinary ? 'TiB' : 'TB', multiplier: Math.pow(base, 4) },
    { name: isBinary ? 'Pebibyte' : 'Petabyte', symbol: isBinary ? 'PiB' : 'PB', multiplier: Math.pow(base, 5) },
  ];
}

// Map slug to unit arrays
export const UNIT_CONFIG_MAP: Record<string, { units: RegistryUnit[]; baseUnit: string }> = {
  'angle-converter': { units: ANGLE_UNITS, baseUnit: 'Degree' },
  'area-converter': { units: AREA_UNITS, baseUnit: 'Square Meter' },
  'energy-converter': { units: ENERGY_UNITS, baseUnit: 'Joule' },
  'power-converter': { units: POWER_UNITS, baseUnit: 'Watt' },
  'pressure-converter': { units: PRESSURE_UNITS, baseUnit: 'Pascal' },
  'speed-converter': { units: SPEED_UNITS, baseUnit: 'm/s' },
};
