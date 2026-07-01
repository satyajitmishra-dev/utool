/**
 * Safely registers an element to trigger a callback when it is close to the viewport.
 * Default threshold is 150px before entering the viewport (rootMargin: "150px 0px").
 */
export function registerLazyLoad(
  element: HTMLElement,
  onVisible: () => void,
  options?: { rootMargin?: string; threshold?: number }
): () => void {
  if (typeof window === "undefined" || !element) {
    return () => {};
  }

  const rootMargin = options?.rootMargin || "150px 0px";
  const threshold = options?.threshold || 0;

  try {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible();
            observer.unobserve(element); // Trigger once
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  } catch (err) {
    console.error("[Ad Lazy Load] IntersectionObserver not supported, loading immediately:", err);
    onVisible(); // Fallback: load immediately
    return () => {};
  }
}
