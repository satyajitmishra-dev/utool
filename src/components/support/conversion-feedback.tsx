"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ConversionFeedbackProps {
  toolSlug: string;
  conversionId?: string;
  inputFileType?: string;
  outputFileType?: string;
  onNegativeFeedback: () => void;
}

const TAGS_BY_RATING: Record<number, string[]> = {
  5: [
    "Fast & accurate! ⚡",
    "Great quality output 🎯",
    "Super easy to use 👍",
    "Privacy first (local) 🔒",
    "Best free tool found! 🌟",
    "Clean UI, no ads ✨"
  ],
  4: [
    "Good quality 🎨",
    "Works great 👍",
    "Easy to use 👌",
    "Fast processing ⚡",
    "Helpful utility 🌟"
  ],
  3: [
    "Works fine 👍",
    "Average output 😐",
    "Could be faster ⏳",
    "A bit confusing 🧩",
    "Decent tool ⚙️"
  ],
  2: [
    "Output was blurry ❌",
    "Conversion too slow ⏳",
    "Formatting was lost 📄",
    "Confusing settings 😵‍💫",
    "Needs improvement 🔧"
  ],
  1: [
    "File was corrupted ❌",
    "Process got stuck 🐢",
    "Not working at all 💥",
    "Lost my layout 📄",
    "Bad interface 🧩"
  ]
};

export function ConversionFeedback({ toolSlug, conversionId, inputFileType, outputFileType, onNegativeFeedback }: ConversionFeedbackProps) {
  const [feedbackState, setFeedbackState] = useState<'idle' | 'positive' | 'submitted' | 'closed'>('idle');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (feedbackState === 'closed') return null;

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setSelectedTags([]);
    setReview(""); // Clear custom review message on rating change
  };

  const handleTagToggle = (tag: string) => {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
      // Remove tag from review text
      let newMsg = review;
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      newMsg = newMsg.replace(new RegExp(`\\.?\\s*${escapedTag}`, "g"), "");
      newMsg = newMsg.trim().replace(/^\.*\s*/, "");
      setReview(newMsg);
    } else {
      newTags = [...selectedTags, tag];
      // Append tag to review text
      setReview((prev) => {
        const trimmed = prev.trim();
        if (!trimmed) return tag;
        if (trimmed.endsWith(".") || trimmed.endsWith("!") || trimmed.endsWith("?")) {
          return `${trimmed} ${tag}`;
        }
        return `${trimmed}. ${tag}`;
      });
    }
    setSelectedTags(newTags);
  };

  const handleSubmit = async () => {
    setFeedbackState('submitted');
    try {
      await fetch('/api/support/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug,
          conversionId,
          rating,
          reviewText: review,
          recommend,
          inputFileType,
          outputFileType
        })
      });
    } catch (e) {
      console.error("Failed to submit conversion feedback:", e);
    }
  };

  const activeTags = rating > 0 ? TAGS_BY_RATING[rating] || [] : [];

  return (
    <div className="mt-8 border-t border-border pt-6 w-full text-center">
      <AnimatePresence mode="wait">
        {feedbackState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4 animate-fade-in"
          >
            <p className="text-sm font-medium text-foreground">Did this tool work as expected?</p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="rounded-full gap-2 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 cursor-pointer"
                onClick={() => setFeedbackState('positive')}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-500" /> Yes
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 cursor-pointer"
                onClick={onNegativeFeedback}
              >
                <ThumbsDown className="w-4 h-4 text-red-500" /> No
              </Button>
            </div>
          </motion.div>
        )}

        {feedbackState === 'positive' && (
          <motion.div
            key="positive"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 relative max-w-md mx-auto w-full text-left border border-border shadow-2xl backdrop-blur-md"
          >
            <button 
              onClick={() => setFeedbackState('closed')}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-sm text-foreground mb-3">Glad to hear! Rate your experience</h4>
            
            {/* Stars */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 transition-all duration-200 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                        : "text-muted-foreground/30 hover:text-amber-400/50"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* progressive disclosure section for feedback comments */}
            <AnimatePresence>
              {rating > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Quick suggestion chips */}
                  {activeTags.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Quick tags (click to add)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeTags.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleTagToggle(tag)}
                              className={`text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer select-none font-medium ${
                                isSelected
                                  ? "bg-primary/10 border-primary text-primary"
                                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-muted/40"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Textarea */}
                  <textarea
                    className="w-full bg-muted/30 border border-border rounded-xl p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[70px]"
                    placeholder={rating <= 2 ? "Tell us what went wrong so we can fix it..." : "Optional: What did you like about this tool?"}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />

                  {/* Recommend Checkbox */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="recommend" 
                      checked={recommend}
                      onChange={(e) => setRecommend(e.target.checked)}
                      className="rounded text-primary focus:ring-primary bg-muted border-border cursor-pointer"
                    />
                    <label htmlFor="recommend" className="text-xs text-muted-foreground cursor-pointer select-none">
                      I would recommend this tool
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button className="w-full rounded-xl font-bold py-2.5 cursor-pointer shadow-md" onClick={handleSubmit}>
                    Submit Feedback
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {feedbackState === 'submitted' && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-emerald-500 text-sm font-semibold flex items-center justify-center gap-2 py-4 animate-fade-in"
          >
            <ThumbsUp className="w-4 h-4 fill-emerald-500/20" /> Thank you for your feedback!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

