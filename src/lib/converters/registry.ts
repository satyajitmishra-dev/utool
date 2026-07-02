import { ANGLE_UNITS, AREA_UNITS, ENERGY_UNITS, POWER_UNITS, PRESSURE_UNITS, SPEED_UNITS, getStorageUnits } from './units';
import { CURRENCY_CATALOG } from './currency';

export type ConverterCategory = 
  | 'Converters' // General unit converters
  | 'Documents'  // Data & text converters
  | 'Image';     // Image & file suites

export type InputMode = 'number' | 'text' | 'file';

export interface RegistryUnit {
  name: string;
  symbol: string;
  multiplier: number; // Multiplier relative to the base unit
  offset?: number;    // Offset for non-zero origin conversions (e.g., Temperature)
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ExampleItem {
  title: string;
  description: string;
  input: string;
  output: string;
  fromUnit?: string;
  toUnit?: string;
}

export interface ToolRegistryEntry {
  id: string; // matches tool slug
  slug: string;
  name: string;
  description: string;
  category: ConverterCategory;
  primaryTag: string;
  iconTag: string;
  
  // Logical types
  inputMode: InputMode;
  outputMode: InputMode;
  
  // Unit conversion specific
  baseUnit?: string;
  units?: RegistryUnit[];
  
  // Custom execution override for non-standard converters (Currency, CSV, Image)
  customConverterId?: 'currency' | 'csv-json' | 'json-csv' | 'png-jpg';
  
  // Validation constraints
  validation: {
    allowNegative?: boolean;
    maxLength?: number;
    maxBytes?: number; // For files
    maxValue?: number;
    minValue?: number;
  };
  
  // Rich details & SEO
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
    h1?: string;
  };
  intro?: string;
  howItWorks: string[];
  benefits: { title: string; desc: string }[];
  faqs: FAQItem[];
  examples: ExampleItem[];
  relatedTools: string[];
  
  // Operational details
  analyticsId: string;
}

// Memory map of registered converters
const converterRegistry: Record<string, ToolRegistryEntry> = {};

export function registerConverter(entry: ToolRegistryEntry) {
  converterRegistry[entry.slug] = entry;
}

export function getConverter(slug: string): ToolRegistryEntry | undefined {
  let normalizedSlug = slug;
  if (slug === 'png-to-jpg' || slug === 'jpg-to-png') {
    normalizedSlug = 'png-to-jpg-converter';
  } else if (slug === 'csv-to-json' || slug === 'json-to-csv') {
    normalizedSlug = 'csv-to-json-converter';
  }
  return converterRegistry[normalizedSlug];
}

export function getAllConverters(): ToolRegistryEntry[] {
  return Object.values(converterRegistry);
}

// ==========================================
// REGISTER ALL 10 CONVERTERS ON CODE LOAD
// ==========================================

// 1. Angle Converter
registerConverter({
  id: 'angle-converter',
  slug: 'angle-converter',
  name: 'Angle Unit Converter',
  description: 'Convert angles between degrees, radians, gradians, minutes, seconds, and turns.',
  category: 'Converters',
  primaryTag: 'Converter',
  iconTag: 'Scale',
  inputMode: 'number',
  outputMode: 'number',
  baseUnit: 'Degree',
  units: ANGLE_UNITS,
  validation: { allowNegative: true, maxValue: 1e12, minValue: 1e-12 },
  seoMeta: {
    title: 'Angle Unit Converter — Degrees, Radians, Turns | UTool',
    description: 'Convert degrees to radians, turns to gradians, and standard circles instantly. 100% local, safe browser calculations.',
    keywords: ['angle converter', 'degrees to radians', 'radians to degrees', 'gradian converter'],
  },
  howItWorks: [
    'Enter the value you wish to convert in the input box.',
    'Select the source unit from the dropdown list.',
    'Select the target unit you wish to convert to.',
    'The result updates instantly with formula details.'
  ],
  benefits: [
    { title: 'Trigonometry Safe', desc: 'Maintains exact multipliers matching Math.PI coordinates.' },
    { title: 'Subatomic Precision', desc: 'Adjust decimal counts from 2 to 12 places in settings.' },
    { title: 'Works Offline', desc: 'No internet required. Calculations occur inside your browser.' }
  ],
  faqs: [
    { question: 'What is a Gradian?', answer: 'A gradian is a unit of measurement of an angle, equivalent to 1/400 of a turn. There are 100 gradians in a right angle.' },
    { question: 'How is Radian defined?', answer: 'A radian is the angle subtended at the center of a circle by an arc whose length is equal to the radius of the circle.' }
  ],
  examples: [
    { title: 'Degrees to Radians', description: 'Convert 180 degrees to circular radians.', input: '180', output: '3.1416', fromUnit: 'Degree', toUnit: 'Radian' },
    { title: 'Turns to Degrees', description: 'Convert 1 full turn to degrees.', input: '1', output: '360', fromUnit: 'Turn', toUnit: 'Degree' }
  ],
  relatedTools: ['area-converter', 'speed-converter'],
  analyticsId: 'angle_converter_use'
});

