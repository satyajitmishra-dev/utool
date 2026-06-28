"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Layers,
  Lock,
  Unlock,
  Sliders,
  CheckSquare,
  Trash2,
  Loader2,
  ArrowUpDown,
  Bell,
  Eye,
  EyeOff,
  Settings,
  Flame,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { ToolDetailsModal } from "./ToolDetailsModal";
import { Button } from "@/components/ui/button";

interface AdminToolsDashboardClientProps {
  initialTools: any[];
}

export function AdminToolsDashboardClient({ initialTools }: AdminToolsDashboardClientProps) {
  // Master state
  const [tools, setTools] = useState<any[]>(initialTools);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());

  // Filter & search states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [completionFilter, setCompletionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50); // Default items per page

  // Edit Modal state
  const [editingTool, setEditingTool] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Bulk operation states
  const [bulkAction, setBulkAction] = useState("");
  const [bulkCompletionValue, setBulkCompletionValue] = useState(100);
  const [bulkPriorityValue, setBulkPriorityValue] = useState("Medium");
  const [bulkCategoryValue, setBulkCategoryValue] = useState("PDF");
  const [bulkReason, setBulkReason] = useState("Bulk administrative status update");
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Scroll virtualization ref and scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [search, statusFilter, categoryFilter, completionFilter, sortBy, sortOrder]);

  // Handle scroll events for virtualization
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Derive status and category list dynamically
  const categoriesList = useMemo(() => {
    const cats = new Set(initialTools.map((t) => t.category));
    return ["all", ...Array.from(cats)].sort();
  }, [initialTools]);

  const statusesList = [
    "all",
    "Live",
    "Beta",
    "Testing",
    "In Progress",
    "Planned",
    "Deprecated",
    "Broken",
    "Hidden"
  ];

  // Dynamic statistics calculations
  const stats = useMemo(() => {
    const total = tools.length;
    const live = tools.filter((t) => t.status === "Live").length;
    const testing = tools.filter((t) => t.status === "Testing").length;
    const progress = tools.filter((t) => t.status === "In Progress").length;
    const broken = tools.filter((t) => t.status === "Broken").length;
    const hidden = tools.filter((t) => t.status === "Hidden").length;
    const beta = tools.filter((t) => t.status === "Beta").length;
    
    const productionReady = tools.filter((t) => t.productionReady).length;
    const needsBackend = tools.filter((t) => t.status !== "Live" && !t.backend).length;
    const needsApi = tools.filter((t) => t.status !== "Live" && !t.api).length;
    const needsTesting = tools.filter((t) => t.status !== "Live" && !t.tested).length;

    const sumCompletion = tools.reduce((acc, t) => acc + (t.completion ?? 0), 0);
    const avgCompletion = total > 0 ? Math.round(sumCompletion / total) : 0;

    // Category breakdown averages
    const catStats: Record<string, { count: number; sum: number }> = {};
    tools.forEach((t) => {
      const c = t.category || "Other";
      if (!catStats[c]) catStats[c] = { count: 0, sum: 0 };
      catStats[c].count += 1;
      catStats[c].sum += t.completion ?? 0;
    });
    const catBreakdown = Object.entries(catStats).map(([name, val]) => ({
      name,
      count: val.count,
      average: Math.round(val.sum / val.count),
    })).sort((a, b) => b.average - a.average);

    return {
      total,
      live,
      testing,
      progress,
      broken,
      hidden,
      beta,
      productionReady,
      needsBackend,
      needsApi,
      needsTesting,
      avgCompletion,
      catBreakdown,
    };
  }, [tools]);

  // Apply filters, search, and sorting
  const filteredTools = useMemo(() => {
    let result = [...tools];

    // 1. Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter !== "all") {
      const sf = statusFilter.toLowerCase();
      result = result.filter((t) => t.status?.toLowerCase() === sf);
    }

    // 3. Category Filter
    if (categoryFilter !== "all") {
      const cf = categoryFilter.toLowerCase();
      result = result.filter((t) => t.category?.toLowerCase() === cf);
    }

    // 4. Completion Filter
    if (completionFilter !== "all") {
      const min = parseInt(completionFilter, 10);
      if (!isNaN(min)) {
        result = result.filter((t) => (t.completion ?? 0) >= min);
      }
    }

    // 5. Sorting
    const priorityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "completion") {
        valA = a.completion ?? 0;
        valB = b.completion ?? 0;
      } else if (sortBy === "lastUpdated") {
        valA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        valB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      } else if (sortBy === "priority") {
        valA = priorityWeight[a.priority as keyof typeof priorityWeight] ?? 0;
        valB = priorityWeight[b.priority as keyof typeof priorityWeight] ?? 0;
      } else {
        valA = (valA ?? "").toString().toLowerCase();
        valB = (valB ?? "").toString().toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [tools, search, statusFilter, categoryFilter, completionFilter, sortBy, sortOrder]);

  // Paginated list matching active filters
  const paginatedTools = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredTools.slice(startIndex, startIndex + limit);
  }, [filteredTools, page, limit]);

  const totalPages = Math.ceil(filteredTools.length / limit);

  // Virtualization constants
  const rowHeight = 65; // Fixed row height in pixels
  const containerHeight = 500; // Fixed scroll window height in pixels
  const buffer = 5; // Buffer items before/after viewport

  const virtualItems = useMemo(() => {
    const totalCount = paginatedTools.length;
    const totalHeight = totalCount * rowHeight;

    const visibleRows = Math.ceil(containerHeight / rowHeight);
    const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    const endIdx = Math.min(totalCount, startIdx + visibleRows + 2 * buffer);

    const rows = [];
    for (let i = startIdx; i < endIdx; i++) {
      rows.push({
        index: i,
        tool: paginatedTools[i],
        offsetY: i * rowHeight,
      });
    }

    return {
      rows,
      totalHeight,
    };
  }, [paginatedTools, scrollTop]);

  // Selections
  const handleSelectTool = (slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleSelectAllOnPage = () => {
    const pageSlugs = paginatedTools.map((t) => t.slug);
    const allSelected = pageSlugs.every((slug) => selectedSlugs.has(slug));

    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageSlugs.forEach((slug) => next.delete(slug));
      } else {
        pageSlugs.forEach((slug) => next.add(slug));
      }
      return next;
    });
  };

  // Bulk update API action
  const handleBulkUpdate = async () => {
    if (selectedSlugs.size === 0 || !bulkAction) return;

    setBulkUpdating(true);
    const slugsArray = Array.from(selectedSlugs);

    // Compute bulk updates
    let updates: Record<string, any> = {};
    if (bulkAction === "Live") {
      updates = { status: "Live", completion: 100, frontend: true, backend: true, api: true, tested: true, productionReady: true };
    } else if (bulkAction === "Testing") {
      updates = { status: "Testing", tested: true };
    } else if (bulkAction === "Broken") {
      updates = { status: "Broken", productionReady: false };
    } else if (bulkAction === "Hide") {
      updates = { status: "Hidden" };
    } else if (bulkAction === "Show") {
      updates = { status: "Live" };
    } else if (bulkAction === "completion") {
      updates = { completion: bulkCompletionValue };
    } else if (bulkAction === "priority") {
      updates = { priority: bulkPriorityValue };
    } else if (bulkAction === "category") {
      updates = { category: bulkCategoryValue };
    } else if (bulkAction === "production") {
      updates = { productionReady: true };
    } else if (bulkAction === "testing-complete") {
      updates = { tested: true };
    }

    // Optimistic UI updates
    setTools((prev) =>
      prev.map((t) => {
        if (selectedSlugs.has(t.slug)) {
          return {
            ...t,
            ...updates,
            lastUpdated: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    const oldSelected = new Set(selectedSlugs);
    setSelectedSlugs(new Set()); // Reset selections
    setBulkAction("");

    try {
      const res = await fetch("/api/tools/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: slugsArray,
          updates,
          reason: bulkReason,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to sync bulk updates with server.");
      }

      toast.success(`Successfully updated ${slugsArray.length} tools!`);
    } catch (err: any) {
      toast.error(err.message || "Bulk update sync error.");
      // Rollback on error
      fetch("/api/tools?limit=500")
        .then((r) => r.json())
        .then((d) => {
          if (d && d.tools) setTools(d.tools);
        });
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleEditClick = (tool: any) => {
    setEditingTool(tool);
    setModalOpen(true);
  };

  const handleModalSave = (updatedTool: any) => {
    setTools((prev) =>
      prev.map((t) => (t.slug === updatedTool.slug ? { ...t, ...updatedTool } : t))
    );
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "Live": return "bg-emerald-500 text-emerald-600 border-emerald-500/20";
      case "Testing": return "bg-blue-500 text-blue-600 border-blue-500/20";
      case "In Progress": return "bg-orange-500 text-orange-600 border-orange-500/20";
      case "Planned": return "bg-purple-500 text-purple-600 border-purple-500/20";
      case "Beta": return "bg-cyan-500 text-cyan-600 border-cyan-500/20";
      case "Deprecated": return "bg-zinc-500 text-zinc-600 border-zinc-500/20";
      case "Broken": return "bg-red-500 text-red-600 border-red-500/20";
      default: return "bg-zinc-500 text-zinc-600 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-10 px-6 max-w-7xl mx-auto space-y-10 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] bg-indigo-500/[0.03] blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="border-b border-border/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-purple-500/20">
            <Sliders className="h-3.5 w-3.5" />
            Internal Management
          </div>
          <h1 className="text-display-s md:text-display-md font-black tracking-tight leading-none mt-2">
            Tool Lifecycle Tracker
          </h1>
          <p className="text-body-s text-muted-foreground mt-2 max-w-2xl">
            REDESIGNED SaaS Tool Management Dashboard. Monitor development status, test gates, feature checklists, and audits.
          </p>
        </div>
      </div>

      {/* 1. Dashboard Metrics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Tools", value: stats.total, color: "text-foreground" },
          { label: "Live Engines", value: `${stats.live} / ${stats.total}`, color: "text-emerald-500" },
          { label: "Average Progress", value: `${stats.avgCompletion}%`, color: "text-purple-500" },
          { label: "QA Completed", value: stats.productionReady, color: "text-blue-400" },
          { label: "Needs Backend", value: stats.needsBackend, color: "text-orange-400" },
          { label: "Needs API", value: stats.needsApi, color: "text-rose-500" }
        ].map((card, i) => (
          <div key={i} className="glass-card bg-card/40 border border-border/60 p-5 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{card.label}</span>
            <span className={`text-2xl font-black mt-3.5 tracking-tight ${card.color}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* 2. Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Counts Chart */}
        <div className="glass-card bg-card/40 border border-border/60 p-6 rounded-3xl space-y-4 lg:col-span-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Lifecycle State Count</h3>
          <div className="space-y-3.5 pt-2">
            {[
              { label: "Live", count: stats.live, color: "bg-emerald-500" },
              { label: "Beta", count: stats.beta, color: "bg-cyan-500" },
              { label: "Testing", count: stats.testing, color: "bg-blue-500" },
              { label: "In Progress", count: stats.progress, color: "bg-orange-500" },
              { label: "Broken", count: stats.broken, color: "bg-red-500" },
              { label: "Hidden", count: stats.hidden, color: "bg-zinc-500" }
            ].map((bar, idx) => {
              const percentage = stats.total > 0 ? (bar.count / stats.total) * 100 : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{bar.label}</span>
                    <span>{bar.count}</span>
                  </div>
                  <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${bar.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion by Category */}
        <div className="glass-card bg-card/40 border border-border/60 p-6 rounded-3xl space-y-4 lg:col-span-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Completion Average by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 pt-2">
            {stats.catBreakdown.slice(0, 10).map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>{cat.name} <span className="text-[10px] text-muted-foreground font-semibold">({cat.count} tools)</span></span>
                  <span className="text-purple-500">{cat.average}%</span>
                </div>
                <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.average}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Filters & Controls */}
      <div className="glass-card bg-card/40 border border-border/60 p-6 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-purple-600" />
            Registry Listings Filter ({filteredTools.length} tools)
          </h3>
          
          <div className="relative w-full md:max-w-md h-10 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Quick search by name, slug or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full bg-muted border border-border/60 rounded-xl pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-1">
          {/* Status filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status State</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-muted border border-border/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              {statusesList.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-muted border border-border/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              {categoriesList.map((c) => (
                <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
              ))}
            </select>
          </div>

          {/* Completion Threshold */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Completion Threshold</span>
            <select
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value)}
              className="w-full bg-muted border border-border/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All completion values</option>
              <option value="100">100% (Complete)</option>
              <option value="90">90% or above</option>
              <option value="80">80% or above</option>
              <option value="70">70% or above</option>
              <option value="50">50% or above</option>
              <option value="0">0% or above</option>
            </select>
          </div>

          {/* Items per page limit */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Display Limit</span>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value, 10))}
              className="w-full bg-muted border border-border/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="25">25 items</option>
              <option value="50">50 items</option>
              <option value="100">100 items</option>
              <option value="500">Show All (Virtualized)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Virtualized Table Container */}
      <div className="border border-border/80 bg-card/25 rounded-3xl overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1.5fr_1.2fr_1fr_1.5fr_1fr_0.8fr] gap-4 bg-muted/65 border-b border-border/80 px-6 py-4 text-xs font-bold text-muted-foreground select-none">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={paginatedTools.length > 0 && paginatedTools.every((t) => selectedSlugs.has(t.slug))}
              onChange={handleSelectAllOnPage}
              className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
          </div>
          
          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort("name")}>
            Tool Name & Slug <ArrowUpDown className="h-3 w-3 shrink-0" />
          </div>
          
          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort("category")}>
            Category <ArrowUpDown className="h-3 w-3 shrink-0" />
          </div>
          
          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort("status")}>
            Status <ArrowUpDown className="h-3 w-3 shrink-0" />
          </div>

          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => toggleSort("completion")}>
            Completion % <ArrowUpDown className="h-3 w-3 shrink-0" />
          </div>

          <div className="flex items-center">Gate Checklist</div>
          
          <div className="flex items-center justify-end">Actions</div>
        </div>

        {/* Scroll Window (Virtualized) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-y-auto w-full relative"
          style={{ height: `${Math.min(containerHeight, paginatedTools.length * rowHeight)}px` }}
        >
          {paginatedTools.length > 0 ? (
            <div style={{ height: `${virtualItems.totalHeight}px`, width: "100%", position: "relative" }}>
              {virtualItems.rows.map(({ index, tool, offsetY }) => {
                if (!tool) return null;
                const isSelected = selectedSlugs.has(tool.slug);
                return (
                  <div
                    key={tool.slug}
                    className={`grid grid-cols-[40px_1.5fr_1.2fr_1fr_1.5fr_1fr_0.8fr] gap-4 items-center px-6 border-b border-border/60 hover:bg-muted/30 transition-all ${
                      isSelected ? "bg-purple-500/[0.02]" : ""
                    }`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${rowHeight}px`,
                      transform: `translateY(${offsetY}px)`,
                    }}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center h-full">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectTool(tool.slug)}
                        className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </div>

                    {/* Tool Name & Slug */}
                    <div className="flex items-center gap-3 overflow-hidden pr-2">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-black text-foreground truncate group-hover:text-purple-600">
                          {tool.name}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground mt-0.5 truncate leading-none">
                          /{tool.slug}
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="text-xs font-extrabold text-foreground truncate leading-none">
                      {tool.category}
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${getStatusDotColor(tool.status)}`}>
                        {tool.status || "Planned"}
                      </span>
                    </div>

                    {/* Completion bar */}
                    <div className="flex flex-col pr-6">
                      <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground mb-1 select-none">
                        <span>{tool.completion ?? 0}% Complete</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                          style={{ width: `${tool.completion ?? 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Checklist details */}
                    <div className="flex flex-wrap gap-1 items-center">
                      {[
                        { flag: tool.frontend, letter: "FE", label: "Frontend Complete" },
                        { flag: tool.backend, letter: "BE", label: "Backend Ready" },
                        { flag: tool.api, letter: "API", label: "API Available" },
                        { flag: tool.seo, letter: "SEO", label: "SEO Configured" },
                        { flag: tool.tested, letter: "QA", label: "QA Tested" },
                        { flag: tool.productionReady, letter: "PR", label: "Production Ready" }
                      ].map((gate, gIdx) => (
                        <span
                          key={gIdx}
                          title={`${gate.label}: ${gate.flag ? "Yes" : "No"}`}
                          className={`text-[8px] font-black px-1 py-0.2 rounded-md leading-none border select-none ${
                            gate.flag
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}
                        >
                          {gate.letter}
                        </span>
                      ))}
                    </div>

                    {/* Action edit buttons */}
                    <div className="flex items-center justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(tool)}
                        className="rounded-xl flex items-center gap-1 text-[11px] font-bold h-7.5 px-3"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Configure
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-xs font-bold text-muted-foreground">
              No tools matched your current filters.
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-xs font-bold border-t border-border pt-4">
          <span className="text-muted-foreground select-none">
            Showing {Math.min(filteredTools.length, (page - 1) * limit + 1)} -{" "}
            {Math.min(filteredTools.length, page * limit)} of {filteredTools.length} tools
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl h-8 text-[11px] font-bold"
            >
              Previous Page
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-xl h-8 text-[11px] font-bold"
            >
              Next Page
            </Button>
          </div>
        </div>
      )}

      {/* 5. Bulk Operations Action Bar */}
      <AnimatePresence>
        {selectedSlugs.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-6 right-6 z-40 bg-card border border-purple-500/30 rounded-2xl shadow-xl p-5 max-w-5xl mx-auto flex flex-col gap-4 backdrop-blur-md"
          >
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-border/60 pb-2">
              <p className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                <CheckSquare className="h-4.5 w-4.5 text-purple-600" />
                Bulk Actions: <span className="text-purple-600">{selectedSlugs.size} tools selected</span>
              </p>
              <button
                onClick={() => setSelectedSlugs(new Set())}
                className="text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer uppercase tracking-wider"
              >
                Clear Selection
              </button>
            </div>

            {/* Form selections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Select Operation</span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="bg-muted border border-border/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="">-- Choose Bulk Update Action --</option>
                  <option value="Live">🟢 Mark Live (100%, FE+BE+QA checks)</option>
                  <option value="Testing">🔵 Mark Testing (tested: true)</option>
                  <option value="Broken">🔴 Mark Broken (productionReady: false)</option>
                  <option value="Hide">⚫ Hide Tools (status: Hidden)</option>
                  <option value="Show">🟢 Show Tools (status: Live)</option>
                  <option value="completion">📊 Update Completion %</option>
                  <option value="priority">🔥 Update Development Priority</option>
                  <option value="category">📁 Re-categorize Tools</option>
                  <option value="production">✅ Set Production Ready</option>
                  <option value="testing-complete">🧪 Set Testing Complete</option>
                </select>
              </div>

              {/* Context inputs matching selected bulk action */}
              {bulkAction === "completion" && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Completion Progress ({bulkCompletionValue}%)</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={bulkCompletionValue}
                    onChange={(e) => setBulkCompletionValue(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-600 h-1 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {bulkAction === "priority" && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Priority level</span>
                  <select
                    value={bulkPriorityValue}
                    onChange={(e) => setBulkPriorityValue(e.target.value)}
                    className="bg-muted border border-border/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="Critical">Critical Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              )}

              {bulkAction === "category" && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Category</span>
                  <select
                    value={bulkCategoryValue}
                    onChange={(e) => setBulkCategoryValue(e.target.value)}
                    className="bg-muted border border-border/60 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    {categoriesList.filter(c => c !== "all").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Audit change logs reason */}
              {bulkAction && (
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Audit Reason (Required)</span>
                  <input
                    type="text"
                    placeholder="Provide reason for bulk operation..."
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    className="bg-muted border border-border/60 rounded-xl px-3.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}
            </div>

            {/* Perform action trigger */}
            {bulkAction && (
              <div className="flex justify-end gap-2 border-t border-border/40 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkAction("")}
                  className="rounded-xl h-8.5 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkUpdate}
                  disabled={bulkUpdating || !bulkReason.trim()}
                  size="sm"
                  className="rounded-xl h-8.5 font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/10"
                >
                  {bulkUpdating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Flame className="h-3.5 w-3.5" />
                  )}
                  Execute Bulk Operation
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Configuration Modal */}
      <ToolDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tool={editingTool}
        onSave={handleModalSave}
      />
    </div>
  );
}
