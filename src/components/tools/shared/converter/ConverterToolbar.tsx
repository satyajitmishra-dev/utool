import React from 'react';
import { RotateCcw, Copy, Share2, Star, History, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConverterToolbarProps {
  isFavorited: boolean;
  onReset: () => void;
  onCopy: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
  onToggleHistory: () => void;
  onToggleSettings: () => void;
  hasCopied?: boolean;
}

export function ConverterToolbar({
  isFavorited,
  onReset,
  onCopy,
  onShare,
  onToggleFavorite,
  onToggleHistory,
  onToggleSettings,
  hasCopied = false,
}: ConverterToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-4">
      {/* Left controls: Reset & Favorites */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-xs flex items-center gap-1.5"
          title="Reset values (Ctrl+R)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </Button>
        <Button
          variant={isFavorited ? 'primary' : 'outline'}
          size="sm"
          onClick={onToggleFavorite}
          className={`text-xs flex items-center gap-1.5 ${isFavorited ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
          title="Pin to favorites"
        >
          <Star className={`h-3.5 w-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          <span>Favorite</span>
        </Button>
      </div>

      {/* Right controls: Share, Copy, History, Settings */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="text-xs flex items-center gap-1.5"
          title="Copy result (Ctrl+Shift+C)"
        >
          {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{hasCopied ? 'Copied' : 'Copy'}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="text-xs flex items-center gap-1.5"
          title="Share result"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleHistory}
          className="text-xs flex items-center gap-1.5"
          title="Toggle conversion history"
        >
          <History className="h-3.5 w-3.5" />
          <span>History</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSettings}
          className="text-xs flex items-center gap-1.5"
          title="Configure precision & options"
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
}
