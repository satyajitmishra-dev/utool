"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useWorkspace, getFileCategory, WorkspaceFile } from '@/context/WorkspaceContext';
import { v4 as uuidv4 } from 'uuid';
import { RegistryService } from '@/lib/registry';
import { toast } from 'sonner';

export function GlobalUploader({ children }: { children: React.ReactNode }) {
  const { dispatch } = useWorkspace();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const newFiles: WorkspaceFile[] = acceptedFiles.map(file => {
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      return {
        id: uuidv4(),
        file,
        previewUrl: URL.createObjectURL(file),
        category: getFileCategory(file.type, ext),
        mimeType: file.type,
        size: file.size,
        name: file.name,
        status: 'idle',
        progress: 0,
      };
    });

    dispatch({ type: 'ADD_FILES', payload: newFiles });

    // Optionally trigger auto-upload here
    // ...
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // We don't want clicking the screen to trigger upload
    noKeyboard: true,
  });

  // Handle Paste Events for URLs and Images
  React.useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const text = clipboardData.getData('text');
      
      if (text) {
        // Try parsing as URL
        try {
          const url = new URL(text);
          const downloader = RegistryService.getDownloaderForUrl(url.toString());
          
          if (downloader) {
            e.preventDefault();
            const newFile: WorkspaceFile = {
              id: uuidv4(),
              file: new Blob(), // Dummy blob until downloaded
              previewUrl: '',
              category: 'unknown',
              mimeType: 'application/octet-stream',
              size: 0,
              name: url.pathname.split('/').pop() || 'downloaded-file',
              sourceUrl: url.toString(),
              status: 'downloading',
              progress: 0,
            };
            
            dispatch({ type: 'ADD_FILES', payload: [newFile] });
            toast.info(`Started downloading from ${url.hostname}`);
            
            // Trigger actual download API call here...
            try {
              const res = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.toString() })
              });
              
              if (!res.ok) throw new Error('Download failed');
              const data = await res.json();
              
              dispatch({ type: 'UPDATE_FILE', payload: { 
                id: newFile.id, 
                updates: { status: 'idle', serverKey: data.key, size: data.size, name: data.originalName, mimeType: data.mimeType } 
              }});
              toast.success('Download complete!');
            } catch (err: any) {
              dispatch({ type: 'UPDATE_FILE', payload: { id: newFile.id, updates: { status: 'error', error: err.message } } });
              toast.error('Failed to download file.');
            }
          }
        } catch (_) {
          // Not a valid URL, ignore
        }
      }
      
      // Also handle pasted files/images
      if (clipboardData.files && clipboardData.files.length > 0) {
        e.preventDefault();
        onDrop(Array.from(clipboardData.files));
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [dispatch, onDrop]);

  return (
    <div {...getRootProps()} className="relative w-full h-full flex outline-none">
      <input {...getInputProps()} id="global-file-input" />
      
      {isDragActive && (
        <div className="absolute inset-0 z-50 bg-primary/20 backdrop-blur-sm flex items-center justify-center border-4 border-primary border-dashed rounded-xl m-2">
          <div className="bg-card p-8 rounded-2xl shadow-2xl flex flex-col items-center">
            <h2 className="text-3xl font-bold text-primary mb-2">Drop files here</h2>
            <p className="text-muted-foreground">Release to add to your workspace</p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
