"use client";

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';

export function LeftSidebar() {
  const { state, dispatch } = useWorkspace();

  return (
    <div className="w-64 h-full border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Media Workspace</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Upload Button */}
        <button 
          className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-medium hover:opacity-90 transition"
          onClick={() => document.getElementById('global-file-input')?.click()}
        >
          Upload Media
        </button>
        
        {/* File List */}
        <div className="space-y-2 mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">Files</h3>
          {state.files.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No files uploaded.</p>
          ) : (
            state.files.map(file => (
              <div 
                key={file.id}
                onClick={() => dispatch({ type: 'SET_ACTIVE_FILE', payload: file.id })}
                className={`p-3 rounded-xl cursor-pointer text-sm truncate border transition-colors ${
                  state.activeFileId === file.id 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-transparent hover:bg-muted'
                }`}
              >
                {file.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