// 2. Area Converter
registerConverter({
  id: 'area-converter',
  slug: 'area-converter',
  name: 'Area Unit Converter',
  description: 'Convert surface sizes between square meters, square feet, acres, hectares, and square miles.',
  category: 'Converters',
  primaryTag: 'Converter',
  iconTag: 'Scale',
  inputMode: 'number',
  outputMode: 'number',
  baseUnit: 'Square Meter',
  units: AREA_UNITS,
  validation: { allowNegative: false, maxValue: 1e15, minValue: 1e-15 },
  seoMeta: {
    title: 'Area Unit Converter — Acres to Square Feet, Hectares | UTool',
    description: 'Convert land sizes and surfaces between square meters, square feet, acres, and hectares instantly. Free and secure client-side tool.',
    keywords: ['area converter', 'acres to square feet', 'hectares to acres', 'square meters to feet'],
  },
  howItWorks: [
    'Enter the area measurement value.',
    'Select the initial measurement unit (e.g. Acres).',
    'Choose your destination unit (e.g. Hectares).',
    'Output displays instantly.'
  ],
  benefits: [
    { title: 'Land Metric Standard', desc: 'Supports agricultural and residential area metrics.' },
    { title: '100% Local Math', desc: 'Runs entirely in client sandbox for data confidentiality.' },
    { title: 'Double Precision', desc: 'Allows rounding selectors up to 12 decimal points.' }
  ],
  faqs: [
    { question: 'How many square feet are in an acre?', answer: 'There are exactly 43,560 square feet in one acre.' },
    { question: 'What is a hectare?', answer: 'A hectare is a metric unit of area equal to 10,000 square meters, or approximately 2.471 acres.' }
  ],
  examples: [
    { title: 'Acre to Square Feet', description: 'Convert 1 standard acre to square feet.', input: '1', output: '43560', fromUnit: 'Acre', toUnit: 'Square Foot' },
    { title: 'Hectare to Square Meter', description: 'Convert 1 hectare to metric square meters.', input: '1', output: '10000', fromUnit: 'Hectare', toUnit: 'Square Meter' }
  ],
  relatedTools: ['length-converter', 'volume-converter'],
  analyticsId: 'area_converter_use'
});

// 3. Energy Converter
registerConverter({
  id: 'energy-converter',
  slug: 'energy-converter',
  name: 'Energy Unit Converter',
  description: 'Convert energy between joules, calories, watt-hours, kilowatt-hours, and BTUs.',
  category: 'Converters',
  primaryTag: 'Converter',
  iconTag: 'Scale',
  inputMode: 'number',
  outputMode: 'number',
  baseUnit: 'Joule',
  units: ENERGY_UNITS,
  validation: { allowNegative: false, maxValue: 1e15, minValue: 1e-15 },
  seoMeta: {
    title: 'Energy Unit Converter — Joules, Calories, kWh | UTool',
    description: 'Convert joules to calories, watt-hours to BTUs, and kilowatt-hours to food calories instantly. No limits and 100% secure.',
    keywords: ['energy converter', 'joules to calories', 'kwh to joules', 'btu to calories'],
  },
  howItWorks: [
    'Enter the energy value to be transformed.',
    'Select your source unit (e.g. Kilowatt Hour).',
    'Select target unit (e.g. Calories).',
    'View the converted value instantly.'
  ],
  benefits: [
    { title: 'Thermal & Electric Scales', desc: 'Bridges physics joules with heating BTUs and electricity kWh.' },
    { title: 'Subatomic Support', desc: 'Includes Electron Volts (eV) for quantum mechanics calculations.' },
    { title: 'Zero Lag', desc: 'Fires instantly on key triggers without round-trips.' }
  ],
  faqs: [
    { question: 'What is a British Thermal Unit (BTU)?', answer: 'A BTU is the amount of heat required to raise the temperature of one pound of liquid water by one degree Fahrenheit.' },
    { question: 'How many Joules are in a kWh?', answer: 'One Kilowatt Hour (kWh) is equivalent to exactly 3,600,000 Joules.' }
  ],
  examples: [
    { title: 'kWh to Joules', description: 'Convert 1 kilowatt hour of electricity to Joules.', input: '1', output: '3600000', fromUnit: 'Kilowatt Hour', toUnit: 'Joule' },
    { title: 'Calories to Joules', description: 'Convert 100 food calories to scientific Joules.', input: '100', output: '418.4', fromUnit: 'Calorie', toUnit: 'Joule' }
  ],
  relatedTools: ['power-converter', 'temperature-converter'],
  analyticsId: 'energy_converter_use'
});

