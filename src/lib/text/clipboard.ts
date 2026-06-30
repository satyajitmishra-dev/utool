// Clipboard copy and paste wrappers
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error("Clipboard copy failed: ", err);
    return false;
  }
}

export async function readFromClipboard(): Promise<string> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      return sanitizeText(text);
    }
  } catch (err) {
    console.error("Clipboard paste failed: ", err);
  }
  return "";
}

// Simple text sanitization helper to clean up dangerous control chars
export function sanitizeText(text: string): string {
  if (!text) return "";
  // Strip control characters, keep newlines, carriage returns, tabs, and standard printable symbols
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}
