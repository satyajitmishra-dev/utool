import { useState, useEffect, useRef } from "react";

export function useScaledDashboard() {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return;
      const width = window.innerWidth;
      
      // Calculate scale factor based on viewport width
      if (width < 640) {
        // Mobile
        const parentWidth = containerRef.current.parentElement?.clientWidth || width - 32;
        const targetWidth = 640; // Base width of the dashboard on mobile
        const calculatedScale = parentWidth / targetWidth;
        setScale(Math.min(1, calculatedScale * 0.95)); // 0.95 for padding margin
      } else if (width < 1024) {
        // Tablet
        const parentWidth = containerRef.current.parentElement?.clientWidth || width - 48;
        const targetWidth = 850; // Base width of the dashboard on tablet
        const calculatedScale = parentWidth / targetWidth;
        setScale(Math.min(1, calculatedScale));
      } else {
        // Desktop
        setScale(1);
      }
    }

    // Set initial size
    handleResize();
    
    // Setup listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { scale, containerRef };
}
