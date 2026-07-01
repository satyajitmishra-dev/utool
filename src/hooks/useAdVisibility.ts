"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks visibility of an element and triggers onVisible 
 * ONLY when at least 50% of the element is in-view for 1 consecutive second.
 */
export function useAdVisibility(onVisible: () => void) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement || typeof window === "undefined" || hasTriggered) return;

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              // 50%+ visible: start the 1-second timer
              if (!timerRef.current) {
                timerRef.current = setTimeout(() => {
                  onVisible();
                  setHasTriggered(true);
                  // Stop observing once impression is successfully recorded
                  observer.unobserve(currentElement);
                }, 1000);
              }
            } else {
              // Went below 50% visibility: clear timer
              if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
              }
            }
          });
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1.0], // Monitor multiple ratios
        }
      );

      observer.observe(currentElement);

      return () => {
        observer.unobserve(currentElement);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    } catch (err) {
      console.warn("[useAdVisibility] IntersectionObserver error, falling back immediately:", err);
      onVisible();
      setHasTriggered(true);
    }
  }, [onVisible, hasTriggered]);

  return { elementRef, hasTriggered };
}
