"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Star, Trash, Edit, CheckCircle, AlertTriangle, MessageCircle, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportTicket, TicketMessage, ToolReview } from "@/modules/support/types";
import { useAuth } from "@/context/auth-context";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/config/firebase";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { updateTicketStatusAction } from "@/app/actions/support";
import { toast } from "sonner";

export function AdminSupportClient() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'tickets' | 'reviews'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [reviews, setReviews] = useState<ToolReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isPrivateNote, setIsPrivateNote] = useState(false);

  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t));
    } else {
      setToken(null);
    }
  }, [user]);

  useEffect(() => {
    // Real-time listener for ALL tickets
    const qTickets = query(
      collection(db, "supportTickets"),
      orderBy("updatedAt", "desc")
    );
    const unsubTickets = onSnapshot(qTickets, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
      setTickets(docs);
      setLoading(false);
    });

    // Real-time listener for ALL reviews
    const qReviews = query(
      collection(db, "toolReviews"),
      orderBy("createdAt", "desc")
    );
    const unsubReviews = onSnapshot(qReviews, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ToolReview));
      setReviews(docs);
    });

    return () => {
      unsubTickets();
      unsubReviews();
    };
  }, [token]);

  useEffect(() => {
    if (!activeTicket) return;

    // Real-time listener for messages in active ticket
    const q = query(
      collection(db, "ticketMessages"),
      where("ticketId", "==", activeTicket.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TicketMessage));
      docs.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(docs);
    });

    return () => unsubscribe();
  }, [activeTicket]);

  const handleReply = async () => {
    if (!activeTicket || !replyText.trim()) return;

    try {
      const res = await fetch('/api/support/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticketId: activeTicket.id,
          message: replyText,
          isPrivateNote,
          email: user?.email
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.message]);
        setReplyText("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkResolved = async () => {
    if (!activeTicket) return;
    try {
      const result = await updateTicketStatusAction(activeTicket.id, "Resolved");
      if (result.success) {
        toast.success("Ticket marked as resolved");
        setActiveTicket(prev => prev ? { ...prev, status: "Resolved" } : null);
      } else {
        toast.error(result.error || "Failed to update ticket status");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] border border-border rounded-3xl overflow-hidden bg-card/40 backdrop-blur-xl shadow-sm">
      {/* Sidebar: Navigation & List */}
      <div className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-card flex flex-col shrink-0 h-full ${activeTicket ? "hidden md:flex" : "flex"}`}>
        <div className="flex border-b border-border">
          <button 
            className={`flex-1 p-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'tickets' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted/30'}`}
            onClick={() => setActiveTab('tickets')}
          >
            Tickets
          </button>
          <button 
            className={`flex-1 p-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted/30'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'tickets' ? (
            tickets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No tickets found.</div>
            ) : (
              tickets.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setActiveTicket(t)}
                  className={`p-4 border-b border-border cursor-pointer transition-colors ${activeTicket?.id === t.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/30 border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm truncate pr-2">{t.subject}</h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatDistanceToNow(t.updatedAt)} ago</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      t.status === 'Open' ? 'bg-emerald-500/10 text-emerald-500' : 
                      t.status === 'Resolved' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      {t.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{t.email}</span>
                  </div>
                </div>
              ))
            )
          ) : (
            reviews.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No reviews found.</div>
            ) : (
              reviews.map(r => (
                <div key={r.id} className="p-4 border-b border-border hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm truncate">{r.toolSlug}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${r.status === 'published' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3 h-3 ${star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{r.reviewText}</p>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className={`flex-1 flex flex-col bg-background/50 h-full ${activeTicket && activeTab === 'tickets' ? "flex" : "hidden md:flex"}`}>
        {activeTab === 'tickets' && activeTicket ? (
          <>
            <div className="p-4 border-b border-border bg-card/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTicket(null)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
                <div>
                  <h3 className="font-bold text-sm md:text-base leading-tight">{activeTicket.subject}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">User: {activeTicket.email} • Tier: {activeTicket.tier}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="h-8" onClick={handleMarkResolved} disabled={activeTicket.status === 'Resolved'}>Mark Resolved</Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.senderRole === 'Agent' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-[80%] ${
                    msg.isPrivateNote ? 'bg-amber-500/20 text-amber-900 border border-amber-500/30' :
                    msg.senderRole === 'Agent' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border'
                  }`}>
                    {msg.isPrivateNote && <div className="text-[10px] uppercase font-bold text-amber-600 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Internal Note</div>}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 mx-2">{formatDistanceToNow(msg.createdAt)} ago</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-card border-t border-border">
              <div className="flex gap-2 mb-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={isPrivateNote} onChange={e => setIsPrivateNote(e.target.checked)} className="rounded" />
                  Internal Note (Hidden from user)
                </label>
              </div>
              <textarea 
                placeholder="Type your reply..."
                className="w-full bg-muted/50 border border-border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <Button onClick={handleReply} disabled={!replyText.trim()}>Send Reply</Button>
              </div>
            </div>
          </>
        ) : activeTab === 'tickets' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <MessageCircle className="w-16 h-16 mb-4 opacity-10" />
            <h3 className="text-lg font-bold text-foreground">Admin Workspace</h3>
            <p className="max-w-xs mt-2">Select a ticket from the sidebar to view details and respond.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <Star className="w-16 h-16 mb-4 opacity-10" />
            <h3 className="text-lg font-bold text-foreground">Review Moderation</h3>
            <p className="max-w-xs mt-2">Select a review from the sidebar to approve or reject.</p>
          </div>
        )}
      </div>
    </div>
  );
}
