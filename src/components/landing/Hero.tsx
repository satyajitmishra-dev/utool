import SearchBar from "./SearchBar";
import TrustBadges from "./TrustBadges";
import CTAButtons from "./CTAButtons";
import StatsStrip from "./StatsStrip";
import DashboardMockup from "./DashboardMockup";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden flex flex-col justify-between hero-bg pt-16">
      {/* Background SVG Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.8]"
        style={{ 
          backgroundImage: "url('/bg-pattern.svg')",
          backgroundSize: "60px 60px"
        }}
      />
      
      {/* Subtle Radial Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 radial-glow-tr" />
      <div className="absolute inset-0 pointer-events-none z-0 radial-glow-bl" />

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 flex-1 flex flex-col items-center justify-center">
        {/* Headline */}
        <h1 className="text-center tracking-tight text-gray-900 font-normal leading-[1.05] max-w-5xl select-none">
          <span className="block text-[40px] sm:text-[60px] lg:text-[72px] xl:text-[84px] opacity-0 animate-fade-up">
            All your essential tools.
          </span>
          <span className="block text-[40px] sm:text-[60px] lg:text-[72px] xl:text-[84px] opacity-0 animate-fade-up animation-delay-100 mt-1 font-medium bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 bg-clip-text text-transparent">
            One simple workspace.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-center text-gray-600 max-w-2xl leading-relaxed text-[15px] sm:text-lg lg:text-xl font-light opacity-0 animate-fade-up animation-delay-200">
          Merge PDFs, build resumes, generate QR codes, and shorten links — all in one fast, private, and beautifully simple platform.
        </p>

        {/* Interactive Search Bar wrapper */}
        <div className="mt-8 w-full max-w-lg opacity-0 animate-fade-up animation-delay-300">
          <SearchBar />
          <TrustBadges />
        </div>

        {/* Call to Actions */}
        <div className="opacity-0 animate-fade-up animation-delay-400">
          <CTAButtons />
        </div>

        {/* Dashboard Mockup Panel (Floating Preview Card) */}
        <div className="w-[92%] sm:w-[84%] lg:w-[72%] max-w-5xl mx-auto z-20 relative -mb-20 sm:-mb-32 lg:-mb-44 mt-6">
          <DashboardMockup />
        </div>

        {/* Social Proof Strip */}
        <div className="w-full opacity-0 animate-fade-up animation-delay-500">
          <StatsStrip />
        </div>
      </div>
    </section>
  );
}
export default Hero;
