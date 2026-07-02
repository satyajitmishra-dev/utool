"use client";

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { getConverter, ToolRegistryEntry } from '@/lib/converters/registry';
import { convert, ConversionResponse } from '@/lib/converters/engine';
import { getHistory, addHistoryItem, deleteHistoryItem, clearHistory, HistoryItem } from '@/lib/converters/history';
import { getFavorites, toggleFavoriteItem, FavoriteItem, isFavorite } from '@/lib/converters/favorites';
import { UNIT_CONFIG_MAP, getStorageUnits } from '@/lib/converters/units';
import { CURRENCY_CATALOG, fetchExchangeRates } from '@/lib/converters/currency';
import { packageBatchZip } from '@/lib/converters/image';

import { ConverterHeader } from './ConverterHeader';
import { ConverterToolbar } from './ConverterToolbar';
import { ConverterInput } from './ConverterInput';
import { ConverterOutput } from './ConverterOutput';
import { ConverterSelect, SelectOption } from './ConverterSelect';
import { ConverterSwap } from './ConverterSwap';
import { ConverterSettings, ConverterSettingsState } from './ConverterSettings';
import { ConverterHistory } from './ConverterHistory';
import { ConverterFavorites } from './ConverterFavorites';
import { ConverterFormula } from './ConverterFormula';
import { ConverterExamples } from './ConverterExamples';
import { ConverterFAQ } from './ConverterFAQ';
import { ConverterError } from './ConverterError';
import { ToolCard } from '@/components/ui/tool-card';
import { getToolBySlug, getAllTools } from '@/config/tool-registry';

import { toast } from 'sonner';
import { CloudAlert, Wifi } from 'lucide-react';

const FORMAT_NAME_MAP: Record<string, string> = {
  '.md': 'Markdown',
  '.html': 'HTML',
  '.yaml': 'YAML',
  '.yml': 'YAML',
  '.json': 'JSON',
  '.csv': 'CSV',
  '.txt': 'Text',
  '.png': 'PNG',
  '.jpg': 'JPG',
  '.jpeg': 'JPG',
};

interface ConverterLayoutProps {
  config: ToolRegistryEntry | any; // Supports custom registry and standard base config
}

const DEFAULT_SETTINGS: ConverterSettingsState = {
  precision: 4,
  useScientific: false,
  binaryStandard: false,
  delimiter: ',',
  header: true,
  minify: false,
  imageQuality: 0.85,
  imageBgColor: '#FFFFFF',
};

