import { ShieldCheck, Lock, Sparkles } from "lucide-react";
import { TRUST_BADGES } from "./constants";

export function TrustBadges() {
  const getIcon = (text: string) => {
    const cleanText = text.toLowerCase();
    if (cleanText.includes("signup")) {
      return <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />;
    }
    if (cleanText.includes("secure") || cleanText.includes("browser")) {
      return <Lock className="h-3.5 w-3.5 text-blue-500" />;
    }
    if (cleanText.includes("free")) {
      return <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-50" />;
    }
    return null;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
      {TRUST_BADGES.map((badge) => (
        <span
          key={badge.text}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/60 bg-gray-50/60 px-3 py-1 text-xs font-light text-gray-500 transition-all duration-300 hover:border-gray-300 hover:bg-white hover:text-gray-700 hover:shadow-xs cursor-default"
        >
          {getIcon(badge.text)}
          {badge.text}
        </span>
      ))}
    </div>
  );
}
export default TrustBadges;
