"use client";

import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getToolBySlug } from "@/config/tool-registry";
import { analyzeText, TextStats } from "@/lib/text/analyzers";
import { TextEditor } from "./TextEditor";
import { TextToolbar } from "./TextToolbar";
import { TextStatistics } from "./TextStatistics";
import { TextOptions } from "./TextOptions";
import { TextResult } from "./TextResult";
import { PresetPanel } from "./PresetPanel";
import { HistoryPanel, saveSessionToHistory, HistoryItem } from "./HistoryPanel";
import { SearchPanel } from "./SearchPanel";
import { TextWorkerController } from "@/lib/text/text-worker-client";
import { MorseAudioPlayer } from "@/lib/text/converters";
import { generateRandomWords } from "@/lib/text/word-generator";
import { findMatches, replaceAll, MatchRange } from "@/lib/text/search";
import { Loader2, Play, Square, Settings, BarChart2, History, Type, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

interface TextWorkspaceProps {
  toolId: string;
}

export function TextWorkspace({ toolId }: TextWorkspaceProps) {
  const toolConfig = getToolBySlug(toolId);
  const toolName = toolConfig?.name || "Text Tool";
  const toolDesc = toolConfig?.description || "Text processing workspace.";

  // Core Editor states
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [options, setOptions] = useState<any>({});
  const [stats, setStats] = useState<TextStats>(analyzeText(""));

  // Layout & UI states
  const [activeTab, setActiveTab] = useState<"workspace" | "stats" | "history">("workspace");
  const [wordWrap, setWordWrap] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Background Web Worker states
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingTimeMs, setProcessingTimeMs] = useState(0);
  const [modificationsCount, setModificationsCount] = useState(0);

  // Search & Replace states
  const [searchMatches, setSearchMatches] = useState<MatchRange[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  // Automatically search and highlight matches when input text or search filters change
  useEffect(() => {
    if (!showSearch || !findText) {
      setSearchMatches([]);
      setCurrentMatchIndex(0);
      return;
    }

    const matches = findMatches(inputText, {
      findText,
      replaceText: "",
      caseSensitive,
      wholeWord,
      useRegex,
    });
    
    setSearchMatches(matches);
    setCurrentMatchIndex((prev) => {
      if (matches.length === 0) return 0;
      return Math.min(prev, matches.length - 1);
    });
  }, [inputText, findText, caseSensitive, wholeWord, useRegex, showSearch]);

  // Morse Player state
  const [isPlayingMorse, setIsPlayingMorse] = useState(false);

  // Refs for background processes
  const workerControllerRef = useRef<TextWorkerController | null>(null);
  const audioPlayerRef = useRef<MorseAudioPlayer | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Undo/Redo Stacks
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Initialize controllers
  useEffect(() => {
    workerControllerRef.current = new TextWorkerController();
    audioPlayerRef.current = new MorseAudioPlayer();

    // Default tool options config
    const defaults = getToolDefaultOptions(toolId);
    setOptions(defaults);

    // Sync options with URL parameters if any (Share state restoration)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const newOpts: any = { ...defaults };
      let hasUrlParams = false;
      urlParams.forEach((val, key) => {
        if (key in defaults) {
          hasUrlParams = true;
          // Parse types correctly
          if (val === "true") newOpts[key] = true;
          else if (val === "false") newOpts[key] = false;
          else if (!isNaN(Number(val))) newOpts[key] = Number(val);
          else newOpts[key] = val;
        }
      });
      if (hasUrlParams) {
        setOptions(newOpts);
      }
    } catch (e) {}

    return () => {
      if (workerControllerRef.current) {
        workerControllerRef.current.cancel();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stop();
      }
    };
  }, [toolId]);

  // Load default options helper
  const getToolDefaultOptions = (id: string) => {
    switch (id) {
      case "binary-to-text":
      case "text-to-binary":
        return { toBinary: id !== "binary-to-text", mode: "utf8", separator: "space" };
      case "morse-code-encoder":
      case "morse-code-decoder":
        return { wpm: 20, frequency: 600 };
      case "strip-html-tags":
        return { preserveLineBreaks: true, decodeEntities: true, removeScriptsStyles: true, removeComments: true };
      case "remove-duplicate-lines":
        return { ignoreCase: false, trimWhitespace: true, sortBeforeRemoval: false };
      case "text-reverser":
        return { mode: "chars", preserveSpacing: false, preservePunctuation: false };
      case "text-sorter":
        return { mode: "alpha", direction: "asc", ignoreCase: true, removeDuplicates: false, trimWhitespace: true };
      case "random-word-generator":
        return { count: 10, category: "general", startsWith: "", endsWith: "" };
      default:
        return {};
    }
  };

  // Keep live stats up to date
  useEffect(() => {
    setStats(analyzeText(inputText));
  }, [inputText]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd modifier
      const isCmd = e.ctrlKey || e.metaKey;
      if (!isCmd) return;

      switch (e.key.toLowerCase()) {
        case "z":
          e.preventDefault();
          handleUndo();
          break;
        case "y":
          e.preventDefault();
          handleRedo();
          break;
        case "f":
          e.preventDefault();
          setShowSearch(true);
          // Focus search input
          setTimeout(() => {
            const searchInput = document.querySelector('input[placeholder="Find text..."]') as HTMLInputElement;
            if (searchInput) searchInput.focus();
          }, 100);
          break;
        case "enter":
          e.preventDefault();
          triggerProcessingImmediate();
          break;
        case "k":
          e.preventDefault();
          handleClear();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputText, undoStack, redoStack, options]);

  // Push state to Undo Stack (debounced)
  const pushToUndoStack = (val: string) => {
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === val) return;
    setUndoStack((prev) => [...prev, val]);
    setRedoStack([]); // Clear redo stack on new action
  };

  const handleInputChange = (val: string) => {
    setInputText(val);
    pushToUndoStack(val);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const prev = undoStack[undoStack.length - 1];
      const newUndo = undoStack.slice(0, -1);
      setUndoStack(newUndo);
      setRedoStack((prevRedo) => [...prevRedo, inputText]);
      setInputText(prev || "");
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      const newRedo = redoStack.slice(0, -1);
      setRedoStack(newRedo);
      setUndoStack((prevUndo) => [...prevUndo, inputText]);
      setInputText(next || "");
    }
  };

  const handleClear = () => {
    pushToUndoStack(inputText);
    setInputText("");
    setOutputText("");
    setModificationsCount(0);
    setSearchMatches([]);
    setCurrentMatchIndex(0);
    toast.success("Workspace cleared.");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleInputChange(text);
        toast.success("Pasted text from clipboard.");
      }
    } catch (e) {
      toast.error("Failed to read from clipboard. Enable clipboard permissions.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("Result copied to clipboard!");
  };

  const handleSwap = () => {
    if (toolId === "binary-to-text" || toolId === "text-to-binary") {
      const toBinary = !(options.toBinary ?? true);
      setOptions({ ...options, toBinary });
      setInputText(outputText);
      toast.success(`Swapped to ${toBinary ? "Text → Binary" : "Binary → Text"} mode.`);
    } else if (toolId === "morse-code-encoder" || toolId === "morse-code-decoder") {
      // Toggle routing case
      window.location.href = `/tools/${toolId === "morse-code-encoder" ? "morse-code-decoder" : "morse-code-encoder"}`;
    }
  };

  // Debounced Processing Pipeline
  useEffect(() => {
    // Avoid double-running if options aren't initialized yet
    if (Object.keys(options).length === 0) return;

    // Random Word Generator handles execution on button clicks, not typing debounces
    if (toolId === "random-word-generator") return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      runProcessingPipeline();
    }, 250); // 250ms debounce to prevent layout freezes on rapid typing

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText, options, toolId]);

  const triggerProcessingImmediate = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    runProcessingPipeline();
  };

  const runProcessingPipeline = async () => {
    if (!inputText && toolId !== "random-word-generator") {
      setOutputText("");
      setModificationsCount(0);
      return;
    }

    if (!workerControllerRef.current) return;

    // Special client-side case: Random Word Generator (main-thread)
    if (toolId === "random-word-generator") {
      const startTime = performance.now();
      const generated = generateRandomWords(options);
      const endTime = performance.now();
      
      setOutputText(generated);
      setInputText(generated); // Feed generator back to editor
      setProcessingTimeMs(endTime - startTime);
      setModificationsCount(options.count);
      return;
    }

    // Run using Web Worker
    setRunning(true);
    setProgress(0);
    const startTime = performance.now();

    const workerResult = await workerControllerRef.current.runTask(
      inputText,
      toolId,
      options,
      (pct) => setProgress(pct)
    );

    const endTime = performance.now();
    setProcessingTimeMs(endTime - startTime);

    if (workerResult.error) {
      // If user cancelled, don't show error toast
      if (workerResult.error !== "Processing was cancelled by user.") {
        toast.error(`Error: ${workerResult.error}`);
      }
      setRunning(false);
      return;
    }

    setOutputText(workerResult.result);
    if (workerResult.stats) {
      setModificationsCount(workerResult.stats.modificationsCount || 0);
      
      // Save session in history panel logs
      saveSessionToHistory(toolId, toolName, inputText, workerResult.result, options);
    }
    setRunning(false);
  };

  const handleCancel = () => {
    if (workerControllerRef.current) {
      workerControllerRef.current.cancel();
      setRunning(false);
      toast.info("Processing cancelled.");
    }
  };

  // Morse Audio Code Player
  const playMorseAudio = () => {
    if (!audioPlayerRef.current || !outputText) return;
    setIsPlayingMorse(true);
    
    // Play Output (Morse) for Encoder, Play Input (Morse) for Decoder
    const codeToPlay = toolId === "morse-code-encoder" ? outputText : inputText;
    
    audioPlayerRef.current.play(
      codeToPlay,
      { wpm: options.wpm || 20, frequency: options.frequency || 600 },
      () => setIsPlayingMorse(false)
    );
  };

  const stopMorseAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stop();
      setIsPlayingMorse(false);
    }
  };

  // Search & Replace Handlers
  const highlightMatch = (matches: MatchRange[], index: number) => {
    if (matches.length === 0 || !matches[index]) return;
    const match = matches[index];
    const editor = document.getElementById("text-editor") as HTMLTextAreaElement;
    if (editor) {
      editor.focus();
      editor.setSelectionRange(match.start, match.end);
      
      // Scroll into view
      const lineIdx = inputText.substring(0, match.start).split("\n").length - 1;
      editor.scrollTop = lineIdx * 24; // estimate based on line-height
    }
  };

  const handleNextMatch = () => {
    if (searchMatches.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIdx);
    highlightMatch(searchMatches, nextIdx);
  };

  const handlePrevMatch = () => {
    if (searchMatches.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    setCurrentMatchIndex(prevIdx);
    highlightMatch(searchMatches, prevIdx);
  };

  const handleReplace = (all: boolean) => {
    if (!findText) return;

    const replaceOpts = {
      findText,
      replaceText,
      caseSensitive,
      wholeWord,
      useRegex,
    };

    if (all) {
      const { result, replacementsCount } = replaceAll(inputText, replaceOpts);
      handleInputChange(result);
      toast.success(`Replaced ${replacementsCount} occurrences.`);
      setShowSearch(false);
      setFindText("");
    } else {
      // Replace single match at current index
      if (searchMatches.length === 0 || !searchMatches[currentMatchIndex]) return;
      const match = searchMatches[currentMatchIndex];
      const start = inputText.substring(0, match.start);
      const end = inputText.substring(match.end);
      const updated = start + replaceText + end;
      handleInputChange(updated);
      toast.success("Replaced single occurrence.");
    }
  };

  // Restore history session
  const handleRestoreHistory = (item: HistoryItem) => {
    setInputText(item.input);
    setOutputText(item.output);
    setOptions(item.options);
    toast.success("Restored previous session!");
    setActiveTab("workspace");
  };

  // Preset loading handler
  const handleSelectPreset = (val: string) => {
    handleInputChange(val);
    toast.success("Loaded preset example.");
  };

  // Export Session as JSON file
  const handleExportSession = () => {
    try {
      const session = {
        toolId,
        timestamp: new Date().toISOString(),
        options,
        inputText,
      };
      const json = JSON.stringify(session, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${toolId}-session.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Session configuration exported as JSON.");
    } catch (e) {
      toast.error("Failed to export session.");
    }
  };

  // Import Session JSON
  const handleImportSession = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const session = JSON.parse(e.target?.result as string);
        if (session.toolId && session.options) {
          setOptions(session.options);
          if (session.inputText) {
            handleInputChange(session.inputText);
          }
          toast.success("Session configuration imported successfully.");
        } else {
          toast.error("Invalid session JSON format.");
        }
      } catch (err) {
        toast.error("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner details */}
      <div className="border-b border-border pb-4 select-none">
        <h2 className="text-h2 font-extrabold text-foreground tracking-tight">{toolName}</h2>
        <p className="text-body-s text-muted-foreground mt-0.5">{toolDesc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Parameters / Inputs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Workspace navigation tabs */}
          <div className="flex border border-border rounded-xl p-1 bg-muted/20 w-fit select-none text-xs">
            <button
              onClick={() => setActiveTab("workspace")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 font-bold rounded-lg transition-all",
                activeTab === "workspace" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Settings className="h-3.5 w-3.5" /> Config
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 font-bold rounded-lg transition-all",
                activeTab === "stats" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BarChart2 className="h-3.5 w-3.5" /> Stats
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 font-bold rounded-lg transition-all",
                activeTab === "history" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <History className="h-3.5 w-3.5" /> History
            </button>
          </div>

          {/* Conditional panels rendering */}
          {activeTab === "workspace" && (
            <div className="space-y-6">
              <TextOptions
                toolId={toolId}
                options={options}
                setOptions={setOptions}
                onExecute={triggerProcessingImmediate}
                isPlayingMorse={isPlayingMorse}
                onPlayMorseAudio={playMorseAudio}
                onStopMorseAudio={stopMorseAudio}
              />
              <PresetPanel toolId={toolId} onSelectPreset={handleSelectPreset} />
            </div>
          )}

          {activeTab === "stats" && (
            <TextStatistics stats={stats} />
          )}

          {activeTab === "history" && (
            <HistoryPanel toolId={toolId} onRestore={handleRestoreHistory} />
          )}
        </div>

        {/* Right Side: Editor and Output Results */}
        <div className="lg:col-span-8 space-y-6 relative">
          {/* Top toolbar */}
          <TextToolbar
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onPaste={handlePaste}
            onClear={handleClear}
            onSwap={handleSwap}
            showSwap={["binary-to-text", "text-to-binary", "morse-code-encoder", "morse-code-decoder"].includes(toolId)}
            wordWrap={wordWrap}
            onToggleWrap={() => setWordWrap(!wordWrap)}
            onExportSession={handleExportSession}
            onImportSession={handleImportSession}
          />

          {/* Inline search bar */}
          {showSearch && (
            <SearchPanel
              findText={findText}
              setFindText={setFindText}
              replaceText={replaceText}
              setReplaceText={setReplaceText}
              caseSensitive={caseSensitive}
              setCaseSensitive={setCaseSensitive}
              wholeWord={wholeWord}
              setWholeWord={setWholeWord}
              useRegex={useRegex}
              setUseRegex={setUseRegex}
              matchCount={searchMatches.length}
              currentMatchIndex={currentMatchIndex}
              onNextMatch={handleNextMatch}
              onPrevMatch={handlePrevMatch}
              onReplace={handleReplace}
              onClose={() => {
                setShowSearch(false);
                setFindText("");
              }}
            />
          )}

          {/* Large Input Editor area */}
          <div className="relative">
            <TextEditor
              value={inputText}
              onChange={handleInputChange}
              wordWrap={wordWrap}
              fullscreen={fullscreen}
              onToggleFullscreen={() => setFullscreen(!fullscreen)}
              placeholder={
                toolId === "binary-to-text"
                  ? "Paste binary digits here (e.g. 01001000 01101001)..."
                  : toolId === "morse-code-decoder"
                  ? "Paste Morse code signals here (e.g. .... . .-.. .-.. ---)..."
                  : "Type or paste your source text here..."
              }
            />

            {/* Cancelable background progress loading indicator */}
            {running && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-xs flex flex-col items-center justify-center rounded-2xl z-40 animate-fade-in select-none">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <h4 className="text-sm font-black text-foreground mt-3">Processing large dataset...</h4>
                <div className="w-48 bg-muted h-2 rounded-full overflow-hidden mt-2 border border-border/50">
                  <div className="bg-primary h-full transition-all duration-150" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground mt-1.5">{progress}% complete</span>
                
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="mt-4 text-xs font-bold border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl"
                >
                  Cancel Processing
                </Button>
              </div>
            )}
          </div>

          {/* Output Results Panel */}
          {outputText && (
            <div className="pt-2 animate-fade-in">
              <TextResult
                toolId={toolId}
                inputText={inputText}
                outputText={outputText}
                modificationsCount={modificationsCount}
                processingTimeMs={processingTimeMs}
                wordWrap={wordWrap}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
