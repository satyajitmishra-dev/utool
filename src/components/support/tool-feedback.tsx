"use client";

import React, { useState, useEffect, useTransition } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2, Sparkles } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/support";
import { toast } from "sonner";

interface ToolFeedbackProps {
  toolSlug: string;
}

export function ToolFeedback({ toolSlug }: ToolFeedbackProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Check if user has already voted for this tool in the current browser
    const votedState = localStorage.getItem(`utool_feedback_${toolSlug}`);
    if (votedState) {
      setHasVoted(true);
    }
  }, [toolSlug]);

  const handleVote = (response: boolean) => {
    startTransition(async () => {
      try {
        const result = await submitFeedbackAction(toolSlug, response);
        if (result.success) {
          toast.success(result.message || "Feedback submitted!");
          localStorage.setItem(`utool_feedback_${toolSlug}`, "true");
          setHasVoted(true);
        } else {
          toast.error(result.error || "Failed to submit feedback");
        }
      } catch (err) {
        console.error("Feedback submission error:", err);
        toast.error("Could not record feedback.");
      }
    });
  };

  if (hasVoted) {
    return (
      <div className="border border-border/80 rounded-2xl p-5 bg-card/20 backdrop-blur-xs flex items-center justify-center gap-3 text-center py-6 animate-fade-in">
        <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-4.5 w-4.5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-foreground">Thank you for your feedback!</h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Your input helps us refine and optimize Utool for everyone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-2xl p-5 bg-card/40 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/10" />
      
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Did this tool solve your problem?
        </h4>
        <p className="text-[10px] text-muted-foreground">
          Let us know how this utility performed for your files.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* YES button */}
        <button
          onClick={() => handleVote(true)}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-400 text-xs font-bold transition-all duration-200 disabled:opacity-50 active:scale-95 cursor-pointer select-none"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>Yes, it did</span>
        </button>

        {/* NO button */}
        <button
          onClick={() => handleVote(false)}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-400 text-xs font-bold transition-all duration-200 disabled:opacity-50 active:scale-95 cursor-pointer select-none"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          <span>No, it didn't</span>
        </button>
      </div>
    </div>
  );
}
