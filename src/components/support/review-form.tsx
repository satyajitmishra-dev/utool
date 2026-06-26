"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Star, Camera, X, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { submitReviewAction } from "@/app/actions/support";

interface ReviewFormProps {
  toolSlug: string;
  onSuccess?: () => void;
}

export function ReviewForm({ toolSlug, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-card/60 p-6 shadow-xs backdrop-blur-sm relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20" />
      
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold text-foreground">Write a Review</h3>
      </div>

      {/* Rating Picker */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Your Rating
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="group relative p-1 focus:outline-none transition-transform active:scale-90"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                className={`h-7 w-7 transition-all duration-200 ${
                  star <= (hoverRating ?? rating)
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                    : "text-muted-foreground/30 hover:text-muted-foreground/60"
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-muted-foreground ml-2">
            {rating === 5
              ? "Excellent!"
              : rating === 4
              ? "Great!"
              : rating === 3
              ? "Good"
              : rating === 2
              ? "Fair"
              : "Poor"}
          </span>
        </div>
      </div>

      {/* Name and Email Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          id="review-name"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!!user || isPending}
          required
        />
        <Input
          label="Email Address"
          id="review-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!!user || isPending}
          required
        />
      </div>

      {/* Review Textarea */}
      <div className="space-y-1.5">
        <label
          htmlFor="review-message"
          className="block text-body-s font-medium text-foreground"
        >
          Review Message
        </label>
        <textarea
          id="review-message"
          rows={4}
          placeholder="What did you like or dislike about this tool? How can we improve?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPending}
          className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)_/_0.2)] disabled:opacity-50"
          required
        />
      </div>

      {/* Optional Screenshot */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Upload Screenshot (Optional)
        </span>
        <div className="flex items-center gap-4">
          {!screenshotPreview ? (
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border bg-card/40 hover:bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground text-xs font-semibold cursor-pointer transition-all duration-200">
              <Camera className="h-4 w-4" />
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
                className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
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
          className="w-full md:w-auto"
          loading={isPending}
        >
          Submit Review
        </Button>
      </div>
    </form>
  );
}
