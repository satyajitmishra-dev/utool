"use client";

import React, { useState, useTransition } from "react";
import {
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Calendar,
  Send,
  User,
  Shield,
  Search,
  ExternalLink,
  Paperclip,
  Star,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  replyToTicketAction,
  updateTicketStatusAction,
  deleteTicketAction,
  deleteReviewAction,
} from "@/app/actions/support";
import { Button } from "@/components/ui/button";

interface Reply {
  senderId: string;
  senderName: string;
  senderEmail: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  uid?: string;
  name: string;
  email: string;
  toolSlug?: string;
  issueType: string;
  subject: string;
  message: string;
  screenshotUrl?: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  replies: Reply[];
  timeline?: any[];
}

interface Review {
  id: string;
  uid?: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  toolSlug: string;
  screenshotUrl?: string;
  createdAt: string;
}

interface SupportAdminClientProps {
  initialTickets: Ticket[];
  initialReviews: Review[];
  adminName: string;
  adminEmail: string;
}

interface TimelineEvent {
  id: string;
  type: "created" | "reply" | "status_change" | "priority_change" | "resolved" | "deleted";
  actorName: string;
  actorRole: "user" | "admin" | "system";
  message: string;
  createdAt: string;
}

// Fallback timeline generator
function getTimelineEvents(ticket: Ticket): TimelineEvent[] {
  if (ticket.timeline && ticket.timeline.length > 0) {
    return ticket.timeline;
  }

  const events: TimelineEvent[] = [];

  events.push({
    id: `created-${ticket.id}`,
    type: "created",
    actorName: ticket.name,
    actorRole: "user",
    message: "created the ticket",
    createdAt: ticket.createdAt,
  });

  (ticket.replies || []).forEach((reply, idx) => {
    events.push({
      id: `reply-${idx}-${reply.createdAt}`,
      type: "reply",
      actorName: reply.senderName,
      actorRole: reply.isAdmin ? "admin" : "user",
      message: reply.message,
      createdAt: reply.createdAt,
    });
  });

  return events.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function SupportAdminClient({
  initialTickets,
  initialReviews,
  adminName,
  adminEmail,
}: SupportAdminClientProps) {
  const [activeTab, setActiveTab] = useState<"tickets" | "reviews">("tickets");
  
  // Support state
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");
  const [isPending, startTransition] = useTransition();

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | "all">("all");
  const [isDeletingReviewId, setIsDeletingReviewId] = useState<string | null>(null);

  // Handle posting reply as Admin
  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || replyText.trim().length < 2) return;

    const ticketId = selectedTicket.id;
    const text = replyText.trim();

    startTransition(async () => {
      try {
        const result = await replyToTicketAction(ticketId, text);
        if (result.success) {
          toast.success("Reply sent to customer!");
          setReplyText("");

          const localReply: Reply = {
            senderId: "current-admin",
            senderName: adminName || "Utool Support",
            senderEmail: adminEmail,
            message: text,
            isAdmin: true,
            createdAt: new Date().toISOString(),
          };

          const localEvent: TimelineEvent = {
            id: `reply-${Date.now()}`,
            type: "reply",
            actorName: adminName || "Utool Support",
            actorRole: "admin",
            message: text,
            createdAt: new Date().toISOString(),
          };

          const updatedTickets = tickets.map((t) => {
            if (t.id === ticketId) {
              const updatedReplies = [...(t.replies || []), localReply];
              const currentTimeline = t.timeline || getTimelineEvents(t);
              const updatedTimeline = [...currentTimeline, localEvent];

              const nextStatus = t.status === "open" ? ("in_progress" as const) : t.status;
              
              if (t.status === "open") {
                updatedTimeline.push({
                  id: `status-${Date.now()}`,
                  type: "status_change",
                  actorName: adminName || "Support System",
                  actorRole: "admin",
                  message: "changed status to in progress",
                  createdAt: new Date().toISOString(),
                });
              }

              const updated = {
                ...t,
                replies: updatedReplies,
                timeline: updatedTimeline,
                status: nextStatus,
              };
              setSelectedTicket(updated);
              return updated;
            }
            return t;
          });
          setTickets(updatedTickets);
        } else {
          toast.error(result.error || "Failed to submit reply");
        }
      } catch (err) {
        console.error("Admin reply error:", err);
        toast.error("Failed to send reply");
      }
    });
  };

  // Change Ticket Status
  const handleStatusChange = async (newStatus: Ticket["status"]) => {
    if (!selectedTicket) return;
    const ticketId = selectedTicket.id;

    startTransition(async () => {
      try {
        const result = await updateTicketStatusAction(ticketId, newStatus);
        if (result.success) {
          toast.success(`Ticket marked as ${newStatus}`);
          
          const localEvent: TimelineEvent = {
            id: `status-${Date.now()}`,
            type: "status_change",
            actorName: adminName || "Support Lead",
            actorRole: "admin",
            message: `changed status to ${newStatus.replace("_", " ")}`,
            createdAt: new Date().toISOString(),
          };

          const updatedTickets = tickets.map((t) => {
            if (t.id === ticketId) {
              const currentTimeline = t.timeline || getTimelineEvents(t);
              const updated = { 
                ...t, 
                status: newStatus,
                timeline: [...currentTimeline, localEvent]
              };
              setSelectedTicket(updated);
              return updated;
            }
            return t;
          });
          setTickets(updatedTickets);
        } else {
          toast.error(result.error || "Failed to update status");
        }
      } catch (err) {
        console.error("Status update error:", err);
        toast.error("Failed to update status");
      }
    });
  };

  // Delete/Spam Ticket
  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to permanently delete this support ticket? This action cannot be undone.")) return;

    startTransition(async () => {
      try {
        const result = await deleteTicketAction(ticketId);
        if (result.success) {
          toast.success("Ticket deleted successfully");
          setTickets(tickets.filter((t) => t.id !== ticketId));
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(null);
          }
        } else {
          toast.error(result.error || "Failed to delete ticket");
        }
      } catch (err) {
        console.error("Delete ticket error:", err);
        toast.error("Failed to delete ticket");
      }
    });
  };

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;

    setIsDeletingReviewId(reviewId);
    try {
      const result = await deleteReviewAction(reviewId);
      if (result.success) {
        toast.success("Review deleted successfully!");
        setReviews(reviews.filter((r) => r.id !== reviewId));
      } else {
        toast.error(result.error || "Failed to delete review");
      }
    } catch (err) {
      console.error("Delete review error:", err);
      toast.error("Failed to delete review");
    } finally {
      setIsDeletingReviewId(null);
    }
  };

  // Ticket Filters and searches
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesSearch =
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Review Filters and searches
  const filteredReviews = reviews.filter((review) => {
    const matchesRating = reviewRatingFilter === "all" || review.rating === Number(reviewRatingFilter);
    const matchesSearch =
      review.name.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      review.email.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      review.message.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      review.toolSlug.toLowerCase().includes(reviewSearch.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const getStatusIcon = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-indigo-400" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-amber-400 animate-pulse" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    }
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "low":
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Navigation Tabs */}
      <div className="flex gap-4 border-b border-border/80 pb-3">
        <button
          onClick={() => setActiveTab("tickets")}
          className={`pb-3 text-sm font-extrabold tracking-tight border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "tickets"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Support Tickets ({tickets.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-sm font-extrabold tracking-tight border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "reviews"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star className="h-4 w-4" />
          <span>User Reviews ({reviews.length})</span>
        </button>
      </div>

      {activeTab === "tickets" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* 1. Ticket List column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Filters */}
            <div className="space-y-3">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="Search by user, email, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Status buttons */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-muted/30 border border-border rounded-xl">
                {(["all", "open", "in_progress", "resolved"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all capitalize cursor-pointer select-none ${
                      statusFilter === status
                        ? "bg-card text-foreground shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets container */}
            <div className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border rounded-xl bg-card/25">
                  <MessageSquare className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[11px] text-muted-foreground">No tickets match this filter.</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 border rounded-xl hover:bg-card/60 transition-all cursor-pointer select-none relative ${
                      selectedTicket?.id === ticket.id
                        ? "border-primary bg-card/50 shadow-sm"
                        : "border-border/80 bg-card/20"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[8px] font-mono text-muted-foreground">
                          #{ticket.id}
                        </span>
                        <div className="flex gap-1.5 items-center">
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          {getStatusIcon(ticket.status)}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-foreground truncate">{ticket.subject}</h4>
                      <p className="text-[10px] text-muted-foreground truncate">{ticket.message}</p>
                      
                      <div className="flex items-center justify-between pt-2 text-[8px] text-muted-foreground font-semibold border-t border-border/40 mt-2">
                        <span className="truncate max-w-[120px]">{ticket.name}</span>
                        <span suppressHydrationWarning>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Chat detail column (Timeline UI) */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="border border-border rounded-2xl bg-card/30 p-5 md:p-6 backdrop-blur-xs space-y-6">
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      TICKET: #{selectedTicket.id}
                    </span>
                    <h3 className="text-sm font-bold text-foreground mt-1">{selectedTicket.subject}</h3>
                    <p className="text-[10px] text-muted-foreground">
                      From: <strong>{selectedTicket.name}</strong> ({selectedTicket.email})
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    {/* Status select */}
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(e.target.value as Ticket["status"])}
                      disabled={isPending}
                      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground font-semibold shadow-xs focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteTicket(selectedTicket.id)}
                      disabled={isPending}
                      className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Delete Ticket (Spam)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Dynamic chronological timeline for the ticket lifecycle */}
                <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-1">
                  {getTimelineEvents(selectedTicket).map((event) => {
                    // 1. Status Transition Event UI
                    if (event.type === "status_change") {
                      return (
                        <div key={event.id} className="flex justify-center my-3 select-none">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-muted border border-border text-muted-foreground shadow-xs">
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                            <span>{event.message} ({event.actorName})</span>
                            <span className="opacity-60">•</span>
                            <span suppressHydrationWarning>{new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      );
                    }

                    // 2. Ticket Creation Event UI
                    if (event.type === "created") {
                      return (
                        <div key={event.id} className="flex gap-2.5 items-start">
                          <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="flex-1 bg-card/40 border border-border/80 rounded-2xl p-4 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-foreground">{event.actorName}</span>
                              <span className="text-[9px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">Ticket Created</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap pt-1.5">
                              {selectedTicket.message}
                            </p>

                            {selectedTicket.screenshotUrl && (
                              <div className="pt-2">
                                <a
                                  href={selectedTicket.screenshotUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-all"
                                >
                                  <Paperclip className="h-3 w-3 shrink-0" />
                                  <span>View Attachment</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>
                            )}
                            <p suppressHydrationWarning className="text-[7px] text-muted-foreground/60 text-right font-semibold pt-1 border-t border-border/30 mt-2">
                              {new Date(event.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    // 3. User & Admin Replies Event UI
                    const isAdminReply = event.actorRole === "admin";
                    const avatarBg = isAdminReply
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
                    return (
                      <div key={event.id} className="flex gap-2.5 items-start">
                        <div className={`h-7 w-7 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 select-none ${avatarBg}`}>
                          {isAdminReply ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div
                          className={`flex-1 border rounded-2xl p-4 space-y-1 ${
                            isAdminReply ? "bg-purple-950/10 border-purple-500/20" : "bg-card/40 border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-foreground">{event.actorName}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded border font-semibold ${
                              isAdminReply ? "text-purple-400 bg-purple-500/10 border-purple-500/20" : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                            }`}>
                              {isAdminReply ? "Support Agent" : "User Client"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap pt-1">
                            {event.message}
                          </p>
                          <p suppressHydrationWarning className="text-[7px] text-muted-foreground/60 text-right font-semibold pt-1 border-t border-border/30 mt-2">
                            {new Date(event.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Admin Response Form */}
                <form onSubmit={handlePostReply} className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                    <span>Replying to client as: <strong>{adminName}</strong></span>
                    <span>User will be notified via email</span>
                  </div>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response to the customer..."
                    disabled={isPending}
                    className="block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)_/_0.2)] disabled:opacity-50"
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" size="sm" loading={isPending} className="gap-1.5">
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Reply</span>
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-full min-h-[350px] border border-dashed border-border rounded-2xl flex flex-col justify-center items-center p-6 bg-card/10 text-center select-none">
                <MessageSquare className="h-10 w-10 text-muted-foreground/20 mb-3" />
                <h4 className="text-xs font-bold text-muted-foreground">No ticket selected</h4>
                <p className="text-[10px] text-muted-foreground/60 max-w-xs mt-1">
                  Select a ticket from the left panel to view the dynamic tracking log, view attachment screenshots, change ticket status, or write replies.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* REVIEWS MODERATION PANEL */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Search reviews by user, email, message, or tool slug..."
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Stars:</span>
              <select
                value={reviewRatingFilter}
                onChange={(e) => setReviewRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground font-semibold focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          {/* Reviews Grid */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/10 select-none">
              <Star className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
              <h4 className="text-xs font-bold text-muted-foreground">No reviews found</h4>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-border rounded-2xl p-5 bg-card/25 hover:bg-card/45 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: User & Rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-foreground truncate max-w-[150px]">{review.name}</h4>
                        <p className="text-[9px] text-muted-foreground truncate max-w-[150px]">{review.email}</p>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating ? "text-amber-400 fill-current" : "text-zinc-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Meta: Tool */}
                    <div className="flex items-center justify-between gap-2 border-y border-border/40 py-1.5 text-[9px] font-bold">
                      <span className="text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        {review.toolSlug}
                      </span>
                      <span suppressHydrationWarning className="text-muted-foreground font-semibold">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Review Message */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 select-text">
                      "{review.message}"
                    </p>
                  </div>

                  {/* Footer: Deletion & screenshot attachment */}
                  <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-4">
                    {review.screenshotUrl ? (
                      <a
                        href={review.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-400 hover:text-purple-300"
                      >
                        <Paperclip className="h-3 w-3" />
                        <span>Attachment</span>
                        <ExternalLink className="h-2 w-2" />
                      </a>
                    ) : (
                      <span className="text-[9px] text-muted-foreground/60 italic">No attachments</span>
                    )}

                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={isDeletingReviewId === review.id}
                      className="p-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Review (Spam)"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
