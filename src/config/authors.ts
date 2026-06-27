export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  experience: string[];
  linkedin: string;
  github: string;
  website: string;
}

export const authors: Record<string, Author> = {
  "elena-rostova": {
    slug: "elena-rostova",
    name: "Elena Rostova",
    role: "Document Specialist & Media Architect",
    bio: "Elena Rostova is a software engineer and digital document expert with over 8 years of experience in browser-native architectures. She specializes in building local-first client processors, WebAssembly media decoders, and secure PDF compilation workflows.",
    avatar: "ER",
    experience: [
      "Senior Document Architect at DocuStream (2022 - 2025)",
      "WASM Compilation Engineer at MediaCore (2019 - 2022)",
      "Core Contributor to OpenPDF JS Engine"
    ],
    linkedin: "https://linkedin.com/in/elena-rostova-demo",
    github: "https://github.com/elena-rostova-demo",
    website: "https://elena-rostova.dev"
  },
  "marcus-chen": {
    slug: "marcus-chen",
    name: "Marcus Chen",
    role: "Network Security Admin",
    bio: "Marcus Chen is a systems administrator and cybersecurity engineer focused on network privacy, edge computing, and client-side sandbox architectures. He works to ensure zero-data retention pipelines and secure static QR matrix generators.",
    avatar: "MC",
    experience: [
      "Lead CyberSecurity Consultant at NetSec Labs (2023 - Present)",
      "Infrastructure & Privacy Architect at EdgeRoute (2020 - 2023)",
      "Security Analyst at ShieldGate Systems"
    ],
    linkedin: "https://linkedin.com/in/marcus-chen-demo",
    github: "https://github.com/marcus-chen-demo",
    website: "https://marcus-chen.security"
  },
  "sarah-jenkins": {
    slug: "sarah-jenkins",
    name: "Sarah Jenkins",
    role: "Executive Recruiter",
    bio: "Sarah Jenkins is a career coach and veteran recruiter with over a decade of hiring experience in Fortune 500 tech companies. She writes extensively on ATS formatting compliance, keyword mapping, and building high-impact career portfolios.",
    avatar: "SJ",
    experience: [
      "Principal Tech Recruiter at TalentStream (2021 - Present)",
      "Hiring Manager at CloudScale Inc. (2017 - 2021)",
      "Author of 'Decoding the ATS Robot'"
    ],
    linkedin: "https://linkedin.com/in/sarah-jenkins-demo",
    github: "https://github.com/sarah-jenkins-demo",
    website: "https://sarah-jenkins.careers"
  },
  "david-vance": {
    slug: "david-vance",
    name: "David Vance",
    role: "Growth Specialist",
    bio: "David Vance is a digital marketer and growth hacker who has scaled multiple SaaS businesses to millions of users. He writes about click-through optimization, digital analytics, link tracking setups, and building high-trust marketing redirects.",
    avatar: "DV",
    experience: [
      "Director of Growth at ScaleMetric (2024 - Present)",
      "Growth Product Manager at ClickBoost (2021 - 2024)",
      "Growth Advisor to SaaS Startups"
    ],
    linkedin: "https://linkedin.com/in/david-vance-demo",
    github: "https://github.com/david-vance-demo",
    website: "https://davidvance.growth"
  },
  "alex-mercer": {
    slug: "alex-mercer",
    name: "Alex Mercer",
    role: "Performance Engineer",
    bio: "Alex Mercer is a performance engineer specializing in V8 engine optimization, browser-native compilation, and WASM threads. He is passionate about bringing desktop-grade processing speeds to mobile web browsers.",
    avatar: "AM",
    experience: [
      "WASM Performance Lead at ByteSpeed (2023 - Present)",
      "Browser Optimization Specialist at WebCore (2020 - 2023)",
      "Contributor to WebAssembly Runtime Project"
    ],
    linkedin: "https://linkedin.com/in/alex-mercer-demo",
    github: "https://github.com/alex-mercer-demo",
    website: "https://alexmercer.perf"
  },
  "satyajit-mishra": {
    slug: "satyajit-mishra",
    name: "Satyajit Mishra",
    role: "Founder & Lead Architect",
    bio: "Satyajit Mishra is the founder and lead developer of UTool. A passionate software engineer, he created UTool to rebuild online utility workflows with a focus on local client-side privacy, blazing-fast processing speed, and zero cloud uploads.",
    avatar: "SM",
    experience: [
      "Founder at UTool Technologies (2026 - Present)",
      "Full Stack Engineer & WebAssembly Specialist (2020 - 2026)",
      "Creator of open-source local browser modules"
    ],
    linkedin: "https://linkedin.com/in/satyajitmishra1",
    github: "https://github.com/satyajitmishra-dev",
    website: "https://satyajitmishra.me"
  }
};

export function getAuthorByName(name: string): Author | undefined {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("elena")) return authors["elena-rostova"];
  if (lowerName.includes("marcus")) return authors["marcus-chen"];
  if (lowerName.includes("sarah")) return authors["sarah-jenkins"];
  if (lowerName.includes("david")) return authors["david-vance"];
  if (lowerName.includes("alex")) return authors["alex-mercer"];
  if (lowerName.includes("satyajit")) return authors["satyajit-mishra"];
  return undefined;
}
