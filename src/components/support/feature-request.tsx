"use client";

import React, { useState, useEffect, useTransition } from "react";
import { ArrowUp, Sparkles, MessageSquare, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  submitFeatureRequestAction,
  voteFeatureRequestAction,
} from "@/app/actions/support";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

interface FeatureRequest {
  id: string;
  name: string;
  toolName: string;
  description: string;
  votes: number;
  votedUids: string[];
}

export function FeatureRequestSystem() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [loadingList, setLoadingList] = useState(true);
  const [requests, setRequests] = useState<FeatureRequest[]>([]);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [toolName, setToolName] = useState("");
  const [description, setDescription] = useState("");

  // Upvote trackers
  const [localVotes, setLocalVotes] = useState<string[]>([]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    } else {
      setName("");
      setEmail("");
    }
  }, [user]);

  // Load top requests and local votes on mount
  useEffect(() => {
    fetchTopRequests();
    
    const storedVotes = localStorage.getItem("utool_voted_requests");
    if (storedVotes) {
      try {
        setLocalVotes(JSON.parse(storedVotes));
      } catch (e) {
        setLocalVotes([]);
      }
    }
  }, []);

  const fetchTopRequests = async () => {
    setLoadingList(true);
    try {
      const q = query(
        collection(db, "feature_requests"),
        orderBy("votes", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          toolName: data.toolName,
          description: data.description,
          votes: data.votes || 0,
          votedUids: data.votedUids || [],
        };
      });
      setRequests(items);
    } catch (error) {
      console.warn("Firestore feature requests read failed (insufficient rules/auth), using mock fallbacks:", error instanceof Error ? error.message : String(error));
      setRequests([
        {
          id: "feat-m1",
          name: "Add FFmpeg multi-track audio editing support",
          toolName: "Media Workspace",
          description: "Allow merging audio tracks on top of video backgrounds directly with a visual timeline.",
          votes: 84,
          votedUids: [],
        },
        {
          id: "feat-m2",
          name: "Static QR Code logo overlays",
          toolName: "QR Code Generator",
          description: "Let users upload custom brand icons and center them inside the QR code vector grid automatically.",
          votes: 61,
          votedUids: [],
        },
        {
          id: "feat-m3",
          name: "PDF OCR batch processing",
          toolName: "PDF Tools",
          description: "Allow selecting multiple scanned documents and performing cloud-based text extraction concurrently.",
          votes: 49,
          votedUids: [],
        }
      ]);
    } finally {
      setLoadingList(false);
    }
  };

  const handleVote = async (requestId: string) => {
    if (!user) {
      toast.error("Please sign in to upvote feature requests");
      return;
    }

    // Check if already voted
    const target = requests.find((r) => r.id === requestId);
    if (target && (target.votedUids.includes(user.uid) || localVotes.includes(requestId))) {
      toast.error("You have already upvoted this request");
      return;
    }

    try {
      const result = await voteFeatureRequestAction(requestId);
      if (result.success) {
        toast.success("Vote registered!");

        // Update local storage
        const updatedLocalVotes = [...localVotes, requestId];
        setLocalVotes(updatedLocalVotes);
        localStorage.setItem("utool_voted_requests", JSON.stringify(updatedLocalVotes));

        // Update state
        setRequests(
          requests.map((r) => {
            if (r.id === requestId) {
              return {
                ...r,
                votes: r.votes + 1,
                votedUids: [...r.votedUids, user.uid],
              };
            }
            return r;
          })
        );
      } else {
        toast.error(result.error || "Failed to upvote");
      }
    } catch (err) {
      console.error("Vote request error:", err);
      toast.error("An error occurred.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!toolName.trim()) return toast.error("Requested tool name is required");
    if (!description.trim() || description.length < 10) {
      return toast.error("Description must be at least 10 characters");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("toolName", toolName);
    formData.append("description", description);

    startTransition(async () => {
      try {
        const result = await submitFeatureRequestAction(null, formData);
        if (result.success) {
          toast.success(result.message || "Request submitted!");
          setToolName("");
          setDescription("");
          fetchTopRequests(); // Refresh the list
        } else {
          toast.error(result.error || "Failed to submit request");
        }
      } catch (err) {
        console.error("Submit feature error:", err);
        toast.error("Failed to submit request.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* 1. Request form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 shadow-xs backdrop-blur-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20" />
        
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Plus className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Suggest a Feature / Tool</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Your Name"
            id="feature-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!!user || isPending}
            placeholder="Name"
            required
          />
          <Input
            label="Email Address"
            id="feature-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!user || isPending}
            placeholder="email@example.com"
            required
          />
        </div>

        <Input
          label="Requested Tool / Feature Name"
          id="feature-toolname"
          value={toolName}
          onChange={(e) => setToolName(e.target.value)}
          disabled={isPending}
          placeholder="e.g. SVG to PNG Converter, CSV Auditor"
          required
        />

        <div className="space-y-1.5">
          <label
            htmlFor="feature-desc"
            className="block text-body-s font-medium text-foreground"
          >
            Description of the tool
          </label>
          <textarea
            id="feature-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            placeholder="Explain what this tool should do and how it will improve your workspace workflow..."
            className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)_/_0.2)] disabled:opacity-50"
            required
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" loading={isPending} className="w-full">
            Submit Suggestion
          </Button>
        </div>
      </form>

      {/* 2. Top requested features list */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Community Wishlist</h3>
        </div>

        {loadingList ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-2xl bg-card/10">
            <MessageSquare className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No active suggestions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const hasUserVoted =
                user && (req.votedUids.includes(user.uid) || localVotes.includes(req.id));

              return (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-4 p-4 border border-border/80 rounded-xl bg-card/30 hover:bg-card/50 transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-bold text-foreground">{req.toolName}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {req.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleVote(req.id)}
                    disabled={!!hasUserVoted}
                    className={`flex flex-col items-center justify-center h-12 w-12 rounded-xl border transition-all duration-200 ${
                      hasUserVoted
                        ? "bg-primary/10 border-primary/20 text-primary cursor-default"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground active:scale-95 cursor-pointer"
                    }`}
                  >
                    <ArrowUp className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] font-black mt-0.5">{req.votes}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
