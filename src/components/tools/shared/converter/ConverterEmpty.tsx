import React from 'react';
import { Inbox } from 'lucide-react';

interface ConverterEmptyProps {
  title: string;
  description: string;
}

export function ConverterEmpty({ title, description }: ConverterEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-2 border border-dashed border-border rounded-2xl bg-card/30">
      <Inbox className="h-8 w-8 text-muted-foreground/35" />
      <h4 className="text-sm font-bold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}
