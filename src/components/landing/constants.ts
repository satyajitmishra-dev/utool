export interface NavItem {
  label: string;
  href: string;
}

export interface TrustBadge {
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
  description?: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  time: string;
  type: "pdf" | "qr" | "link" | "resume";
  status: "success" | "pending" | "info";
  statusLabel: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "PDF Tools", href: "#pdf-tools" },
  { label: "Resume Builder", href: "#resume-builder" },
  { label: "QR Generator", href: "#qr-generator" },
  { label: "Link Shortener", href: "#link-shortener" },
];

export const TRUST_BADGES: TrustBadge[] = [
  { text: "No signup required" },
  { text: "Secure browser processing" },
  { text: "Free forever" },
];

export const MOCK_STATS_ROW: StatItem[] = [
  { value: "12,450", label: "PDFs Processed", description: "Client-side" },
  { value: "3,890", label: "Resumes Built", description: "Active templates" },
  { value: "85,620", label: "QR Created", description: "Scans tracked" },
  { value: "148,930", label: "Links Generated", description: "Shortened links" },
];

export const SOCIAL_PROOF_STATS: StatItem[] = [
  { value: "4.2M+", label: "PDFs processed" },
  { value: "1.2M+", label: "Resumes built" },
  { value: "8.9M+", label: "Links shortened" },
];

export const UTILITY_CARDS = [
  { title: "Merge PDF", description: "Fast client-side PDF merger", type: "pdf" },
  { title: "Create Resume", description: "Modern CV builder template", type: "resume" },
  { title: "Generate QR", description: "Static & Dynamic QR generator", type: "qr" },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "1", action: "Merged", target: "assignment.pdf", time: "Just now", type: "pdf", status: "success", statusLabel: "Ready" },
  { id: "2", action: "Built", target: "internship-resume.pdf", time: "3m ago", type: "resume", status: "success", statusLabel: "Exported" },
  { id: "3", action: "Generated QR for", target: "portfolio", time: "8m ago", type: "qr", status: "success", statusLabel: "Active" },
  { id: "4", action: "Shortened", target: "github-link", time: "15m ago", type: "link", status: "success", statusLabel: "Active" },
];
