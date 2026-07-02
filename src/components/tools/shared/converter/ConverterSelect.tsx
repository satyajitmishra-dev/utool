import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  symbol?: string;
  flag?: string; // Flag emojis for currency conversion
}

interface ConverterSelectProps {
  label: string;
  options: SelectOption[];
  selected: string;
  onChange: (value: string) => void;
  id: string;
}

export function ConverterSelect({
  label,
  options,
  selected,
  onChange,
  id,
}: ConverterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === selected);

  // Filter options based on query
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    opt.value.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Autofocus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Handle keyboard events inside dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filtered.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filtered.length) {
          onChange(filtered[activeIndex].value);
          setIsOpen(false);
          setSearch('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        break;
      case 'Tab':
        // Let natural tab focus close it
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-1.5 text-left relative" ref={containerRef}>
      <label htmlFor={id} className="block text-xs font-bold text-muted-foreground uppercase">
        {label}
      </label>
      
      {/* Dropdown Button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.flag && <span className="text-base select-none">{selectedOption.flag}</span>}
          <span className="font-semibold">{selectedOption?.label || selected}</span>
          {selectedOption?.symbol && (
            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
              {selectedOption.symbol}
            </span>
          )}
        </div>
        <ChevronDown className={`h-4.5 w-4.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Options Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-40 mt-1 rounded-xl border border-border bg-card shadow-lg animate-scale-up overflow-hidden max-h-64 flex flex-col">
          {/* Search box inside dropdown */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-3 py-2 shrink-0">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search units..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* List of options */}
          <ul
            role="listbox"
            tabIndex={-1}
            className="overflow-y-auto py-1.5 flex-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-xs text-muted-foreground text-center">No options match query.</li>
            ) : (
              filtered.map((opt, idx) => {
                const isSelected = opt.value === selected;
                const isActive = idx === activeIndex;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors select-none
                      ${isSelected ? 'text-primary font-bold bg-primary/5' : 'text-foreground'}
                      ${isActive ? 'bg-muted/80' : 'hover:bg-muted/30'}`}
                  >
                    <div className="flex items-center gap-2">
                      {opt.flag && <span className="text-base">{opt.flag}</span>}
                      <span>{opt.label}</span>
                    </div>
                    {opt.symbol && (
                      <span className="text-xs font-mono px-1 rounded-md bg-muted text-muted-foreground font-semibold">
                        {opt.symbol}
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
