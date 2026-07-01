import { AdPlacementConfig } from "./types";

export const DEFAULT_PLACEMENTS: Record<string, AdPlacementConfig> = {
  "home-top": {
    id: "home-top",
    name: "Homepage Top Banner",
    enabled: true,
    devices: { mobile: true, tablet: true, desktop: true },
    sizes: { mobile: "320x50", tablet: "728x90", desktop: "970x90" },
    adUnitId: "home-top-unit"
  },
  "home-native": {
    id: "home-native",
    name: "Homepage Native Sponsor Card",
    enabled: true,
    devices: { mobile: true, tablet: true, desktop: true },
    sizes: { mobile: "native", tablet: "native", desktop: "native" },
    adUnitId: "home-native-unit"
  },
  "tool-top": {
    id: "tool-top",
    name: "Tool Page Header Banner",
    enabled: true,
    devices: { mobile: true, tablet: true, desktop: true },
    sizes: { mobile: "320x50", tablet: "728x90", desktop: "970x90" },
    adUnitId: "tool-top-unit"
  },
  "faq-bottom": {
    id: "faq-bottom",
    name: "Tool FAQ Native Ad",
    enabled: true,
    devices: { mobile: true, tablet: true, desktop: true },
    sizes: { mobile: "native", tablet: "native", desktop: "native" },
    adUnitId: "faq-bottom-unit"
  },
  "blog-top": {
    id: "blog-top",
    name: "Blog Article Top Banner",
    enabled: true,
    devices: { mobile: true, tablet: true, desktop: true },
    sizes: { mobile: "320x50", tablet: "728x90", desktop: "970x90" },
    adUnitId: "blog-top-unit"
  },
  "blog-middle-30": {
    id: "blog-middle-30",
    name: "Blog Content Inline Ad (30%)",
    enabled: true,
    devices: { mobile: true, tablet: true, desktop: true },
    sizes: { mobile: "native", tablet: "native", desktop: "native" },
    adUnitId: "blog-mid-30-unit"
  },
  "blog-middle-60": {
    id: "blog-middle-60",
    name: "Blog Content Inline Ad (60%)",
    enabled: true,
    devices: { mobile: true, tablet: true, desktop: true },
    sizes: { mobile: "native", tablet: "native", desktop: "native" },
    adUnitId: "blog-mid-60-unit"
  },
  "blog-bottom": {
    id: "blog-bottom",
    name: "Blog Post Bottom Banner",
    enabled: true,
    devices: { mobile: true, tablet: true, desktop: true },
    sizes: { mobile: "320x100", tablet: "728x90", desktop: "970x250" },
    adUnitId: "blog-bottom-unit"
  },
  "sidebar-desktop": {
    id: "sidebar-desktop",
    name: "Desktop Sticky Sidebar Ad",
    enabled: true,
    devices: { mobile: false, tablet: false, desktop: true },
    sizes: { mobile: "auto", tablet: "auto", desktop: "300x600" },
    adUnitId: "sidebar-desktop-unit"
  },
  "bottom-mobile": {
    id: "bottom-mobile",
    name: "Mobile Bottom Sticky Overlay",
    enabled: true,
    devices: { mobile: true, tablet: false, desktop: false },
    sizes: { mobile: "320x50", tablet: "auto", desktop: "auto" },
    adUnitId: "bottom-mobile-unit"
  }
};
