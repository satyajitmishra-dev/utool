export interface HistoryItem {
  id: string;
  timestamp: string;
  title: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
}

export interface CalculatorSEO {
  title: string;
  description: string;
  h1?: string;
  keywords?: string[];
}
