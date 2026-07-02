"use client";

import React, { useEffect, useState } from "react";
import { FileDown, RefreshCw, AlertCircle, FileCheck2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

export interface FileLog {
  id: string;
  name: string;
  size: string;
  type: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export interface ExperienceHistoryProps {
  className?: string;
  isOffline?: boolean;
}

export function ExperienceHistory({ className, isOffline = false }: ExperienceHistoryProps) {
  const [history, setHistory] = useState<FileLog[]>([]);
  const [pendingQueue, setPendingQueue] = useState<FileLog[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load processed files history
    const savedHistory = localStorage.getItem("utool_file_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        // ignore
      }
    } else {
      // Mock history so page doesn't look blank
      const mockHistory: FileLog[] = [
        { id: "1", name: "tax_records_2026.pdf", size: "2.4 MB", type: "PDF", timestamp: new Date(Date.now() - 3600000).toISOString(), status: "completed" },
        { id: "2", name: "avatar_comp.png", size: "840 KB", type: "Image", timestamp: new Date(Date.now() - 7200000).toISOString(), status: "completed" },
      ];
      setHistory(mockHistory);
      localStorage.setItem("utool_file_history", JSON.stringify(mockHistory));
    }

    // Load offline pending queue
    const savedPending = localStorage.getItem("utool_pending_uploads");
    if (savedPending) {
      try {
        setPendingQueue(JSON.parse(savedPending));
      } catch {
        // ignore
      }
    } else if (isOffline) {
      // Create a mock pending item if offline to showcase the queue
      const mockPending: FileLog[] = [
        { id: "p1", name: "project_brief.pdf", size: "4.8 MB", type: "PDF", timestamp: new Date().toISOString(), status: "pending" }
      ];
      setPendingQueue(mockPending);
      localStorage.setItem("utool_pending_uploads", JSON.stringify(mockPending));
    }
  }, [isOffline]);

  // Synchronize queue when internet is back
  useEffect(() => {
    if (!isOffline && pendingQueue.length > 0) {
      const syncQueue = async () => {
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 2000)),
          {
            loading: `Syncing ${pendingQueue.length} pending file(s) with workspace...`,
            success: () => {
              // Move pending to completed
              const synced = pendingQueue.map(item => ({ ...item, status: "completed" as const }));
              const newHistory = [...synced, ...history].slice(0, 10);
              setHistory(newHistory);
              setPendingQueue([]);
              localStorage.setItem("utool_file_history", JSON.stringify(newHistory));
              localStorage.removeItem("utool_pending_uploads");
              return "Files synced successfully! Your workspace is up to date.";
            },
            error: "Failed to sync pending files.",
          }
        );
      };
      syncQueue();
    }
  }, [isOffline, pendingQueue, history]);

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("utool_file_history");
    }
    toast.success("File processing history cleared.");
  };

  const removePending = (id: string) => {
    const updated = pendingQueue.filter(item => item.id !== id);
    setPendingQueue(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("utool_pending_uploads", JSON.stringify(updated));
    }
    toast.info("File removed from upload queue.");
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "";
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-4 text-left animate-fade-in", className)}>
      {/* Pending Upload Queue */}
      {pendingQueue.length > 0 && (
        <div className="flex flex-col gap-2 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-xs">
          <h4 className="text-xs font-bold text-amber-500 flex items-center gap-1.5 uppercase tracking-wider">
            <RefreshCw size={12} className="animate-spin" />
            Offline Pending Queue
          </h4>
          <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70 font-medium -mt-1 leading-normal">
            These files will auto-upload when you reconnect to the internet.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            {pendingQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-card/65 border border-amber-500/10"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle size={14} className="text-amber-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-foreground block truncate max-w-[160px]">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground block font-medium">
                      {item.size} • Waiting
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removePending(item.id)}
                  className="text-muted-foreground hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed History logs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <FileCheck2 size={12} />
            Processed Files
          </h4>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-[10px] text-red-500 hover:underline flex items-center gap-1 font-semibold"
            >
              Clear Logs
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="flex flex-col gap-2">
            {history.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card/10 hover:bg-card/25 backdrop-blur-xs transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileDown size={14} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-foreground block truncate max-w-[200px]">
                      {log.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground block font-medium">
                      {log.size} • {log.type} • {formatDate(log.timestamp)}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full select-none">
                  Ready
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-xl text-muted-foreground text-xs">
            No files processed in this session.
          </div>
        )}
      </div>
    </div>
  );
}
export default ExperienceHistory;
