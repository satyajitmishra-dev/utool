import React, { useEffect } from 'react';
import { X, Sliders, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ConverterSettingsState {
  precision: number;
  useScientific: boolean;
  binaryStandard: boolean;
  delimiter: string;
  header: boolean;
  minify: boolean;
  imageQuality: number;
  imageBgColor: string;
  imageResizeWidth?: number;
  imageResizeHeight?: number;
}

interface ConverterSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ConverterSettingsState;
  onSettingsChange: (settings: Partial<ConverterSettingsState>) => void;
  showStorageOption?: boolean;
  showCsvOption?: boolean;
  showJsonOption?: boolean;
  showImageOption?: boolean;
}

export function ConverterSettings({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  showStorageOption = false,
  showCsvOption = false,
  showJsonOption = false,
  showImageOption = false,
}: ConverterSettingsProps) {
  // Listen for Escape key to close settings modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-scale-up space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 id="settings-title" className="text-base font-bold text-foreground flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            <span>Converter Settings</span>
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-left max-h-[60vh] overflow-y-auto pr-1">
          {/* General Precision */}
          {!showCsvOption && !showJsonOption && !showImageOption && (
            <div className="space-y-2">
              <label htmlFor="precision-input" className="block text-xs font-bold text-muted-foreground uppercase">
                Precision Decimals (0-12)
              </label>
              <input
                id="precision-input"
                type="number"
                min="0"
                max="12"
                value={settings.precision}
                onChange={(e) => onSettingsChange({ precision: Math.max(0, Math.min(12, parseInt(e.target.value, 10) || 0)) })}
                className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          {/* Scientific Notation */}
          {!showCsvOption && !showJsonOption && !showImageOption && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Scientific Notation</span>
              <button
                type="button"
                onClick={() => onSettingsChange({ useScientific: !settings.useScientific })}
                className="text-primary hover:opacity-80 focus:outline-none"
              >
                {settings.useScientific ? (
                  <ToggleRight className="h-9 w-9" />
                ) : (
                  <ToggleLeft className="h-9 w-9 text-muted-foreground" />
                )}
              </button>
            </div>
          )}

          {/* Digital Storage Standard */}
          {showStorageOption && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-foreground block">Binary Standard</span>
                <span className="text-xs text-muted-foreground block">Use 1024-based multipliers (KiB/MiB)</span>
              </div>
              <button
                type="button"
                onClick={() => onSettingsChange({ binaryStandard: !settings.binaryStandard })}
                className="text-primary hover:opacity-80 focus:outline-none"
              >
                {settings.binaryStandard ? (
                  <ToggleRight className="h-9 w-9" />
                ) : (
                  <ToggleLeft className="h-9 w-9 text-muted-foreground" />
                )}
              </button>
            </div>
          )}

          {/* CSV Config Options */}
          {showCsvOption && (
            <div className="space-y-4 border-t border-border pt-4">
              <div className="space-y-2">
                <label htmlFor="delimiter-select" className="block text-xs font-bold text-muted-foreground uppercase">
                  CSV Delimiter Character
                </label>
                <select
                  id="delimiter-select"
                  value={settings.delimiter}
                  onChange={(e) => onSettingsChange({ delimiter: e.target.value })}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Auto-Detect Delimiter</option>
                  <option value=",">Comma ( , )</option>
                  <option value=";">Semicolon ( ; )</option>
                  <option value="&#9;">Tab ( \t )</option>
                  <option value="|">Pipe ( | )</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-foreground block">Header Detection</span>
                  <span className="text-xs text-muted-foreground block">Treat first row as column names</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSettingsChange({ header: !settings.header })}
                  className="text-primary hover:opacity-80 focus:outline-none"
                >
                  {settings.header ? (
                    <ToggleRight className="h-9 w-9" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* JSON Config Options */}
          {showJsonOption && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-foreground block">Minified JSON</span>
                <span className="text-xs text-muted-foreground block">Compress payload to a single string</span>
              </div>
              <button
                type="button"
                onClick={() => onSettingsChange({ minify: !settings.minify })}
                className="text-primary hover:opacity-80 focus:outline-none"
              >
                {settings.minify ? (
                  <ToggleRight className="h-9 w-9" />
                ) : (
                  <ToggleLeft className="h-9 w-9 text-muted-foreground" />
                )}
              </button>
            </div>
          )}

          {/* Image Settings */}
          {showImageOption && (
            <div className="space-y-4 border-t border-border pt-4">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="quality-slider" className="text-xs font-bold text-muted-foreground uppercase">
                    JPEG Output Quality
                  </label>
                  <span className="text-xs font-mono font-bold text-primary">{Math.round(settings.imageQuality * 100)}%</span>
                </div>
                <input
                  id="quality-slider"
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.imageQuality}
                  onChange={(e) => onSettingsChange({ imageQuality: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bg-picker" className="block text-xs font-bold text-muted-foreground uppercase">
                  Transparent Background Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    id="bg-picker"
                    type="color"
                    value={settings.imageBgColor}
                    onChange={(e) => onSettingsChange({ imageBgColor: e.target.value })}
                    className="w-10 h-10 border border-border rounded-lg cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.imageBgColor.toUpperCase()}
                    onChange={(e) => onSettingsChange({ imageBgColor: e.target.value })}
                    className="flex-1 rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Dimensions overrides */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="resize-width" className="text-xs font-bold text-muted-foreground uppercase">
                    Resize Width (px)
                  </label>
                  <input
                    id="resize-width"
                    type="number"
                    placeholder="Auto"
                    value={settings.imageResizeWidth || ''}
                    onChange={(e) => onSettingsChange({ imageResizeWidth: parseInt(e.target.value, 10) || undefined })}
                    className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="resize-height" className="text-xs font-bold text-muted-foreground uppercase">
                    Resize Height (px)
                  </label>
                  <input
                    id="resize-height"
                    type="number"
                    placeholder="Auto"
                    value={settings.imageResizeHeight || ''}
                    onChange={(e) => onSettingsChange({ imageResizeHeight: parseInt(e.target.value, 10) || undefined })}
                    className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="primary" className="rounded-xl w-full" onClick={onClose}>
            Apply Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
