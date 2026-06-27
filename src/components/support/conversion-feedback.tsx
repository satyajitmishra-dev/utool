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

export function ConversionFeedback({ toolSlug, conversionId, inputFileType, outputFileType, onNegativeFeedback }: ConversionFeedbackProps) {
  const [feedbackState, setFeedbackState] = useState<'idle' | 'positive' | 'submitted' | 'closed'>('idle');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [recommend, setRecommend] = useState(true);

  if (feedbackState === 'closed') return null;

  const handleSubmit = async () => {
    setFeedbackState('submitted');
    // We would fire off the API call here to save the review
    try {
      await fetch('/api/support/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug,
          conversionId,
          rating,
          reviewText: review,
          recommend
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mt-8 border-t border-border pt-6 w-full text-center">
      <AnimatePresence mode="wait">
        {feedbackState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-sm font-medium text-foreground">Did this tool work as expected?</p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="rounded-full gap-2 hover:bg-success/10 hover:text-success hover:border-success/30"
                onClick={() => setFeedbackState('positive')}
              >
                <ThumbsUp className="w-4 h-4" /> Yes
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                onClick={onNegativeFeedback}
              >
                <ThumbsDown className="w-4 h-4" /> No
              </Button>
            </div>
          </motion.div>
        )}

        {feedbackState === 'positive' && (
          <motion.div
            key="positive"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 relative max-w-md mx-auto w-full text-left"
          >
            <button 
              onClick={() => setFeedbackState('closed')}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-bold mb-4">Glad to hear! Rate your experience</h4>
            
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30 hover:text-amber-400/50"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Quick suggestion chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(rating <= 2 && rating > 0
                ? [
                    "Output quality was poor",
                    "Conversion was too slow",
                    "File was corrupted",
                    "Formatting was lost",
                    "Didn't support my file",
                    "Result was blurry",
                    "Process got stuck",
                  ]
                : [
                    "Fast and accurate!",
                    "Great quality output",
                    "Super easy to use",
                    "Love the privacy — no uploads!",
                    "Works perfectly on mobile",
                    "Best free tool I've found",
                    "Clean UI, no ads",
                  ]
              ).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setReview((prev) => prev ? `${prev}. ${suggestion}` : suggestion)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    review.includes(suggestion)
                      ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <textarea
              className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px] mb-4"
              placeholder={rating <= 2 && rating > 0 ? "Tell us what went wrong so we can fix it..." : "Optional: What did you like about this tool?"}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <div className="flex items-center gap-2 mb-6">
              <input 
                type="checkbox" 
                id="recommend" 
                checked={recommend}
                onChange={(e) => setRecommend(e.target.checked)}
                className="rounded text-primary focus:ring-primary bg-muted border-border"
              />
              <label htmlFor="recommend" className="text-sm text-muted-foreground cursor-pointer">
                I would recommend this tool
              </label>
            </div>

            <Button className="w-full rounded-xl font-bold" onClick={handleSubmit} disabled={rating === 0}>
              Submit Feedback
            </Button>
          </motion.div>
        )}

        {feedbackState === 'submitted' && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-success text-sm font-medium flex items-center justify-center gap-2 py-4"
          >
            <ThumbsUp className="w-4 h-4" /> Thank you for your feedback!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
