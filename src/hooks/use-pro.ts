"use client";

import { useContext } from "react";
import { ProContext, ProContextType } from "@/context/pro-context";

export function usePro(): ProContextType {
  const context = useContext(ProContext);
  if (context === undefined) {
    throw new Error("usePro must be used within a ProProvider");
  }
  return context;
}
