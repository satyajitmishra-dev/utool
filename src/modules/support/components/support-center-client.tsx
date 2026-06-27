"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, File, Plus, MessageCircle, AlertCircle, HelpCircle, AlertTriangle, Paperclip, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportTicket, TicketMessage } from "@/modules/support/types";
import { useAuth } from "@/context/auth-context";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/config/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export function SupportCenterClient() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      user.getIdToken().then(t => setToken(t));
    } else {
      setToken(null);
    }
  }, [user]);
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isCreating, setIsCreating] = useState(searchParams.get('newTicket') === 'true');
  const [loading, setLoading] = useState(true);

  // New ticket form state
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [initialMessage, setInitialMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    // Real-time listener for user's tickets
    const q = query(
      collection(db, "supportTickets"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        } as SupportTicket;
      });
      // Sort client-side to avoid requiring composite indexes in Firestore
      docs.sort((a, b) => b.updatedAt - a.updatedAt);
      setTickets(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!activeTicket) return;

    // Real-time listener for messages in active ticket
    const q = query(
      collection(db, "ticketMessages"),
      where("ticketId", "==", activeTicket.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        } as TicketMessage;
      });
      docs.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(docs);
    });

    return () => unsubscribe();
  }, [activeTicket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !initialMessage.trim()) return;

    try {
      const res = await fetch('/api/support/conversation', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          category,
          subject,
          message: initialMessage,
          toolSlug: searchParams.get('tool') || undefined,
          isGuest: !user,
          email: user?.email,
          metadata: {
            browser: navigator.userAgent,
            url: window.location.href,
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setTickets([data.ticket, ...tickets]);
        setActiveTicket(data.ticket);
        setIsCreating(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeTicket) return;

    const msg = messageInput;
    setMessageInput(""); // optimistic clear

    try {
      const res = await fetch('/api/support/message', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticketId: activeTicket.id,
          message: msg,
          email: user?.email
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.message]);
      }
    } catch (e) {
      console.error(e);
      setMessageInput(msg); // revert
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Support Center...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-140px)] border border-border rounded-3xl overflow-hidden bg-card/40 backdrop-blur-xl shadow-sm">
      {/* Sidebar: Conversation List */}
      <div className={`w-full md:w-80 border-r border-border bg-card flex flex-col ${activeTicket || isCreating ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <h2 className="font-bold text-lg">Conversations</h2>
          <Button size="icon" variant="ghost" onClick={() => { setIsCreating(true); setActiveTicket(null); }} className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">No conversations yet.</p>
              <Button variant="outline" className="mt-4 rounded-full" onClick={() => setIsCreating(true)}>Start a Chat</Button>
            </div>
          ) : (
            tickets.map(t => (
              <div 
                key={t.id} 
                onClick={() => { setActiveTicket(t); setIsCreating(false); }}
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
                  {t.priority === 'High' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Area: Chat Window or Create Form */}
      <div className="flex-1 flex flex-col bg-background/50">
        {isCreating ? (
          <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-6 lg:p-12 overflow-y-auto">
            <div className="md:hidden mb-6">
               <Button variant="ghost" onClick={() => setIsCreating(false)} className="pl-0 gap-1"><ChevronLeft className="w-4 h-4"/> Back</Button>
            </div>
            <h2 className="text-2xl font-bold mb-2">New Support Conversation</h2>
            <p className="text-muted-foreground mb-8">Describe your issue and our team will get back to you shortly.</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold mb-2 block">Category</label>
                <select 
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-primary outline-none appearance-none"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="General">General Question</option>
                  <option value="Bug Report">Report a Bug / Issue</option>
                  <option value="Feature Request">Request a Feature</option>
                  <option value="Billing">Billing & Subscription</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-bold mb-2 block">Subject</label>
                <input 
                  type="text" 
                  placeholder="Brief summary of your issue"
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-primary outline-none"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold mb-2 block">Message</label>
                <textarea 
                  placeholder="Provide as much detail as possible..."
                  className="w-full min-h-[150px] bg-muted/50 border border-border rounded-xl p-3 focus:ring-1 focus:ring-primary outline-none resize-y"
                  value={initialMessage}
                  onChange={e => setInitialMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="rounded-full" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button className="rounded-full px-8" onClick={handleCreateTicket} disabled={!subject || !initialMessage}>Start Conversation</Button>
              </div>
            </div>
          </div>
        ) : activeTicket ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center gap-4 bg-card/80 backdrop-blur-md">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveTicket(null)}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h3 className="font-bold">{activeTicket.subject}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="capitalize px-2 py-0.5 bg-muted rounded-full">{activeTicket.category}</span>
                  ID: {activeTicket.id.split('-')[0]}
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map(msg => {
                const isMine = msg.senderRole === 'User';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isMine && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          {msg.senderRole === 'AI' ? <HelpCircle className="w-4 h-4 text-primary" /> : <img src="/logo.png" className="w-4 h-4" alt="Agent" />}
                        </div>
                      )}
                      <div className={`p-4 rounded-2xl ${isMine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm border border-border'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 mx-10">{formatDistanceToNow(msg.createdAt)} ago</span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            {activeTicket.status !== 'Closed' && activeTicket.status !== 'Resolved' ? (
              <div className="p-4 bg-card border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="icon" className="rounded-full shrink-0" onClick={handleSendMessage} disabled={!messageInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/30 border-t border-border text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                <p>This conversation has been closed.</p>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setIsCreating(true)}>Open New Conversation</Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <MessageCircle className="w-16 h-16 mb-4 opacity-10" />
            <h3 className="text-lg font-bold text-foreground">Support Center</h3>
            <p className="max-w-xs mt-2">Select a conversation from the sidebar or start a new one to get help.</p>
          </div>
        )}
      </div>
    </div>
  );
}
