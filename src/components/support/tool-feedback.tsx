"use client";

import React, { useState, useEffect, useTransition } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2, Sparkles, Star, AlertTriangle, Send } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/support";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ToolFeedbackProps {
  toolSlug: string;
}

export function ToolFeedback({ toolSlug }: ToolFeedbackProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [votedType, setVotedType] = useState<'none' | 'positive' | 'negative'>('none');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [negativeComment, setNegativeComment] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Check if user has already voted for this tool in the current browser
    const votedState = localStorage.getItem(`utool_feedback_${toolSlug}`);
    if (votedState) {
      setHasVoted(true);
    }
  }, [toolSlug]);

  const handleInitialVote = (positive: boolean) => {
    startTransition(async () => {
      try {
        const result = await submitFeedbackAction(toolSlug, positive);
        if (result.success) {
          if (positive) {
            setVotedType('positive');
          } else {
            setVotedType('negative');
          }
        } else {
          toast.error(result.error || "Failed to submit feedback");
        }
      } catch (err) {
        console.error("Feedback submission error:", err);
        toast.error("Could not record feedback.");
      }
    });
  };

  const handleStarClick = (star: number) => {
    setRating(star);
    // Dispatch tool-success event to open the review modal pre-populated with this rating!
    window.dispatchEvent(new CustomEvent("tool-success", {
      detail: {
        toolSlug,
        initialRating: star
      }
    }));
    
    // Save completion state
    localStorage.setItem(`utool_feedback_${toolSlug}`, "true");
    setHasVoted(true);
    toast.success("Thank you! Opening the review form...");
  };

  const handleNegativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!negativeComment.trim()) return;

    // Dispatch the open support ticket event with the issue description
    window.dispatchEvent(new CustomEvent('open-support-ticket', { 
      detail: { 
        toolSlug, 
        errorLogs: `Inline feedback: ${negativeComment}`
      } 
    }));

    localStorage.setItem(`utool_feedback_${toolSlug}`, "true");
    setHasVoted(true);
    toast.success("Thank you for reporting. Opening support ticket...");
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
    <div className="border border-border rounded-2xl p-5 bg-card/40 backdrop-blur-xs relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20" />
      
      <AnimatePresence mode="wait">
        {votedType === 'none' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1"
          >
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
                suppressHydrationWarning
                onClick={() => handleInitialVote(true)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-400 text-xs font-bold transition-all duration-200 disabled:opacity-50 active:scale-95 cursor-pointer select-none"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Yes, it did</span>
              </button>

              {/* NO button */}
              <button
                suppressHydrationWarning
                onClick={() => handleInitialVote(false)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-400 text-xs font-bold transition-all duration-200 disabled:opacity-50 active:scale-95 cursor-pointer select-none"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                <span>No, it didn't</span>
              </button>
            </div>
          </motion.div>
        )}

        {votedType === 'positive' && (
          <motion.div
            key="positive"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center gap-3 py-2 text-center"
          >
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-foreground flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Awesome! How would you rate it?
              </h4>
              <p className="text-[10px] text-muted-foreground">
                Click a star to write a quick, one-click review.
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125 active:scale-90 cursor-pointer"
                >
                  <Star
                    className={`h-7 w-7 transition-all duration-200 ${
                      star <= (hoverRating ?? rating)
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {votedType === 'negative' && (
          <motion.div
            key="negative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-3 py-1"
          >
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                What went wrong with the tool?
              </h4>
              <p className="text-[10px] text-muted-foreground">
                Tell us the problem so we can fix it. We will open a support ticket for you.
              </p>
            </div>

            <form onSubmit={handleNegativeSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Returned incorrect formatting, threw an error..."
                value={negativeComment}
                onChange={(e) => setNegativeComment(e.target.value)}
                className="flex-1 bg-muted/40 border border-border rounded-xl px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all cursor-pointer"
              >
                <Send className="h-3 w-3" />
                <span>Report</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

