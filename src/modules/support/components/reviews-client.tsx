"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Trash, Edit, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolReview } from "@/modules/support/types";
import { useAuth } from "@/context/auth-context";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/config/firebase";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";

export function ReviewsClient() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ToolReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "toolReviews"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ToolReview));
      // Need to parse string ISO dates back to numbers for sorting, or just use string comparison since ISO 8601 is lexicographical
      docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviews(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading Reviews...</div>;

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm p-6 min-h-[500px]">
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px] text-muted-foreground">
          <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
          <h3 className="text-xl font-bold text-foreground">No Reviews Yet</h3>
          <p className="mt-2 text-sm max-w-sm">
            When you use a tool successfully, you can leave a review. Your published reviews will appear here.
          </p>
          <Button variant="outline" className="mt-6 rounded-full" onClick={() => window.location.href = '/tools'}>
            Explore Tools
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="p-6 bg-card rounded-2xl border border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg">{review.toolSlug}</h4>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    review.status === 'published' ? 'bg-success/10 text-success' :
                    review.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-foreground/80 mb-4">{review.reviewText}</p>
              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">{formatDistanceToNow(review.createdAt)} ago</span>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
