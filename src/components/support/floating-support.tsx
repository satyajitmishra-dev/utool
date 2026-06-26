"use client";

import React, { useState } from "react";
import { X, MessageCircle, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import { SupportForm } from "@/components/support/support-form";

export function FloatingSupport() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      {/* AI Support Widget — Premium glass card */}
      <div className="fixed bottom-8 right-8 z-50 select-none">
        <motion.div
          layout
          className="relative rounded-2xl border border-white/[0.08] bg-card/70 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3),0_0_30px_rgba(139,92,246,0.12)] overflow-hidden"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Ambient glow */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500/10 blur-2xl rounded-full pointer-events-none" />

          {/* Collapsed state — always visible */}
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* AI Avatar */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_4px_16px_rgba(99,102,241,0.4)] shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-foreground">Need Help?</span>
                <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                Response in under 2 minutes
              </p>
            </div>
          </div>

          {/* Expanded state — actions */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-1 space-y-2 border-t border-white/[0.04]">
                  {/* Open Chat button */}
                  <button
                    onClick={() => {
                      setIsFormOpen(true);
                      setIsExpanded(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[12px] font-bold py-2.5 transition-all hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Open Chat
                  </button>

                  {/* Documentation button */}
                  <a
                    href="/support"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-muted-foreground text-[12px] font-semibold py-2.5 transition-all hover:bg-white/[0.06] hover:text-foreground"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Documentation
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Embedded Modal Dialog for Support Form */}
      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        size="lg"
      >
        <SupportForm 
          onSuccess={() => setIsFormOpen(false)} 
          className="border-none bg-transparent shadow-none p-0 sm:p-0 md:p-0 rounded-none overflow-visible"
        />
      </Modal>
    </>
  );
}
