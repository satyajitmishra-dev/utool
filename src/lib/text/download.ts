// Text download helpers
export function downloadTextFile(text: string, filename: string) {
  if (!text) return;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCsvFile(lines: string[], headers: string[], filename: string) {
  if (!lines || lines.length === 0) return;
  
  // Format lines as CSV: escape quotes and wrap in quotes
  const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;
  
  const csvRows = [
    headers.map(escapeCsv).join(","),
    ...lines.map((line, idx) => {
      // Split line into columns or just output line index + content
      return [String(idx + 1), line].map(escapeCsv).join(",");
    })
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
