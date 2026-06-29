"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Star, Camera, X, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { submitReviewAction } from "@/app/actions/support";

interface ReviewFormProps {
  toolSlug: string;
  initialRating?: number;
  onSuccess?: () => void;
}

const TAGS_BY_RATING: Record<number, string[]> = {
  5: [
    "Perfect working 🚀",
    "Beautiful UI/UX ✨",
    "Super fast conversion ⚡",
    "Highly recommended 👍",
    "Very easy to use 💡",
    "Privacy first (local run) 🔒"
  ],
  4: [
    "Good UI 🎨",
    "Works great 👍",
    "Easy to use 👌",
    "Fast processing ⚡",
    "Very helpful tool 🌟"
  ],
  3: [
    "Works fine 👍",
    "Average UI 😐",
    "Could be faster ⏳",
    "Needs some features ⚙️",
    "A bit confusing 🧩"
  ],
  2: [
    "Needs improvement 🔧",
    "UI is slow ⏳",
    "Confusing options 😵‍💫",
    "Failed on large files ❌",
    "Hard to navigate 🗺️"
  ],
  1: [
    "Not working at all ❌",
    "Crashed browser 💥",
    "Extremely slow 🐢",
    "Confusing UI/UX 🧩",
    "Lost formatting 📄"
  ]
};

export function ReviewForm({ toolSlug, initialRating, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [rating, setRating] = useState<number>(initialRating || 0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Update rating if initialRating prop changes
  useEffect(() => {
    if (initialRating !== undefined && initialRating > 0) {
      setRating(initialRating);
    }
  }, [initialRating]);

  // Autofill if logged in
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    } else {
      setName("");
      setEmail("");
    }
  }, [user]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setSelectedTags([]);
    setMessage(""); // Clear message so it refreshes for the new rating's tags
  };

  const handleTagToggle = (tag: string) => {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
      // Remove tag from message
      let newMsg = message;
      // Escape special characters for RegExp
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      newMsg = newMsg.replace(new RegExp(`\\.?\\s*${escapedTag}`, "g"), "");
      newMsg = newMsg.trim().replace(/^\.*\s*/, "");
      setMessage(newMsg);
    } else {
      newTags = [...selectedTags, tag];
      // Append tag to message
      setMessage((prev) => {
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

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("File must be an image");
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) {
      return toast.error("Please select a rating first");
    }
    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!message.trim() || message.length < 5) {
      return toast.error("Message must be at least 5 characters");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("rating", rating.toString());
    formData.append("message", message);
    formData.append("toolSlug", toolSlug);
    if (screenshot) {
      formData.append("screenshot", screenshot);
    }

    startTransition(async () => {
      try {
        const result = await submitReviewAction(null, formData);
        if (result.success) {
          toast.success(result.message || "Review submitted successfully!");
          setMessage("");
          setSelectedTags([]);
          setRating(0);
          removeScreenshot();
          if (onSuccess) onSuccess();
        } else {
          toast.error(result.error || "Failed to submit review");
        }
      } catch (err) {
        console.error("Submit review error:", err);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  const activeTags = rating > 0 ? TAGS_BY_RATING[rating] || [] : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-card/60 p-6 shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/40 via-purple-500/40 to-primary/40" />

      {/* Write a Review Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-inner">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Share Your Experience</h3>
            <p className="text-[10px] text-muted-foreground">It takes less than 10 seconds</p>
          </div>
        </div>
        {rating > 0 && (
          <button
            type="button"
            onClick={() => handleRatingChange(0)}
            className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Progress Disclosure: Rating Picker (Always Visible) */}
      <div className={`flex flex-col items-center justify-center gap-3 py-4 transition-all duration-300 ${rating === 0 ? "my-6 scale-105" : "my-0 scale-100"}`}>
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
          {rating === 0 ? "Rate your experience with this tool" : "Your Rating"}
        </label>
        
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="group relative p-1 focus:outline-none transition-transform hover:scale-125 active:scale-95 cursor-pointer"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                className={`transition-all duration-300 ${
                  rating === 0 ? "h-9 w-9" : "h-7 w-7"
                } ${
                  star <= (hoverRating ?? rating)
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                    : "text-muted-foreground/30 hover:text-muted-foreground/60"
                }`}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full animate-fade-in">
            {rating === 5
              ? "Excellent! 💖"
              : rating === 4
              ? "Great! ✨"
              : rating === 3
              ? "Good 👍"
              : rating === 2
              ? "Fair 😐"
              : "Poor 😢"}
          </span>
        )}
      </div>

      {/* Expand the rest of the form once rating is selected */}
      <AnimatePresence>
        {rating > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="space-y-5 overflow-hidden"
          >
            {/* Quick Tag Chips */}
            {activeTags.length > 0 && (
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Quick tags (click to add comment)
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`text-xs px-3 py-2 rounded-full border transition-all duration-250 cursor-pointer select-none font-medium flex items-center gap-1 active:scale-95 ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                            : "border-border text-muted-foreground bg-card hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {tag}
                        {isSelected && <X className="h-3 w-3 ml-0.5 text-primary/80" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Name and Email section */}
            {user && user.email ? (
              /* Sleek profile badge for logged in users */
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 text-xs shadow-inner">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs select-none">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-foreground font-semibold text-xs leading-tight">
                    {user.displayName || "Authorized User"}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                </div>
                <div className="ml-auto text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Logged In
                </div>
              </div>
            ) : (
              /* Input grid for guests */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <Input
                  label="Name"
                  id="review-name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  required
                />
                <Input
                  label="Email Address"
                  id="review-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  required
                />
              </div>
            )}

            {/* Review Textarea */}
            <div className="space-y-1.5">
              <label
                htmlFor="review-message"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Review Message
              </label>
              <textarea
                id="review-message"
                rows={3}
                placeholder="Click the quick tags above or type your experience here (min 5 chars)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isPending}
                className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-inner transition-all duration-250 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 resize-y min-h-[80px]"
                required
              />
            </div>

            {/* Optional Screenshot */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Upload Screenshot (Optional)
              </span>
              <div className="flex items-center gap-4">
                {!screenshotPreview ? (
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border bg-card/40 hover:bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground text-xs font-semibold cursor-pointer transition-all duration-200">
                    <Camera className="h-4 w-4 text-muted-foreground/75" />
                    <span>Attach Image (Max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                      disabled={isPending}
                    />
                  </label>
                ) : (
                  <div className="relative inline-block rounded-xl overflow-hidden border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshotPreview}
                      alt="Screenshot Preview"
                      className="h-20 w-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors cursor-pointer"
                      disabled={isPending}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center md:w-auto shadow-md"
                loading={isPending}
              >
                Submit Review
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

