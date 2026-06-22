import { useState, FormEvent } from "react";
import { ArrowUp, Search } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto rounded-full bg-white shadow-xl shadow-gray-100/50 ring-1 ring-gray-200/80 p-1.5 flex items-center transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/40 focus-within:ring-indigo-500/45 focus-within:ring-2 focus-within:shadow-2xl focus-within:shadow-indigo-100/20"
    >
      <div className="pl-4 text-gray-400">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you need today?"
        className="flex-1 bg-transparent outline-none text-gray-855 placeholder-gray-400 px-3 py-2.5 text-base font-light"
      />
      <button
        type="submit"
        className="bg-gray-900 text-white rounded-full p-3 hover:bg-gray-800 transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer group"
        aria-label="Search tool"
      >
        <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </form>
  );
}
export default SearchBar;
