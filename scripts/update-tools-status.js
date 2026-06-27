const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/config/tool-registry.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove all isPremium: true globally
content = content.replace(/\s*"isPremium": true,/g, '');

// 2. Add isPremium: true to subtitle-generator
content = content.replace(/("slug": "subtitle-generator",\s*"name": "[^"]+",)/, `$1\n    "isPremium": true,`);

// 3. Add requiresAuth: true and freeLimit: 1 to background-remover
content = content.replace(/("slug": "background-remover",\s*"name": "[^"]+",)/, `$1\n    "requiresAuth": true,\n    "freeLimit": 1,`);

fs.writeFileSync(filePath, content);
console.log('Updated tool registry for PRO and auth restrictions.');
