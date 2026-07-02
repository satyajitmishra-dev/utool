import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConverterSwapProps {
  onSwap: () => void;
  disabled?: boolean;
}

export function ConverterSwap({ onSwap, disabled = false }: ConverterSwapProps) {
  const [rotated, setRotated] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setRotated((prev) => !prev);
    onSwap();
  };

  return (
    <div className="flex items-center justify-center shrink-0 self-center">
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        disabled={disabled}
        aria-label="Swap source and target units"
        className="rounded-full bg-card shadow-sm border-border hover:bg-muted focus-ring hover:scale-105 active:scale-95 duration-200"
      >
        <ArrowLeftRight
          className={`h-4.5 w-4.5 text-primary transition-transform duration-300 ${rotated ? 'rotate-180' : ''}`}
        />
      </Button>
    </div>
  );
}
