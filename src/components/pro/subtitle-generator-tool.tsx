"use client";

import React, { useState } from "react";
import { useSubtitleGenerator, formatSrtTime } from "@/hooks/useSubtitleGenerator";
import { usePro } from "@/hooks/use-pro";
import { UploadZone } from "@/components/tools/pdf/upload-zone";
import { UpgradeBanner } from "@/components/pro/upgrade-banner";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Video,
  Lock,
  Sparkles,
  Download,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  Play,
  Volume2,
} from "lucide-react";
import { formatBytes } from "@/utils/fileHelpers";

export function SubtitleGeneratorTool() {
  const { isPro, showUpgrade } = usePro();
  const {
    file,
    previewUrl,
    result,
    status,
    errorMessage,
    selectFile,
    processMedia,
    downloadSrt,
    downloadTxt,
    reset,
  } = useSubtitleGenerator();

  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ["audio/", "video/"];
      if (validTypes.some((type) => droppedFile.type.startsWith(type))) {
        selectFile(droppedFile);
      }
    }
  };

  const onFileSelect = (files: File[]) => {
    if (files.length > 0) {
      selectFile(files[0]);
    }
  };

  const handleProcessClick = () => {
    if (!isPro) {
      showUpgrade();
      return;
    }
    processMedia();
  };

  const isVideo = file?.type.startsWith("video/");

  return (
    <div className="w-full space-y-6">
      {/* Premium Banner for Free Users */}
      <UpgradeBanner />

      {!file ? (
        <UploadZone
          isDragActive={isDragActive}
          isParsing={status === "processing"}
          dragHandlers={{
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onDrop: handleDrop,
          }}
          onFileSelect={onFileSelect}
          maxSizeLabel={isPro ? "2GB" : "30MB"}
          allowMultiple={false}
          accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/x-m4a,audio/m4a,video/mp4,video/quicktime,video/webm"
          title="Upload your video or audio file."
          description="Drag & drop or browse from your device. Supports MP3, WAV, M4A, MP4, MOV, WebM."
          fileTypeLabel="Audio & Video Only"
          icon={<Video className="h-7 w-7 text-primary" />}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings panel */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-6 border-border space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Video className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">AI Transcription Options</h3>
              </div>

              {/* File Info */}
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-2 text-2xs leading-relaxed text-muted-foreground">
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Filename:</span>
                  <span className="truncate max-w-[150px]" title={file.name}>
                    {file.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Size:</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Type:</span>
                  <span className="uppercase">{file.type.split("/")[0]}</span>
                </div>
              </div>

              {/* Action Button */}
              {isPro ? (
                <Button
                  variant="premium"
                  className="w-full h-11 rounded-xl font-bold shadow-md shadow-primary/10 flex items-center justify-center gap-2"
                  onClick={processMedia}
                  loading={status === "processing"}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Subtitles
                </Button>
              ) : (
                <Button
                  variant="premium"
                  className="w-full h-11 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 filter blur-[0.3px] opacity-75"
                  onClick={handleProcessClick}
                >
                  <Lock className="h-4 w-4" />
                  Generate Subtitles
                  <span className="text-[8px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    PRO
                  </span>
                </Button>
              )}

              {/* Reset */}
              <Button
                variant="outline"
                className="w-full h-10 border-border rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40"
                onClick={reset}
                disabled={status === "processing"}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Upload Different File
              </Button>
            </GlassCard>

            {errorMessage && (
              <div className="p-4 rounded-xl border border-error/20 bg-error/5 text-xs text-error font-medium">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-6 border-border flex flex-col justify-between h-full min-h-[400px]">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xs font-bold text-foreground">Subtitle Timeline Canvas</span>
                <span className="text-3xs text-muted-foreground uppercase font-bold tracking-wider">
                  Media Player
                </span>
              </div>

              {/* Media Preview Tag */}
              <div className="my-6 flex flex-col items-center justify-center bg-muted/20 border border-border/80 rounded-2xl p-4 min-h-[160px] overflow-hidden relative shrink-0">
                {isVideo ? (
                  <video src={previewUrl!} controls className="max-w-full max-h-[180px] rounded-lg shadow-sm" />
                ) : (
                  <div className="w-full space-y-3 py-4 max-w-sm text-center">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                      <Volume2 className="h-5 w-5" />
                    </div>
                    <audio src={previewUrl!} controls className="w-full" />
                  </div>
                )}
              </div>

              {/* Timed Segments Output Console */}
              <div className="flex-1 border border-border/80 rounded-2xl bg-card/65 p-4 min-h-[220px] max-h-[300px] overflow-y-auto font-mono text-2xs space-y-2.5 relative">
                {status === "processing" && (
                  <div className="absolute inset-0 bg-background/55 backdrop-blur-xs flex flex-col items-center justify-center z-10 gap-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs font-bold text-foreground">AI transcribing speech streams...</span>
                  </div>
                )}

                {result?.segments ? (
                  result.segments.map((seg) => (
                    <div key={seg.id} className="flex gap-4 border-b border-border/40 pb-2 last:border-b-0">
                      <div className="text-primary font-bold flex items-center gap-1 shrink-0 text-3xs opacity-85">
                        <Clock className="h-3 w-3 shrink-0" />
                        {formatSrtTime(seg.start).split(",")[0]}
                      </div>
                      <div className="text-foreground/90 font-sans leading-relaxed text-xs">
                        {seg.text.trim()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-3xs uppercase tracking-wider font-bold">
                    Timed transcript will appear here.
                  </div>
                )}
              </div>

              {/* Subtitle Downloads */}
              {result?.segments && (
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1 justify-center sm:justify-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Subtitles Ready
                    </h4>
                    <p className="text-3xs text-muted-foreground mt-0.5">
                      Timed subtitle segments generated: {result.segments.length} lines.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="rounded-xl flex-1 sm:flex-none px-4 py-2 text-2xs font-bold border-border flex items-center gap-1.5"
                      onClick={downloadTxt}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Download TXT
                    </Button>
                    <Button
                      variant="premium"
                      className="rounded-xl flex-1 sm:flex-none px-5 py-2 text-2xs font-bold shadow-md flex items-center gap-1.5"
                      onClick={downloadSrt}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download SRT Subtitles
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
export default SubtitleGeneratorTool;
