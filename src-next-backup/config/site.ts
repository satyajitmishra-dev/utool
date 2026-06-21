export const siteConfig = {
  name: "utool",
  description: "The ultimate multi-tool workspace for creators, developers, and power users.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://utool.in",
  ogImage: "https://utool.in/og.jpg",
  links: {
    twitter: "https://twitter.com/utool",
    github: "https://github.com/utool",
  },
  mainNav: [
    { title: "Features", href: "/#features" },
    { title: "Tools", href: "/tools" },
    { title: "Pricing", href: "/pricing" },
    { title: "About", href: "/about" },
  ],
  dashboardNav: [
    { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "All Tools", href: "/tools", icon: "Wrench" },
    { title: "Billing & Plans", href: "/dashboard/billing", icon: "CreditCard" },
    { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
};

export type SiteConfig = typeof siteConfig;
