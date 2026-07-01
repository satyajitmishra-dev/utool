"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logAdEvent } from "@/lib/ads/analytics";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  placementId: string;
}

interface State {
  hasError: boolean;
}

export class AdErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Ad Error Boundary] Ad rendering crashed:", error, errorInfo);
    
    // Log ad failure event to analytics
    logAdEvent({
      eventType: "failed",
      placementId: this.props.placementId,
      provider: "adsense", // Default provider
      path: typeof window !== "undefined" ? window.location.pathname : "",
      device: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop",
      networkSpeed: "unknown",
      errorMessage: `${error.name}: ${error.message}`,
    });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}
export default AdErrorBoundary;
