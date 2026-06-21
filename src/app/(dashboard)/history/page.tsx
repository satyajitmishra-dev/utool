"use client";

import React, { useState, useEffect } from "react";
import { History, Search, RefreshCw, Terminal, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getAnonymousId } from "@/utils/anonymous-id";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

interface LogEntry {
  tool: string;
  time: string;
  status: "Success" | "Failed";
  cost: string;
  id: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    const identifier = user ? user.uid : getAnonymousId();

    // Default seed logs
    const defaultLogs: LogEntry[] = [
      { id: "1", tool: "JSON Formatter & Validator", time: "2 hours ago", status: "Success", cost: "1 credit" },
      { id: "2", tool: "PDF Compiler & Merger", time: "1 day ago", status: "Success", cost: "3 credits" },
      { id: "3", tool: "Smart Image Resizer", time: "3 days ago", status: "Failed", cost: "0 credits" },
    ];

    try {
      const q = query(
        collection(db, "usage_transactions"),
        where("userId", "==", identifier),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const fetchedLogs: LogEntry[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : "Just now";
          fetchedLogs.push({
            id: docSnap.id,
            tool: data.toolName || data.toolId || "Unknown Tool",
            time: date,
            status: data.status === "success" ? "Success" : "Failed",
            cost: `${data.creditsUsed || 1} credit${(data.creditsUsed || 1) === 1 ? "" : "s"}`,
          });
        });
        setLogs(fetchedLogs);
      } else {
        setLogs(defaultLogs);
      }
    } catch (e) {
      console.warn("Failed to fetch transaction logs from Firestore, using defaults:", e);
      setLogs(defaultLogs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const filteredLogs = logs.filter(
    (log) =>
      log.tool.toLowerCase().includes(search.toLowerCase()) ||
      log.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight text-foreground flex items-center gap-3">
            <History className="h-7 w-7 text-primary" />
            Execution History
          </h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            Review detailed execution logs, success status, and credits consumed across all utility workspaces.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={fetchHistory}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Logs
        </Button>
      </div>

      {/* 2. Search Filter */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter logs by tool name or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-xl border border-border bg-card text-foreground pl-11 pr-4 py-2.5 text-sm placeholder-muted-foreground/60 shadow-sm focus:border-primary focus:outline-none transition-colors"
          suppressHydrationWarning
        />
      </div>

      {/* 3. History Logs List */}
      <div className="space-y-4">
        {loading ? (
          <GlassCard className="p-12 text-center animate-pulse flex flex-col items-center justify-center">
            <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin mb-3" />
            <span className="text-sm text-muted-foreground">Decrypting workspace transaction history...</span>
          </GlassCard>
        ) : filteredLogs.length > 0 ? (
          <GlassCard className="overflow-hidden p-0 border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold bg-muted/20">
                    <th className="p-4 pl-6">Tool Workspace</th>
                    <th className="p-4">Execution Time</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 pr-6 text-right">Quota Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 pl-6 font-bold text-foreground flex items-center gap-2.5">
                        <Terminal className="h-4 w-4 text-primary" />
                        {log.tool}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{log.time}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wider ${
                            log.status === "Success"
                              ? "bg-success/10 text-success border border-success/20"
                              : "bg-destructive/10 text-destructive border border-destructive/20"
                          }`}
                        >
                          {log.status === "Success" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right font-mono text-xs text-muted-foreground">
                        {log.cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[220px]">
            <History className="h-8 w-8 text-muted-foreground mb-3" />
            <h4 className="text-base font-semibold text-foreground">No logs found</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
              No executions matched your filters. Run tools in the workspace to write transaction logs.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
