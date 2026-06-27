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
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const selectFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setResult(null);
    setErrorMessage(null);
    setProgress(0);
    setProgressLabel("");

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
    setProgress(0);
    setProgressLabel("Preparing files...");

    try {
      let res: Response;
      const threshold30Mb = 30 * 1024 * 1024;

      if (file.size > threshold30Mb) {
        // --- CLOUDFLARE R2 UPLOAD PATH ---
        setProgressLabel("Uploading to storage...");

        const { fileKey } = await uploadFileToR2(file, (uploadProgress) => {
          setProgress(Math.round(uploadProgress * 0.7)); // 0-70% for upload
          setProgressLabel("Uploading to storage...");
        });

        setProgress(75);
        setProgressLabel("Transcribing speech...");
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
        setProgress(15);
        setProgressLabel("Uploading & transcribing...");

        const formData = new FormData();
        formData.append("file", file);

        // Simulate progress ticks during API wait
        const ticker = setInterval(() => {
          setProgress((p) => Math.min(p + 3, 85));
        }, 800);

        res = await fetch("/api/tools/subtitle-generator", {
          method: "POST",
          body: formData,
        });

        clearInterval(ticker);
      }

      setProgress(90);
      setProgressLabel("Parsing response...");

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || "Failed to generate timed subtitles.");
      }

      setResult(body.data);
      setProgress(100);
      setProgressLabel("Complete!");
      setStatus("success");
      toast.success("Media transcribed successfully!");
    } catch (err: any) {
      console.error("[useSubtitleGenerator] Error:", err);
      const msg = err.message || "An unexpected error occurred.";
      setErrorMessage(msg);
      setStatus("error");
      setProgress(0);
      setProgressLabel("");
      toast.error(msg);
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
    setProgress(0);
    setProgressLabel("");
  };

  return {
    file,
    previewUrl,
    result,
    status,
    errorMessage,
    progress,
    progressLabel,
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
