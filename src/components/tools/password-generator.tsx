"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [batchCount, setBatchCount] = useState(1); // Batch generate up to 10 passwords

  const [passwords, setPasswords] = useState<string[]>([]);
  const [strength, setStrength] = useState({ label: "Weak", color: "bg-red-500", pct: 25, tip: "" });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const similarChars = /[il1Lo0O|]/g;

  const generatePasswords = () => {
    let pool = "";
    if (includeUppercase) pool += uppercaseChars;
    if (includeLowercase) pool += lowercaseChars;
    if (includeNumbers) pool += numberChars;
    if (includeSymbols) pool += symbolChars;

    if (excludeSimilar) {
      pool = pool.replace(similarChars, "");
    }

    if (!pool) {
      setPasswords(["Please select at least one character category!"]);
      return;
    }

    const generated: string[] = [];
    for (let b = 0; b < batchCount; b++) {
      let pass = "";
      for (let i = 0; i < length; i++) {
        pass += pool.charAt(Math.floor(Math.random() * pool.length));
      }
      generated.push(pass);
    }

    setPasswords(generated);
    calculateStrength(generated[0], pool.length);
  };

  const calculateStrength = (password: string, poolSize: number) => {
    if (!password || passwords[0]?.startsWith("Please")) {
      setStrength({ label: "N/A", color: "bg-muted", pct: 0, tip: "" });
      return;
    }

    // Entropy calculation: L * log2(R)
    const entropy = password.length * Math.log2(poolSize);

    let label = "Weak";
    let color = "bg-rose-500";
    let pct = 25;
    let tip = "Very easy to crack. Use a longer length and enable more character sets.";

    if (entropy >= 80) {
      label = "Very Strong";
      color = "bg-emerald-500";
      pct = 100;
      tip = "Maximum security. Perfect for critical master passwords and databases.";
    } else if (entropy >= 60) {
      label = "Strong";
      color = "bg-teal-500";
      pct = 75;
      tip = "Highly secure. Great for emails, banking, and online accounts.";
    } else if (entropy >= 35) {
      label = "Medium";
      color = "bg-amber-500";
      pct = 50;
      tip = "Decent strength, but could be cracked with brute-force. Make it longer.";
    }

    setStrength({ label, color, pct, tip });
  };

  useEffect(() => {
    generatePasswords();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, batchCount]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success("Password copied to clipboard!");
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(passwords.join("\n"));
    toast.success("All passwords copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Strong Password Generator</h2>
        <p className="text-body-s text-muted-foreground mt-0.5">
          Generate secure, custom passwords locally in your browser to protect your online accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Card: Generator Options */}
        <GlassCard className="p-5 space-y-5 lg:col-span-1">
          <span className="text-xs font-bold text-foreground block">Generator Settings</span>

          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
              <span>Password Length</span>
              <span className="font-mono text-sm font-black text-foreground">{length} chars</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground font-bold">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Checklist checkboxes */}
          <div className="space-y-3 pt-2">
            {[
              { label: "Uppercase Letters (A-Z)", val: includeUppercase, set: setIncludeUppercase },
              { label: "Lowercase Letters (a-z)", val: includeLowercase, set: setIncludeLowercase },
              { label: "Numbers (0-9)", val: includeNumbers, set: setIncludeNumbers },
              { label: "Special Characters (!@#$)", val: includeSymbols, set: setIncludeSymbols },
              { label: "Exclude ambiguous chars (e.g. i, 1, l, o, 0)", val: excludeSimilar, set: setExcludeSimilar },
            ].map((opt, i) => (
              <button
                key={i}
                onClick={() => opt.set(!opt.val)}
                className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition text-left cursor-pointer select-none"
              >
                {opt.val ? <CheckSquare className="h-4.5 w-4.5 text-primary shrink-0" /> : <Square className="h-4.5 w-4.5 shrink-0" />}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Batch Count Selection */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold text-muted-foreground">Generate Batch Size</span>
            <select
              value={batchCount}
              onChange={(e) => setBatchCount(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-muted/40 p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {[1, 2, 5, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Password" : "Passwords"}
                </option>
              ))}
            </select>
          </div>
        </GlassCard>

        {/* Right Card: Result & Strength Panel */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          <GlassCard className="p-6 space-y-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 flex-1 flex flex-col justify-between">
            {/* Top Row Result */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Generated Passwords</span>
                <div className="flex gap-2">
                  {batchCount > 1 && (
                    <button
                      onClick={handleCopyAll}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-2.5 py-1 rounded bg-muted/40 hover:bg-muted/80"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy All
                    </button>
                  )}
                  <button
                    onClick={generatePasswords}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-2.5 py-1 rounded bg-muted/40 hover:bg-muted/80"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </button>
                </div>
              </div>

              {/* Passwords display */}
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {passwords.map((pass, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border bg-card/60 hover:bg-card transition font-mono text-sm tracking-wide select-all text-foreground group"
                  >
                    <span className="break-all">{pass}</span>
                    <button
                      onClick={() => handleCopy(pass, idx)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition shrink-0"
                    >
                      {copiedIndex === idx ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Strength Analysis */}
            {batchCount === 1 && !passwords[0]?.startsWith("Please") && (
              <div className="space-y-3 pt-4 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Password Strength</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    {strength.pct >= 75 ? (
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                    ) : (
                      <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                    )}
                    {strength.label}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.pct}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal italic">
                  {strength.tip}
                </p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