// 4. Power Converter
registerConverter({
  id: 'power-converter',
  slug: 'power-converter',
  name: 'Power Unit Converter',
  description: 'Convert power units between watts, kilowatts, megawatts, horsepower, and BTUs per hour.',
  category: 'Converters',
  primaryTag: 'Converter',
  iconTag: 'Scale',
  inputMode: 'number',
  outputMode: 'number',
  baseUnit: 'Watt',
  units: POWER_UNITS,
  validation: { allowNegative: false, maxValue: 1e15, minValue: 1e-15 },
  seoMeta: {
    title: 'Power Unit Converter — Watts to Horsepower | UTool',
    description: 'Convert horsepower to watts, kilowatts to megawatts, and BTUs/hour to watts instantly. Local web sandbox calculation.',
    keywords: ['power converter', 'watts to horsepower', 'kw to hp', 'btu to watts'],
  },
  howItWorks: [
    'Enter the power amount in the input field.',
    'Select the source power unit (e.g. Horsepower).',
    'Choose the target power unit (e.g. Kilowatts).',
    'Output displays in milliseconds.'
  ],
  benefits: [
    { title: 'Mechanical & Heating Units', desc: 'Compare engine horsepower directly with heating BTU/hr metrics.' },
    { title: 'Grid Scale Ready', desc: 'Supports Megawatt conversions for industrial applications.' },
    { title: 'Keyboard Shortcuts', desc: 'Press Ctrl+R to reset and Ctrl+Shift+C to copy results.' }
  ],
  faqs: [
    { question: 'How many Watts are in one horsepower?', answer: 'One mechanical/imperial horsepower is equal to approximately 745.7 Watts.' },
    { question: 'What is a BTU per hour?', answer: 'BTU per hour is a unit of power that measures heat energy transfer rate. 1 BTU/hr is equal to ~0.293 Watts.' }
  ],
  examples: [
    { title: 'Horsepower to Kilowatts', description: 'Convert standard 100 horsepower to kilowatts.', input: '100', output: '74.57', fromUnit: 'Horsepower', toUnit: 'Kilowatt' },
    { title: 'Kilowatts to Watts', description: 'Convert 1.5 kilowatts to standard watts.', input: '1.5', output: '1500', fromUnit: 'Kilowatt', toUnit: 'Watt' }
  ],
  relatedTools: ['energy-converter', 'speed-converter'],
  analyticsId: 'power_converter_use'
});

