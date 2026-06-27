const fs = require('fs');
const files = [
  'src/app/(tools)/tools/[slug]/page.tsx', 
  'src/app/api/convert/[id]/route.ts', 
  'src/components/converter/ConverterLayout.tsx', 
  'src/components/upload/Uploader.tsx', 
  'src/lib/seo/engine.ts'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\\`/g, '\`').replace(/\\\$/g, '$');
  fs.writeFileSync(f, content);
});
console.log('Fixed');
