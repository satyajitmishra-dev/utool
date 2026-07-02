import React, { useEffect } from 'react';
import { X, History, Trash2, RotateCcw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HistoryItem } from '@/lib/converters/history';

interface ConverterHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onReload: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onAddToFavorites?: (item: HistoryItem) => void;
  isFavCheck?: (fromUnit: string, toUnit: string) => boolean;
}

export function ConverterHistory({
  isOpen,
  onClose,
  history,
  onReload,
  onDelete,
  onClearAll,
  onAddToFavorites,
  isFavCheck,
}: ConverterHistoryProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-sm border-l border-border bg-card p-6 shadow-xl h-full flex flex-col justify-between animate-slide-in">
        <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <span>Conversion History</span>
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close history"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List content */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {history.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-muted-foreground text-xs space-y-2">
                <History className="h-8 w-8 text-muted-foreground/30" />
                <p className="font-semibold">No recent conversions found.</p>
              </div>
            ) : (
              history.map((item) => {
                const isFavorited = isFavCheck ? isFavCheck(item.fromUnit, item.toUnit) : false;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/30 transition-all flex justify-between items-start gap-3 text-left relative group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
                        <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span className="truncate max-w-[150px]">{item.fromUnit} ⇄ {item.toUnit}</span>
                      </div>
                      
                      <div className="text-xs font-mono font-bold text-foreground truncate break-all">
                        <span>{item.inputValue} {item.fromSymbol} = </span>
                        <span className="text-primary">{item.outputValue} {item.toSymbol}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {onAddToFavorites && (
                        <button
                          onClick={() => onAddToFavorites(item)}
                          className={`p-1 rounded-md hover:bg-muted transition-colors ${isFavorited ? 'text-amber-500' : 'text-muted-foreground'}`}
                          title="Pin Favorite"
                        >
                          <Star className={`h-3.5 w-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                        </button>
                      )}
                      <button
                        onClick={() => onReload(item)}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Restore values"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 rounded-md text-muted-foreground hover:text-error hover:bg-error/10 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clear all footer */}
        {history.length > 0 && (
          <div className="border-t border-border pt-4 mt-4 shrink-0">
            <Button
              variant="outline"
              className="w-full text-error border-error/20 hover:bg-error/5 flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl"
              onClick={onClearAll}
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear History</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