// 5. Pressure Converter
registerConverter({
  id: 'pressure-converter',
  slug: 'pressure-converter',
  name: 'Pressure Unit Converter',
  description: 'Convert pressures between pascals, bars, PSI, atmospheres, torrs, and mmHg.',
  category: 'Converters',
  primaryTag: 'Converter',
  iconTag: 'Scale',
  inputMode: 'number',
  outputMode: 'number',
  baseUnit: 'Pascal',
  units: PRESSURE_UNITS,
  validation: { allowNegative: true, maxValue: 1e15, minValue: 1e-15 },
  seoMeta: {
    title: 'Pressure Unit Converter — Bar, PSI, Pascals, mmHg | UTool',
    description: 'Convert atmospheric and technical pressure scales between pascals, bars, PSI, mmHg, and atmospheres instantly. Free online tool.',
    keywords: ['pressure converter', 'psi to bar', 'bar to pascals', 'atm to psi'],
  },
  howItWorks: [
    'Type the pressure value into the workspace.',
    'Select the source pressure unit (e.g. Bar).',
    'Select the target pressure unit (e.g. PSI).',
    'Result updates instantly in high definition.'
  ],
  benefits: [
    { title: 'Multi-Discipline Scales', desc: 'Bridges physics Pascals with medical mmHg and automotive PSI.' },
    { title: 'Vacuum Ready', desc: 'Supports negative values for differential pressure and vacuum calculations.' },
    { title: 'Exact Factors', desc: 'Conversion multipliers calibrated against ISO specifications.' }
  ],
  faqs: [
    { question: 'What is 1 Atmosphere in PSI?', answer: 'One standard atmosphere (atm) is equivalent to approximately 14.696 PSI.' },
    { question: 'How are Torrs and mmHg related?', answer: 'They are nearly identical. 1 Torr is defined as 1/760 of an atmosphere, which is extremely close to 1 millimeter of mercury (~133.32 Pascals).' }
  ],
  examples: [
    { title: 'PSI to Bar', description: 'Convert tire pressure of 32 PSI to bars.', input: '32', output: '2.206', fromUnit: 'PSI', toUnit: 'Bar' },
    { title: 'Atmosphere to mmHg', description: 'Convert 1 standard atmosphere to mmHg.', input: '1', output: '760', fromUnit: 'Atmosphere', toUnit: 'mmHg' }
  ],
  relatedTools: ['volume-converter', 'speed-converter'],
  analyticsId: 'pressure_converter_use'
});

// 6. Speed Converter
registerConverter({
  id: 'speed-converter',
  slug: 'speed-converter',
  name: 'Speed Unit Converter',
  description: 'Convert velocity measurements between km/h, mph, m/s, knots, and Mach.',
  category: 'Converters',
  primaryTag: 'Converter',
  iconTag: 'Scale',
  inputMode: 'number',
  outputMode: 'number',
  baseUnit: 'm/s',
  units: SPEED_UNITS,
  validation: { allowNegative: false, maxValue: 1e12, minValue: 1e-12 },
  seoMeta: {
    title: 'Speed Unit Converter — km/h, mph, knots, Mach | UTool',
    description: 'Convert speed levels between miles per hour, kilometers per hour, knots, and Mach sound speed levels instantly. 100% secure.',
    keywords: ['speed converter', 'mph to kmh', 'kmh to mph', 'knots to mph'],
  },
  howItWorks: [
    'Enter the speed value to convert.',
    'Select the source unit from the dropdown list.',
    'Select the target unit (e.g. knots for marine, Mach for sound).',
    'Read results instantly.'
  ],
  benefits: [
    { title: 'Aeronautical & Marine', desc: 'Includes Mach speed of sound and Knots for nautical navigation.' },
    { title: 'Double Format Options', desc: 'Review exact results or scientific notations side-by-side.' },
    { title: 'Local Sandbox', desc: 'Secure local executions protect your activity records.' }
  ],
  faqs: [
    { question: 'What is Mach 1?', answer: 'Mach 1 represents the speed of sound, which is approximately 343 meters per second, 1,225 km/h, or 761 mph in air at 20°C.' },
    { question: 'How is Knot defined?', answer: 'A knot is a unit of speed equal to one nautical mile per hour, equivalent to exactly 1.852 km/h or approximately 1.151 mph.' }
  ],
  examples: [
    { title: 'mph to km/h', description: 'Convert highway speed of 60 mph to kilometers per hour.', input: '60', output: '96.56', fromUnit: 'mph', toUnit: 'km/h' },
    { title: 'm/s to km/h', description: 'Convert wind speed of 10 m/s to km/h.', input: '10', output: '36', fromUnit: 'm/s', toUnit: 'km/h' }
  ],
  relatedTools: ['time-converter', 'angle-converter'],
  analyticsId: 'speed_converter_use'
});

