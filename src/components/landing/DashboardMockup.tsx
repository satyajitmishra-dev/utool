"use client";

import { useState } from "react";
import {
  RotateCw,
  Share,
  Plus,
  LayoutGrid,
  Sparkles,
  ArrowUpRight,
  FileText,
  User,
  QrCode,
  Link as LinkIcon,
  Activity,
  Info,
} from "lucide-react";
import { useScaledDashboard } from "../../hooks/useScaledDashboard";
import { MOCK_STATS_ROW, RECENT_ACTIVITY, UTILITY_CARDS } from "./constants";
import { Logo } from "./Logo";

export function DashboardMockup() {
  const { scale, containerRef } = useScaledDashboard();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const sidebarItems = [
    { label: "PDF Tools", icon: FileText },
    { label: "Resume Builder", icon: User },
    { label: "QR Generator", icon: QrCode },
    { label: "Link Shortener", icon: LinkIcon },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "resume":
        return <User className="h-4 w-4" />;
      case "qr":
        return <QrCode className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full flex justify-center mt-12 sm:mt-16 animate-hero-rise">
      {/* Scaled Wrapper */}
      <div
        ref={containerRef}
        style={{ height: `${scale * 560}px` }}
        className="w-full overflow-hidden transition-all duration-300 flex justify-center"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: "960px",
            height: "560px",
          }}
          className="flex-none bg-[#111214] border border-white/10 rounded-t-2xl shadow-[0_-20px_80px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col transition-all duration-500 hover:border-white/15"
        >
          {/* Top Browser Chrome */}
          <div className="h-11 bg-[#111214] border-b border-white/5 px-4 flex items-center justify-between select-none">
            {/* Left Traffic Dots */}
            <div className="flex items-center gap-1.5 w-1/4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <div className="flex items-center gap-1.5 ml-4 text-white/20">
                <span className="text-xs">&lt;</span>
                <span className="text-xs">&gt;</span>
              </div>
            </div>

            {/* URL Bar */}
            <div className="w-2/5 max-w-[280px] bg-[#1a1a1d] border border-white/5 rounded-md py-1 text-center text-[11px] text-white/40 font-light tracking-wide truncate">
              utool.in
            </div>

            {/* Right Chrome Icons */}
            <div className="flex items-center justify-end gap-3 w-1/4 text-white/30">
              <RotateCw className="h-3.5 w-3.5 hover:text-white/60 cursor-pointer transition-colors" />
              <Share className="h-3.5 w-3.5 hover:text-white/60 cursor-pointer transition-colors" />
              <Plus className="h-3.5 w-3.5 hover:text-white/60 cursor-pointer transition-colors" />
              <LayoutGrid className="h-3.5 w-3.5 hover:text-white/60 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Inner Content Area */}
          <div className="flex-1 flex overflow-hidden bg-[#111214]">
            {/* Sidebar */}
            <aside className="w-48 bg-[#111214] border-r border-white/5 p-3 flex flex-col justify-between select-none">
              <div className="flex flex-col gap-5">
                {/* Switch Workspace Selector */}
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg border border-white/5 bg-[#1a1a1d]">
                  <div className="h-6 w-6 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <Logo size={14} className="text-indigo-400" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[11px] font-medium text-white/80 leading-none">UTool</span>
                    <span className="text-[9px] text-white/40 font-light">Workspace</span>
                  </div>
                </div>

                {/* Nav list */}
                <nav className="flex flex-col gap-0.5">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => setActiveTab(item.label)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-light transition-all duration-200 ${
                          activeTab === item.label
                            ? "bg-white/5 text-white/80"
                            : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5" />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Latest section */}
              <div className="border-t border-white/5 pt-3">
                <span className="block text-[9px] font-semibold text-white/20 uppercase tracking-widest px-2 mb-2">Latest</span>
                <div className="flex flex-col gap-1.5 px-2">
                  <div className="flex items-center gap-1.5 text-[9px] text-white/40 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                    <span className="truncate">Merged assignment.pdf</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-white/40 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                    <span className="truncate">Built resume.pdf</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 bg-[#1a1a1d] p-5 overflow-hidden flex flex-col gap-5">
              {/* Workspace Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                    <Logo size={22} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/80 tracking-tight leading-none">UTool Workspace</h3>
                    <p className="text-[10px] text-white/40 font-light mt-1">All your essential tools in one place</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-[10px] font-medium text-white/80 bg-[#232327] hover:bg-[#2c2c31] border border-white/5 px-3 py-1.5 rounded-full transition-colors">
                  <Sparkles className="h-3 w-3 text-indigo-400 fill-indigo-400/20" />
                  <span>Generate</span>
                </button>
              </div>

              {/* Stats Row Block */}
              <div className="bg-[#232327] border border-white/5 rounded-xl flex divide-x divide-white/5 py-4">
                {MOCK_STATS_ROW.map((stat, i) => (
                  <div key={stat.label} className="flex-1 px-4 select-none">
                    <span className="block text-[8px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
                    <span className="block text-xl font-light text-white/95 mt-1 leading-none">{stat.value}</span>
                    {stat.description && (
                      <span className="block text-[9px] text-white/40 font-light mt-1.5">{stat.description}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Subjects Row */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-white/30">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">Core Tools</span>
                  <Info className="h-3.5 w-3.5" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {UTILITY_CARDS.map((card) => (
                    <div
                      key={card.title}
                      className="bg-[#232327] border border-white/5 rounded-xl p-3.5 transition-all duration-300 hover:border-white/10 hover:bg-[#2a2a2f] cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-md bg-white/5 text-white/60 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
                            {getIcon(card.type)}
                          </div>
                          <span className="text-xs font-normal text-white/80 group-hover:text-white transition-colors">
                            {card.title}
                          </span>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                      </div>
                      <p className="text-[10px] text-white/40 font-light mt-2">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Inbox section */}
              <div className="flex-1 border border-white/5 rounded-xl bg-[#232327] p-4 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-3 select-none">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-white/40" />
                    <span className="text-[11px] text-white/60 font-medium">Activity Feed</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 font-light">
                    Active now
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
                  {RECENT_ACTIVITY.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-b-0 hover:bg-white/[0.01] px-1 rounded transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-light text-white/40">
                          {activity.action === "Merged" && "Merged "}
                          {activity.action === "Built" && "Built "}
                          {activity.action === "Generated QR for" && "Generated QR for "}
                          {activity.action === "Shortened" && "Shortened "}
                          <span className="text-white/80 font-normal group-hover:text-indigo-300 transition-colors">
                            {activity.target}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-white/40 font-light">{activity.time}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded border leading-none ${
                            activity.type === "pdf"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : activity.type === "resume"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {activity.statusLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashboardMockup;
