import { getConverter, ToolRegistryEntry } from './registry';
import { UNIT_CONFIG_MAP, getStorageUnits } from './units';
import { convertCurrency, fetchExchangeRates } from './currency';
import { parseCSV, jsonToCSV } from './csv';
import { analyzeJSON, formatJSON } from './json';
import { convertSingleImage } from './image';
import { validateNumericInput } from './validators';
import { formatValue, formatExact } from './formatter';

export interface ConversionParams {
  slug: string;
  value: any; // Can be string, number, File, or File[]
  fromUnit?: string;
  toUnit?: string;
  options?: {
    precision?: number;
    useScientific?: boolean;
    binaryStandard?: boolean; // For Digital Storage
    delimiter?: string;        // For CSV
    header?: boolean;          // For CSV
    minify?: boolean;          // For JSON
    imageOptions?: any;        // For PNG-to-JPG
  };
}

export interface ConversionResponse {
  success: boolean;
  result?: any;
  exactResult?: string;
  formulaUsed?: string;
  error?: string;
  processingTimeMs?: number;
}

/**
 * Main coordinator function to convert any registered format.
 */
export async function convert(params: ConversionParams): Promise<ConversionResponse> {
  const startTime = Date.now();
  const { slug, value, fromUnit, toUnit, options = {} } = params;

  try {
    // Check specific text/document/utility converters first
    if (slug === 'markdown-to-html' || slug === 'html-to-markdown') {
      if (fromUnit === 'HTML' || toUnit === 'Markdown' || slug === 'html-to-markdown') {
        const TurndownService = (await import('turndown')).default;
        const turndownService = new TurndownService();
        const mdText = turndownService.turndown(String(value));
        return {
          success: true,
          result: mdText,
          processingTimeMs: Date.now() - startTime,
        };
      } else {
        const { marked } = await import('marked');
        const htmlText = await marked.parse(String(value));
        return {
          success: true,
          result: htmlText,
          processingTimeMs: Date.now() - startTime,
        };
      }
    }
    if (slug === 'yaml-to-json') {
      const yaml = await import('js-yaml');
      if (fromUnit === 'JSON' || toUnit === 'YAML') {
        const parsed = JSON.parse(String(value));
        const yamlText = yaml.dump(parsed);
        return {
          success: true,
          result: yamlText,
          processingTimeMs: Date.now() - startTime,
        };
      } else {
        const parsed = yaml.load(String(value));
        const jsonText = JSON.stringify(parsed, null, 2);
        return {
          success: true,
          result: jsonText,
          processingTimeMs: Date.now() - startTime,
        };
      }
    }
    if (slug === 'base64-encoder-decoder') {
      if (fromUnit === 'Base64' || toUnit === 'Text') {
        try {
          const decoded = Buffer.from(String(value).trim(), 'base64').toString('utf-8');
          return {
            success: true,
            result: decoded,
            processingTimeMs: Date.now() - startTime,
          };
        } catch {
          return { success: false, error: 'Invalid Base64 string.' };
        }
      } else {
        const encoded = Buffer.from(String(value)).toString('base64');
        return {
          success: true,
          result: encoded,
          processingTimeMs: Date.now() - startTime,
        };
      }
    }

    const config = getConverter(slug);
    
    // Check custom overrides first
    if (config?.customConverterId) {
      switch (config.customConverterId) {
        case 'currency': {
          if (!fromUnit || !toUnit) {
            return { success: false, error: 'Source and target currencies are required.' };
          }
          const numVal = Number(value);
          if (isNaN(numVal)) {
            return { success: false, error: 'Please enter a valid numeric amount.' };
          }
          
          const rateFetch = await fetchExchangeRates();
          const converted = convertCurrency(numVal, fromUnit, toUnit, rateFetch.data.rates);
          const formatted = formatValue(converted, {
            precision: options.precision !== undefined ? options.precision : 4,
            useScientific: options.useScientific,
          });

          return {
            success: true,
            result: formatted,
            exactResult: formatExact(converted),
            formulaUsed: `1 ${fromUnit} = ${(rateFetch.data.rates[toUnit] / rateFetch.data.rates[fromUnit]).toFixed(6)} ${toUnit}`,
            processingTimeMs: Date.now() - startTime,
          };
        }

        case 'csv-json': {
          if (fromUnit === 'JSON' || toUnit === 'CSV') {
            const diagnostic = analyzeJSON(String(value));
            if (!diagnostic.isValid) {
              return {
                success: false,
                error: diagnostic.error || 'Invalid JSON format.',
              };
            }
            const csvText = await jsonToCSV(
              Array.isArray(diagnostic.parsedData) ? diagnostic.parsedData : [diagnostic.parsedData],
              { delimiter: options.delimiter }
            );
            return {
              success: true,
              result: csvText,
              processingTimeMs: Date.now() - startTime,
            };
          }

          const parsed = await parseCSV(String(value), {
            delimiter: options.delimiter,
            header: options.header,
          });
          if (parsed.errors.length > 0) {
            return {
              success: false,
              error: `CSV parsing errors: ${parsed.errors.map(e => e.message).join('; ')}`,
            };
          }
          const formattedJSON = formatJSON(parsed.data, {
            minify: options.minify,
            indent: 2,
          });
          return {
            success: true,
            result: formattedJSON,
            processingTimeMs: Date.now() - startTime,
          };
        }

        case 'png-jpg': {
          if (!(value instanceof Blob)) {
            return { success: false, error: 'Invalid file provided for conversion.' };
          }
          const targetFormat = slug === 'jpg-to-png' ? 'image/png' : 'image/jpeg';
          const outputBlob = await convertSingleImage(value, {
            ...options.imageOptions,
            targetFormat
          });
          return {
            success: true,
            result: outputBlob,
            processingTimeMs: Date.now() - startTime,
          };
        }

        default:
          return { success: false, error: 'Custom converter execution not configured.' };
      }
    }

    // Default: Mathematical Unit Converters
    if (!fromUnit || !toUnit) {
      return { success: false, error: 'Source and destination units are required.' };
    }

    // 1. Validate numeric input
    const validation = validateNumericInput(String(value), {
      allowNegative: config?.validation?.allowNegative,
      minValue: config?.validation?.minValue,
      maxValue: config?.validation?.maxValue,
    });

    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const numInput = Number(validation.sanitizedValue);

    // 2. Fetch unit configuration
    let units = UNIT_CONFIG_MAP[slug]?.units;
    if (slug === 'storage-converter') {
      units = getStorageUnits(!!options.binaryStandard);
    }

    if (!units) {
      return { success: false, error: `Unit configuration not found for converter: ${slug}` };
    }

    const source = units.find(u => u.name === fromUnit || u.symbol === fromUnit);
    const target = units.find(u => u.name === toUnit || u.symbol === toUnit);

    if (!source || !target) {
      return { success: false, error: 'Invalid source or destination unit selected.' };
    }

    // 3. Conversion math: convert to base, then to target
    // baseVal = input * source.multiplier
    // targetVal = baseVal / target.multiplier
    // For offset-based units (e.g. Temperature), apply offset. Since we only have multiplicative units:
    const toBaseVal = numInput * source.multiplier;
    const toTargetVal = toBaseVal / target.multiplier;

    // 4. Formats
    const formattedResult = formatValue(toTargetVal, {
      precision: options.precision,
      useScientific: options.useScientific,
    });

    // 5. Generate descriptive formula
    const conversionFactor = source.multiplier / target.multiplier;
    const formulaString = `1 ${source.symbol} = ${formatValue(conversionFactor, { precision: 8 })} ${target.symbol}`;

    return {
      success: true,
      result: formattedResult,
      exactResult: formatExact(toTargetVal),
      formulaUsed: formulaString,
      processingTimeMs: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Conversion error: ${err.message || err}`,
      processingTimeMs: Date.now() - startTime,
    };
  }
}
