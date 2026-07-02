"use client";

import React, { useState } from "react";
import { ExperienceLayout } from "@/components/system/ExperienceLayout";
import { ExperienceState } from "@/components/system/ExperienceConfig";
import { 
  Settings2, RefreshCw, Sparkles, Trash2, Wifi, 
  HelpCircle, ChevronLeft, ChevronRight 
} from "lucide-react";
import { toast } from "sonner";

const STATES: { label: string; value: ExperienceState; category: string }[] = [
  { label: "404 Not Found", value: "404", category: "Routing" },
  { label: "Offline Mode", value: "offline", category: "Network" },
  { label: "Slow Network Quality", value: "slow-network", category: "Network" },
  { label: "Client Workspace Loader", value: "loading", category: "Lifecycle" },
  { label: "Scheduled Maintenance", value: "maintenance", category: "Server" },
  { label: "500 Server Error", value: "500", category: "Server" },
  { label: "403 Access Denied", value: "403", category: "Authentication" },
  { label: "Session Expired", value: "session-expired", category: "Authentication" },
  { label: "Rate Limited (Cool down)", value: "rate-limited", category: "Lifecycle" },
  { label: "Upload Disrupted", value: "upload-failed", category: "Failures" },
  { label: "File Too Large", value: "file-too-large", category: "Failures" },
  { label: "Corrupted File Structure", value: "corrupted-file", category: "Failures" },
  { label: "Legacy Browser Warning", value: "browser-unsupported", category: "Lifecycle" },
  { label: "Roadmap Feature Coming", value: "coming-soon", category: "Lifecycle" },
];

export default function ExperienceTestPage() {
  const [selectedState, setSelectedState] = useState<ExperienceState>("404");
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleRetrySimulation = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Running state diagnostic tests...",
        success: "All client buffers verified! Sandbox is stable.",
        error: "Diagnostic failed.",
      }
    );
  };

  const triggerKonamiCheat = () => {
    if (typeof window !== "undefined") {
      (window as any).__KONAMI_UNLOCKED__ = true;
      (window as any).__UTOOL_KONAMI__ = true;
      // Dispatch a keydown or custom event to let the listener fire
      const event = new KeyboardEvent("keydown", { key: "a" });
      window.dispatchEvent(event);
      // Wait, our listener checks for the sequence. We can just set the state or force dispatch it.
      // But setting the state in the layout does the trick since we set __KONAMI_UNLOCKED__ = true
      toast.success("🎮 Konami Cheat Code programmatically triggered!");
      // Simulate typing key sequence to fire listener
      const keys = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
      keys.forEach((key) => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key }));
      });
    }
  };

  const resetGameData = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("utool_game_highscore");
    localStorage.removeItem("utool_game_achievements");
    localStorage.removeItem("utool_telemetry");
    localStorage.removeItem("utool_file_history");
    localStorage.removeItem("utool_pending_uploads");
    toast.success("All local game scores, achievements, and telemetry reset!");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex">
      {/* Sidebar Control Panel Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-40 w-80 bg-card/90 backdrop-blur-xl border-r border-border p-5 flex flex-col gap-5 shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center pb-2 border-b border-border/60">
          <span className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-1.5">
            <Settings2 size={16} className="text-primary animate-spin-slow" />
            Experience State Simulator
          </span>
          <span className="text-[9px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Dev Tools
          </span>
        </div>

        {/* State Selection List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
          {["Routing", "Network", "Server", "Authentication", "Lifecycle", "Failures"].map((cat) => {
            const catStates = STATES.filter((s) => s.category === cat);
            if (catStates.length === 0) return null;

            return (
              <div key={cat} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2.5">
                  {cat} States
                </span>
                <div className="flex flex-col gap-0.5">
                  {catStates.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setSelectedState(item.value);
                        toast.info(`Switched to State: ${item.label}`);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        selectedState === item.value
                          ? "bg-primary text-white shadow-md shadow-primary/15"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[9px] font-mono opacity-60">
                        {item.value}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Simulator controls */}
        <div className="pt-4 border-t border-border/60 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
            Simulation Actions
          </span>
          
          <button
            onClick={triggerKonamiCheat}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              Trigger Confetti Rain
            </span>
            <kbd className="text-[9px] font-mono opacity-60">🎮 Cheat</kbd>
          </button>

          <button
            onClick={resetGameData}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold text-red-500 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Trash2 size={13} />
              Reset Game & Telemetry
            </span>
          </button>
        </div>
      </div>

      {/* Drawer Toggle Handle */}
      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 w-8 h-12 bg-card border border-border flex items-center justify-center rounded-r-xl shadow-md transition-all cursor-pointer hover:bg-muted ${
          drawerOpen ? "left-80" : "left-0"
        }`}
        aria-label="Toggle state simulator panel"
      >
        {drawerOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Main Experience Layout Render */}
      <div className={`flex-1 transition-all duration-300 ${drawerOpen ? "pl-80" : "pl-0"}`}>
        <ExperienceLayout
          state={selectedState}
          onRetry={handleRetrySimulation}
        />
      </div>
    </div>
  );
}
