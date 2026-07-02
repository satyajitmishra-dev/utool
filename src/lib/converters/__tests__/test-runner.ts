import assert from 'assert';
import { convert } from '../engine';
import { getConverter, registerConverter } from '../registry';
import { validateNumericInput } from '../validators';
import { formatValue, formatExact } from '../formatter';

async function runTests() {
  console.log('🧪 Starting UTool Converter Engine Unit Tests...\n');

  // Test 1: Registry Lookup
  console.log('1. Testing Converter Registry Lookup...');
  const angleConfig = getConverter('angle-converter');
  assert.ok(angleConfig, 'Registry should find angle-converter configuration.');
  assert.strictEqual(angleConfig.baseUnit, 'Degree');
  console.log('✅ Registry lookup successful.\n');

  // Test 2: Input Validator
  console.log('2. Testing Numeric Input Validation...');
  const validVal = validateNumericInput(' 150.50 ');
  assert.strictEqual(validVal.isValid, true);
  assert.strictEqual(validVal.sanitizedValue, '150.50');

  const invalidVal = validateNumericInput('125.abc');
  assert.strictEqual(invalidVal.isValid, false, 'Should reject alphabetic chars.');

  const negativeVal = validateNumericInput('-10', { allowNegative: false });
  assert.strictEqual(negativeVal.isValid, false, 'Should reject negative values if configured.');
  console.log('✅ Input validation checks passed.\n');

  // Test 3: Math Unit Calculations
  console.log('3. Testing Unit Conversion Math...');
  // 100 km/h = 27.77777778 m/s
  const speedRes = await convert({
    slug: 'speed-converter',
    value: 100,
    fromUnit: 'km/h',
    toUnit: 'm/s',
    options: { precision: 6 }
  });
  assert.strictEqual(speedRes.success, true);
  assert.strictEqual(speedRes.result, '27.777778');
  console.log('✅ Unit conversion math checks passed.\n');

  // Test 4: Formatters
  console.log('4. Testing Number Formatters...');
  const formattedVal = formatValue(123456.789, { precision: 2 });
  assert.strictEqual(formattedVal, '123,456.79', 'Should display comma separators.');

  const sciVal = formatValue(0.00000123, { useScientific: true, precision: 4 });
  assert.ok(sciVal.includes('e-6'), 'Should force scientific notation.');
  console.log('✅ Output formatting checks passed.\n');

  // Test 5: Storage Dynamic Standard Toggles
  console.log('5. Testing Storage Decimal vs Binary Standards...');
  const decRes = await convert({
    slug: 'storage-converter',
    value: 1,
    fromUnit: 'Kilobyte',
    toUnit: 'Byte',
    options: { binaryStandard: false } // Decimal 1000
  });
  assert.strictEqual(decRes.result, '1,000');

  const binRes = await convert({
    slug: 'storage-converter',
    value: 1,
    fromUnit: 'Kibibyte',
    toUnit: 'Byte',
    options: { binaryStandard: true } // Binary 1024
  });
  assert.strictEqual(binRes.result, '1,024');
  console.log('✅ Storage standard triggers checked.\n');

  // Test 6: CSV ⇄ JSON Bi-directional conversions
  console.log('6. Testing CSV ⇄ JSON Engine...');
  const csvVal = 'id,name,role\n1,Alice,Engineer\n2,Bob,Architect';
  const csvToJsonRes = await convert({
    slug: 'csv-to-json-converter',
    value: csvVal,
    options: { delimiter: ',', header: true }
  });
  if (!csvToJsonRes.success) {
    console.error('CSV to JSON Error:', csvToJsonRes.error);
  }
  assert.strictEqual(csvToJsonRes.success, true);
  assert.ok(csvToJsonRes.result.includes('Alice'));
  assert.ok(csvToJsonRes.result.includes('Architect'));

  const jsonVal = '[\n  {"id": 1, "name": "Alice", "role": "Engineer"},\n  {"id": 2, "name": "Bob", "role": "Architect"}\n]';
  const jsonToCsvRes = await convert({
    slug: 'csv-to-json-converter', // Uses bidirectional via swap or type detection
    value: jsonVal,
    fromUnit: 'JSON',
    toUnit: 'CSV',
    options: { delimiter: ',' }
  });
  assert.strictEqual(jsonToCsvRes.success, true);
  assert.ok(jsonToCsvRes.result.includes('id,name,role'));
  console.log('✅ CSV ⇄ JSON conversions passed.\n');

  console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY! UTool Converter Engine is production-ready.');
}

runTests().catch(err => {
  console.error('❌ TEST FAILURE:', err);
  process.exit(1);
});
