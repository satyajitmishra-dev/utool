import { useState } from "react";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { toast } from "sonner";

export function usePdfExporter() {
  const { recordUsage } = useToolLimit();
  const [exporting, setExporting] = useState(false);

  const exportPdfFile = async (
    bytes: Uint8Array,
    fileName: string,
    toolId: string
  ): Promise<boolean> => {
    setExporting(true);
    const toastId = toast.loading("Generating your final PDF file...");
    try {
      // 1. Prepare Blob with visual/electronic metadata type
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // 2. Trigger browser download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up DOM and URL reference
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);

      // 3. Record Successful Transaction
      await recordUsage(toolId, "success");
      
      toast.dismiss(toastId);
      toast.success("Download started successfully!");
      setExporting(false);
      
      // Notify page of success event
      window.dispatchEvent(new CustomEvent("tool-success", { detail: { toolSlug: toolId } }));
      
      return true;
    } catch (err: any) {
      console.error("PDF Export error:", err);
      const errMsg = err?.message || "Failed to compile and download PDF document.";
      toast.dismiss(toastId);
      toast.error(errMsg);
      
      await recordUsage(toolId, "failed", errMsg);
      setExporting(false);
      return false;
    }
  };

  return {
    exportPdfFile,
    exporting,
  };
}
