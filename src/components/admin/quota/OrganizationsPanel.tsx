"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Layers,
  Activity,
  Plus,
  RefreshCw,
  Info,
  CheckCircle,
  Database,
  Sliders,
  Send,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface OrganizationsPanelProps {
  isOnline: boolean;
}

export function OrganizationsPanel({ isOnline }: OrganizationsPanelProps) {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [tier, setTier] = useState("enterprise");
  const [maxSeats, setMaxSeats] = useState(10);
  const [saving, setSaving] = useState(false);

  // Edit Organization Quota
  const [editingOrg, setEditingOrg] = useState<any>(null);
  const [editSeats, setEditSeats] = useState(10);
  const [editStorageGB, setEditStorageGB] = useState(10);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/organizations");
      if (!res.ok) throw new Error("Failed to load organizations");
      const data = await res.json();
      if (data.success) {
        setOrganizations(data.organizations || []);
      }
    } catch (e: any) {
      toast.error("Error loading B2B organizations: " + (e.message || "Network Error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      toast.error("Write operations are disabled while offline.");
      return;
    }
    if (!name.trim() || !ownerId.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          ownerId: ownerId.trim(),
          subscriptionTier: tier,
          maxSeats: maxSeats,
          maxStorageBytes: 100 * 1024 * 1024 * 1024 // 100 GB default
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create organization");
      }

      toast.success(`Successfully created B2B Enterprise Organization: ${name}`);
      setShowCreateForm(false);
      setName("");
      setOwnerId("");
      fetchOrganizations();
    } catch (err: any) {
      toast.error(err.message || "Failed to create organization");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveQuota = async () => {
    if (!editingOrg) return;
    if (!isOnline) {
      toast.error("Write operations are disabled while offline.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/organizations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingOrg.id,
          maxSeats: editSeats,
          maxStorageBytes: editStorageGB * 1024 * 1024 * 1024
        })
      });

      if (!res.ok) throw new Error("Failed to save organization updates");

      toast.success("Organization limits modified successfully.");
      setEditingOrg(null);
      fetchOrganizations();
    } catch (err: any) {
      toast.error(err.message || "Failed to edit limits");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Organizations Header actions */}
      <div className="flex justify-between items-center leading-none">
        <div>
          <h3 className="text-lg font-black text-foreground">B2B Team Accounts</h3>
          <p className="text-xs text-muted-foreground mt-1">Manage B2B organizations, department groups, team quotas, and SSO integrations.</p>
        </div>
        <Button variant="primary" disabled={!isOnline} onClick={() => setShowCreateForm(true)} className="rounded-xl">
          <Plus className="h-4.5 w-4.5" />
          <span>New B2B Team</span>
        </Button>
      </div>

      {/* Creation Modal form */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreateOrg} className="bg-card border border-white/[0.06] rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Initialize B2B Organization
              </h3>
              <p className="text-xs text-muted-foreground leading-normal">
                Set up a new shared billing and seating environment for an enterprise customer.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. Stark Industries"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Owner User ID (UID)</label>
                <input
                  type="text"
                  placeholder="e.g. user_vip_1"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Seat Cap</label>
                  <input
                    type="number"
                    value={maxSeats}
                    onChange={(e) => setMaxSeats(parseInt(e.target.value))}
                    min="2"
                    className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Billing Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-sm text-foreground focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="pro">B2B Pro</option>
                    <option value="enterprise">B2B Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} className="rounded-xl border-white/[0.06]">
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving} className="rounded-xl">
                Create Org
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Editing Limits Dialog */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-white/[0.06] rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Sliders className="h-5 w-5 text-purple-400" />
                Edit B2B Quotas
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Modify shared usage caps for team organization: <span className="font-bold text-foreground">{editingOrg.name}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Max Seating Seats</label>
                <input
                  type="number"
                  value={editSeats}
                  onChange={(e) => setEditSeats(parseInt(e.target.value))}
                  min="2"
                  className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Max Storage Bytes (GB)</label>
                <input
                  type="number"
                  value={editStorageGB}
                  onChange={(e) => setEditStorageGB(parseInt(e.target.value))}
                  min="1"
                  className="w-full bg-muted/65 border border-white/[0.06] px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingOrg(null)} className="rounded-xl border-white/[0.06]">
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={handleSaveQuota} loading={saving} className="rounded-xl">
                Apply Limits
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Organizations List cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 bg-card/30 border border-white/[0.04] rounded-2xl animate-pulse" />
          ))
        ) : organizations.length === 0 ? (
          <div className="col-span-2 bg-card/30 border border-white/[0.04] rounded-2xl p-12 text-center text-muted-foreground font-semibold">
            <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            No organizations registered. Click "New B2B Team" to initialize one.
          </div>
        ) : (
          organizations.map((org) => {
            const currentMembersCount = org.members?.length || 0;
            const storagePct = org.maxStorageBytes ? Math.min(100, Math.round((org.sharedStorageBytes / org.maxStorageBytes) * 100)) : 0;
            return (
              <GlassCard key={org.id} className="p-6 border-white/[0.04] bg-card/35 flex flex-col justify-between space-y-4" hover={false}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground tracking-tight">{org.name}</h4>
                    <span className="text-[10px] text-muted-foreground font-mono">Org ID: {org.id}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    org.subscriptionTier === "enterprise" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  }`}>
                    {org.subscriptionTier}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs border-y border-white/[0.03] py-3.5 font-bold">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Members</span>
                    <span className="text-foreground font-mono">{currentMembersCount} / {org.maxSeats || 10}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Daily AICredits</span>
                    <span className="text-foreground font-mono">{org.teamQuotas?.dailyAICredits || 100}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Monthly Limit</span>
                    <span className="text-foreground font-mono">{org.teamQuotas?.monthlyCredits || 5000}</span>
                  </div>
                </div>

                {/* Storage used progress indicator */}
                <div className="space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between text-[10px] text-muted-foreground leading-none font-mono">
                    <span>Storage Consumed: {(org.sharedStorageBytes / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                    <span>{storagePct}% of {(org.maxStorageBytes / (1024 * 1024 * 1024)).toFixed(0)} GB</span>
                  </div>
                  <div className="h-1 bg-muted/60 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${storagePct}%` }} />
                  </div>
                </div>

                {/* Departments list */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Departments</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(org.departments || []).map((dep: string) => (
                      <span key={dep} className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingOrg(org);
                      setEditSeats(org.maxSeats || 10);
                      setEditStorageGB(Math.round(org.maxStorageBytes / (1024 * 1024 * 1024)) || 10);
                    }}
                    disabled={!isOnline}
                    className="rounded-lg text-xs h-8 border-white/[0.06] font-bold"
                  >
                    Adjust Quotas
                  </Button>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
