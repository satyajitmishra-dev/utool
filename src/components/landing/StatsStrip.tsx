import { SOCIAL_PROOF_STATS } from "./constants";

export function StatsStrip() {
  return (
    <div className="mt-20 border-t border-gray-200/40 pt-10 pb-6 max-w-4xl mx-auto w-full px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Social Proof Text */}
        <div className="text-center md:text-left">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500">
            Trust & Scale
          </p>
          <h4 className="text-base font-light text-gray-900 mt-1">
            Trusted by <span className="font-normal text-gray-950">10,000+</span> users globally
          </h4>
        </div>

        {/* Right: Counter Columns */}
        <div className="flex items-center justify-center gap-8 sm:gap-16">
          {SOCIAL_PROOF_STATS.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <span className="block text-2xl font-light tracking-tight text-gray-900">
                {stat.value}
              </span>
              <span className="block text-xs font-light text-gray-500 mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default StatsStrip;
