import { ArrowRight } from "lucide-react";

export function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full px-4">
      <a
        href="/signup"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-medium text-white hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 group cursor-pointer"
      >
        <span>Try Free</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </a>
      <a
        href="#tools"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full ring-1 ring-gray-300 bg-white/50 backdrop-blur-xs px-8 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5 transition-all duration-200 shadow-xs cursor-pointer"
      >
        Explore Tools
      </a>
    </div>
  );
}
export default CTAButtons;
