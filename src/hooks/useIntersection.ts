"use client";

import { useEffect, useRef, useState } from "react";

export function useIntersection(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement || typeof window === "undefined") return;

    try {
      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      }, options);

      observer.observe(currentElement);
      return () => {
        observer.unobserve(currentElement);
      };
    } catch (err) {
      console.warn("[useIntersection] IntersectionObserver not supported, defaulting to true:", err);
      setIsIntersecting(true);
    }
  }, [options]);

  return [elementRef, isIntersecting] as const;
}
