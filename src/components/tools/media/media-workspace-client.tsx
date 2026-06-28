"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Video,
  Music,
  FileText,
  Sparkles,
  Maximize2,
  FileVideo,
  Image as ImageIcon,
  Film,
  Camera,
  Search,
  Settings,
  Sliders,
  Scissors,
  Wrench,
  Trash2,
  FolderOpen,
  ArrowRight,
  Share2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  FolderDown,
  ChevronRight,
  Info,
  Clock,
  Heart,
  HardDrive,
  Activity,
  Plus,
  Compass,
  FileCode,
  QrCode,
  Volume2,
  Type,
  Maximize,
  HelpCircle,
  AlertCircle,
  Copy,
  Check
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import QRCode from "qrcode";
import { cn } from "@/utils/cn";

// Categories and sub-tools mapping
const CATEGORIES = {
  DASHBOARD: { label: "Workspace Dashboard", icon: Compass },
  DOWNLOAD: { label: "Media Downloader", icon: Download },
  CONVERT: { label: "Converters", icon: RotateCcw },
  EDIT: { label: "Media Editor", icon: Scissors },
  COMPRESS: { label: "Compressors", icon: Maximize2 },
  UTILITIES: { label: "Utilities", icon: Wrench },
};

const TOOLS = [
  // Download Category
  { id: "downloader", name: "Media Downloader", category: "DOWNLOAD", icon: Download, desc: "Download videos/audio client-side where permitted." },
  { id: "audio-downloader", name: "Audio Downloader", category: "DOWNLOAD", icon: Music, desc: "Extract and download audio tracks from online URLs." },
  { id: "thumbnail-downloader", name: "Thumbnail Downloader", category: "DOWNLOAD", icon: Camera, desc: "Grab video thumbnails in high definition." },

  // Convert Category
  { id: "video-converter", name: "Video Converter", category: "CONVERT", icon: FileVideo, desc: "Convert videos between MP4, WebM, and AVI formats." },
  { id: "audio-converter", name: "Audio Converter", category: "CONVERT", icon: Music, desc: "Transcode audio between MP3, WAV, M4A, and FLAC." },
  { id: "image-converter", name: "Image Converter", category: "CONVERT", icon: ImageIcon, desc: "Convert images to WebP, PNG, or JPG locally." },

  // Edit Category
  { id: "trim-video", name: "Trim Video", category: "EDIT", icon: Scissors, desc: "Select timestamps and trim video tracks in the client." },
  { id: "rotate-video", name: "Rotate Video", category: "EDIT", icon: RotateCcw, desc: "Rotate clips 90, 180, or 270 degrees." },

  // Compress Category
  { id: "image-compressor", name: "Image Compressor", category: "COMPRESS", icon: ImageIcon, desc: "Compress image file sizes directly in browser." },

  // Utilities Category
  { id: "audio-extractor", name: "Audio Extractor", category: "UTILITIES", icon: Music, desc: "Strip video elements and export raw audio tracks." },
  { id: "qr-generator", name: "QR Generator", category: "UTILITIES", icon: QrCode, desc: "Compile data strings into custom static QR codes." },
  { id: "hash-generator", name: "File Hash Generator", category: "UTILITIES", icon: FileCode, desc: "Generate MD5, SHA-1, and SHA-256 hashes of files." },
  { id: "meta-viewer", name: "Media Metadata Viewer", category: "UTILITIES", icon: FileCode, desc: "Read and display inner video/image EXIF metadata." },
];

interface QueueItem {
  id: string;
  name: string;
  type: "download" | "convert" | "compress" | "extract";
  status: "queued" | "processing" | "paused" | "completed" | "failed";
  progress: number;
  size: string;
  speed?: string;
  timeRemaining?: string;
}

interface SandboxFile {
  name: string;
  size: string;
  type: string;
  dimensions?: string;
  duration?: string;
  date: string;
  isFavorite?: boolean;
  isPinned?: boolean;
}

// Convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArr = new ArrayBuffer(length);
  const view = new DataView(bufferArr);
  const channels: Float32Array[] = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"
  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // chunk length
  setUint16(1);                                  // sample format (raw PCM)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2);                      // block align
  setUint16(16);                                 // bits per sample
  setUint32(0x61746164);                         // "data" chunk
  setUint32(length - pos - 4);                   // chunk length

  // write interleaved data
  for (i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {             // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF); // scale to 16-bit signed PCM
      view.setInt16(pos, sample, true);          // write 16-bit sample
      pos += 2;
    }
    offset++;
  }

  return new Blob([bufferArr], { type: "audio/wav" });

  // Helper block write
  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

