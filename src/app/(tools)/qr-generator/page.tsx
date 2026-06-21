"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  QrCode,
  Download,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  FileText,
  Mail,
  Wifi,
  Lock,
  ArrowLeft,
  User,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";

type QRType = "url" | "text" | "email" | "wifi";

export default function QRGeneratorPage() {
  const { user, logout } = useAuth();
  const { limitStatus, loading: limitLoading, checkLimit, recordUsage, refresh } = useToolLimit();

  // Tool states
  const [type, setType] = useState<QRType>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");

  // Style states (default to high contrast colors that user can adjust)
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [margin, setMargin] = useState(4);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set default state or empty state
  const handleReset = () => {
    setUrl("");
    setText("");
    setEmailTo("");
    setEmailSubject("");
    setEmailBody("");
    setWifiSsid("");
    setWifiPassword("");
    setWifiEncryption("WPA");
    setFgColor("#000000");
    setBgColor("#ffffff");
    setMargin(4);
    setErrorCorrection("M");
    setQrCodeUrl(null);
  };

  // Compile inputs based on active type
  const getQRContent = (): string => {
    switch (type) {
      case "url":
        return url.trim() ? (url.startsWith("http://") || url.startsWith("https://") ? url.trim() : `https://${url.trim()}`) : "";
      case "text":
        return text;
      case "email":
        if (!emailTo.trim()) return "";
        return `mailto:${emailTo.trim()}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "wifi":
        if (!wifiSsid.trim()) return "";
        return `WIFI:S:${wifiSsid.trim()};T:${wifiEncryption};P:${wifiPassword};;`;
      default:
        return "";
    }
  };

  const handleGenerate = async () => {
    const content = getQRContent();
    if (!content) {
      toast.error("Please fill in the required inputs to generate a QR Code.");
      return;
    }

    setGenerating(true);
    const toastId = toast.info("Processing your request...");

    // Double check usage limits
    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.dismiss(toastId);
      toast.error("You’ve reached today’s free limit.");
      setGenerating(false);
      return;
    }

    try {
      // Use qrcode npm package to generate data URL
      const dataUrl = await QRCode.toDataURL(content, {
        color: {
          dark: fgColor,
          light: bgColor,
        },
        margin: margin,
        errorCorrectionLevel: errorCorrection,
        width: 600,
      });

      setQrCodeUrl(dataUrl);
      toast.dismiss(toastId);
      toast.success("Your QR code is ready.");
      await recordUsage("qr-static", "success");
    } catch (err) {
      console.error("QR Code generation error:", err);
      toast.dismiss(toastId);
      toast.error("Failed to generate QR Code. Please check inputs.");
      await recordUsage("qr-static", "failed", err instanceof Error ? err.message : String(err));
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    toast.success("Your QR Code is ready to download.");
    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = `toolzy-qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold text-[17px] tracking-tight text-foreground hover:opacity-90 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[image:var(--gradient-primary)] shadow-sm">
                <QrCode className="h-[18px] w-[18px] text-white" />
              </div>
              <span>
                Toolzy{" "}
                <Badge variant="primary" className="ml-1 align-middle text-[9px]">
                  Workspace
                </Badge>
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border">
              <span className="text-caption font-bold text-foreground">QR Generator</span>
              <Badge variant="success">Live</Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!limitLoading ? (
              limitStatus.tier === "pro" || limitStatus.tier === "enterprise" ? (
                <Badge variant="pro" className="hidden sm:inline-flex">
                  <Sparkles className="h-3 w-3" />
                  Pro: Unlimited
                </Badge>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="default">
                    Actions: {limitStatus.count} / {limitStatus.max}
                  </Badge>
                  <button onClick={refresh} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            ) : (
              <div className="hidden sm:block h-6 w-24 skeleton rounded-full" />
            )}

            <ThemeToggle />

            <div className="flex items-center gap-2 pl-3 border-l border-border">
              {user ? (
                <>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground" title={user.email || ""}>
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <button onClick={logout} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <Link href={`/login?redirect=%2Fqr-generator`} className="inline-flex items-center justify-center rounded-xl bg-card border border-border px-3.5 py-1.5 text-caption font-bold text-foreground hover:bg-muted transition-all">
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-caption font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="space-y-10 flex-1 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <Badge variant="primary" className="mx-auto">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              100% Client-Side Generator
            </Badge>
            <h1 className="text-display-md font-extrabold tracking-tight text-foreground">
              Toolzy QR Workstation
            </h1>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              Instantly compile clean, customizable QR codes inside your browser. Pick colors, configure content types, and export at 600px print density.
            </p>
          </div>

          {/* Quota limit warning */}
          {limitStatus.isLimited && !limitLoading && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex gap-3 text-sm text-destructive max-w-4xl mx-auto w-full">
              <Lock className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <h4 className="font-bold">Daily Action Limit Exceeded</h4>
                <p className="mt-0.5 text-xs text-destructive/80 leading-relaxed">
                  You have hit your daily limit. Please sign up or upgrade to Pro for unlimited operations or check back tomorrow.
                </p>
              </div>
            </div>
          )}

          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl w-full mx-auto items-start">
            {/* Controls panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Type selector */}
              <GlassCard className="p-6 space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border pb-3">
                  1. Choose QR Code Type
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "url", label: "URL Link", icon: LinkIcon },
                    { id: "text", label: "Plain Text", icon: FileText },
                    { id: "email", label: "Email", icon: Mail },
                    { id: "wifi", label: "Wi-Fi", icon: Wifi },
                  ].map((t) => {
                    const CurrentIcon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => { setType(t.id as QRType); setQrCodeUrl(null); }}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center gap-2 ${
                          type === t.id
                            ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                            : "border-border hover:border-foreground/30 hover:bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <CurrentIcon className="h-4.5 w-4.5 text-foreground" />
                        <span className="text-[10px] tracking-wide uppercase font-semibold">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Data input form */}
              <GlassCard className="p-6 space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border pb-3">
                  2. Input QR Data
                </h3>

                <div className="space-y-4">
                  {type === "url" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target URL Link</label>
                      <input
                        type="text"
                        placeholder="e.g. www.toolzy.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  {type === "text" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Plain text / Notes</label>
                      <textarea
                        rows={4}
                        placeholder="Write any plain text content here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  )}

                  {type === "email" && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Recipient Email</label>
                        <input
                          type="email"
                          placeholder="e.g. hello@toolzy.com"
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Subject Line</label>
                        <input
                          type="text"
                          placeholder="e.g. Custom Inquiry"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Body Message</label>
                        <textarea
                          rows={3}
                          placeholder="Write your default email message..."
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {type === "wifi" && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Network SSID (Name)</label>
                        <input
                          type="text"
                          placeholder="e.g. Office_WiFi_5G"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Encryption / Security</label>
                        <select
                          value={wifiEncryption}
                          onChange={(e) => setWifiEncryption(e.target.value)}
                          className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None (Open)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Design Customizations */}
              <GlassCard className="p-6 space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border pb-3">
                  3. Customize Appearance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Colors */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Foreground Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => { setFgColor(e.target.value); setQrCodeUrl(null); }}
                          className="h-7 w-7 border border-border rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-foreground uppercase">{fgColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Background Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => { setBgColor(e.target.value); setQrCodeUrl(null); }}
                          className="h-7 w-7 border border-border rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-foreground uppercase">{bgColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Margins & Correction */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Quiet Zone (Margin)</span>
                        <span className="text-foreground">{margin}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={margin}
                        onChange={(e) => { setMargin(parseInt(e.target.value)); setQrCodeUrl(null); }}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Error Correction Level</label>
                      <select
                        value={errorCorrection}
                        onChange={(e) => { setErrorCorrection(e.target.value as "L" | "M" | "Q" | "H"); setQrCodeUrl(null); }}
                        className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="L">Low (7% recovery)</option>
                        <option value="M">Medium (15% recovery)</option>
                        <option value="Q">Quartile (25% recovery)</option>
                        <option value="H">High (30% recovery)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[360px] text-center">
                {qrCodeUrl ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="bg-white border border-border p-6 rounded-3xl shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCodeUrl}
                        alt="Generated QR Code"
                        className="h-48 w-48 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">QR Code Compiled!</h4>
                      <p className="text-[10px] text-muted-foreground font-semibold tracking-wide uppercase mt-1">Ready for high-res download</p>
                    </div>
                    <div className="flex gap-2.5 w-full">
                      <Button
                        variant="secondary"
                        onClick={handleReset}
                        className="flex-1 flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleDownload}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 shadow-sm text-white flex items-center justify-center gap-1.5"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4 max-w-xs flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground">
                      <QrCode className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-semibold text-foreground">
                      Generate your first QR code.
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Configure your details on the left, then trigger the compiler pipeline to generate.
                    </p>
                    <Button
                      onClick={handleGenerate}
                      disabled={generating || limitStatus.isLimited}
                      className="w-full mt-4 flex items-center justify-center gap-2"
                    >
                      <QrCode className="h-4.5 w-4.5" />
                      Compile QR Code
                    </Button>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
