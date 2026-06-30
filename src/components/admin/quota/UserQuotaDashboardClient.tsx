"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  Shield,
  Layers,
  Activity,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  Plus,
  Trash2,
  Lock,
  Unlock,
  CheckCircle,
  Eye,
  EyeOff,
  Database,
  Cpu,
  WifiOff,
  HelpCircle,
  Clock,
  Sparkles,
  Info
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { UserDetailsDrawer } from "./UserDetailsDrawer";
import { OrganizationsPanel } from "./OrganizationsPanel";
import { AnalyticsPanel } from "./AnalyticsPanel";

export function UserQuotaDashboardClient() {
  const [activeTab, setActiveTab] = useState<"users" | "organizations" | "analytics">("users");

  // Connection State
  const [isOnline, setIsOnline] = useState(true);

  // Users List Master States
  const [users, setUsers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [nextLastId, setNextLastId] = useState("");
  const [historyIds, setHistoryIds] = useState<string[]>([""]);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [minCreditsFilter, setMinCreditsFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  // Table Config States
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState({
    avatar: true,
    name: true,
    email: true,
    role: true,
    subscription: true,
    credits: true,
    usageToday: true,
    storage: true,
    status: true,
    joined: true,
    country: true,
  });

  // Bulk Operations State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [bulkReason, setBulkReason] = useState("");
  const [bulkConfirmText, setBulkConfirmText] = useState("");
  const [bulkExecuting, setBulkExecuting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, successes: 0, failures: 0 });
  const [bulkErrors, setBulkErrors] = useState<{ userId: string; error: string }[]>([]);
  const [bulkRetriableIds, setBulkRetriableIds] = useState<string[]>([]);
  const [bulkPayload, setBulkPayload] = useState<any>({});

  // Single User Detail States
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);

  // Overall Statistics States
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [trendRange, setTrendRange] = useState("30"); // 1, 7, 30, 90 days

  // Offline Caching & Connection Event Bindings
  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(window.navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored! Dashboard is online.");
      fetchData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Dashboard is offline. Write operations are disabled.", { duration: 10000 });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Read offline cached user list if present
    const cachedUsers = localStorage.getItem("utool_admin_cached_users");
    if (cachedUsers) {
      try {
        const parsed = JSON.parse(cachedUsers);
        setUsers(parsed.users || []);
        setTotalCount(parsed.total || 0);
      } catch (_) {}
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(0);
      setHistoryIds([""]);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Main Fetch Trigger
  const fetchData = async () => {
    setLoading(true);
    try {
      const activeLastId = historyIds[currentPage] || "";
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        lastId: activeLastId,
        search: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
        subscriptionTier: tierFilter,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/admin/users?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch user profiles");
      
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setTotalCount(data.total || 0);
        setNextLastId(data.nextLastId || "");

        // Cache users in local storage for offline recovery
        localStorage.setItem("utool_admin_cached_users", JSON.stringify({
          users: data.users,
          total: data.total
        }));
      }
    } catch (e: any) {
      toast.error("Error loading dashboard users: " + (e.message || "Network Error"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch overall statistics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAnalytics(data.stats);
        }
      }
    } catch (e) {
      console.error("Failed to load statistics dashboard", e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, roleFilter, statusFilter, tierFilter, sortBy, sortOrder, limit, currentPage]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Pagination Handlers
  const handleNextPage = () => {
    if (!nextLastId) return;
    setHistoryIds(prev => {
      const next = [...prev];
      next[currentPage + 1] = nextLastId;
      return next;
    });
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage === 0) return;
    setCurrentPage(prev => prev - 1);
  };

  // Sorting Handler
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(0);
    setHistoryIds([""]);
  };

  // Selection Checkboxes Handlers
  const handleToggleSelectAll = () => {
    const allSelectedOnPage = users.every(u => selectedIds.has(u.uid));
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelectedOnPage) {
        users.forEach(u => next.delete(u.uid));
      } else {
        users.forEach(u => next.add(u.uid));
      }
      return next;
    });
  };

  const handleToggleSelectUser = (uid: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  // Trigger Bulk Modal
  const initiateBulkAction = (action: string) => {
    if (selectedIds.size === 0) {
      toast.warning("Please select at least one user from the list.");
      return;
    }
    if (!isOnline) {
      toast.error("Write operations are disabled while offline.");
      return;
    }
    setBulkAction(action);
    setBulkReason("");
    setBulkConfirmText("");
    setBulkErrors([]);
    setBulkRetriableIds([]);
    setBulkPayload({});
    setShowBulkModal(true);
  };

  // Bulk execution sequence with progress counters
  const handleExecuteBulkAction = async (retryList?: string[]) => {
    const targets = retryList || Array.from(selectedIds);
    setBulkExecuting(true);
    setBulkErrors([]);

    const total = targets.length;
    let successes = 0;
    let failures = 0;
    const errorsLog: typeof bulkErrors = [];
    const retries: string[] = [];

    // Subdivide targets into mini chunks of size 5 for chunked executions
    const chunkSize = 5;
    for (let i = 0; i < total; i += chunkSize) {
      const chunk = targets.slice(i, i + chunkSize);
      
      const payloadObj = {
        userIds: chunk,
        action: bulkAction,
        payload: bulkPayload,
        reason: bulkReason || `Bulk operation executed by administrator`
      };

      try {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadObj)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Batch execution failed");
        }

        const data = await res.json();
        const batchRes = data.results;

        successes += batchRes.successCount;
        failures += batchRes.failureCount;

        if (batchRes.errors && batchRes.errors.length > 0) {
          errorsLog.push(...batchRes.errors);
        }
        if (batchRes.retriableIds && batchRes.retriableIds.length > 0) {
          retries.push(...batchRes.retriableIds);
        }

      } catch (err: any) {
        failures += chunk.length;
        chunk.forEach(uid => {
          errorsLog.push({ userId: uid, error: err.message || "Failed in batch" });
          retries.push(uid);
        });
      }

      setBulkProgress({
        current: Math.min(i + chunkSize, total),
        total,
        successes,
        failures
      });
    }

    setBulkErrors(errorsLog);
    setBulkRetriableIds(retries);
    setBulkExecuting(false);

    if (failures === 0) {
      toast.success(`Successfully processed bulk action on ${successes} users.`);
      setTimeout(() => {
        setShowBulkModal(false);
        setSelectedIds(new Set());
        fetchData();
        fetchAnalytics();
      }, 1500);
    } else {
      toast.error(`Completed with failures. ${successes} succeeded, ${failures} failed.`);
      fetchData();
    }
  };

  // CSV Export Utility
  const handleCSVExport = () => {
    if (users.length === 0) {
      toast.warning("No user profiles available to export.");
      return;
    }

    const csvData = users.map(u => ({
      UID: u.uid,
      Name: u.displayName || "N/A",
      Email: u.email,
      Role: u.role || "user",
      SubscriptionTier: u.subscriptionTier,
      SubscriptionStatus: u.subscriptionStatus,
      CreditsRemaining: u.credits,
      DailyAICreditsMax: u.maxDailyAICredits || 0,
      DailyAICreditsUsed: u.dailyUsageCount || 0,
      StorageUsedMB: (u.storageUsedBytes / (1024 * 1024)).toFixed(2),
      StorageMaxMB: (u.maxStorageBytes / (1024 * 1024)).toFixed(2),
      Status: u.status || "active",
      Country: u.country || "N/A",
      JoinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"
    }));

    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `utool_user_quota_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully.");
  };

  // Seed Helper
  const triggerDatabaseSeed = async () => {
    if (!isOnline) return;
    const confirmSeed = window.confirm("Are you sure you want to seed the database? This will insert 50+ mock users and billing/usage metrics.");
    if (!confirmSeed) return;

    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchData();
        fetchAnalytics();
      } else {
        toast.error("Seed failed: " + data.error);
      }
    } catch (err: any) {
      toast.error("Seeding API error: " + err.message);
    }
  };

  // Aggregated Stat computations
  const statsList = useMemo(() => {
    if (!analytics) return [];
    return [
      { label: "Total Users", value: analytics.totalUsers, desc: "Platform total accounts", icon: Users, color: "text-purple-400" },
      { label: "Active Today", value: analytics.activeUsersToday, desc: "Users active in last 24h", icon: Activity, color: "text-emerald-500" },
      { label: "Monthly Active", value: analytics.monthlyActiveUsers, desc: "MAU active in last 30d", icon: Clock, color: "text-blue-400" },
      { label: "Suspended", value: analytics.suspendedUsers, desc: "Accounts blocked", icon: AlertTriangle, color: "text-error" },
      { label: "Pro Subscriptions", value: analytics.proUsers, desc: "Active Pro tier members", icon: Sparkles, color: "text-indigo-400" },
      { label: "Enterprise Seats", value: analytics.enterpriseUsers, desc: "Managed enterprise seats", icon: Shield, color: "text-purple-500" },
      { label: "Storage Consumed", value: `${(analytics.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`, desc: "Aggregate R2 storage", icon: Database, color: "text-zinc-400" },
      { label: "Revenue Summary", value: `$${analytics.revenueSummary?.toLocaleString()}`, desc: "Aggregate subscription cash flow", icon: TrendingUp, color: "text-emerald-400" }
    ];
  }, [analytics]);

  return (
    <div className="space-y-8 relative">
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-2xl flex items-center gap-3 animate-pulse text-sm">
          <WifiOff className="h-5 w-5 shrink-0" />
          <div>
            <span className="font-bold">Offline Mode Active:</span> You are currently viewing cached data. All administrative modifications and updates are disabled until connection is restored.
          </div>
        </div>
      )}

      {/* Main Tab Controller */}
      <div className="flex border-b border-border/80 pb-0.5 gap-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 leading-none relative ${
            activeTab === "users" ? "border-purple-500 text-purple-400" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          User Quotas Table
        </button>
        <button
          onClick={() => setActiveTab("organizations")}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 leading-none ${
            activeTab === "organizations" ? "border-purple-500 text-purple-400" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Enterprise Organizations
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 leading-none ${
            activeTab === "analytics" ? "border-purple-500 text-purple-400" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Aggregated Analytics
        </button>
        
        {/* Seed Helper for dev checks */}
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={triggerDatabaseSeed}
            className="ml-auto pb-3 text-xs font-semibold text-muted-foreground hover:text-purple-400 flex items-center gap-1.5 leading-none transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Seed Mock Data
          </button>
        )}
      </div>

      {activeTab === "users" && (
        <>
          {/* Quick Statistics Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingAnalytics ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-card/30 border border-white/[0.04] p-6 space-y-4 animate-pulse">
                  <div className="h-4 bg-muted/60 rounded w-1/3" />
                  <div className="h-8 bg-muted/60 rounded w-1/2" />
                  <div className="h-3 bg-muted/60 rounded w-2/3" />
                </div>
              ))
            ) : (
              statsList.slice(0, 4).map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <GlassCard key={i} className="p-6 border-white/[0.04] bg-card/30 flex flex-col justify-between" hover={false}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mt-4 text-foreground tracking-tight">{stat.value}</h3>
                      <p className="text-[10.5px] text-muted-foreground mt-1 leading-relaxed">{stat.desc}</p>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>

          {/* Search, Filters, and Options Panel */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Global Search: Name, Email, User ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-card/45 border border-white/[0.06] rounded-2xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`rounded-xl border border-white/[0.06] ${showFilters ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : ""}`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Advanced Filters</span>
                </Button>

                <Button variant="outline" onClick={handleCSVExport} className="rounded-xl border border-white/[0.06]">
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            {/* Filter Toggle Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-card/25 border border-white/[0.04] rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div>
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">RBAC Role</label>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2 rounded-xl text-sm text-foreground focus:outline-none"
                      >
                        <option value="">All Roles</option>
                        <option value="owner">Owner</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="support">Support</option>
                        <option value="finance">Finance</option>
                        <option value="developer">Developer</option>
                        <option value="moderator">Moderator</option>
                        <option value="read_only">Read Only</option>
                        <option value="user">User</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Account Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2 rounded-xl text-sm text-foreground focus:outline-none"
                      >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Subscription Tier</label>
                      <select
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value)}
                        className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2 rounded-xl text-sm text-foreground focus:outline-none"
                      >
                        <option value="">All Tiers</option>
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setRoleFilter("");
                          setStatusFilter("");
                          setTierFilter("");
                        }}
                        className="w-full rounded-xl"
                      >
                        Clear Active Filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bulk Action Trigger Floating Bar */}
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-card/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-5 max-w-4xl w-[90%]"
              >
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xs font-extrabold">
                    {selectedIds.size}
                  </div>
                  <span className="text-xs font-bold text-foreground">selected</span>
                </div>

                <div className="h-4 w-px bg-white/[0.08]" />

                <div className="flex flex-wrap gap-2 flex-1">
                  <Button variant="ghost" size="sm" onClick={() => initiateBulkAction("grant_credits")} className="hover:text-purple-400">
                    Grant Credits
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => initiateBulkAction("upgrade")} className="hover:text-indigo-400">
                    Upgrade Tier
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => initiateBulkAction("suspend")} className="hover:text-error text-error/85">
                    Suspend Users
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => initiateBulkAction("unsuspend")} className="hover:text-emerald-500">
                    Unsuspend
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => initiateBulkAction("delete")} className="hover:bg-error/10 text-error hover:text-white">
                    Delete Accounts
                  </Button>
                </div>

                <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="text-muted-foreground text-xs leading-none">
                  Cancel
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main User Operations Data Table */}
          <div className="bg-card/35 border border-white/[0.04] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04] text-[10.5px] font-black uppercase tracking-wider text-muted-foreground bg-muted/10">
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={users.length > 0 && users.every(u => selectedIds.has(u.uid))}
                        onChange={handleToggleSelectAll}
                        className="rounded border-white/[0.08] bg-transparent text-purple-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                    </th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("displayName")}>
                      <div className="flex items-center gap-1.5">
                        <span>User</span>
                        {sortBy === "displayName" && (sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("role")}>
                      <div className="flex items-center gap-1.5">
                        <span>Role</span>
                        {sortBy === "role" && (sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("subscriptionTier")}>
                      <div className="flex items-center gap-1.5">
                        <span>Subscription</span>
                        {sortBy === "subscriptionTier" && (sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("credits")}>
                      <div className="flex items-center gap-1.5">
                        <span>Credits</span>
                        {sortBy === "credits" && (sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                    <th className="p-4">Daily AICredits</th>
                    <th className="p-4">Storage Used</th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("status")}>
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        {sortBy === "status" && (sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("createdAt")}>
                      <div className="flex items-center gap-1.5">
                        <span>Joined</span>
                        {sortBy === "createdAt" && (sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </div>
                    </th>
                    <th className="p-4 w-16 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[13px] font-medium">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="p-4 text-center"><div className="h-4 w-4 bg-muted/60 rounded mx-auto" /></td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-muted/60 rounded-full shrink-0" />
                            <div className="space-y-2 w-full">
                              <div className="h-4 bg-muted/60 rounded w-2/3" />
                              <div className="h-3 bg-muted/60 rounded w-1/2" />
                            </div>
                          </div>
                        </td>
                        <td className="p-4"><div className="h-5 bg-muted/60 rounded w-16" /></td>
                        <td className="p-4"><div className="h-5 bg-muted/60 rounded w-20" /></td>
                        <td className="p-4"><div className="h-4 bg-muted/60 rounded w-12" /></td>
                        <td className="p-4"><div className="h-4 bg-muted/60 rounded w-14" /></td>
                        <td className="p-4"><div className="h-4 bg-muted/60 rounded w-16" /></td>
                        <td className="p-4"><div className="h-5 bg-muted/60 rounded w-16" /></td>
                        <td className="p-4"><div className="h-4 bg-muted/60 rounded w-20" /></td>
                        <td className="p-4 text-center"><div className="h-8 bg-muted/60 rounded w-8 mx-auto" /></td>
                      </tr>
                    ))
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-12 text-center text-muted-foreground">
                        <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <span className="font-extrabold text-sm block mb-1">No Admin Users Found</span>
                        <p className="text-xs">Adjust your search input or clear active filtering queries.</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const storagePct = u.maxStorageBytes ? Math.min(100, Math.round((u.storageUsedBytes / u.maxStorageBytes) * 100)) : 0;
                      return (
                        <tr
                          key={u.uid}
                          className="hover:bg-white/[0.02] cursor-pointer group transition-colors"
                          onClick={() => setDrawerUserId(u.uid)}
                        >
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.has(u.uid)}
                              onChange={() => handleToggleSelectUser(u.uid)}
                              className="rounded border-white/[0.08] bg-transparent text-purple-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.displayName || "utool"}`}
                                alt={u.displayName || "User"}
                                className="h-9 w-9 rounded-full bg-muted/60 shrink-0 border border-white/[0.04]"
                              />
                              <div className="overflow-hidden">
                                <span className="font-bold text-foreground truncate block leading-snug group-hover:text-purple-400 transition-colors">
                                  {u.displayName || "N/A"}
                                </span>
                                <span className="text-xs text-muted-foreground truncate block font-medium">
                                  {u.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                              u.role === "owner" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                              u.role === "admin" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                              u.role === "support" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                              u.role === "finance" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                              u.role === "developer" ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" :
                              "bg-muted text-muted-foreground border-transparent"
                            }`}>
                              {u.role || "user"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                              u.subscriptionTier === "enterprise" ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-sm" :
                              u.subscriptionTier === "pro" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                              "bg-muted/40 text-muted-foreground border-transparent"
                            }`}>
                              {u.subscriptionTier}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold font-mono">{u.credits?.toLocaleString() ?? 0}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-xs text-muted-foreground leading-none">
                              {u.dailyUsageCount || 0} / <span className="font-mono text-[10px]">{u.maxDailyAICredits || 3}</span>
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="w-24">
                              <div className="flex justify-between text-[10px] text-muted-foreground mb-1 leading-none font-mono">
                                <span>{(u.storageUsedBytes / (1024 * 1024)).toFixed(0)} MB</span>
                                <span>{storagePct}%</span>
                              </div>
                              <div className="h-1 bg-muted/60 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${storagePct}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold leading-none ${
                              u.status === "suspended" ? "text-error" : "text-emerald-500"
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${u.status === "suspended" ? "bg-error" : "bg-emerald-500"}`} />
                              {u.status || "active"}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground leading-snug">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                          </td>
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDrawerUserId(u.uid)}
                              className="rounded-lg h-8 w-8 hover:bg-muted/80"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Sticky Table Footer / Pagination */}
            <div className="border-t border-white/[0.04] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
              <span className="text-xs text-muted-foreground font-medium">
                Showing <span className="font-bold text-foreground">{users.length}</span> of{" "}
                <span className="font-bold text-foreground">{totalCount}</span> users
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 || loading}
                  className="rounded-lg"
                >
                  Previous
                </Button>
                <div className="text-xs text-muted-foreground font-mono px-3">
                  Page <span className="font-bold text-foreground">{currentPage + 1}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!nextLastId || loading}
                  className="rounded-lg"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "organizations" && (
        <OrganizationsPanel isOnline={isOnline} />
      )}

      {activeTab === "analytics" && (
        <AnalyticsPanel />
      )}

      {/* SINGLE USER DETAILS DRAWER */}
      <UserDetailsDrawer
        userId={drawerUserId}
        onClose={() => {
          setDrawerUserId(null);
          fetchData();
          fetchAnalytics();
        }}
        isOnline={isOnline}
      />

      {/* BULK OPERATION MODAL */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-white/[0.06] rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Confirm Bulk Operation
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You are about to execute action <span className="font-bold text-purple-400 uppercase">{bulkAction}</span> on{" "}
                  <span className="font-bold text-foreground">{selectedIds.size}</span> selected users.
                </p>
              </div>

              {/* Action Parameter Inputs */}
              {bulkAction === "grant_credits" && (
                <div>
                  <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1.5">Credits Amount to Grant</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    onChange={(e) => setBulkPayload({ credits: e.target.value })}
                    className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
              )}

              {bulkAction === "upgrade" && (
                <div>
                  <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1.5">Select Target Tier</label>
                  <select
                    onChange={(e) => setBulkPayload({ tier: e.target.value })}
                    className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-sm text-foreground focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="pro">Pro Plan</option>
                    <option value="enterprise">Enterprise Plan</option>
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-[10.5px] font-bold text-muted-foreground uppercase block mb-1.5">Administrative Reason</label>
                  <input
                    type="text"
                    placeholder="Provide a reason for the audit log..."
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                {bulkAction === "delete" && (
                  <div>
                    <label className="text-[10.5px] font-bold text-error uppercase block mb-1.5">Type CONFIRM to authorize account deletions</label>
                    <input
                      type="text"
                      placeholder="CONFIRM"
                      value={bulkConfirmText}
                      onChange={(e) => setBulkConfirmText(e.target.value)}
                      className="w-full bg-muted/65 border border-error/20 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-error/50 transition-colors font-bold text-error"
                    />
                  </div>
                )}
              </div>

              {/* Progress Display */}
              {bulkExecuting && (
                <div className="space-y-2 bg-muted/40 p-4 rounded-xl border border-white/[0.04]">
                  <div className="flex justify-between text-xs font-bold leading-none">
                    <span>Executing operations...</span>
                    <span>{bulkProgress.current} / {bulkProgress.total}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-[10px] text-muted-foreground font-bold pt-1 leading-none">
                    <span className="text-emerald-500">{bulkProgress.successes} Succeeded</span>
                    <span className="text-error">{bulkProgress.failures} Failed</span>
                  </div>
                </div>
              )}

              {/* Error reports */}
              {bulkErrors.length > 0 && (
                <div className="max-h-28 overflow-y-auto bg-error/5 border border-error/10 rounded-xl p-3 text-xs text-error space-y-1 font-mono">
                  <span className="font-bold uppercase tracking-wider block mb-1 text-[10px]">Errors Log:</span>
                  {bulkErrors.map((err, i) => (
                    <div key={i}>User {err.userId}: {err.error}</div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkModal(false)}
                  disabled={bulkExecuting}
                  className="rounded-xl border border-white/[0.06]"
                >
                  Cancel
                </Button>

                {bulkRetriableIds.length > 0 ? (
                  <Button
                    variant="primary"
                    onClick={() => handleExecuteBulkAction(bulkRetriableIds)}
                    disabled={bulkExecuting}
                    className="rounded-xl bg-amber-500 text-white"
                  >
                    Retry Failures ({bulkRetriableIds.length})
                  </Button>
                ) : (
                  <Button
                    variant={bulkAction === "delete" ? "destructive" : "primary"}
                    onClick={() => handleExecuteBulkAction()}
                    disabled={
                      bulkExecuting ||
                      !bulkReason.trim() ||
                      (bulkAction === "delete" && bulkConfirmText !== "CONFIRM")
                    }
                    className="rounded-xl"
                  >
                    {bulkAction === "delete" ? "Authorize Hard Delete" : "Apply Operation"}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