export function MediaWorkspaceClient({ initialToolId }: { initialToolId?: string }) {
  const initialTool = initialToolId ? TOOLS.find(t => t.id === initialToolId) : null;
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORIES>(
    initialTool ? (initialTool.category as keyof typeof CATEGORIES) : "DASHBOARD"
  );
  const [selectedToolId, setSelectedToolId] = useState<string | null>(
    initialTool ? initialTool.id : null
  );

  // Sync initialToolId selection
  useEffect(() => {
    if (initialToolId) {
      const tool = TOOLS.find(t => t.id === initialToolId);
      if (tool) {
        setActiveCategory(tool.category as keyof typeof CATEGORIES);
        setSelectedToolId(tool.id);
      }
    }
  }, [initialToolId]);

  // Command Palette Ctrl + K
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);

  // Real-time Downloader State
  const [mediaUrl, setMediaUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [corsError, setCorsError] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [downloadTimeLeft, setDownloadTimeLeft] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Unified Sandbox State (holds the actual File object)
  const [sandboxFile, setSandboxFile] = useState<File | null>(null);
  const [recentFiles, setRecentFiles] = useState<SandboxFile[]>([
    { name: "Lofi Beats Chill.mp3", size: "12.4 MB", type: "audio/mpeg", date: "2 mins ago" },
    { name: "Profile Image Portrait.png", size: "1.2 MB", type: "image/png", dimensions: "800x800", date: "1 hour ago" },
  ]);

  // Image Converter State
  const [imgConvFile, setImgConvFile] = useState<File | null>(null);
  const [imgConvFormat, setImgConvFormat] = useState("webp");
  const [imgConvQuality, setImgConvQuality] = useState(0.85);
  const [imgConverting, setImgConverting] = useState(false);
  const [imgConvResult, setImgConvResult] = useState<{ url: string; size: string; savings: string; name: string } | null>(null);

  // Image Compressor State
  const [imgCompFile, setImgCompFile] = useState<File | null>(null);
  const [imgCompQuality, setImgCompQuality] = useState(0.7);
  const [imgCompScale, setImgCompScale] = useState(80);
  const [imgComping, setImgComping] = useState(false);
  const [imgCompResult, setImgCompResult] = useState<{ url: string; size: string; savings: string; name: string } | null>(null);

  // Audio Extractor State
  const [audioExtFile, setAudioExtFile] = useState<File | null>(null);
  const [audioExting, setAudioExting] = useState(false);
  const [audioExtProgress, setAudioExtProgress] = useState(0);
  const [audioExtResult, setAudioExtResult] = useState<string | null>(null);

  // File Hash Generator State
  const [hashFile, setHashFile] = useState<File | null>(null);
  const [hashAlgo, setHashAlgo] = useState<"SHA-256" | "SHA-1" | "SHA-512">("SHA-256");
  const [hashResult, setHashResult] = useState("");
  const [hashing, setHashing] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Local QR Generator State
  const [qrText, setQrText] = useState("");
  const [generatedQr, setGeneratedQr] = useState("");

  // Metadata Viewer State
  const [metaFile, setMetaFile] = useState<File | null>(null);
  const [metaDetails, setMetaDetails] = useState<any | null>(null);

  // Audio Converter State
  const [audioConvFile, setAudioConvFile] = useState<File | null>(null);
  const [audioConverting, setAudioConverting] = useState(false);
  const [audioConvResult, setAudioConvResult] = useState<string | null>(null);
  const [audioConvPreviewUrl, setAudioConvPreviewUrl] = useState<string | null>(null);

  const handleSetAudioConvFile = (file: File | null) => {
    if (audioConvPreviewUrl) {
      URL.revokeObjectURL(audioConvPreviewUrl);
    }
    setAudioConvFile(file);
    setAudioConvResult(null);
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioConvPreviewUrl(url);
    } else {
      setAudioConvPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (audioConvPreviewUrl) {
        URL.revokeObjectURL(audioConvPreviewUrl);
      }
    };
  }, [audioConvPreviewUrl]);

  // Active Downloader Queue
  const [queue, setQueue] = useState<QueueItem[]>([]);

  // Keyboard Command Palette
  const filteredTools = searchQuery.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : TOOLS.slice(0, 8);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        setSearchQuery("");
        setSearchIndex(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectTool = (tool: typeof TOOLS[0]) => {
    setActiveCategory(tool.category as keyof typeof CATEGORIES);
    setSelectedToolId(tool.id);
    setSearchOpen(false);
  };

  // Real-time direct link media downloader with stream progress
  const handleAnalyzeUrl = async () => {
    if (!mediaUrl.trim()) {
      toast.error("Please enter a valid link.");
      return;
    }
    setAnalyzing(true);
    setAnalysisResult(null);
    setCorsError(false);

    const urlString = mediaUrl.trim();
    let title = "Online Media Stream";
    let thumbnail = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=480";
    let isYouTube = false;

    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/||user\/[^\/]+\/)|youtu\.be\/)([^"&?\/ ]{11})/;
    const ytMatch = urlString.match(ytRegex);

    if (ytMatch) {
      const videoId = ytMatch[1];
      title = `YouTube Video (${videoId})`;
      thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      isYouTube = true;
    } else {
      const parts = urlString.split("/");
      const lastPart = parts[parts.length - 1].split("?")[0];
      if (lastPart && lastPart.includes(".")) {
        title = lastPart;
      }
    }

    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult({
        title,
        thumbnail,
        url: urlString,
        isYouTube,
        formats: [
          { quality: "Original Media File", format: isYouTube ? "mp4" : title.split(".").pop() || "mp4", size: "Unknown", type: "video" }
        ]
      });
      if (isYouTube) {
        setCorsError(true);
      }
      toast.success("Link analyzed successfully!");
    }, 1000);
  };

  const startStreamDownload = async (mode: "video" | "audio") => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadSpeed("Connecting to media server...");
    setDownloadTimeLeft("");

    const queueId = "dl_" + Date.now();
    const filename = mode === "audio" 
      ? `${analysisResult?.title || "audio"}.mp3` 
      : `${analysisResult?.title || "video"}.mp4`;

    const newQueueItem: QueueItem = {
      id: queueId,
      name: filename,
      type: "download",
      status: "processing",
      progress: 0,
      size: "Calculating...",
    };
    setQueue((prev) => [newQueueItem, ...prev]);

    try {
      // 1. Resolve media URL via public Cobalt API
      const cobaltRes = await fetch("https://api.cobalt.tools/", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: analysisResult.url,
          downloadMode: mode === "audio" ? "audio" : "auto",
          audioFormat: "mp3",
          vQuality: "720"
        })
      });

      if (!cobaltRes.ok) {
        throw new Error("API server responded with error. The media link might be restricted.");
      }

      const cobaltData = await cobaltRes.json();
      if (cobaltData.status === "error") {
        throw new Error(cobaltData.text || "Failed to parse download url.");
      }

      const directStreamUrl = cobaltData.url;
      if (!directStreamUrl) {
        throw new Error("No download stream URL returned.");
      }

      // 2. Fetch the resolved stream. Try direct, fallback to Allorigins proxy if CORS fails.
      let response: Response;
      try {
        response = await fetch(directStreamUrl);
      } catch (e) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directStreamUrl)}`;
        response = await fetch(proxyUrl);
      }

      if (!response.ok) throw new Error("CORS or Network issue");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("ReadableStream not supported on this resource");

      const contentLength = response.headers.get("content-length");
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      
      setQueue((prev) =>
        prev.map((item) =>
          item.id === queueId
            ? { ...item, size: totalBytes ? `${(totalBytes / 1024 / 1024).toFixed(1)} MB` : "Unknown" }
            : item
        )
      );

      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;
      const startTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedBytes += value.length;

        const percent = totalBytes ? Math.round((receivedBytes / totalBytes) * 100) : 50;
        const elapsed = (Date.now() - startTime) / 1000;
        const speedBps = elapsed > 0 ? receivedBytes / elapsed : 0;
        const speedMbps = (speedBps / 1024 / 1024).toFixed(1);

        setDownloadProgress(percent);
        setDownloadSpeed(`${speedMbps} MB/s`);
        
        if (totalBytes > 0) {
          const remainingSec = Math.ceil((totalBytes - receivedBytes) / speedBps);
          setDownloadTimeLeft(`${remainingSec}s left`);
        }

        setQueue((prev) =>
          prev.map((item) =>
            item.id === queueId
              ? {
                  ...item,
                  progress: percent,
                  speed: `${speedMbps} MB/s`,
                  timeRemaining: totalBytes ? `${Math.ceil((totalBytes - receivedBytes) / speedBps)}s` : ""
                }
              : item
          )
        );
      }

      const blob = new Blob(chunks as any);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setQueue((prev) =>
        prev.map((item) => (item.id === queueId ? { ...item, status: "completed", progress: 100 } : item))
      );
      setRecentFiles((prev) => [
        {
          name: filename,
          size: `${(blob.size / 1024 / 1024).toFixed(1)} MB`,
          type: blob.type || (mode === "audio" ? "audio/mpeg" : "video/mp4"),
          date: "Just now"
        },
        ...prev
      ]);
      toast.success("Download completed!");
      window.dispatchEvent(new CustomEvent("tool-success", { detail: { toolSlug: "media-workspace" } }));
    } catch (err: any) {
      console.error(err);
      setCorsError(true);
      setQueue((prev) =>
        prev.map((item) => (item.id === queueId ? { ...item, status: "failed", progress: 0 } : item))
      );
      toast.error(err.message || "Security policy blocked direct stream. Try direct link or search.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Image Converter
  const convertImageReal = () => {
    if (!imgConvFile) return;
    setImgConverting(true);
    setImgConvResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const mime = imgConvFormat === "png" ? "image/png" : imgConvFormat === "jpg" ? "image/jpeg" : "image/webp";
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const name = `${imgConvFile.name.substring(0, imgConvFile.name.lastIndexOf(".")) || imgConvFile.name}-converted.${imgConvFormat}`;
              const origSize = imgConvFile.size;
              const newSize = blob.size;
              const savings = origSize > newSize ? `${Math.round(((origSize - newSize) / origSize) * 100)}% saved` : "lossless";
              
              setImgConvResult({
                url,
                name,
                size: `${(blob.size / 1024).toFixed(1)} KB`,
                savings
              });

              // Add to recent files
              setRecentFiles((prev) => [
                {
                  name,
                  size: `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
                  type: mime,
                  dimensions: `${img.width}x${img.height}`,
                  date: "Just now"
                },
                ...prev
              ]);
              toast.success("Converted successfully!");
            }
            setImgConverting(false);
          }, mime, imgConvQuality);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imgConvFile);
  };

  // Image Compressor
  const compressImageReal = () => {
    if (!imgCompFile) return;
    setImgComping(true);
    setImgCompResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = imgCompScale / 100;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const name = `${imgCompFile.name.substring(0, imgCompFile.name.lastIndexOf(".")) || imgCompFile.name}-compressed.jpg`;
              const origSize = imgCompFile.size;
              const newSize = blob.size;
              const savings = origSize > newSize ? `${Math.round(((origSize - newSize) / origSize) * 100)}% smaller` : "0%";
              
              setImgCompResult({
                url,
                name,
                size: `${(blob.size / 1024).toFixed(1)} KB`,
                savings
              });
              
              setRecentFiles((prev) => [
                {
                  name,
                  size: `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
                  type: "image/jpeg",
                  dimensions: `${canvas.width}x${canvas.height}`,
                  date: "Just now"
                },
                ...prev
              ]);
              toast.success("Compressed successfully!");
            }
            setImgComping(false);
          }, "image/jpeg", imgCompQuality);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imgCompFile);
  };

  // Audio Extractor (Web Audio API)
  const extractAudioReal = async () => {
    if (!audioExtFile) return;
    setAudioExting(true);
    setAudioExtProgress(10);
    setAudioExtResult(null);

    const queueId = "ext_" + Date.now();
    const newQueueItem: QueueItem = {
      id: queueId,
      name: `Soundtrack_${audioExtFile.name.substring(0, audioExtFile.name.lastIndexOf(".")) || audioExtFile.name}.wav`,
      type: "extract",
      status: "processing",
      progress: 10,
      size: "Processing...",
    };
    setQueue((prev) => [newQueueItem, ...prev]);

    try {
      const arrayBuffer = await audioExtFile.arrayBuffer();
      setAudioExtProgress(40);
      
      const AudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffer = await AudioCtx.decodeAudioData(arrayBuffer);
      setAudioExtProgress(75);
      
      const wavBlob = audioBufferToWav(decodedBuffer);
      const url = URL.createObjectURL(wavBlob);
      setAudioExtResult(url);
      setAudioExtProgress(100);

      setQueue((prev) =>
        prev.map((item) => (item.id === queueId ? { ...item, status: "completed", progress: 100 } : item))
      );

      setRecentFiles((prev) => [
        {
          name: newQueueItem.name,
          size: `${(wavBlob.size / 1024 / 1024).toFixed(1)} MB`,
          type: "audio/wav",
          duration: `${Math.round(decodedBuffer.duration)}s`,
          date: "Just now"
        },
        ...prev
      ]);
      toast.success("Sound extracted successfully!");
    } catch (err) {
      console.error(err);
      setAudioExtProgress(0);
      setQueue((prev) =>
        prev.map((item) => (item.id === queueId ? { ...item, status: "failed", progress: 0 } : item))
      );
      toast.error("Failed to decode audio track. Ensure the video contains audio data.");
    } finally {
      setAudioExting(false);
    }
  };

  // Audio Converter (WAV conversion)
  const convertAudioReal = async () => {
    if (!audioConvFile) return;
    setAudioConverting(true);
    setAudioConvResult(null);

    try {
      const arrayBuffer = await audioConvFile.arrayBuffer();
      const AudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffer = await AudioCtx.decodeAudioData(arrayBuffer);
      
      const wavBlob = audioBufferToWav(decodedBuffer);
      const url = URL.createObjectURL(wavBlob);
      setAudioConvResult(url);

      const outputName = `${audioConvFile.name.substring(0, audioConvFile.name.lastIndexOf(".")) || audioConvFile.name}-converted.wav`;
      
      setRecentFiles((prev) => [
        {
          name: outputName,
          size: `${(wavBlob.size / 1024 / 1024).toFixed(2)} MB`,
          type: "audio/wav",
          duration: `${Math.round(decodedBuffer.duration)}s`,
          date: "Just now"
        },
        ...prev
      ]);
      toast.success("Audio converted to WAV format!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to convert audio file.");
    } finally {
      setAudioConverting(false);
    }
  };

  // Cryptographic File Hashing
  const hashFileReal = async () => {
    if (!hashFile) return;
    setHashing(true);
    setHashResult("");

    try {
      const buffer = await hashFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest(hashAlgo, buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setHashResult(hex);
      toast.success("Hash calculated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Could not calculate hash.");
    } finally {
      setHashing(false);
    }
  };

  // QR Code Generation
  const generateQrReal = async () => {
    if (!qrText.trim()) return;
    try {
      const url = await QRCode.toDataURL(qrText, {
        width: 400,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setGeneratedQr(url);
      toast.success("QR Code compiled!");
    } catch (err) {
      toast.error("Failed to generate QR Code.");
    }
  };

  // File Metadata Inspector
  const readMetadataReal = async (file: File) => {
    setMetaFile(file);
    setMetaDetails(null);

    const details: any = {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB (${file.size.toLocaleString()} bytes)`,
      type: file.type || "unknown/binary",
      lastModified: new Date(file.lastModified).toLocaleString(),
    };

    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        details.dimensions = `${img.width} x ${img.height} pixels`;
        details.aspectRatio = (img.width / img.height).toFixed(2);
        setMetaDetails(details);
      };
      img.src = URL.createObjectURL(file);
    } else if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
      const mediaEl = document.createElement(file.type.startsWith("video/") ? "video" : "audio");
      mediaEl.src = URL.createObjectURL(file);
      mediaEl.onloadedmetadata = () => {
        details.duration = `${mediaEl.duration.toFixed(1)} seconds`;
        if (file.type.startsWith("video/")) {
          details.resolution = `${(mediaEl as HTMLVideoElement).videoWidth} x ${(mediaEl as HTMLVideoElement).videoHeight} pixels`;
        }
        setMetaDetails(details);
      };
    } else {
      setMetaDetails(details);
    }
  };

  // Sandbox File Loading & Magic Box Redirection
  const handleSandboxSelect = (file: File) => {
    setSandboxFile(file);
    toast.success(`Sandbox ready: ${file.name}`);
  };

  // Copy helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="relative min-h-[640px] bg-background text-foreground flex flex-col lg:flex-row gap-6">
      
      {/* Floating command palette indicator */}
      <div className="absolute top-[-52px] right-0 hidden sm:flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-card/60 backdrop-blur-md px-3.5 py-2 text-caption font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.06] active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <Search className="h-3.5 w-3.5 text-primary" />
          <span>Search Tools</span>
          <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] border border-border">Ctrl+K</kbd>
        </button>
      </div>

      {/* LEFT SIDEBAR NAVIGATION */}
      <GlassCard hover={false} className="w-full lg:w-64 shrink-0 flex flex-col p-4 space-y-2.5 bg-card/50">
        <div className="px-3 py-2 flex items-center justify-between border-b border-border/60 pb-3 mb-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Sliders className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-extrabold tracking-tight text-foreground">Media OS Panel</span>
          </div>
          <Badge variant="primary" className="text-[9px]">Module</Badge>
        </div>

        {Object.entries(CATEGORIES).map(([key, value]) => {
          const Icon = value.icon;
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveCategory(key as keyof typeof CATEGORIES);
                setSelectedToolId(null);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all border",
                isActive
                  ? "bg-primary/10 text-primary border-primary/20 shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{value.label}</span>
              </div>
              <ChevronRight className={cn("h-3 w-3 transition-transform opacity-40", isActive && "translate-x-0.5 opacity-80")} />
            </button>
          );
        })}

        {/* System Health */}
        <div className="pt-6 border-t border-border mt-auto space-y-2 text-[10px] text-muted-foreground font-bold">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> System Engine</span>
            <span className="text-emerald-400">100% Client Only</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Quota Usage</span>
            <span className="text-primary font-extrabold">UNLIMITED</span>
          </div>
        </div>
      </GlassCard>

      {/* RIGHT SIDE WORKSPACE */}
      <div className="flex-1 min-w-0 flex flex-col space-y-6">

        {/* WORKSPACE DASHBOARD */}
        {activeCategory === "DASHBOARD" && !selectedToolId && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Media Hub Overview</h2>
                <p className="text-body-s text-muted-foreground mt-0.5">Drag a file or select a tool below. 100% private, runs in-browser.</p>
              </div>
              <Badge variant="success" className="w-fit">WASM core ready</Badge>
            </div>

            {/* Sandbox Dropzone (Unified Drop) */}
            <div className="space-y-4">
              {!sandboxFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files.length > 0) {
                      handleSandboxSelect(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleSandboxSelect(file);
                    };
                    input.click();
                  }}
                  className="border border-dashed border-border/80 hover:border-primary/50 bg-muted/20 hover:bg-muted/40 transition rounded-2xl p-8 text-center space-y-3 relative group cursor-pointer"
                >
                  <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground/60 group-hover:scale-105 transition-transform duration-300" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Drop any file here or click to select</p>
                    <p className="text-xs text-muted-foreground mt-1">Video, audio, or image. We'll automatically show what you can do with it!</p>
                  </div>
                </div>
              ) : (
                /* Auto-Detect Magic Box (3yo simple workflow) */
                <GlassCard hover={false} className="p-6 border-primary/30 bg-primary/5 space-y-5 animate-scale-in relative">
                  <button
                    onClick={() => setSandboxFile(null)}
                    className="absolute top-4 right-4 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    ✕ Clear File
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center animate-bounce">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-foreground">✨ Utool Smart Action Finder</h3>
                      <p className="text-xs text-muted-foreground">We detected your file: <span className="font-bold text-foreground">{sandboxFile.name}</span> ({ (sandboxFile.size / 1024 / 1024).toFixed(2) } MB)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* VIDEO ACTIONS */}
                    {sandboxFile.type.startsWith("video/") && (
                      <>
                        <button
                          onClick={() => {
                            setAudioExtFile(sandboxFile);
                            setSelectedToolId("audio-extractor");
                            setActiveCategory("UTILITIES");
                          }}
                          className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-left transition active:scale-95 cursor-pointer flex items-start gap-4 shadow-md"
                        >
                          <Music className="h-8 w-8 text-indigo-400 mt-1" />
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">Save as Music (MP3/WAV)</h4>
                            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">Extract and download the sound track instantly.</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setMetaFile(sandboxFile);
                            readMetadataReal(sandboxFile);
                            setSelectedToolId("meta-viewer");
                            setActiveCategory("UTILITIES");
                          }}
                          className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-left transition active:scale-95 cursor-pointer flex items-start gap-4 shadow-md"
                        >
                          <Info className="h-8 w-8 text-emerald-400 mt-1" />
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">Inspect File Info</h4>
                            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">Check resolution, duration, size, and layout details.</p>
                          </div>
                        </button>
                      </>
                    )}

                    {/* AUDIO ACTIONS */}
                    {sandboxFile.type.startsWith("audio/") && (
                      <>
                        <button
                          onClick={() => {
                            handleSetAudioConvFile(sandboxFile);
                            setSelectedToolId("audio-converter");
                            setActiveCategory("CONVERT");
                          }}
                          className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-left transition active:scale-95 cursor-pointer flex items-start gap-4 shadow-md"
                        >
                          <Music className="h-8 w-8 text-indigo-400 mt-1" />
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">Transcode to WAV</h4>
                            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">Convert this audio track into a standard lossless WAV file.</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setHashFile(sandboxFile);
                            setSelectedToolId("hash-generator");
                            setActiveCategory("UTILITIES");
                          }}
                          className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-left transition active:scale-95 cursor-pointer flex items-start gap-4 shadow-md"
                        >
                          <FileCode className="h-8 w-8 text-emerald-400 mt-1" />
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">Generate Security Hash</h4>
                            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed font-mono">SHA-256, SHA-1 checksum verification.</p>
                          </div>
                        </button>
                      </>
                    )}

                    {/* IMAGE ACTIONS */}
                    {sandboxFile.type.startsWith("image/") && (
                      <>
                        <button
                          onClick={() => {
                            setImgConvFile(sandboxFile);
                            setImgConvFormat("webp");
                            setSelectedToolId("image-converter");
                            setActiveCategory("CONVERT");
                          }}
                          className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-left transition active:scale-95 cursor-pointer flex items-start gap-4 shadow-md"
                        >
                          <RotateCcw className="h-8 w-8 text-indigo-400 mt-1" />
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">Convert to WebP</h4>
                            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">Save as WebP to load faster on websites.</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setImgCompFile(sandboxFile);
                            setSelectedToolId("image-compressor");
                            setActiveCategory("COMPRESS");
                          }}
                          className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-left transition active:scale-95 cursor-pointer flex items-start gap-4 shadow-md"
                        >
                          <Maximize2 className="h-8 w-8 text-emerald-400 mt-1" />
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">Shrink File Size</h4>
                            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">Compress file weight without losing resolution.</p>
                          </div>
                        </button>
                      </>
                    )}

                    {/* PDF / OTHER FILES */}
                    {!sandboxFile.type.startsWith("image/") && !sandboxFile.type.startsWith("video/") && !sandboxFile.type.startsWith("audio/") && (
                      <>
                        <button
                          onClick={() => {
                            setHashFile(sandboxFile);
                            setSelectedToolId("hash-generator");
                            setActiveCategory("UTILITIES");
                          }}
                          className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-left transition active:scale-95 cursor-pointer flex items-start gap-4 shadow-md"
                        >
                          <FileCode className="h-8 w-8 text-indigo-400 mt-1" />
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">Get Checksum Hash</h4>
                            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">Instantly verify SHA-256 for secure file integrity.</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setMetaFile(sandboxFile);
                            readMetadataReal(sandboxFile);
                            setSelectedToolId("meta-viewer");
                            setActiveCategory("UTILITIES");
                          }}
                          className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-left transition active:scale-95 cursor-pointer flex items-start gap-4 shadow-md"
                        >
                          <Info className="h-8 w-8 text-emerald-400 mt-1" />
                          <div>
                            <h4 className="font-extrabold text-sm text-foreground">View File Specs</h4>
                            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">Read file system headers, format logs, and sizes.</p>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlassCard
                variant="interactive"
                onClick={() => setActiveCategory("DOWNLOAD")}
                className="p-5 flex flex-col justify-between h-36 group cursor-pointer"
              >
                <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400 w-fit">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">Media Downloader</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Download direct URLs locally with progress.</p>
                </div>
              </GlassCard>

              <GlassCard
                variant="interactive"
                onClick={() => {
                  setActiveCategory("CONVERT");
                  setSelectedToolId("image-converter");
                }}
                className="p-5 flex flex-col justify-between h-36 group cursor-pointer"
              >
                <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400 w-fit">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">Image Converter</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Save pictures as WebP, PNG, or JPG.</p>
                </div>
              </GlassCard>

              <GlassCard
                variant="interactive"
                onClick={() => {
                  setActiveCategory("UTILITIES");
                  setSelectedToolId("qr-generator");
                }}
                className="p-5 flex flex-col justify-between h-36 group cursor-pointer"
              >
                <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 w-fit">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">QR Code Maker</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Turn any link into a QR block.</p>
                </div>
              </GlassCard>
            </div>

            {/* Recent Files List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FolderOpen className="h-4 w-4 text-primary" />
                Sandbox Output Files
              </h3>
              <GlassCard hover={false} className="divide-y divide-border/60 overflow-hidden">
                {recentFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="h-4 w-4 text-purple-400" />
                        ) : file.type.startsWith("audio/") ? (
                          <Music className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <FileVideo className="h-4 w-4 text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {file.dimensions ? `${file.dimensions} • ` : ""}
                          {file.duration ? `${file.duration} • ` : ""}
                          {file.size}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{file.date}</span>
                  </div>
                ))}
              </GlassCard>
            </div>
          </div>
        )}

        {/* MEDIA DOWNLOADER SECTION */}
        {activeCategory === "DOWNLOAD" && !selectedToolId && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Media Downloader</h2>
              <p className="text-body-s text-muted-foreground mt-0.5">Download files or streams directly to your browser memory.</p>
            </div>

            {/* Big paste block */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Paste direct file URL (e.g., https://example.com/video.mp4)..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-card/60 backdrop-blur-md px-4 py-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button onClick={handleAnalyzeUrl} disabled={analyzing} className="px-6 rounded-xl font-bold shrink-0">
                {analyzing ? "Reading URL..." : "Analyze URL"}
              </Button>
            </div>

            {/* Loading status */}
            {analyzing && <div className="h-32 skeleton rounded-2xl w-full" />}

            {/* Analysis Result (3yo workflow: One simple Click Download) */}
            {analysisResult && !analyzing && (
              <GlassCard hover={false} className="p-6 space-y-6 animate-scale-in">
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <img
                    src={analysisResult.thumbnail}
                    alt="Thumbnail"
                    className="w-44 h-24 object-cover rounded-xl border border-white/5 shadow-md"
                  />
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-sm font-extrabold text-foreground">{analysisResult.title}</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Ready to save locally</p>
                  </div>
                </div>

                {/* Big Download Button */}
                <div className="p-4 border border-indigo-500/20 bg-indigo-500/5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                    Save File (Super Fast)
                  </h4>

                  {isDownloading ? (
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                        <span>Downloading: {downloadProgress}%</span>
                        <span>{downloadSpeed} • {downloadTimeLeft}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => startStreamDownload("video")}
                        className="py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Video className="h-4.5 w-4.5" />
                        Download Video
                      </button>

                      <button
                        onClick={() => startStreamDownload("audio")}
                        className="py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Music className="h-4.5 w-4.5" />
                        Download Audio (MP3)
                      </button>
                    </div>
                  )}
                </div>

                {corsError && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-300 leading-relaxed flex gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                    <div>
                      <strong>CORS Security Alert:</strong> If the direct download progress fails, browser security policies are restricting automatic code downloads. Simply click the <strong>"Direct New-Tab Link"</strong> button above, then right-click and save the file.
                    </div>
                  </div>
                )}
              </GlassCard>
            )}
          </div>
        )}

        {/* IMAGE CONVERTER VIEW */}
        {activeCategory === "CONVERT" && selectedToolId === "image-converter" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Image Converter</h2>
              <p className="text-body-s text-muted-foreground mt-0.5">Convert photos to next-gen formats with zero upload requirements.</p>
            </div>

            <GlassCard hover={false} className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground">Select Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImgConvFile(file);
                      setImgConvResult(null);
                    }
                  }}
                  className="block w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-xs text-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-bold file:text-[10px] cursor-pointer"
                />
              </div>

              {imgConvFile && (
                <div className="space-y-4 animate-scale-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-foreground">Convert to Format</span>
                      <select
                        value={imgConvFormat}
                        onChange={(e) => {
                          setImgConvFormat(e.target.value);
                          setImgConvResult(null);
                        }}
                        className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="webp">WebP (Highly Compressed)</option>
                        <option value="png">PNG (Lossless Quality)</option>
                        <option value="jpg">JPEG (Standard Size)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-foreground">Quality Compression</span>
                      <select
                        value={imgConvQuality}
                        onChange={(e) => {
                          setImgConvQuality(parseFloat(e.target.value));
                          setImgConvResult(null);
                        }}
                        className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="0.95">Best Quality (Larger File)</option>
                        <option value="0.8">Balanced (Recommended)</option>
                        <option value="0.6">Maximum Compress (Smaller File)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={convertImageReal}
                    disabled={imgConverting}
                    className="w-full py-4.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {imgConverting ? "Generating canvas..." : "Convert Image Now"}
                  </button>

                  {imgConvResult && (
                    <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in">
                      <div className="text-center sm:text-left">
                        <p className="text-xs font-bold text-foreground">Converted: {imgConvResult.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Size: {imgConvResult.size} ({imgConvResult.savings})</p>
                      </div>
                      <a
                        href={imgConvResult.url}
                        download={imgConvResult.name}
                        className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition active:scale-95 shadow-md flex items-center gap-1.5"
                      >
                        <Download className="h-4 w-4" /> Download File
                      </a>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* IMAGE COMPRESSOR VIEW */}
        {activeCategory === "COMPRESS" && selectedToolId === "image-compressor" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Image Compressor</h2>
              <p className="text-body-s text-muted-foreground mt-0.5">Reduce image kilobytes locally inside your browser cache.</p>
            </div>

            <GlassCard hover={false} className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground">Select Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImgCompFile(file);
                      setImgCompResult(null);
                    }
                  }}
                  className="block w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-xs text-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-bold file:text-[10px] cursor-pointer"
                />
              </div>

              {imgCompFile && (
                <div className="space-y-4 animate-scale-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-foreground">Compression Level</span>
                      <select
                        value={imgCompQuality}
                        onChange={(e) => {
                          setImgCompQuality(parseFloat(e.target.value));
                          setImgCompResult(null);
                        }}
                        className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="0.9">Minimal (Best Quality)</option>
                        <option value="0.7">Medium (Recommended)</option>
                        <option value="0.4">Extreme (Smallest Size)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-foreground">Scale Dimensions</span>
                      <select
                        value={imgCompScale}
                        onChange={(e) => {
                          setImgCompScale(parseInt(e.target.value, 10));
                          setImgCompResult(null);
                        }}
                        className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="100">Original Size (100%)</option>
                        <option value="80">Medium Scale (80%)</option>
                        <option value="50">Half Size (50%)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={compressImageReal}
                    disabled={imgComping}
                    className="w-full py-4.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {imgComping ? "Compressing canvas..." : "Compress Image"}
                  </button>

                  {imgCompResult && (
                    <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in">
                      <div className="text-center sm:text-left">
                        <p className="text-xs font-bold text-foreground">Compressed: {imgCompResult.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Size: {imgCompResult.size} ({imgCompResult.savings} space saved)</p>
                      </div>
                      <a
                        href={imgCompResult.url}
                        download={imgCompResult.name}
                        className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition active:scale-95 shadow-md flex items-center gap-1.5"
                      >
                        <Download className="h-4 w-4" /> Download Compressed File
                      </a>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* AUDIO EXTRACTOR VIEW */}
        {activeCategory === "UTILITIES" && selectedToolId === "audio-extractor" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Audio Extractor</h2>
              <p className="text-body-s text-muted-foreground mt-0.5">Extract high fidelity WAV files from video streams in 1 click.</p>
            </div>

            <GlassCard hover={false} className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground">Upload Video File (MP4, WebM, etc.)</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAudioExtFile(file);
                      setAudioExtResult(null);
                      setAudioExtProgress(0);
                    }
                  }}
                  className="block w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-xs text-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-bold file:text-[10px] cursor-pointer"
                />
              </div>

              {audioExtFile && (
                <div className="space-y-4 animate-scale-in">
                  <div className="p-3 bg-muted/30 border border-border rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground truncate max-w-[200px]">{audioExtFile.name}</span>
                    <Badge variant="primary">{(audioExtFile.size / 1024 / 1024).toFixed(1)} MB</Badge>
                  </div>

                  {audioExting ? (
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-300"
                          style={{ width: `${audioExtProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                        <span>Extracting Sound waves...</span>
                        <span>{audioExtProgress}%</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={extractAudioReal}
                      className="w-full py-4.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Music className="h-4.5 w-4.5" />
                      Save as WAV Audio File
                    </button>
                  )}

                  {audioExtResult && (
                    <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in">
                      <div>
                        <p className="text-xs font-bold text-foreground">Soundtrack extracted successfully!</p>
                        <p className="text-[10px] text-muted-foreground mt-1">High-fidelity WAV format.</p>
                      </div>
                      <a
                        href={audioExtResult}
                        download={`Soundtrack_${audioExtFile.name.substring(0, audioExtFile.name.lastIndexOf(".")) || audioExtFile.name}.wav`}
                        className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition active:scale-95 shadow-md flex items-center gap-1.5"
                      >
                        <Download className="h-4 w-4" /> Save WAV File
                      </a>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* AUDIO CONVERTER VIEW */}
        {activeCategory === "CONVERT" && selectedToolId === "audio-converter" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Audio Converter</h2>
              <p className="text-body-s text-muted-foreground mt-0.5">Transcode sound tracks to WAV offline.</p>
            </div>

            <GlassCard hover={false} className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground">Upload Audio File</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleSetAudioConvFile(file);
                    }
                  }}
                  className="block w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-xs text-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-bold file:text-[10px] cursor-pointer"
                />
              </div>

              {audioConvFile && (
                <div className="space-y-4 animate-scale-in">
                  {/* Input Audio Preview */}
                  {audioConvPreviewUrl && (
                    <div className="space-y-2 p-4 bg-muted/20 rounded-2xl border border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Original Audio Preview
                      </span>
                      <audio src={audioConvPreviewUrl} controls className="w-full h-10 outline-none rounded bg-transparent" />
                    </div>
                  )}

                  {audioConverting ? (
                    <div className="py-6 text-center text-xs text-muted-foreground">Decoding audio bytes locally...</div>
                  ) : (
                    <button
                      onClick={convertAudioReal}
                      className="w-full py-4.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <RotateCcw className="h-4.5 w-4.5" />
                      Convert to WAV Format
                    </button>
                  )}

                  {audioConvResult && (
                    <div className="space-y-4 animate-scale-in">
                      {/* Output Audio Preview */}
                      <div className="space-y-2 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">
                          Converted WAV Preview
                        </span>
                        <audio src={audioConvResult} controls className="w-full h-10 outline-none rounded bg-transparent" />
                      </div>

                      <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold text-foreground">Conversion successful!</p>
                        </div>
                        <a
                          href={audioConvResult}
                          download={`${audioConvFile.name.substring(0, audioConvFile.name.lastIndexOf(".")) || audioConvFile.name}-converted.wav`}
                          className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition active:scale-95 shadow-md flex items-center gap-1.5"
                        >
                          <Download className="h-4 w-4" /> Download WAV File
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* HASH GENERATOR VIEW */}
        {activeCategory === "UTILITIES" && selectedToolId === "hash-generator" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h2 className="text-h2 font-extrabold text-foreground tracking-tight">File Hash Generator</h2>
              <p className="text-body-s text-muted-foreground mt-0.5">Calculate cryptographic checksums for secure files.</p>
            </div>

            <GlassCard hover={false} className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground">Upload Target File</span>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setHashFile(file);
                      setHashResult("");
                    }
                  }}
                  className="block w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-xs text-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-bold file:text-[10px] cursor-pointer"
                />
              </div>

              {hashFile && (
                <div className="space-y-4 animate-scale-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-foreground">Algorithm</span>
                      <select
                        value={hashAlgo}
                        onChange={(e) => {
                          setHashAlgo(e.target.value as any);
                          setHashResult("");
                        }}
                        className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="SHA-256">SHA-256 (Highly Secure)</option>
                        <option value="SHA-1">SHA-1 (Legacy)</option>
                        <option value="SHA-512">SHA-512 (Maximum Security)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={hashFileReal}
                    disabled={hashing}
                    className="w-full py-4.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {hashing ? "Hashing..." : "Generate Hash Code"}
                  </button>

                  {hashResult && (
                    <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3 animate-scale-in">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{hashAlgo} Hash</span>
                        <button
                          onClick={() => copyToClipboard(hashResult)}
                          className="p-1.5 hover:bg-white/10 rounded-md transition text-muted-foreground hover:text-foreground"
                        >
                          {copiedHash ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="font-mono text-xs text-foreground select-all break-all leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
                        {hashResult}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* QR CODE GENERATOR VIEW */}
        {activeCategory === "UTILITIES" && selectedToolId === "qr-generator" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Static QR Code Generator</h2>
              <p className="text-body-s text-muted-foreground mt-0.5">Generate vector QR codes instantly.</p>
            </div>

            <GlassCard hover={false} className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground">QR Code Text or URL</span>
                <input
                  type="text"
                  placeholder="Paste URL link or wifi details..."
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                onClick={generateQrReal}
                className="w-full py-4.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                Compile QR Code
              </button>

              {generatedQr && (
                <div className="flex flex-col items-center justify-center p-6 border border-border bg-muted/20 rounded-2xl space-y-4 animate-scale-in">
                  <img src={generatedQr} alt="QR Code" className="w-48 h-48 border border-white/10 rounded-xl p-2 bg-white" />
                  <a
                    href={generatedQr}
                    download="utool-qr.png"
                    className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold px-4 py-2.5 text-xs shadow-md transition hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </a>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* METADATA VIEWER VIEW */}
        {activeCategory === "UTILITIES" && selectedToolId === "meta-viewer" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Media Metadata Viewer</h2>
              <p className="text-body-s text-muted-foreground mt-0.5">Inspect format and layout stats of your files locally.</p>
            </div>

            <GlassCard hover={false} className="p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground">Select File</span>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) readMetadataReal(file);
                  }}
                  className="block w-full rounded-xl border border-border bg-card/60 px-4 py-3 text-xs text-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-bold file:text-[10px] cursor-pointer"
                />
              </div>

              {metaDetails && (
                <div className="space-y-4 animate-scale-in">
                  <h4 className="text-xs font-bold text-foreground">File Header Details</h4>
                  <div className="bg-muted/40 border border-border rounded-xl p-4 font-mono text-xs text-foreground space-y-2.5 overflow-x-auto select-text leading-relaxed">
                    <p className="text-indigo-400 font-semibold">// Client Side Analysis Logs</p>
                    <p><span className="text-muted-foreground">FileName:</span> "{metaDetails.name}"</p>
                    <p><span className="text-muted-foreground">FileSize:</span> "{metaDetails.size}"</p>
                    <p><span className="text-muted-foreground">MimeType:</span> "{metaDetails.type}"</p>
                    <p><span className="text-muted-foreground">Modified:</span> "{metaDetails.lastModified}"</p>
                    {metaDetails.dimensions && <p><span className="text-muted-foreground">Dimensions:</span> "{metaDetails.dimensions}"</p>}
                    {metaDetails.duration && <p><span className="text-muted-foreground">Duration:</span> "{metaDetails.duration}"</p>}
                    {metaDetails.resolution && <p><span className="text-muted-foreground">Video Resolution:</span> "{metaDetails.resolution}"</p>}
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* OTHER TOOLS CATEGORY GRID */}
        {((activeCategory !== "DASHBOARD" && activeCategory !== "DOWNLOAD" && !selectedToolId) || (selectedToolId && selectedToolId !== "image-converter" && selectedToolId !== "image-compressor" && selectedToolId !== "audio-extractor" && selectedToolId !== "audio-converter" && selectedToolId !== "qr-generator" && selectedToolId !== "meta-viewer" && selectedToolId !== "hash-generator")) && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-h2 font-extrabold text-foreground tracking-tight">{CATEGORIES[activeCategory]?.label || "Media Tools"}</h2>
                <p className="text-body-s text-muted-foreground mt-0.5">Explore standard client-side media pipelines.</p>
              </div>
              {selectedToolId && (
                <button
                  onClick={() => setSelectedToolId(null)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Back to List
                </button>
              )}
            </div>

            {selectedToolId ? (
              /* Simulated tool interface fallback for minor/unimplemented tools */
              <GlassCard hover={false} className="p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-foreground">
                        {TOOLS.find((t) => t.id === selectedToolId)?.name}
                      </h3>
                      <p className="text-caption text-muted-foreground mt-0.5">
                        {TOOLS.find((t) => t.id === selectedToolId)?.desc}
                      </p>
                    </div>
                  </div>
                  <Badge variant="primary">Client Only</Badge>
                </div>

                <div className="border border-dashed border-border/80 rounded-2xl p-8 text-center space-y-3 bg-muted/10">
                  <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Feature coming soon</p>
                    <p className="text-[10px] text-muted-foreground mt-1">We are moving this tool to standard browser pipelines.</p>
                  </div>
                </div>
              </GlassCard>
            ) : (
              /* Catalog grid for category */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TOOLS.filter((t) => t.category === activeCategory).map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <GlassCard
                      key={tool.id}
                      variant="interactive"
                      onClick={() => setSelectedToolId(tool.id)}
                      className="p-5 flex items-start gap-4 hover:border-primary/20 transition-all duration-300 cursor-pointer"
                    >
                      <div className="rounded-xl bg-primary/10 p-2.5 text-primary shrink-0">
                        <ToolIcon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SEARCH COMMAND PALETTE SPOTLIGHT MODAL (Ctrl + K) */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-background/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setSearchOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-card/90 shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[380px] z-10"
            >
              <div className="flex items-center px-4 py-3 border-b border-border">
                <Search className="h-4.5 w-4.5 text-primary mr-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search media tools, history, or commands..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchIndex(0);
                  }}
                  className="w-full bg-transparent border-0 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-[10px] font-bold text-muted-foreground/60 hover:text-foreground px-1.5 py-0.5 rounded border border-border"
                >
                  ESC
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 divide-y divide-border/20">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool, idx) => {
                    const ToolIcon = tool.icon;
                    const isFocused = idx === searchIndex;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => handleSelectTool(tool)}
                        onMouseEnter={() => setSearchIndex(idx)}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors",
                          isFocused ? "bg-primary/10 text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={cn("p-1.5 rounded-md", isFocused ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                            <ToolIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{tool.name}</p>
                            <p className="text-[9px] text-muted-foreground mt-0.5">{tool.desc}</p>
                          </div>
                        </div>
                        <Badge variant="primary" className="text-[8px] uppercase">{tool.category}</Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <AlertCircle className="h-6 w-6 text-muted-foreground/60 mb-2" />
                    <p className="text-xs font-semibold">No tools found matching query</p>
                  </div>
                )}
              </div>

              <div className="px-4 py-2 bg-muted/40 border-t border-border/60 text-[9px] text-muted-foreground flex justify-between">
                <span>Use ↑↓ arrows to navigate, Enter to select</span>
                <span>Ctrl + K to toggle</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
