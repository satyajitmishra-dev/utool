"use client";

import { useState } from "react";
import { toast } from "sonner";
import { WhisperSegment, WhisperApiResponse } from "@/services/GroqWhisperService";

/**
 * Converts decimal seconds into standard SRT subtitle format: HH:MM:SS,mmm
 */
export function formatSrtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  const pad = (num: number, size = 2) => String(num).padStart(size, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

/**
 * CompilesTimed Whisper Segments into an SRT subtitle track.
 */
export function buildSrtSubtitles(segments: WhisperSegment[]): string {
  return segments
    .map((seg, idx) => {
      const lineNum = idx + 1;
      const start = formatSrtTime(seg.start);
      const end = formatSrtTime(seg.end);
      const text = seg.text.trim();
      return `${lineNum}\n${start} --> ${end}\n${text}\n`;
    })
    .join("\n");
}

/**
 * Compiles timed Whisper segments into a flat paragraph transcript.
 */
export function buildParagraphTranscript(segments: WhisperSegment[]): string {
  return segments.map((seg) => seg.text.trim()).join(" ");
}

import { useR2Upload } from "@/hooks/useR2Upload";

export function useSubtitleGenerator() {
  const { uploadFileToR2, isUploading: isUploadingR2, uploadProgress: uploadProgressR2 } = useR2Upload();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<WhisperApiResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setResult(null);
    setErrorMessage(null);

    // Create object URL for audio/video tag playback preview
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const processMedia = async () => {
    if (!file) {
      toast.error("Please upload a media file first.");
      return;
    }

    setStatus("processing");
    setErrorMessage(null);
    const toastId = toast.loading("Preparing files...");

    try {
      let res: Response;
      const threshold30Mb = 30 * 1024 * 1024;

      if (file.size > threshold30Mb) {
        // --- CLOUDFLARE R2 UPLOAD PATH ---
        toast.loading(`Uploading to private storage... 0%`, { id: toastId });

        const { fileKey } = await uploadFileToR2(file, (progress) => {
          toast.loading(`Uploading to private storage... ${progress}%`, { id: toastId });
        });

        toast.loading("Transcribing speech via Groq Whisper API...", { id: toastId });
        res = await fetch("/api/tools/subtitle-generator", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileKey,
            filename: file.name,
            mimeType: file.type,
          }),
        });
      } else {
        // --- STANDARD DIRECT MULTIPART FLOW ---
        toast.loading("Uploading and transcribing speech via Groq Whisper API...", { id: toastId });

        const formData = new FormData();
        formData.append("file", file);

        res = await fetch("/api/tools/subtitle-generator", {
          method: "POST",
          body: formData,
        });
      }

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || "Failed to generate timed subtitles.");
      }

      setResult(body.data);
      setStatus("success");
      toast.success("Media transcribed successfully!", { id: toastId });
    } catch (err: any) {
      console.error("[useSubtitleGenerator] Error:", err);
      const msg = err.message || "An unexpected error occurred.";
      setErrorMessage(msg);
      setStatus("error");
      toast.error(msg, { id: toastId });
    }
  };

  const downloadSrt = () => {
    if (!result?.segments) return;
    
    const srtContent = buildSrtSubtitles(result.segments);
    const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file?.name.split(".")[0] || "subtitles"}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("SRT Subtitles downloaded!");
  };

  const downloadTxt = () => {
    if (!result?.segments) return;

    const txtContent = buildParagraphTranscript(result.segments);
    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${file?.name.split(".")[0] || "transcript"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Transcript document downloaded!");
  };

  const reset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  };

  return {
    file,
    previewUrl,
    result,
    status,
    errorMessage,
    isUploadingR2,
    uploadProgressR2,
    selectFile,
    processMedia,
    downloadSrt,
    downloadTxt,
    reset,
  };
}
export default useSubtitleGenerator;
