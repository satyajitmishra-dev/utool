export interface AdDimensions {
  width: number;
  height: number;
  styleWidth: string;
  styleHeight: string;
}

export const AD_SIZE_MAP: Record<string, AdDimensions> = {
  // Desktop standard
  "728x90": { width: 728, height: 90, styleWidth: "728px", styleHeight: "90px" },
  "970x90": { width: 970, height: 90, styleWidth: "970px", styleHeight: "90px" },
  "970x250": { width: 970, height: 250, styleWidth: "970px", styleHeight: "250px" },
  "300x250": { width: 300, height: 250, styleWidth: "300px", styleHeight: "250px" },
  "300x600": { width: 300, height: 600, styleWidth: "300px", styleHeight: "600px" },
  "250x250": { width: 250, height: 250, styleWidth: "250px", styleHeight: "250px" },
  
  // Mobile/Tablet standard
  "320x50": { width: 320, height: 50, styleWidth: "320px", styleHeight: "50px" },
  "320x100": { width: 320, height: 100, styleWidth: "320px", styleHeight: "100px" },
  
  // Custom slots
  "auto": { width: 0, height: 0, styleWidth: "100%", styleHeight: "auto" },
  "native": { width: 0, height: 0, styleWidth: "100%", styleHeight: "auto" }
};

/**
 * Resolves standard CSS class sizes to reserve layout boxes.
 * This is crucial to prevent Layout Shifts (CLS) on slow networks.
 */
export function getReservationClasses(size: string): string {
  switch (size) {
    case "728x90":
      return "min-w-[320px] max-w-[728px] min-h-[90px] w-full md:w-[728px] md:h-[90px]";
    case "970x90":
      return "min-w-[320px] max-w-[970px] min-h-[90px] w-full md:w-[970px] md:h-[90px]";
    case "970x250":
      return "min-w-[320px] max-w-[970px] min-h-[250px] w-full md:w-[970px] md:h-[250px]";
    case "300x250":
      return "w-[300px] h-[250px]";
    case "300x600":
      return "w-[300px] h-[600px]";
    case "320x50":
      return "w-[320px] h-[50px]";
    case "320x100":
      return "w-[320px] h-[100px]";
    case "native":
      return "w-full min-h-[180px]";
    case "auto":
    default:
      return "w-full min-h-[100px]";
  }
}

/**
 * Returns parsed dimensions object or returns a default.
 */
export function parseAdSize(size: string): AdDimensions {
  return AD_SIZE_MAP[size] || AD_SIZE_MAP["auto"];
}
