export interface WordGeneratorOptions {
  count: number;
  minLength?: number | "";
  maxLength?: number | "";
  category: "general" | "technology" | "nature" | "business" | "education" | "science";
  startsWith?: string;
  endsWith?: string;
}

const DICTIONARY: Record<string, string[]> = {
  technology: [
    "algorithm", "array", "binary", "byte", "compiler", "computer", "database", "developer",
    "digital", "encryption", "firewall", "hardware", "hyperlink", "internet", "keyboard", "laptop",
    "mainframe", "network", "offline", "processor", "protocol", "router", "server", "software",
    "terminal", "upload", "virtual", "website", "debugger", "variable", "function", "recursion"
  ],
  nature: [
    "autumn", "blossom", "canyon", "desert", "earthquake", "forest", "glacier", "hurricane",
    "island", "jungle", "lake", "mountain", "ocean", "prairie", "rainforest", "stream",
    "thunder", "volcano", "waterfall", "wildlife", "valley", "swamp", "meadow", "river",
    "breeze", "clover", "pebble", "horizon", "sunshine", "shadow", "galaxy", "comet"
  ],
  business: [
    "accountant", "advertising", "boardroom", "budget", "campaign", "commodity", "corporation",
    "currency", "deficit", "enterprise", "executive", "finance", "forecast", "inflation",
    "insurance", "inventory", "investment", "liability", "marketing", "merger", "monopoly",
    "negotiate", "portfolio", "profit", "revenue", "shareholder", "startup", "synergy",
    "transaction", "wholesale", "contract", "personnel"
  ],
  education: [
    "academy", "algebra", "assignment", "biology", "blackboard", "classroom", "college",
    "curriculum", "degree", "diploma", "dormitory", "education", "elementary", "examination",
    "geography", "graduate", "history", "homework", "instructor", "kindergarten", "laboratory",
    "lecture", "library", "mathematics", "principal", "professor", "semester", "student",
    "syllabus", "textbook", "university", "writing"
  ],
  science: [
    "astronomy", "atom", "bacterium", "biology", "chemistry", "dinosaur", "eclipse", "element",
    "evolution", "experiment", "fossil", "galaxy", "genetics", "gravity", "hypothesis", "laboratory",
    "magnet", "molecule", "nucleus", "organism", "physics", "radiation", "telescope", "theory",
    "vaccine", "velocity", "weather", "zoology", "ecosystem", "quantum", "relativity", "matter"
  ],
  general: [
    "beautiful", "wonderful", "excellent", "ordinary", "special", "simple", "complex", "happy",
    "sad", "excited", "peaceful", "journey", "destination", "window", "mirror", "blanket",
    "cushion", "umbrella", "backpack", "suitcase", "journey", "pathway", "bridge", "castle",
    "village", "metropolis", "neighborhood", "morning", "evening", "midnight", "afternoon"
  ]
};

export function generateRandomWords(options: WordGeneratorOptions): string {
  const { count, minLength, maxLength, category, startsWith, endsWith } = options;
  
  // Get word pool
  let pool: string[] = [];
  if (category === "general") {
    // Combine all words for general category
    pool = Object.values(DICTIONARY).flat();
  } else {
    pool = DICTIONARY[category] || [];
  }

  // Filter pool based on options
  let filtered = pool.filter((word) => {
    // 1. Min length check
    if (minLength !== undefined && minLength !== "" && word.length < minLength) {
      return false;
    }
    // 2. Max length check
    if (maxLength !== undefined && maxLength !== "" && word.length > maxLength) {
      return false;
    }
    // 3. Starts with check
    if (startsWith && !word.startsWith(startsWith.toLowerCase())) {
      return false;
    }
    // 4. Ends with check
    if (endsWith && !word.endsWith(endsWith.toLowerCase())) {
      return false;
    }
    return true;
  });

  // If pool is empty or too small, fallback to some filler words that match length if possible
  if (filtered.length === 0) {
    filtered = ["utool", "processor", "text", "engine", "utility", "format", "convert", "analyze"];
  }

  // Generate words
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    result.push(filtered[randomIndex]);
  }

  return result.join(" ");
}
