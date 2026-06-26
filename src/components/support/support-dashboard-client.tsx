"use client";

import React, { useState, useTransition } from "react";
import {
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Send,
  User,
  Shield,
  Tag,
  Paperclip,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { replyToTicketAction } from "@/app/actions/support";

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

interface SupportDashboardClientProps {
  initialTickets: Ticket[];
  userEmail: string;
  userName: string;
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

export function SupportDashboardClient({
  initialTickets,
  userEmail,
  userName,
}: SupportDashboardClientProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || replyText.trim().length < 2) return;

    const ticketId = selectedTicket.id;
    const text = replyText.trim();

    startTransition(async () => {
      try {
        const result = await replyToTicketAction(ticketId, text);
        if (result.success) {
          toast.success("Reply posted!");
          setReplyText("");

          // Construct local reply object to update state instantly
          const localReply: Reply = {
            senderId: "current-user",
            senderName: userName || userEmail,
            senderEmail: userEmail,
            message: text,
            isAdmin: false,
            createdAt: new Date().toISOString(),
          };

          const localEvent: TimelineEvent = {
            id: `reply-${Date.now()}`,
            type: "reply",
            actorName: userName || userEmail,
            actorRole: "user",
            message: text,
            createdAt: new Date().toISOString(),
          };

          // Update ticket local states
          const updatedTickets = tickets.map((t) => {
            if (t.id === ticketId) {
              const newReplies = [...(t.replies || []), localReply];
              const currentTimeline = t.timeline || getTimelineEvents(t);
              const updatedTimeline = [...currentTimeline, localEvent];

              const nextStatus = t.status === "resolved" ? ("open" as const) : t.status;
              if (t.status === "resolved") {
                updatedTimeline.push({
                  id: `status-${Date.now()}`,
                  type: "status_change",
                  actorName: userName || userEmail,
                  actorRole: "user",
                  message: "reopened the ticket",
                  createdAt: new Date().toISOString(),
                });
              }

              const updatedTicket = {
                ...t,
                replies: newReplies,
                timeline: updatedTimeline,
                status: nextStatus,
              };
              // Update selected modal ticket
              setSelectedTicket(updatedTicket);
              return updatedTicket;
            }
            return t;
          });

          setTickets(updatedTickets);
        } else {
          toast.error(result.error || "Failed to submit reply");
        }
      } catch (err) {
        console.error("Reply error:", err);
        toast.error("Failed to post reply.");
      }
    });
  };

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock className="h-3 w-3" />
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-3 w-3" />
            In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Resolved
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
            High
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
            Low
          </span>
        );
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border bg-card/30 rounded-2xl p-5 backdrop-blur-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Total Requests
            </p>
            <h4 className="text-2xl font-black text-foreground mt-1">{tickets.length}</h4>
          </div>
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <MessageSquare className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="border border-border bg-card/30 rounded-2xl p-5 backdrop-blur-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Pending Resolution
            </p>
            <h4 className="text-2xl font-black text-foreground mt-1">
              {tickets.filter((t) => t.status !== "resolved").length}
            </h4>
          </div>
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="border border-border bg-card/30 rounded-2xl p-5 backdrop-blur-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Tickets Resolved
            </p>
            <h4 className="text-2xl font-black text-foreground mt-1">
              {tickets.filter((t) => t.status === "resolved").length}
            </h4>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>

      {/* Ticket List table/grid */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-card/10">
          <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-muted-foreground">No support tickets found</h3>
          <p className="text-xs text-muted-foreground/60 mt-1.5 max-w-sm mx-auto">
            You haven't opened any support tickets yet. If you have any technical difficulties, you can open one now.
          </p>
          <div className="mt-6">
            <Button variant="primary" onClick={() => window.location.href = "/support"}>
              Submit New Ticket
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card/30 backdrop-blur-xs">
          <div className="divide-y divide-border">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleTicketSelect(ticket)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-all cursor-pointer select-none"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      #{ticket.id}
                    </span>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                    {ticket.toolSlug && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                        {ticket.toolSlug}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                    {ticket.subject}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate max-w-lg">
                    {ticket.message}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border/50 pt-3 md:pt-0 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold" suppressHydrationWarning>
                      <Calendar className="h-3 w-3" />
                      {formatDateTime(ticket.createdAt)}
                    </div>
                    <div className="text-[10px] text-primary font-bold mt-1">
                      {ticket.replies?.length || 0} {(ticket.replies?.length || 0) === 1 ? "reply" : "replies"}
                    </div>
                  </div>
                  <ChevronRight className="h-4.5 w-4.5 text-muted-foreground/40 hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Details Dialog / Modal */}
      <Modal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket?.subject}
        description={`Support Ticket #${selectedTicket?.id}`}
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            {/* Ticket Information Bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
              {getStatusBadge(selectedTicket.status)}
              {getPriorityBadge(selectedTicket.priority)}
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <Tag className="h-3.5 w-3.5" />
                {selectedTicket.issueType.replace("_", " ").toUpperCase()}
              </span>
              <span className="text-[10px] text-muted-foreground ml-auto font-mono" suppressHydrationWarning>
                Opened: {formatDateTime(selectedTicket.createdAt)}
              </span>
            </div>

            {/* Conversation Timeline (Full Track) */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Ticket Lifecycle Activity
              </h3>

              <div className="space-y-6 max-h-[45vh] overflow-y-auto pr-1">
                {getTimelineEvents(selectedTicket).map((event) => {
                  // 1. Status Transition Event UI
                  if (event.type === "status_change") {
                    return (
                      <div key={event.id} className="flex justify-center my-3 select-none">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-muted border border-border text-muted-foreground shadow-xs">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
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
                                <span>View Screenshot Attachment</span>
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
            </div>

            {/* Post Reply Area */}
            {selectedTicket.status !== "resolved" ? (
              <form onSubmit={handlePostReply} className="border-t border-border pt-4 space-y-3">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a reply here..."
                  disabled={isPending}
                  className="block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)_/_0.2)] disabled:opacity-50"
                  required
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={isPending}
                    className="gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Message</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="border-t border-border pt-4 text-center py-4 bg-muted/20 rounded-xl">
                <p className="text-xs text-muted-foreground font-semibold">
                  This ticket has been marked as **Resolved**. If you post a message, it will be automatically reopened.
                </p>
                <button
                  onClick={() => {
                    const updated = { ...selectedTicket, status: "open" as const };
                    setSelectedTicket(updated);
                  }}
                  className="text-xs text-primary font-bold hover:underline mt-2 inline-block"
                >
                  Force reopen ticket
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
