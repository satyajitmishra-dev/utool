const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/config/tool-registry.ts');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(/"q":/g, '"question":');
content = content.replace(/"a":/g, '"answer":');

fs.writeFileSync(filePath, content);
console.log('Fixed q and a in tool-registry.ts');