// 7. Digital Storage Converter
registerConverter({
  id: 'storage-converter',
  slug: 'storage-converter',
  name: 'Digital Storage Converter',
  description: 'Convert file sizes between bits, bytes, kilobytes (KB/KiB), megabytes (MB/MiB), gigabytes (GB/GiB), and terabytes.',
  category: 'Converters',
  primaryTag: 'Converter',
  iconTag: 'Scale',
  inputMode: 'number',
  outputMode: 'number',
  baseUnit: 'Byte',
  validation: { allowNegative: false, maxValue: 1e18, minValue: 1e-18 },
  seoMeta: {
    title: 'Digital Storage Converter — GB to MB, KB to GiB | UTool',
    description: 'Convert file and byte sizes between binary (1024) and decimal (1000) standards. Free, secure, client-side converter.',
    keywords: ['storage converter', 'gb to mb', 'tb to gb', 'kib to kb'],
  },
  howItWorks: [
    'Enter the storage capacity size.',
    'Select your initial unit (e.g. Gigabytes).',
    'Select your target unit (e.g. Megabytes).',
    'Toggle the Binary Standard switch in Settings if you want to use base-1024 calculations.'
  ],
  benefits: [
    { title: 'Double Standards', desc: 'Dynamically switch between base-1000 (standard consumer) and base-1024 (operating system binary) structures.' },
    { title: 'Petabyte Support', desc: 'Calculate massive server arrays down to individual bits.' },
    { title: 'Works Offline', desc: 'Secure client-side processing without remote server telemetry.' }
  ],
  faqs: [
    { question: 'What is the difference between GB and GiB?', answer: 'A Gigabyte (GB) uses the decimal standard (1,000,000,000 bytes), whereas a Gibibyte (GiB) uses the binary standard (1,073,741,824 bytes, or 1024 cubed).' },
    { question: 'How many bits are in a byte?', answer: 'There are exactly 8 bits in one byte.' }
  ],
  examples: [
    { title: 'GB to MB (Decimal)', description: 'Convert 1 Gigabyte to Megabytes in decimal standard.', input: '1', output: '1000', fromUnit: 'Gigabyte', toUnit: 'Megabyte' },
    { title: 'GiB to MiB (Binary)', description: 'Convert 1 Gibibyte to Mebibytes in binary standard.', input: '1', output: '1024', fromUnit: 'Gibibyte', toUnit: 'Mebibyte' }
  ],
  relatedTools: ['developer-tools', 'word-counter'],
  analyticsId: 'storage_converter_use'
});

// 8. Currency Converter
registerConverter({
  id: 'currency-converter',
  slug: 'currency-converter',
  name: 'Currency Exchange Converter',
  description: 'Convert real-time global exchange rates including USD, EUR, GBP, INR, JPY, and CAD.',
  category: 'Converters',
  primaryTag: 'Converter',
  iconTag: 'Scale',
  inputMode: 'number',
  outputMode: 'number',
  customConverterId: 'currency',
  validation: { allowNegative: false, maxValue: 1e12, minValue: 0.0001 },
  seoMeta: {
    title: 'Currency Exchange Converter — Live Foreign Exchange Rates | UTool',
    description: 'Calculate real-time currency exchange rates for 30+ global currencies. Secure client caching and offline support built-in.',
    keywords: ['currency converter', 'usd to eur', 'usd to inr', 'exchange rates converter'],
  },
  howItWorks: [
    'Select your source currency code (e.g. USD).',
    'Enter the financial amount you want to convert.',
    'Choose your target currency code (e.g. EUR).',
    'Live exchange rates fetch automatically and convert.'
  ],
  benefits: [
    { title: 'Live API Sync', desc: 'Syncs exchange rates directly with trusted public banking APIs.' },
    { title: 'Resilient Offline Mode', desc: 'Caches exchange rates locally. Shows clear indicator banners when offline.' },
    { title: 'Searchable Currencies', desc: 'Find currencies instantly by country names or ISO letters.' }
  ],
  faqs: [
    { question: 'Is this currency tool free?', answer: 'Yes, 100% free with unlimited checks. There are no paywalls or caps.' },
    { question: 'How often are the exchange rates updated?', answer: 'Rates are updated once daily by central banks and cached locally in your browser for 6 hours.' }
  ],
  examples: [
    { title: 'USD to EUR', description: 'Convert 100 US Dollars to Euros.', input: '100', output: '92.50', fromUnit: 'USD', toUnit: 'EUR' },
    { title: 'USD to INR', description: 'Convert 50 US Dollars to Indian Rupees.', input: '50', output: '4175', fromUnit: 'USD', toUnit: 'INR' }
  ],
  relatedTools: ['tax-calculator', 'loan-calculator'],
  analyticsId: 'currency_converter_use'
});

