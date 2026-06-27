"use client";

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { UploadCloud, Image as ImageIcon, FileText, Music, Video } from 'lucide-react';
import { AdContainer } from './AdContainer';

export function CenterWorkspace() {
  const { state } = useWorkspace();
  const activeFile = state.files.find(f => f.id === state.activeFileId);

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 relative">
        <div className="text-center max-w-md p-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <UploadCloud className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome to Media Workspace</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Drag and drop any image, document, audio, or video file here to start editing instantly.
          </p>
          <button 
            onClick={() => document.getElementById('global-file-input')?.click()}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Select a File
          </button>
        </div>
      </div>
    );
  }

  // Active File Viewer
  return (
    <div className="flex-1 flex flex-col bg-muted/10 relative overflow-hidden">
      {/* Canvas Header */}
      <div className="h-14 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center px-4 absolute top-0 w-full z-10">
        <span className="font-medium text-sm truncate">{activeFile.name}</span>
        <span className="ml-4 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md uppercase tracking-wider">
          {activeFile.category}
        </span>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 mt-14 overflow-auto">
        <div className="max-w-4xl max-h-full flex items-center justify-center shadow-2xl rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-border/50">
          {activeFile.category === 'image' && (
            <img src={activeFile.previewUrl} alt={activeFile.name} className="max-w-full max-h-[80vh] object-contain" />
          )}
          {activeFile.category === 'pdf' && (
            <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
              <FileText className="w-24 h-24 mb-4 text-red-500/80" />
              <p>PDF Viewer (Preview)</p>
            </div>
          )}
          {activeFile.category === 'video' && (
            <video src={activeFile.previewUrl} controls className="max-w-full max-h-[80vh]" />
          )}
          {activeFile.category === 'audio' && (
            <div className="flex flex-col items-center justify-center p-20 min-w-[400px]">
              <Music className="w-24 h-24 mb-8 text-primary/80" />
              <audio src={activeFile.previewUrl} controls className="w-full" />
            </div>
          )}
          {activeFile.category === 'document' && (
            <div className="flex flex-col items-center justify-center p-20 text-muted-foreground min-w-[300px]">
              <FileText className="w-24 h-24 mb-4 text-blue-500/80" />
              <p>{activeFile.name}</p>
            </div>
          )}
          {activeFile.category === 'unknown' && (
            <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
              <FileText className="w-24 h-24 mb-4" />
              <p>Unsupported Preview</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Ad Banner */}
      <div className="w-full flex justify-center p-4 bg-background/50 border-t border-border/50">
        <AdContainer slot="center-bottom" width={728} height={90} className="w-full max-w-[728px]" />
      </div>
    </div>
  );
}
