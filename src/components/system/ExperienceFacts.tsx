"use client";

import React, { useState, useEffect } from "react";
import { MessageSquareDot, HelpCircle } from "lucide-react";
import { ExperienceState } from "./ExperienceConfig";
import { cn } from "@/utils/cn";

export interface ExperienceFactsProps {
  state: ExperienceState;
  className?: string;
}

const ROBOT_MESSAGES: Record<string, string[]> = {
  "404": [
    "Beep boop. I looked under the couch, but that page wasn't there.",
    "Are we in a parallel universe? Because this page doesn't exist here.",
    "My GPS needs a recalibration. Or did you write the URL with your eyes closed?",
    "Is this a secret level? I don't see any coins though.",
  ],
  "offline": [
    "Who pulled my plug? The grid is dark!",
    "No internet? Time to play the Dino game... or catch some PDFs here!",
    "I'm running on back-up battery juice right now.",
    "Don't panic! Our local engines still work without the cloud.",
  ],
  "slow-network": [
    "Yawn... is your router powered by a hamster on a wheel?",
    "Data packets are crawling. I'll make a cup of tea while we wait.",
    "Looks like we are downloading at the speed of dial-up in 1995.",
    "Hang tight. I'm pushing the data packets uphill.",
  ],
  "loading": [
    "Spinning up the hyperdrive. Hold onto your seats!",
    "Assembling molecules, loading client libraries...",
    "Warming up the WebAssembly engines. 100% private processing loading.",
    "Loading... I'm thinking of a number between 1 and 42.",
  ],
  "maintenance": [
    "Just cleaning the dust off my transistors. Back soon!",
    "Polishing gears and vacuuming the server room. Smells like ozone.",
    "Upgrading my cognitive chips. I will be smarter when I wake up!",
    "Undergoing scheduled maintenance. Regular robot checkup.",
  ],
  "500": [
    "Ouch! A compiler error hit my toe.",
    "My gears got jammed! Let me try spinning them backwards.",
    "A digital capacitor just blew. Quick, grab the fire extinguisher!",
    "Something crashed. Don't worry, my self-healing protocols are active.",
  ],
  "rate-limited": [
    "Woah, speed racer! My circuits are overheating.",
    "Let me catch my breath! Too many requests in one second.",
    "Taking a short coffee break. I'll be back in 30 seconds.",
    "Cooling down... Ah, that breeze feels nice.",
  ],
  "coming-soon": [
    "I've seen the future, and this feature is absolutely legendary!",
    "Our engineers are typing at 200 words per minute to finish this.",
    "I can't wait for this one either! Be sure to upvote it.",
  ],
};

const TRIVIA_FACTS = [
  "The PDF format was originally created by Adobe co-founder John Warnock in 1993 under 'Project Camelot'.",
  "The first actual computer bug was a real moth found trapped in a relay by Grace Hopper in 1947.",
  "UTool processes all files locally in your web browser. No documents are ever uploaded to remote servers.",
  "WebAssembly (WASM) enables web applications to run compiled C++/Rust code at near-native speeds directly in your browser.",
  "The world's first website (info.cern.ch) was put online in August 1991 by Tim Berners-Lee.",
  "A Konami Code input (Up, Up, Down, Down, Left, Right, Left, Right, B, A) is rumoured to trigger robot confetti rain.",
  "The QPDF engine compiles binary document streams without rasterizing pages, preserving 100% vector formatting.",
];

export function ExperienceFacts({ state, className }: ExperienceFactsProps) {
  const [speech, setSpeech] = useState("");
  const [fact, setFact] = useState("");

  useEffect(() => {
    // Pick random robot speech based on state
    const stateMessages = ROBOT_MESSAGES[state] || ROBOT_MESSAGES["404"];
    const randomMsg = stateMessages[Math.floor(Math.random() * stateMessages.length)];
    setSpeech(randomMsg);

    // Pick random trivia fact
    const randomFact = TRIVIA_FACTS[Math.floor(Math.random() * TRIVIA_FACTS.length)];
    setFact(randomFact);
  }, [state]);

  const cycleFact = () => {
    const currentIndex = TRIVIA_FACTS.indexOf(fact);
    let nextIndex = Math.floor(Math.random() * TRIVIA_FACTS.length);
    if (nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % TRIVIA_FACTS.length;
    }
    setFact(TRIVIA_FACTS[nextIndex]);
  };

  return (
    <div className={cn("w-full flex flex-col gap-4 text-left animate-fade-in", className)}>
      {/* Speech Bubble */}
      {speech && (
        <div className="relative bg-muted/40 border border-border/80 p-4 rounded-2xl rounded-tl-none shadow-xs backdrop-blur-xs flex gap-2.5 items-start">
          <MessageSquareDot className="text-primary shrink-0 mt-0.5" size={16} />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Robot Assistant
            </span>
            <p className="text-xs text-foreground italic font-medium leading-normal">
              &ldquo;{speech}&rdquo;
            </p>
          </div>
          {/* Bubble tail */}
          <div className="absolute top-0 -left-2.5 w-0 h-0 border-t-[10px] border-t-border/80 border-r-[10px] border-r-transparent pointer-events-none" />
          <div className="absolute top-[1px] -left-[8px] w-0 h-0 border-t-[8px] border-t-background border-r-[8px] border-r-transparent pointer-events-none" />
        </div>
      )}

      {/* Did You Know? Trivia Box */}
      <div className="glass-card p-4 rounded-2xl border border-border bg-card/25 hover:bg-card/40 backdrop-blur-xs flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
            <HelpCircle size={12} />
            Did you know?
          </span>
          <button
            onClick={cycleFact}
            className="text-[9px] text-muted-foreground hover:text-foreground font-semibold"
          >
            Next Fact
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed select-text">
          {fact}
        </p>
      </div>
    </div>
  );
}
export default ExperienceFacts;
