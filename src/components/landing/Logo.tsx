import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "text-gray-900", size = 28 }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`${className} transition-transform duration-300 hover:scale-105`}
      fill="currentColor"
    >
      {/* Main Blocks */}
      {/* Top Left: PDF */}
      <rect x="12" y="12" width="34" height="34" rx="9" />
      {/* Top Right: QR */}
      <rect x="54" y="12" width="34" height="34" rx="9" />
      {/* Bottom Left: Links */}
      <rect x="12" y="54" width="34" height="34" rx="9" />
      {/* Bottom Right: Resume */}
      <rect x="54" y="54" width="34" height="34" rx="9" />
      
      {/* Connecting Bridge Pins - subtle intersections */}
      <rect x="42" y="24" width="16" height="10" rx="3" />
      <rect x="42" y="66" width="16" height="10" rx="3" />
      <rect x="24" y="42" width="10" height="16" rx="3" />
      <rect x="66" y="42" width="10" height="16" rx="3" />
    </svg>
  );
}
export default Logo;
