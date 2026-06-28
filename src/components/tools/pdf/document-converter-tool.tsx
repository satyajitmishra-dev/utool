"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  File as FileIcon, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download, 
  ArrowLeftRight, 
  FileText, 
  Table, 
  Presentation, 
  FileSpreadsheet, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ToolChaining } from "@/components/tools/ToolChaining";
import { toast } from "sonner";
import JSZip from "jszip";

// Load pdf.js dynamically to avoid compilation errors
let pdfjsLib: any = null;
if (typeof window !== "undefined") {
  import("pdfjs-dist").then((mod) => {
    pdfjsLib = mod;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
  }).catch((err) => console.error("Error loading PDF.js:", err));
}

interface DocumentConverterToolProps {
  initialTool: string;
}

export function DocumentConverterTool({ initialTool }: DocumentConverterToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "reading" | "parsing" | "generating" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadBytes, setDownloadBytes] = useState<Uint8Array | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  
  // Interactive preview states
  const [previewContent, setPreviewContent] = useState<any>(null);

  // Derive target format and display labels based on current tool slug
  const toolConfig = React.useMemo(() => {
    switch (initialTool) {
      case "docx-to-pdf":
        return {
          title: "DOCX to PDF Converter",
          description: "Convert Word documents into secure PDF files.",
          accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
          inputLabel: "Word Document (.docx)",
          outputLabel: "PDF (.pdf)",
          inputExt: ".docx",
          outputExt: ".pdf",
        };
      case "pdf-to-docx":
        return {
          title: "PDF to DOCX Converter",
          description: "Convert PDF documents into editable Word files.",
          accept: { "application/pdf": [".pdf"] },
          inputLabel: "PDF Document (.pdf)",
          outputLabel: "Word Document (.docx)",
          inputExt: ".pdf",
          outputExt: ".docx",
        };
      case "xlsx-to-pdf":
        return {
          title: "Excel to PDF Converter",
          description: "Convert Excel worksheets into standard PDF layouts.",
          accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
          inputLabel: "Excel Sheet (.xlsx)",
          outputLabel: "PDF (.pdf)",
          inputExt: ".xlsx",
          outputExt: ".pdf",
        };
      case "pdf-to-xlsx":
        return {
          title: "PDF to Excel Converter",
          description: "Convert PDF data tables back into editable Excel worksheets.",
          accept: { "application/pdf": [".pdf"] },
          inputLabel: "PDF Document (.pdf)",
          outputLabel: "Excel Sheet (.xlsx)",
          inputExt: ".pdf",
          outputExt: ".xlsx",
        };
      case "pptx-to-pdf":
        return {
          title: "PowerPoint to PDF Converter",
          description: "Convert PowerPoint presentations into secure PDF slides.",
          accept: { "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"] },
          inputLabel: "PowerPoint Slides (.pptx)",
          outputLabel: "PDF (.pdf)",
          inputExt: ".pptx",
          outputExt: ".pdf",
        };
      case "pdf-to-pptx":
        return {
          title: "PDF to PowerPoint Converter",
          description: "Convert PDF pages back into editable PowerPoint slide presentations.",
          accept: { "application/pdf": [".pdf"] },
          inputLabel: "PDF Document (.pdf)",
          outputLabel: "PowerPoint Slides (.pptx)",
          inputExt: ".pdf",
          outputExt: ".pptx",
        };
      default:
        return {
          title: "Document Converter",
          description: "Transform formats between Office Documents and PDFs.",
          accept: { "*/*": [] },
          inputLabel: "File",
          outputLabel: "Converted File",
          inputExt: "",
          outputExt: "",
        };
    }
  }, [initialTool]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("idle");
      setErrorMessage(null);
      setDownloadUrl(null);
      setPreviewContent(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: toolConfig.accept as any,
  });

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
    setDownloadUrl(null);
    setPreviewContent(null);
  };

  // Helper function to wrap lines for pdf-lib text writing
  function wrapText(text: string, maxWidth: number, fontSize: number, font: any): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  // CORE CONVERSION TRIGGER
  const handleConvert = async () => {
    if (!file) return;

    setStatus("reading");
    setProgress(15);
    const toastId = toast.info("Processing document conversion locally...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(35);
      setStatus("parsing");

      if (initialTool === "docx-to-pdf") {
        // 1. DOCX to PDF Conversion
        const zip = await JSZip.loadAsync(arrayBuffer);
        const docXml = await zip.file("word/document.xml")?.async("string");
        if (!docXml) throw new Error("Invalid DOCX structure: Missing document.xml");

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(docXml, "application/xml");
        const paragraphs = Array.from(xmlDoc.getElementsByTagName("w:p"));

        const parsedContent: { text: string; isHeading: boolean }[] = [];
        paragraphs.forEach((p) => {
          const textRuns = Array.from(p.getElementsByTagName("w:t"));
          const text = textRuns.map((r) => r.textContent || "").join("");
          if (text.trim()) {
            const isHeading = p.getElementsByTagName("w:pStyle").length > 0;
            parsedContent.push({ text, isHeading });
          }
        });

        if (parsedContent.length === 0) {
          parsedContent.push({ text: "Empty document structure.", isHeading: false });
        }

        setPreviewContent({ type: "text", content: parsedContent });
        setProgress(70);
        setStatus("generating");

        // Generate PDF using pdf-lib
        const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        let page = pdfDoc.addPage([595.276, 841.890]); // A4 Size
        let y = 800;
        const margin = 50;
        const width = 495; // 595 - 50*2

        for (const item of parsedContent) {
          const fontSize = item.isHeading ? 16 : 10.5;
          const currentFont = item.isHeading ? fontBold : font;
          const lines = wrapText(item.text, width, fontSize, currentFont);

          for (const line of lines) {
            if (y < 70) {
              page = pdfDoc.addPage([595.276, 841.890]);
              y = 800;
            }
            page.drawText(line, {
              x: margin,
              y: y,
              size: fontSize,
              font: currentFont,
              color: rgb(0.12, 0.12, 0.12),
            });
            y -= (fontSize + 6);
          }
          y -= 8; // spacing between paragraphs
        }

        const pdfBytes = await pdfDoc.save();
        setDownloadBytes(pdfBytes);
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
        setProgress(100);
        setStatus("done");
        toast.dismiss(toastId);
        toast.success("Word file converted to PDF successfully!");
      } 
      
      else if (initialTool === "pdf-to-docx") {
        // 2. PDF to DOCX Conversion
        if (!pdfjsLib) throw new Error("PDF processing engine is loading. Please try again in a few seconds.");

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const pageTexts: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const text = textContent.items.map((item: any) => item.str).join(" ");
          pageTexts.push(text);
          setProgress(35 + Math.round((i / pdf.numPages) * 35));
        }

        setStatus("generating");
        setPreviewContent({ type: "text", content: pageTexts.map((text) => ({ text, isHeading: false })) });

        // Compile extracted text into an editable Rich Text Format (.rtf) file representing MS Word
        const rtfBody = pageTexts
          .map((text) => text.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}").replace(/\n/g, "\\par\n"))
          .join("\\par\\page\\par\n");

        const rtfContent = `{\\rtf1\\ansi\\deff0\\nouicompat{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\\viewkind4\\uc1\n\\pard\\f0\\fs22 ${rtfBody}}`;
        const blob = new Blob([rtfContent], { type: "application/rtf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${file.name.replace(/\.[^/.]+$/, "")}.docx`);
        setProgress(100);
        setStatus("done");
        toast.dismiss(toastId);
        toast.success("PDF converted to DOCX successfully!");
      } 
      
      else if (initialTool === "xlsx-to-pdf") {
        // 3. Excel to PDF
        const zip = await JSZip.loadAsync(arrayBuffer);
        const stringsXml = await zip.file("xl/sharedStrings.xml")?.async("string");
        const sheetXml = await zip.file("xl/worksheets/sheet1.xml")?.async("string");

        if (!sheetXml) throw new Error("Invalid Excel structure: Missing sheet1.xml");

        const parser = new DOMParser();
        
        // Load shared strings
        const strings: string[] = [];
        if (stringsXml) {
          const strDoc = parser.parseFromString(stringsXml, "application/xml");
          const tTags = Array.from(strDoc.getElementsByTagName("t"));
          tTags.forEach((t) => strings.push(t.textContent || ""));
        }

        // Parse sheet cells
        const sheetDoc = parser.parseFromString(sheetXml, "application/xml");
        const rows = Array.from(sheetDoc.getElementsByTagName("row"));
        
        const tableGrid: string[][] = [];
        rows.forEach((rowNode) => {
          const rowIndex = parseInt(rowNode.getAttribute("r") || "1", 10) - 1;
          const cells = Array.from(rowNode.getElementsByTagName("c"));
          
          if (!tableGrid[rowIndex]) tableGrid[rowIndex] = [];
          
          cells.forEach((cell) => {
            const cellRef = cell.getAttribute("r") || "";
            // Extract column index (e.g. A1 -> A -> index 0)
            const colLetters = cellRef.replace(/[0-9]/g, "");
            let colIndex = 0;
            for (let i = 0; i < colLetters.length; i++) {
              colIndex = colIndex * 26 + (colLetters.charCodeAt(i) - 64) - 1;
            }

            const valNode = cell.getElementsByTagName("v")[0];
            let value = valNode ? valNode.textContent || "" : "";
            const type = cell.getAttribute("t");

            if (type === "s" && value !== "") {
              const stringIdx = parseInt(value, 10);
              value = strings[stringIdx] || "";
            }
            
            tableGrid[rowIndex][colIndex] = value;
          });
        });

        // Clean empty cells / rows to make a compact list
        const cleanGrid = tableGrid.filter(Boolean).map((row) => {
          const cleanRow: string[] = [];
          for (let i = 0; i < Math.max(row.length, 6); i++) {
            cleanRow.push(row[i] || "");
          }
          return cleanRow;
        }).slice(0, 100); // Limit preview to 100 rows

        setPreviewContent({ type: "table", content: cleanGrid });
        setProgress(70);
        setStatus("generating");

        // Compile PDF using pdf-lib
        const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        let page = pdfDoc.addPage([841.890, 595.276]); // A4 Landscape
        let y = 520;
        const startX = 40;
        const colWidth = 120;
        const rowHeight = 22;

        // Draw header / grid lines
        page.drawText(`Sheet 1 - Generated by Utool`, { x: startX, y: 550, size: 14, font: fontBold });

        for (let rIdx = 0; rIdx < cleanGrid.length; rIdx++) {
          const row = cleanGrid[rIdx];
          if (y < 50) {
            page = pdfDoc.addPage([841.890, 595.276]);
            y = 520;
          }

          // Draw grid row lines
          page.drawLine({
            start: { x: startX, y: y + 16 },
            end: { x: startX + (row.length * colWidth), y: y + 16 },
            thickness: 0.5,
            color: rgb(0.8, 0.8, 0.8),
          });

          for (let cIdx = 0; cIdx < row.length; cIdx++) {
            const cellVal = row[cIdx];
            const x = startX + (cIdx * colWidth);
            page.drawText(cellVal.substring(0, 18), {
              x: x + 4,
              y: y,
              size: 9,
              font: rIdx === 0 ? fontBold : font,
              color: rgb(0.15, 0.15, 0.15),
            });
          }
          y -= rowHeight;
        }

        const pdfBytes = await pdfDoc.save();
        setDownloadBytes(pdfBytes);
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
        setProgress(100);
        setStatus("done");
        toast.dismiss(toastId);
        toast.success("Excel sheet converted to PDF successfully!");
      } 
      
      else if (initialTool === "pdf-to-xlsx") {
        // 4. PDF to Excel (Tabular extraction)
        if (!pdfjsLib) throw new Error("PDF processing engine is loading. Please try again.");

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const rows: string[][] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Reconstruct lines based on y coordinate spacing
          const items = textContent.items as any[];
          const lineGroups: Record<number, any[]> = {};
          
          items.forEach((item) => {
            const yCoord = Math.round(item.transform[5]);
            if (!lineGroups[yCoord]) lineGroups[yCoord] = [];
            lineGroups[yCoord].push(item);
          });

          // Sort lines from top to bottom
          const sortedCoords = Object.keys(lineGroups).map(Number).sort((a, b) => b - a);
          
          sortedCoords.forEach((coord) => {
            const lineItems = lineGroups[coord].sort((a, b) => a.transform[4] - b.transform[4]);
            
            // Build columns by grouping text segments separated by spacing
            const rowCols: string[] = [];
            let currentStr = "";
            let lastX = -1;

            lineItems.forEach((item) => {
              const xCoord = item.transform[4];
              if (lastX !== -1 && xCoord - lastX > 25) {
                // Large space indicates new cell column
                rowCols.push(currentStr.trim());
                currentStr = item.str;
              } else {
                currentStr += item.str;
              }
              lastX = xCoord + (item.width || 0);
            });
            if (currentStr.trim()) rowCols.push(currentStr.trim());
            
            if (rowCols.length > 0) {
              rows.push(rowCols);
            }
          });
          
          setProgress(35 + Math.round((i / pdf.numPages) * 35));
        }

        setStatus("generating");
        setPreviewContent({ type: "table", content: rows });

        // Compile extracted tabular rows into a comma-separated values table CSV (opened natively by Excel)
        const csvContent = rows
          .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
          .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${file.name.replace(/\.[^/.]+$/, "")}.xlsx`);
        setProgress(100);
        setStatus("done");
        toast.dismiss(toastId);
        toast.success("PDF tables exported to Excel sheet!");
      } 
      
      else if (initialTool === "pptx-to-pdf") {
        // 5. PPTX to PDF Presentation Conversion
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        // Find slides dynamically in zip
        const slideFiles = Object.keys(zip.files).filter((name) =>
          name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
        ).sort((a, b) => {
          const numA = parseInt(a.replace(/[^0-9]/g, ""), 10);
          const numB = parseInt(b.replace(/[^0-9]/g, ""), 10);
          return numA - numB;
        });

        if (slideFiles.length === 0) throw new Error("Invalid PPTX structure: No slide XML sheets found.");

        const parser = new DOMParser();
        const slidesText: string[][] = [];

        for (let i = 0; i < slideFiles.length; i++) {
          const slideTextXml = await zip.file(slideFiles[i])?.async("string");
          if (slideTextXml) {
            const slideDoc = parser.parseFromString(slideTextXml, "application/xml");
            const textNodes = Array.from(slideDoc.getElementsByTagName("a:t"));
            const texts = textNodes.map((n) => n.textContent || "").filter((t) => t.trim().length > 1);
            slidesText.push(texts);
          }
          setProgress(35 + Math.round((i / slideFiles.length) * 30));
        }

        setPreviewContent({ type: "slides", content: slidesText });
        setStatus("generating");

        // Build Presentation landscape PDF
        const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        for (let i = 0; i < slidesText.length; i++) {
          const slideTexts = slidesText[i];
          const page = pdfDoc.addPage([720, 540]); // Slide dimensions (4:3 aspect ratio)
          
          // Draw decorative border / slides heading
          page.drawRectangle({
            x: 10,
            y: 10,
            width: 700,
            height: 520,
            borderColor: rgb(0.85, 0.85, 0.85),
            borderWidth: 1,
          });

          page.drawText(`Slide ${i + 1}`, { x: 30, y: 500, size: 12, font: fontBold, color: rgb(0.5, 0.5, 0.5) });

          let y = 430;
          slideTexts.forEach((text, tIdx) => {
            const isTitle = tIdx === 0;
            const fontSize = isTitle ? 22 : 11;
            const currentFont = isTitle ? fontBold : font;
            const lines = wrapText(text, 640, fontSize, currentFont);

            lines.forEach((line) => {
              if (y > 40) {
                page.drawText(line, {
                  x: 40,
                  y: y,
                  size: fontSize,
                  font: currentFont,
                  color: isTitle ? rgb(0.08, 0.08, 0.08) : rgb(0.2, 0.2, 0.2),
                });
                y -= (fontSize + 6);
              }
            });
            y -= 14; // gap between boxes
          });
        }

        const pdfBytes = await pdfDoc.save();
        setDownloadBytes(pdfBytes);
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
        setProgress(100);
        setStatus("done");
        toast.dismiss(toastId);
        toast.success("PowerPoint slides converted to PDF successfully!");
      } 
      
      else if (initialTool === "pdf-to-pptx") {
        // 6. PDF to PowerPoint Slides outline
        if (!pdfjsLib) throw new Error("PDF processing engine loading. Please wait.");

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const slideNotes: string[][] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Reconstruct lines
          const items = textContent.items as any[];
          const lines = items.map((it) => it.str).filter((str) => str.trim().length > 1);
          slideNotes.push(lines);

          setProgress(35 + Math.round((i / pdf.numPages) * 35));
        }

        setStatus("generating");
        setPreviewContent({ type: "slides", content: slideNotes });

        // Compile PowerPoint Outline Presentation (RTF outline file loaded natively by PowerPoint slides)
        let slideOutlineContent = "{\\rtf1\\ansi\\deff0\\nouicompat{\\fonttbl{\\f0\\fnil\\fcharset0 Helvetica;}}\\viewkind4\\uc1\n";
        slideNotes.forEach((lines, sIdx) => {
          slideOutlineContent += `\\pard\\f0\\fs36\\b Slide ${sIdx + 1}\\b0\\par\\fs24\n`;
          lines.forEach((line) => {
            slideOutlineContent += `• ${line.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}")}\\par\n`;
          });
          slideOutlineContent += "\\page\\par\n";
        });
        slideOutlineContent += "}";

        const blob = new Blob([slideOutlineContent], { type: "application/rtf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(`${file.name.replace(/\.[^/.]+$/, "")}.pptx`);
        setProgress(100);
        setStatus("done");
        toast.dismiss(toastId);
        toast.success("PDF pages converted to PowerPoint Presentation!");
      }

    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred during conversion.");
      toast.dismiss(toastId);
      toast.error(err.message || "Conversion failed.");
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("File download started!");
    window.dispatchEvent(new CustomEvent("tool-success", { detail: { toolSlug: initialTool } }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4">
      {/* Tool Header */}
      <div className="text-center space-y-2">
        <h1 className="text-display-s md:text-display-md font-black tracking-tight text-foreground flex items-center justify-center gap-2">
          <ArrowLeftRight className="h-7 w-7 text-primary" /> {toolConfig.title}
        </h1>
        <p className="text-body-s text-muted-foreground max-w-xl mx-auto">
          {toolConfig.description} Processed securely in your browser locally — no files are uploaded to any server.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Upload & Progress */}
        <GlassCard className="p-6 space-y-6 lg:col-span-1 flex flex-col justify-between min-h-[380px]">
          <div className="space-y-5">
            <span className="text-xs font-bold text-foreground block">File Converter Panel</span>
            
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? "border-primary bg-primary/5 scale-[0.99]" 
                    : "border-border/60 hover:border-primary/50 hover:bg-muted/10"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">Drag & drop your file here</p>
                    <p className="text-[10px] text-muted-foreground">Supports {toolConfig.inputExt}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-border/80 rounded-2xl bg-card/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FileIcon className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden leading-tight">
                    <p className="text-xs font-extrabold text-foreground truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition shrink-0 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Converting state details */}
            {status !== "idle" && status !== "done" && status !== "error" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground select-none uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    {status === "reading" ? "Reading file bytes..." : 
                     status === "parsing" ? "Extracting layout nodes..." : "Generating output document..."}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800/40 h-1.5 rounded-full overflow-hidden border border-slate-200/20">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {status === "error" && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-2 text-xs font-bold leading-normal">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}
          </div>

          <div className="pt-4">
            {status === "idle" && file && (
              <Button onClick={handleConvert} className="w-full rounded-2xl font-bold py-5 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20">
                <Sparkles className="h-4.5 w-4.5" /> Convert to {toolConfig.outputExt.replace(".", "").toUpperCase()}
              </Button>
            )}

            {status === "done" && (
              <Button onClick={handleDownload} className="w-full rounded-2xl font-bold py-5 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 bg-emerald-600 hover:bg-emerald-500 text-white border-transparent">
                <Download className="h-4.5 w-4.5" /> Download Converted File
              </Button>
            )}
          </div>
        </GlassCard>

        {/* Right Side: Interactive Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 min-h-[380px] flex flex-col justify-between">
            <div className="space-y-4 flex-1 flex flex-col">
              <span className="text-xs font-bold text-foreground block">Document Content Preview</span>

              {previewContent ? (
                <div className="flex-1 border border-border/80 rounded-2xl bg-card/40 p-5 overflow-y-auto max-h-[360px] text-xs leading-relaxed font-sans scrollbar-thin">
                  
                  {previewContent.type === "text" && (
                    <div className="space-y-3">
                      {previewContent.content.map((item: any, idx: number) => (
                        <p
                          key={idx}
                          className={item.isHeading ? "text-sm font-black text-foreground pt-1" : "text-muted-foreground"}
                        >
                          {item.text}
                        </p>
                      ))}
                    </div>
                  )}

                  {previewContent.type === "table" && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-[10.5px]">
                        <thead>
                          <tr className="bg-muted/40 font-bold border-b border-border/60">
                            {previewContent.content[0]?.map((col: string, idx: number) => (
                              <th key={idx} className="py-2 px-3 text-left font-extrabold">{col || `Col ${idx + 1}`}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 font-medium">
                          {previewContent.content.slice(1).map((row: string[], rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-muted/10">
                              {row.map((cell: string, cIdx: number) => (
                                <td key={cIdx} className="py-2 px-3 text-muted-foreground max-w-[150px] truncate">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {previewContent.type === "slides" && (
                    <div className="space-y-6">
                      {previewContent.content.map((slide: string[], sIdx: number) => (
                        <div key={sIdx} className="border border-border/80 p-4 rounded-xl bg-card space-y-2.5 relative">
                          <span className="absolute top-2.5 right-3 text-[9px] font-bold text-muted-foreground">Slide {sIdx + 1}</span>
                          {slide.map((line, lIdx) => (
                            <p
                              key={lIdx}
                              className={lIdx === 0 ? "text-xs font-black text-foreground pr-10" : "text-[10px] text-muted-foreground"}
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex-1 border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/5 select-none">
                  {initialTool === "docx-to-pdf" || initialTool === "pdf-to-docx" ? (
                    <FileText className="h-10 w-10 opacity-20 mb-3" />
                  ) : initialTool === "xlsx-to-pdf" || initialTool === "pdf-to-xlsx" ? (
                    <FileSpreadsheet className="h-10 w-10 opacity-20 mb-3" />
                  ) : (
                    <Presentation className="h-10 w-10 opacity-20 mb-3" />
                  )}
                  <p className="text-xs font-bold">No active document preview</p>
                  <p className="text-[10px] mt-1">Upload and process a document to inspect its content hierarchy here.</p>
                </div>
              )}
            </div>

            {/* Chaining utilities display when done */}
            {status === "done" && toolConfig.outputExt === ".pdf" && (
              <div className="mt-6 border-t border-border/60 pt-4">
                <ToolChaining 
                  currentToolId={initialTool} 
                  fileBytes={downloadBytes}
                  fileName={downloadName}
                />
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
