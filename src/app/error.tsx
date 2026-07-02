"use client";

import { useEffect } from "react";
import { ExperienceLayout } from "@/components/system/ExperienceLayout";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return <ExperienceLayout state="500" error={error} reset={reset} />;
}

