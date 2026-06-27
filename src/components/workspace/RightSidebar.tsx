"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Settings2, Download, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AdContainer } from './AdContainer';
import { RegistryService } from '@/lib/registry';

export function RightSidebar() {
  const { state, dispatch } = useWorkspace();
  const activeFile = state.files.find(f => f.id === state.activeFileId);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!activeFile) {
    return (
      <div className="w-80 h-full border-l border-border bg-card flex flex-col p-6 items-center justify-center text-center text-muted-foreground">
        <Settings2 className="w-12 h-12 mb-4 opacity-50" />
        <p>Select a file to view available tools.</p>
      </div>
    );
  }

  const handleSimulatedProcess = () => {
    setIsProcessing(true);
    toast.info(`Processing ${activeFile.name}...`);
    
    // Simulate network request
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Processing complete!');
    }, 2000);
  };

  const availableConverters = activeFile 
    ? RegistryService.getConvertersForInput(activeFile.name.substring(activeFile.name.lastIndexOf('.')))
    : [];

  return (
    <div className="w-80 h-full border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Tools & Export</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* File Info */}
        <div className="bg-muted/30 p-4 rounded-xl space-y-2 border border-border/50">
          <p className="text-sm truncate font-medium text-foreground">{activeFile.name}</p>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{(activeFile.size / 1024 / 1024).toFixed(2)} MB</span>
            <span className="uppercase">{activeFile.category}</span>
          </div>
          {activeFile.status === 'downloading' && (
            <p className="text-xs text-primary animate-pulse mt-2">Downloading from source...</p>
          )}
        </div>

        {/* Dynamic Tool Palette */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Available Tools</h3>
          
          <div className="space-y-2">
            {availableConverters.length === 0 ? (
              <p className="text-sm text-muted-foreground">No specific tools available for this format yet.</p>
            ) : (
              availableConverters.map(tool => (
                <ToolButton key={tool.id} icon={<ArrowRight />} label={tool.name} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="p-4 border-t border-border bg-muted/10 space-y-4">
        <AdContainer slot="right-sidebar" width={300} height={250} className="w-full h-auto min-h-[200px]" format="fluid" />
        <button 
          onClick={handleSimulatedProcess}
          disabled={isProcessing}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium shadow-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? 'Processing...' : 'Apply & Export'}
        </button>
        <button className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-medium border border-border/50 hover:bg-muted transition-all flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download Original
        </button>
      </div>
    </div>
  );
}

function ToolButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-3 text-sm font-medium rounded-xl border border-border/50 bg-card hover:bg-muted/50 hover:border-primary/30 transition-all text-left">
      <span className="text-muted-foreground w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      {label}
    </button>
  );
}
