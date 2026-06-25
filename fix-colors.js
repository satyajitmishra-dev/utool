const fs = require("fs");
const path = require("path");

const files = [
  "compress-tool.tsx",
  "split-tool.tsx",
  "add-password-tool.tsx",
  "remove-password-tool.tsx",
];

const dir = path.join(__dirname, "src", "components", "tools", "pdf");

files.forEach((file) => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, "utf-8");

  // Backgrounds
  content = content.replace(/bg-white(\/90)?/g, "bg-card");
  content = content.replace(/bg-slate-50(\/50|\/10)?/g, "bg-muted");
  content = content.replace(/hover:bg-slate-50(\/50)?/g, "hover:bg-muted");
  
  // Texts
  content = content.replace(/text-slate-800/g, "text-foreground");
  content = content.replace(/text-slate-700/g, "text-foreground");
  content = content.replace(/text-slate-600/g, "text-muted-foreground");
  content = content.replace(/text-slate-500/g, "text-muted-foreground");
  content = content.replace(/text-slate-400/g, "text-muted-foreground");

  // Borders
  content = content.replace(/border-slate-200(\/80|\/60)?/g, "border-border");
  content = content.replace(/border-slate-100/g, "border-border");
  content = content.replace(/hover:border-slate-300/g, "hover:border-primary");

  // Selection states (like in compress-tool.tsx buttons)
  content = content.replace(/text-indigo-900/g, "text-primary-foreground");

  fs.writeFileSync(filePath, content, "utf-8");
});

console.log("Replaced light-mode classes with theme variables.");
