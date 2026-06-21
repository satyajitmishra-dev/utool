"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Sparkles,
  Loader2,
  Check,
  Copy,
  Terminal,
} from "lucide-react";

export default function ToolExecutionClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Define tools metadata to customize the page dynamically
  const toolsMeta: Record<string, { name: string; desc: string; inputPlaceholder: string; credits: number }> = {
    "json-formatter": {
      name: "JSON Formatter & Beautifier",
      desc: "Format, validate, and parse JSON strings with deep syntax validation.",
      inputPlaceholder: 'Paste raw JSON here...\ne.g. {"name":"utool","active":true}',
      credits: 1,
    },
    "env-validator": {
      name: "Env Validator",
      desc: "Validate configuration schemas for dotenv (.env) files.",
      inputPlaceholder: "PORT=3000\nDATABASE_URL=mongodb://localhost\nUPSTASH_TOKEN=",
      credits: 1,
    },
    "gradient-maker": {
      name: "CSS Gradient Generator",
      desc: "Compile custom radial/linear CSS HSL gradient codes.",
      inputPlaceholder: "Enter primary hues separated by commas...\ne.g. 210, 260, 320",
      credits: 1,
    },
  };

  const currentTool = toolsMeta[slug] || {
    name: "Interactive Tool Runner",
    desc: "A premium utility tool workspace.",
    inputPlaceholder: "Enter utility inputs here...",
    credits: 2,
  };

  const handleRun = () => {
    if (!input.trim()) return;
    setRunning(true);
    setOutput("");

    // Simulate server side utility execution
    setTimeout(() => {
      try {
        if (slug === "json-formatter") {
          const parsed = JSON.parse(input);
          setOutput(JSON.stringify(parsed, null, 2));
        } else if (slug === "env-validator") {
          const lines = input.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
          const validated = lines.map((l) => {
            const [k, v] = l.split("=");
            return `[VALID] ${k}: ${v ? "Present" : "Missing Value"}`;
          });
          setOutput(validated.join("\n"));
        } else if (slug === "gradient-maker") {
          const colors = input.split(",").map((c) => c.trim());
          setOutput(`background-image: linear-gradient(to right, ${colors.map((c) => `hsl(${c}, 70%, 50%)`).join(", ")});`);
        } else {
          setOutput(`Success!\nUtility execution output for parameter: ${input}`);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setOutput(`[ERROR] Execution failed:\n${errorMsg}`);
      } finally {
        setRunning(false);
      }
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6">
      {/* Navigation and Title */}
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-caption font-bold text-muted-foreground hover:text-foreground transition mb-3 uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-display-sm font-bold tracking-tight text-foreground flex items-center gap-2.5">
                {currentTool.name}
              </h1>
              <p className="text-body-sm text-muted-foreground mt-1">{currentTool.desc}</p>
            </div>
            <Badge variant="primary" className="self-start">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>Cost: {currentTool.credits} {currentTool.credits === 1 ? "credit" : "credits"}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Editor & Execution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input Panel */}
        <GlassCard className="flex flex-col p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">Input Parameters</span>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded hover:bg-muted/40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentTool.inputPlaceholder}
            className="flex-1 min-h-[300px] block w-full rounded-xl border border-border bg-muted/40 p-4 text-sm text-foreground font-mono placeholder-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            suppressHydrationWarning
          />
          <Button
            onClick={handleRun}
            disabled={running || !input.trim()}
            className="w-full flex justify-center items-center gap-2"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Executing Pipeline...
              </>
            ) : (
              <>
                <Play className="h-4.5 w-4.5 fill-current" />
                Run Utility Pipeline
              </>
            )}
          </Button>
        </GlassCard>

        {/* Output Panel */}
        <GlassCard className="flex flex-col p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-primary" />
              Execution Output
            </span>
            {output && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded hover:bg-muted/40"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 min-h-[300px] w-full rounded-xl border border-border bg-muted/40 p-4 text-sm text-foreground font-mono overflow-auto whitespace-pre-wrap select-text leading-relaxed">
            {output ? (
              output
            ) : (
              <span className="text-muted-foreground/50 italic">Run the pipeline on the left to see results.</span>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
