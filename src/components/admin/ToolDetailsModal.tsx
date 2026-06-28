"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FileText,
  Sliders,
  Settings,
  ListTodo,
  History,
  Activity,
  Calendar,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";

interface Feature {
  name: string;
  completed: boolean;
}

interface ToolDetailsModalProps {
  open: boolean;
  onClose: () => void;
  tool: any;
  onSave: (updatedTool: any) => void;
}

export function ToolDetailsModal({
  open,
  onClose,
  tool,
  onSave,
}: ToolDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "implementation" | "features" | "notes" | "history">("overview");

  // Form states
  const [status, setStatus] = useState("Planned");
  const [completion, setCompletion] = useState(0);
  const [priority, setPriority] = useState("Medium");
  const [frontend, setFrontend] = useState(false);
  const [backend, setBackend] = useState(false);
  const [api, setApi] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [seo, setSeo] = useState(false);
  const [tested, setTested] = useState(false);
  const [productionReady, setProductionReady] = useState(false);
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [developerNotes, setDeveloperNotes] = useState("");
  const [version, setVersion] = useState("0.1.0");
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [reason, setReason] = useState("Manual update via admin panel");

  // Audit history state
  const [audits, setAudits] = useState<any[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync form states when tool changes
  useEffect(() => {
    if (tool) {
      setStatus(tool.status || "Planned");
      setCompletion(tool.completion || 0);
      setPriority(tool.priority || "Medium");
      setFrontend(!!tool.frontend);
      setBackend(!!tool.backend);
      setApi(!!tool.api);
      setMobile(!!tool.mobile);
      setSeo(!!tool.seo);
      setTested(!!tool.tested);
      setProductionReady(!!tool.productionReady);
      setEstimatedCompletion(tool.estimatedCompletion || "");
      setDeveloperNotes(tool.developerNotes || "");
      setVersion(tool.version || "0.1.0");
      setFeatures(tool.expectedFeatures || tool.features || []);
      setReason("Manual update via admin panel");
      setActiveTab("overview");
    }
  }, [tool]);

  // Load audit history
  useEffect(() => {
    if (tool && activeTab === "history" && open) {
      setLoadingAudits(true);
      fetch(`/api/tools/${tool.slug}?logs=true`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.logs) {
            setAudits(data.logs);
          }
        })
        .catch((err) => console.error("Error loading audit history:", err))
        .finally(() => setLoadingAudits(false));
    }
  }, [tool, activeTab, open]);

  if (!tool) return null;

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;
    setFeatures([...features, { name: newFeatureName.trim(), completed: false }]);
    setNewFeatureName("");
  };

  const handleToggleFeature = (index: number) => {
    const updated = [...features];
    updated[index].completed = !updated[index].completed;
    setFeatures(updated);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        status,
        completion,
        priority,
        frontend,
        backend,
        api,
        mobile,
        seo,
        tested,
        productionReady,
        estimatedCompletion,
        developerNotes,
        version,
        features, // matches database features
        expectedFeatures: features, // backward compat
        reason,
      };

      const res = await fetch(`/api/tools/${tool.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error("Failed to save tool metadata.");
      }

      const data = await res.json();
      toast.success(`${tool.name} updated successfully!`);
      onSave({
        ...tool,
        ...updates,
        lastUpdated: new Date().toISOString(),
      });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Configure: ${tool.name}`}
      description={`Lifecycle & metadata management for slug: ${tool.slug}`}
      size="lg"
      className="max-h-[85vh] flex flex-col p-6 text-foreground"
    >
      {/* Sliding Tab headers */}
      <div className="flex border-b border-border/80 pb-3 gap-2 overflow-x-auto select-none mt-2">
        {[
          { id: "overview" as const, label: "Overview", icon: FileText },
          { id: "implementation" as const, label: "Implementation", icon: Sliders },
          { id: "features" as const, label: "Features", icon: ListTodo },
          { id: "notes" as const, label: "Developer Notes", icon: Settings },
          { id: "history" as const, label: "History & Audits", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-purple-600 border-transparent text-white shadow-md shadow-purple-500/10"
                  : "bg-muted border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/85"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto pr-1 py-6 space-y-5 min-h-[350px]">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Lifecycle Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-muted border border-border/60 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-purple-500"
                >
                  <option value="Live">🟢 Live</option>
                  <option value="Beta">👑 Beta</option>
                  <option value="Testing">🔵 Testing</option>
                  <option value="In Progress">🟠 In Progress</option>
                  <option value="Planned">🟣 Planned</option>
                  <option value="Deprecated">⚠️ Deprecated</option>
                  <option value="Broken">🔴 Broken</option>
                  <option value="Hidden">⚫ Hidden</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Development Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-muted border border-border/60 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-purple-500"
                >
                  <option value="Critical">🔴 Critical Priority</option>
                  <option value="High">🟠 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🔵 Low Priority</option>
                </select>
              </div>
            </div>

            {/* Completion Slider */}
            <div className="space-y-2 bg-muted/40 border border-border p-5 rounded-2xl">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-wider">Completion Progress</span>
                <span className="text-purple-600 font-extrabold">{completion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={completion}
                onChange={(e) => setCompletion(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold pt-1">
                <span>0% (Planned)</span>
                <span>50% (Core Working)</span>
                <span>100% (Production)</span>
              </div>
            </div>

            {/* Version Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Semantic Version
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1.0.4"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full bg-muted border border-border/60 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Estimated Completion Date
                </label>
                <input
                  type="date"
                  value={estimatedCompletion}
                  onChange={(e) => setEstimatedCompletion(e.target.value)}
                  className="w-full bg-muted border border-border/60 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "implementation" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Test Readiness Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { state: frontend, set: setFrontend, label: "Frontend Complete", desc: "Interactive UI finished" },
                { state: backend, set: setBackend, label: "Backend Implemented", desc: "Core engines & APIs working" },
                { state: api, set: setApi, label: "API Available", desc: "REST / programmable API endpoints" },
                { state: mobile, set: setMobile, label: "Mobile Compliant", desc: "Mobile-responsive layouts ready" },
                { state: seo, set: setSeo, label: "SEO Optimized", desc: "Custom metatags & pSEO pages live" },
                { state: tested, set: setTested, label: "QA & Tested", desc: "Fully validated by developer/testing suite" },
              ].map((item, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                    item.state
                      ? "bg-purple-500/[0.04] border-purple-500/35 hover:bg-purple-500/[0.08]"
                      : "bg-muted border-border/40 hover:bg-muted/80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.set(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-foreground leading-none">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="h-px bg-border/80 my-4" />

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Production Release Check
              </h4>
              <label
                className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer select-none transition-all ${
                  productionReady
                    ? "bg-emerald-500/[0.03] border-emerald-500/40 hover:bg-emerald-500/[0.06]"
                    : "bg-muted border-border/40 hover:bg-muted/80"
                }`}
              >
                <input
                  type="checkbox"
                  checked={productionReady}
                  onChange={(e) => setProductionReady(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                    {productionReady ? "✅ Ready for Production" : "❌ Production Gate Blocked"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Checking this confirms that the tool has cleared all QA, SEO, mobile compatibility, and backend requirements. The tool will be marked eligible for live client usage.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {activeTab === "features" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Expected Features Builder
            </h4>
            
            <form onSubmit={handleAddFeature} className="flex gap-2">
              <input
                type="text"
                placeholder="Add expected feature... e.g. Batch File Support"
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
                className="flex-1 bg-muted border border-border/60 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
              <Button type="submit" size="sm" className="rounded-xl flex items-center gap-1 text-xs">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </form>

            <div className="border border-border/60 rounded-2xl bg-card overflow-hidden">
              {features.length > 0 ? (
                <ul className="divide-y divide-border/60">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-between p-4 hover:bg-muted/40">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={feature.completed}
                          onChange={() => handleToggleFeature(idx)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className={`text-xs font-semibold ${feature.completed ? "line-through text-muted-foreground/60" : "text-foreground"}`}>
                          {feature.name}
                        </span>
                      </label>
                      
                      <button
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-muted-foreground hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/5 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-xs font-bold text-muted-foreground bg-muted/20">
                  No features configured. Add features using the input above.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Developer Notes & Documentation
              </label>
              <textarea
                rows={6}
                placeholder="Include internal checklist info, architecture blockouts, database paths, or API integrations..."
                value={developerNotes}
                onChange={(e) => setDeveloperNotes(e.target.value)}
                className="w-full bg-muted border border-border/60 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Change Log & Audit Trail
            </h4>

            {loadingAudits ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <p className="text-xs font-bold text-muted-foreground">Loading audit timeline...</p>
              </div>
            ) : audits.length > 0 ? (
              <div className="relative border-l border-border pl-6 space-y-6 mt-4 ml-3">
                {audits.map((log) => (
                  <div key={log.id} className="relative space-y-1">
                    {/* Circle marker */}
                    <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 ring-4 ring-background">
                      <Activity className="h-2 w-2 text-white" />
                    </span>
                    
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-xs font-bold text-foreground">
                        Updated by: <span className="text-purple-600">{log.adminEmail}</span>
                      </p>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      Reason: "{log.reason || "Manual update"}"
                    </p>

                    {/* Diff display */}
                    <div className="bg-muted/40 border border-border p-3.5 rounded-xl text-[11px] font-semibold space-y-1 max-w-lg mt-2">
                      {Object.keys(log.newValues || {}).map((k) => {
                        const oldVal = log.previousValues?.[k];
                        const newVal = log.newValues[k];
                        if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return null;

                        return (
                          <div key={k} className="flex flex-wrap gap-1 leading-relaxed">
                            <span className="text-muted-foreground font-bold">{k}:</span>
                            <span className="text-rose-500 line-through">{JSON.stringify(oldVal)}</span>
                            <span className="text-muted-foreground font-bold">→</span>
                            <span className="text-emerald-500 font-bold">{JSON.stringify(newVal)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 border border-border/40 p-6 rounded-2xl bg-muted/20 justify-center">
                <AlertCircle className="h-4.5 w-4.5 text-muted-foreground" />
                <p className="text-xs font-bold text-muted-foreground">No audit logs found for this tool.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Reason Input + Action Buttons */}
      <div className="border-t border-border/80 pt-5 mt-auto flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {activeTab !== "history" ? (
          <div className="flex-1 max-w-md flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Audit Reason (Required for logs)
            </span>
            <input
              type="text"
              placeholder="e.g. Initial QA passed, marking live"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-muted border border-border/60 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-purple-500"
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving} className="rounded-xl font-bold">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !reason.trim()} size="sm" className="rounded-xl font-bold flex items-center gap-1">
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