// 9. CSV to JSON Converter (Supports bi-directional via swap)
registerConverter({
  id: 'csv-to-json-converter',
  slug: 'csv-to-json-converter',
  name: 'CSV ⇄ JSON Converter',
  description: 'Convert spreadsheet CSV datasets to structured JSON objects and JSON files back to CSV.',
  category: 'Documents',
  primaryTag: 'Converter',
  iconTag: 'FileText',
  inputMode: 'text',
  outputMode: 'text',
  customConverterId: 'csv-json',
  validation: { allowNegative: true, maxLength: 5 * 1024 * 1024 }, // Max 5MB paste
  seoMeta: {
    title: 'CSV to JSON Converter — Convert CSV to JSON online free | UTool',
    description: 'Convert CSV spreadsheets to structured JSON arrays instantly. Delimiter autodetection, header checks, and grid preview tables included.',
    keywords: ['csv to json', 'json to csv', 'csv converter', 'convert spreadsheet to json'],
  },
  howItWorks: [
    'Paste your CSV data or drag a .csv file directly into the input workspace.',
    'The CSV parser autodetects delimiters and columns.',
    'Output prints as formatted JSON instantly.',
    'Toggle "View Table" to review a preview spreadsheet. Click Download to save file.'
  ],
  benefits: [
    { title: 'Auto Delimiter', desc: 'Detects comma, semicolon, tabs, and pipes dynamically.' },
    { title: 'Spreadsheet Previews', desc: 'Renders virtualized layout tables of data columns.' },
    { title: 'XSS Sanitized', desc: 'Safe client processing prevents execution of malicious scripts.' }
  ],
  faqs: [
    { question: 'Does my data get uploaded to a server?', answer: 'No. The conversion is processed entirely in your web browser using JavaScript. Your data remains on your machine.' },
    { question: 'Can I convert large CSV files?', answer: 'Yes. The parser can handle files up to several megabytes directly on your browser thread.' }
  ],
  examples: [
    { title: 'Basic CSV to JSON', description: 'Convert standard comma-separated lines to JSON structures.', input: 'name,age\nJohn,30\nJane,25', output: '[\n  {"name": "John", "age": 30},\n  {"name": "Jane", "age": 25}\n]' }
  ],
  relatedTools: ['csv-reader', 'xml-reader'],
  analyticsId: 'csv_json_converter_use'
});

// 10. PNG to JPG Converter Suite
registerConverter({
  id: 'png-to-jpg-converter',
  slug: 'png-to-jpg-converter',
  name: 'PNG → JPG Converter Suite',
  description: 'Convert PNG images to JPEG format. Handles transparent pixels, batch zip exports, quality sliders, and resizing.',
  category: 'Image',
  primaryTag: 'Converter',
  iconTag: 'Maximize2',
  inputMode: 'file',
  outputMode: 'file',
  customConverterId: 'png-jpg',
  validation: { allowNegative: false, maxBytes: 25 * 1024 * 1024 }, // Max 25MB file
  seoMeta: {
    title: 'PNG to JPG Converter Suite — 100% Free Client-Side | UTool',
    description: 'Convert PNG images to JPG in batches. Flatten transparency, adjust compression slider, remove metadata, and download files in ZIP.',
    keywords: ['png to jpg', 'batch image converter', 'transparency background compiler', 'image resizer'],
  },
  howItWorks: [
    'Drag and drop PNG images or click to select files.',
    'Configure background color and image quality in Settings.',
    'Process files in a single click.',
    'Download the resulting JPG file or ZIP bundle.'
  ],
  benefits: [
    { title: 'Batch Processing', desc: 'Upload and convert dozens of files in parallel.' },
    { title: 'Alpha Transparency', desc: 'Paints alpha channels with custom solid colors (defaults to white).' },
    { title: 'Zero Uploads', desc: 'Canvas processing runs locally. Confidentials are safe.' }
  ],
  faqs: [
    { question: 'Can I crop or resize my images?', answer: 'Yes. Settings panel allows custom dimensions to resize. Exif metadata is also naturally removed for privacy.' },
    { question: 'Does it work offline?', answer: 'Yes. Once loaded, the HTML5 Canvas processing works completely offline.' }
  ],
  examples: [
    { title: 'Standard Conversion', description: 'Convert PNG file to compressed JPEG at 85% quality.', input: 'Image.png (1.2 MB)', output: 'Image.jpg (180 KB)' }
  ],
  relatedTools: ['image-compressor', 'image-resizer'],
  analyticsId: 'png_jpg_converter_use'
});