export function ConverterLayout({ config: rawConfig }: ConverterLayoutProps) {
  // 1. Load actual registry configurations or fallback to raw config
  const slug = rawConfig.slug;
  const config = getConverter(slug) || rawConfig;

  // 2. React state hook variables
  const [inputValue, setInputValue] = useState<any>('');
  const [outputValue, setOutputValue] = useState<any>('');
  const [exactValue, setExactValue] = useState<string>('');
  const [formulaUsed, setFormulaUsed] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [isProcessing, startTransition] = useTransition();
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Lists & Modals
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [rateWarning, setRateWarning] = useState<string>('');

  // Settings
  const [settings, setSettings] = useState<ConverterSettingsState>(DEFAULT_SETTINGS);

  // Debouncing timeout reference
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 3. Initialize default units and settings
  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    setHistory(getHistory(slug));
    setFavorites(getFavorites(slug));

    // Reset inputs
    setInputValue('');
    setOutputValue('');
    setExactValue('');
    setValidationError('');

    // Pre-select units based on type
    if (config.customConverterId === 'currency') {
      setFromUnit('USD');
      setToUnit('EUR');
    } else if (config.customConverterId === 'csv-json') {
      if (slug === 'json-to-csv') {
        setFromUnit('JSON');
        setToUnit('CSV');
      } else {
        setFromUnit('CSV');
        setToUnit('JSON');
      }
    } else if (config.customConverterId === 'png-jpg') {
      if (slug === 'jpg-to-png') {
        setFromUnit('JPG');
        setToUnit('PNG');
      } else {
        setFromUnit('PNG');
        setToUnit('JPG');
      }
      setInputValue([]); // Array for batch files
    } else if (slug === 'base64-encoder-decoder') {
      setFromUnit('Text');
      setToUnit('Base64');
    } else {
      // General Unit Converters
      const uMap = UNIT_CONFIG_MAP[slug];
      if (uMap && uMap.units.length >= 2) {
        setFromUnit(uMap.units[0].name);
        setToUnit(uMap.units[1].name);
      } else if (slug === 'storage-converter') {
        const defaultStorage = getStorageUnits(settings.binaryStandard);
        setFromUnit(defaultStorage[2].name); // KB or KiB
        setToUnit(defaultStorage[3].name); // MB or MiB
      } else if (config.supportedInputFormats && config.supportedOutputFormats) {
        const fromFormat = config.supportedInputFormats[0];
        const toFormat = config.supportedOutputFormats[0];
        setFromUnit(FORMAT_NAME_MAP[fromFormat] || fromFormat.replace('.', '').toUpperCase());
        setToUnit(FORMAT_NAME_MAP[toFormat] || toFormat.replace('.', '').toUpperCase());
      }
    }
  }, [slug]);

  // Online / Offline synchronization hooks
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Network connection restored. Syncing rates...');
      if (config.customConverterId === 'currency') {
        fetchExchangeRates(true).then((res) => {
          if (res.error) setRateWarning(res.error);
          else setRateWarning('');
        });
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Mathematical operations remain fully local.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for currency warning banner
    if (config.customConverterId === 'currency') {
      fetchExchangeRates().then((res) => {
        if (res.error) setRateWarning(res.error);
        else setRateWarning('');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [config.customConverterId]);

  // 4. Conversion Core Handler
  const triggerConversion = (currentInput: any, fUnit: string, tUnit: string, currentSettings: typeof settings) => {
    setValidationError('');

    if (currentInput === '' || (Array.isArray(currentInput) && currentInput.length === 0)) {
      setOutputValue('');
      setExactValue('');
      return;
    }

    // Call dynamic calculator engine
    startTransition(async () => {
      // 1. Handle batch image processing directly to zip or separate blob outputs
      if (config.customConverterId === 'png-jpg') {
        const files: File[] = currentInput;
        try {
          if (files.length === 1) {
            const res = await convert({
              slug,
              value: files[0],
              options: {
                imageOptions: {
                  quality: currentSettings.imageQuality,
                  backgroundColor: currentSettings.imageBgColor,
                  resizeWidth: currentSettings.imageResizeWidth,
                  resizeHeight: currentSettings.imageResizeHeight,
                },
              },
            });
            if (res.success) {
              setOutputValue(res.result);
            } else {
              setValidationError(res.error || 'Failed to convert image.');
            }
          } else {
            // Batch process sequentially
            const conversions = [];
            for (let i = 0; i < files.length; i++) {
              const res = await convert({
                slug,
                value: files[i],
                options: {
                  imageOptions: {
                    quality: currentSettings.imageQuality,
                    backgroundColor: currentSettings.imageBgColor,
                    resizeWidth: currentSettings.imageResizeWidth,
                    resizeHeight: currentSettings.imageResizeHeight,
                  },
                },
              });
              if (res.success) {
                // Change extension from .png to .jpg
                const baseName = files[i].name.replace(/\.[^/.]+$/, '');
                conversions.push({
                  blob: res.result,
                  filename: `${baseName}.jpg`,
                });
              }
            }
            if (conversions.length > 0) {
              const zipBlob = await packageBatchZip(conversions);
              setOutputValue(zipBlob);
            } else {
              setValidationError('Could not convert any of the provided files.');
            }
          }
        } catch (err: any) {
          setValidationError(err.message || 'Image processing crash.');
        }
        return;
      }

      // 2. Perform text/number standard conversions
      const res = await convert({
        slug,
        value: currentInput,
        fromUnit: fUnit,
        toUnit: tUnit,
        options: {
          precision: currentSettings.precision,
          useScientific: currentSettings.useScientific,
          binaryStandard: currentSettings.binaryStandard,
          delimiter: currentSettings.delimiter,
          header: currentSettings.header,
          minify: currentSettings.minify,
        },
      });

      if (res.success) {
        setOutputValue(res.result);
        setExactValue(res.exactResult || '');
        setFormulaUsed(res.formulaUsed || '');

        // Auto log to local storage history (debounced or completed)
        if (config.inputMode === 'number') {
          const updatedHist = addHistoryItem(slug, {
            inputValue: String(currentInput),
            outputValue: String(res.result),
            fromUnit: fUnit,
            toUnit: tUnit,
            fromSymbol: getUnitSymbol(fUnit),
            toSymbol: getUnitSymbol(tUnit),
          });
          setHistory(updatedHist);
        }
      } else {
        setValidationError(res.error || 'Conversion error occurred.');
        setOutputValue('');
        setExactValue('');
      }
    });
  };

  // 5. Debounce typing for heavy textareas or inputs
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (config.inputMode === 'text') {
      debounceRef.current = setTimeout(() => {
        triggerConversion(inputValue, fromUnit, toUnit, settings);
      }, 250);
    } else {
      triggerConversion(inputValue, fromUnit, toUnit, settings);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, fromUnit, toUnit, settings.precision, settings.useScientific, settings.binaryStandard, settings.delimiter, settings.header, settings.minify, settings.imageQuality, settings.imageBgColor, settings.imageResizeWidth, settings.imageResizeHeight]);

  // 6. Keyboard Shortcuts Listener
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        triggerConversion(inputValue, fromUnit, toUnit, settings);
        toast.info('Conversion recalculated!');
      } else if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        handleCopy();
      } else if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [inputValue, fromUnit, toUnit, settings, outputValue]);

  // Helper selectors
  const getUnitSymbol = (uName: string): string => {
    if (config.customConverterId === 'currency') {
      return CURRENCY_CATALOG[uName]?.symbol || '';
    }
    const units = slug === 'storage-converter'
      ? getStorageUnits(settings.binaryStandard)
      : UNIT_CONFIG_MAP[slug]?.units || [];
    return units.find((u) => u.name === uName)?.symbol || '';
  };

  // Swapper unit triggers
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    // Reverse values if it's text conversion (CSV ⇄ JSON)
    if (config.inputMode === 'text' && outputValue && !validationError) {
      setInputValue(outputValue);
    }
    toast.success('Conversion directions swapped!');
  };

  // Reset triggers
  const handleReset = () => {
    setInputValue(config.customConverterId === 'png-jpg' ? [] : '');
    setOutputValue('');
    setExactValue('');
    setValidationError('');
    toast.success('Workspace cleared.');
  };

  // Copy values trigger
  const handleCopy = () => {
    if (!outputValue) {
      toast.error('Nothing to copy.');
      return;
    }
    const textToCopy = typeof outputValue === 'string' ? outputValue : 'Binary content';
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setHasCopied(true);
        toast.success('Output copied to clipboard!');
        setTimeout(() => setHasCopied(false), 2000);
      })
      .catch(() => toast.error('Failed to copy to clipboard.'));
  };

  // Share values trigger
  const handleShare = () => {
    if (!outputValue) {
      toast.error('Nothing to share.');
      return;
    }
    const shareText = `${inputValue} ${getUnitSymbol(fromUnit)} = ${outputValue} ${getUnitSymbol(toUnit)}`;
    if (navigator.share) {
      navigator.share({
        title: `${config.name} Result`,
        text: shareText,
        url: window.location.href,
      })
        .then(() => toast.success('Result shared!'))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\nShared from UTool: ${window.location.href}`);
      toast.info('Share details copied to clipboard!');
    }
  };

  // Download values trigger (CSV/JSON/JPG files)
  const handleDownload = () => {
    if (!outputValue) {
      toast.error('Nothing to download.');
      return;
    }

    let blob: Blob;
    let extension = 'txt';

    if (outputValue instanceof Blob) {
      blob = outputValue;
      if (Array.isArray(inputValue) && inputValue.length > 1) {
        extension = 'zip';
      } else {
        extension = slug === 'jpg-to-png' ? 'png' : 'jpg';
      }
    } else {
      blob = new Blob([String(outputValue)], { type: 'text/plain;charset=utf-8' });
      extension = toUnit.toLowerCase();
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.slug}-output.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download initialized.');
  };

  // Favorite triggers
  const handleToggleFavorite = () => {
    const { items } = toggleFavoriteItem(slug, {
      fromUnit,
      toUnit,
      fromSymbol: getUnitSymbol(fromUnit),
      toSymbol: getUnitSymbol(toUnit),
    });
    setFavorites(items);
    toast.success(isFavorite(slug, fromUnit, toUnit) ? 'Pinned to favorites!' : 'Removed from favorites.');
  };

  // Restores a history item
  const handleReloadHistory = (item: HistoryItem) => {
    setFromUnit(item.fromUnit);
    setToUnit(item.toUnit);
    setInputValue(item.inputValue);
    setIsHistoryOpen(false);
    toast.info('Historical conversion loaded.');
  };

  // Deletes single history item
  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(slug, id);
    setHistory(updated);
    toast.success('Entry removed.');
  };

  // Clears history
  const handleClearHistory = () => {
    clearHistory(slug);
    setHistory([]);
    toast.success('History cleared.');
  };

  // Related Tools query (retrieves from Registry config)
  const allTools = getAllTools();
  const relatedTools = (config.relatedTools || [])
    .map((slugStr: string) => allTools.find((t) => t.slug === slugStr))
    .filter(Boolean);

  // Compile options list for Select dropdowns
  let selectOptions: SelectOption[] = [];
  if (config.customConverterId === 'currency') {
    selectOptions = Object.values(CURRENCY_CATALOG).map((c) => ({
      value: c.code,
      label: `${c.code} - ${c.name}`,
      symbol: c.symbol,
      flag: c.flag,
    }));
  } else if (config.customConverterId === 'csv-json' || config.customConverterId === 'json-csv') {
    selectOptions = [
      { value: 'CSV', label: 'CSV File/Text' },
      { value: 'JSON', label: 'JSON Format' },
    ];
  } else if (config.customConverterId === 'png-jpg') {
    selectOptions = [
      { value: 'PNG', label: 'PNG Image' },
      { value: 'JPG', label: 'JPEG Image' },
    ];
  } else if (slug === 'base64-encoder-decoder') {
    selectOptions = [
      { value: 'Text', label: 'Plain Text' },
      { value: 'Base64', label: 'Base64 Format' },
    ];
  } else {
    // General mathematical units list
    const unitsList = slug === 'storage-converter'
      ? getStorageUnits(settings.binaryStandard)
      : UNIT_CONFIG_MAP[slug]?.units || [];
    
    if (unitsList.length === 0 && config.supportedInputFormats && config.supportedOutputFormats) {
      const inputNames = config.supportedInputFormats.map((f: string) => FORMAT_NAME_MAP[f] || f.replace('.', '').toUpperCase());
      const outputNames = config.supportedOutputFormats.map((f: string) => FORMAT_NAME_MAP[f] || f.replace('.', '').toUpperCase());
      const uniqueNames = Array.from(new Set([...inputNames, ...outputNames]));
      selectOptions = uniqueNames.map((name) => ({
        value: name,
        label: name,
      }));
    } else {
      selectOptions = unitsList.map((u) => ({
        value: u.name,
        label: u.name,
        symbol: u.symbol,
      }));
    }
  }

  return (
    <div className="min-h-screen bg-background pb-16 space-y-10">
      
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-2.5 text-center text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-2">
          <CloudAlert className="h-4.5 w-4.5" />
          <span>Local Mode: Your data is processed 100% locally. Internet is currently disconnected.</span>
        </div>
      )}

      {/* Frankfurter API Cache Warning Banner */}
      {rateWarning && isOnline && (
        <div className="bg-cyan-500/10 border-b border-cyan-500/25 px-4 py-2.5 text-center text-xs text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center gap-2">
          <Wifi className="h-4.5 w-4.5" />
          <span>{rateWarning}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Node */}
        <ConverterHeader
          title={config.seoMeta?.h1 || config.name}
          description={config.intro || config.description}
          isOfflineCompatible={config.customConverterId !== 'currency'}
        />

        {/* Dynamic Favorites Section */}
        <ConverterFavorites
          favorites={favorites}
          onSelectFavorite={(fav) => {
            setFromUnit(fav.fromUnit);
            setToUnit(fav.toUnit);
            toast.info(`Switched units to ${fav.fromUnit} ⇄ ${fav.toUnit}`);
          }}
          onRemoveFavorite={(fav) => {
            const { items } = toggleFavoriteItem(slug, fav);
            setFavorites(items);
          }}
        />

        {/* Operational Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 border border-border rounded-3xl p-6 bg-card/45 shadow-xs relative gap-6 items-stretch">
          {/* Left / Input column */}
          <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
            <ConverterSelect
              id="source-unit-select"
              label="Convert From"
              options={selectOptions}
              selected={fromUnit}
              onChange={(val) => {
                setFromUnit(val);
                // If it is CSV/JSON custom converter, toggle the other unit to match
                if (config.customConverterId === 'csv-json' || config.customConverterId === 'json-csv') {
                  setToUnit(val === 'CSV' ? 'JSON' : 'CSV');
                }
              }}
            />

            <ConverterInput
              inputMode={config.inputMode}
              value={inputValue}
              onChange={setInputValue}
              error={validationError}
              placeholder={
                config.customConverterId === 'png-jpg'
                  ? (slug === 'jpg-to-png' ? 'Paste image or drag JPG/JPEG files here...' : 'Paste image or drag PNG files here...')
                  : 'Enter value...'
              }
              supportedFormats={config.supportedInputFormats || []}
              maxBytes={config.validation?.maxBytes}
            />
          </div>

          {/* Center Swap Button column */}
          <div className="md:col-span-1 flex items-center justify-center py-2 md:py-0">
            <ConverterSwap onSwap={handleSwap} />
          </div>

          {/* Right / Output column */}
          <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
            <ConverterSelect
              id="target-unit-select"
              label="Convert To"
              options={selectOptions}
              selected={toUnit}
              onChange={(val) => {
                setToUnit(val);
                // If it is CSV/JSON custom converter, toggle the other unit to match
                if (config.customConverterId === 'csv-json' || config.customConverterId === 'json-csv') {
                  setFromUnit(val === 'CSV' ? 'JSON' : 'CSV');
                }
              }}
            />

            <ConverterOutput
              outputMode={config.outputMode}
              result={outputValue}
              exactResult={exactValue}
              onCopy={handleCopy}
              onDownload={handleDownload}
              hasCopied={hasCopied}
              error={validationError}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Toolbar section */}
        <ConverterToolbar
          isFavorited={isFavorite(slug, fromUnit, toUnit)}
          onReset={handleReset}
          onCopy={handleCopy}
          onShare={handleShare}
          onToggleFavorite={handleToggleFavorite}
          onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
          onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
          hasCopied={hasCopied}
        />

        {/* Information accordion blocks */}
        <div className="space-y-6">
          <ConverterFormula formula={formulaUsed} fromUnit={fromUnit} toUnit={toUnit} />
          <ConverterExamples
            examples={config.examples || []}
            onSelectExample={(val, fUnit, tUnit) => {
              setInputValue(val);
              if (fUnit) setFromUnit(fUnit);
              if (tUnit) setToUnit(tUnit);
              toast.success('Example loaded into workspace!');
            }}
          />
          <ConverterFAQ faqs={config.faqs || []} />
        </div>

        {/* Related Utilities */}
        {relatedTools.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-base font-bold text-foreground uppercase tracking-widest text-left">Related Utilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedTools.map((relTool: any, idx: number) => (
                <ToolCard
                  key={relTool.id}
                  title={relTool.name}
                  description={relTool.description}
                  href={`/tools/${relTool.slug}`}
                  tag={relTool.iconTag}
                  status={relTool.isPremium ? 'pro' : 'live'}
                  isPremium={relTool.isPremium}
                  requiresAuth={relTool.requiresAuth}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* History Drawer Modal */}
      <ConverterHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onReload={handleReloadHistory}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearHistory}
        onAddToFavorites={(item) => {
          const { items } = toggleFavoriteItem(slug, {
            fromUnit: item.fromUnit,
            toUnit: item.toUnit,
            fromSymbol: item.fromSymbol,
            toSymbol: item.toSymbol,
          });
          setFavorites(items);
        }}
        isFavCheck={(fUnit, tUnit) => isFavorite(slug, fUnit, tUnit)}
      />

      {/* Settings Modal */}
      <ConverterSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
        showStorageOption={slug === 'storage-converter'}
        showCsvOption={config.customConverterId === 'csv-json' || config.customConverterId === 'json-csv'}
        showJsonOption={config.customConverterId === 'csv-json' || config.customConverterId === 'json-csv'}
        showImageOption={config.customConverterId === 'png-jpg'}
      />
    </div>
  );
}
