const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/config/tool-registry.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const premiumTools = [
  'compress-pdf',
  'protect-pdf',
  'unlock-pdf',
  'pdf-ocr',
  'background-remover',
  'subtitle-generator'
];

for (const slug of premiumTools) {
  const regex = new RegExp(`("slug": "${slug}",\\s*"name": "[^"]+",)`);
  content = content.replace(regex, `$1\n    "isPremium": true,`);
}

fs.writeFileSync(filePath, content);
console.log('Set premium flags in registry');
