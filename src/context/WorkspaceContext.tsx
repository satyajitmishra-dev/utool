"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { get, set } from 'idb-keyval';

export type FileCategory = 'image' | 'pdf' | 'document' | 'audio' | 'video' | 'unknown';

export interface WorkspaceFile {
  id: string;
  file: File | Blob;
  previewUrl: string; // Transient, recreated on load
  category: FileCategory;
  mimeType: string;
  size: number;
  name: string;
  serverKey?: string;
  sourceUrl?: string; // Original URL if downloaded
  status: 'idle' | 'uploading' | 'downloading' | 'processing' | 'done' | 'error';
  progress: number;
  resultUrl?: string;
  error?: string;
}

export type ActiveTool = string | null;

interface WorkspaceState {
  files: WorkspaceFile[];
  activeFileId: string | null;
  activeToolId: ActiveTool;
  isLoaded: boolean;
}

type WorkspaceAction =
  | { type: 'INIT_STATE'; payload: WorkspaceState }
  | { type: 'ADD_FILES'; payload: WorkspaceFile[] }
  | { type: 'REMOVE_FILE'; payload: string }
  | { type: 'SET_ACTIVE_FILE'; payload: string | null }
  | { type: 'SET_ACTIVE_TOOL'; payload: ActiveTool }
  | { type: 'UPDATE_FILE'; payload: { id: string; updates: Partial<WorkspaceFile> } }
  | { type: 'CLEAR_ALL' };

const initialState: WorkspaceState = {
  files: [],
  activeFileId: null,
  activeToolId: null,
  isLoaded: false,
};

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  let newState: WorkspaceState;
  
  switch (action.type) {
    case 'INIT_STATE':
      return { ...action.payload, isLoaded: true };
    case 'ADD_FILES':
      newState = {
        ...state,
        files: [...state.files, ...action.payload],
        activeFileId: state.activeFileId || (action.payload.length > 0 ? action.payload[0].id : null),
      };
      break;
    case 'REMOVE_FILE': {
      const remainingFiles = state.files.filter((f) => f.id !== action.payload);
      newState = {
        ...state,
        files: remainingFiles,
        activeFileId: state.activeFileId === action.payload 
          ? (remainingFiles.length > 0 ? remainingFiles[0].id : null) 
          : state.activeFileId,
      };
      break;
    }
    case 'SET_ACTIVE_FILE':
      newState = { ...state, activeFileId: action.payload };
      break;
    case 'SET_ACTIVE_TOOL':
      newState = { ...state, activeToolId: action.payload };
      break;
    case 'UPDATE_FILE':
      newState = {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id ? { ...file, ...action.payload.updates } : file
        ),
      };
      break;
    case 'CLEAR_ALL':
      newState = { ...initialState, isLoaded: true };
      break;
    default:
      return state;
  }

  // Persist to IDB on every state change (debouncing might be better in production, but IDB is fast)
  if (newState.isLoaded) {
    set('media-workspace-state', {
      files: newState.files.map(f => ({ ...f, previewUrl: '' })), // Don't save object URLs
      activeFileId: newState.activeFileId,
      activeToolId: newState.activeToolId
    }).catch(console.error);
  }

  return newState;
}

const WorkspaceContext = createContext<{
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
} | null>(null);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Load from IndexedDB on mount
  useEffect(() => {
    get('media-workspace-state').then((savedState: any) => {
      if (savedState && savedState.files) {
        // Recreate preview URLs for files/blobs
        const filesWithUrls = savedState.files.map((f: any) => {
          if (f.file instanceof Blob || f.file instanceof File) {
            return { ...f, previewUrl: URL.createObjectURL(f.file) };
          }
          return f;
        });
        
        dispatch({
          type: 'INIT_STATE',
          payload: {
            files: filesWithUrls,
            activeFileId: savedState.activeFileId,
            activeToolId: savedState.activeToolId,
            isLoaded: true,
          }
        });
      } else {
        dispatch({ type: 'INIT_STATE', payload: { ...initialState, isLoaded: true } });
      }
    }).catch((err) => {
      console.error("Failed to load workspace state from IDB", err);
      dispatch({ type: 'INIT_STATE', payload: { ...initialState, isLoaded: true } });
    });
  }, []);

  // Cleanup object URLs on unmount (prevent memory leaks)
  useEffect(() => {
    return () => {
      state.files.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, [state.files]);

  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

// Helper function to determine category
export function getFileCategory(mimeType: string, extension: string): FileCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  
  const docExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.rtf'];
  if (docExtensions.some(ext => extension.toLowerCase().endsWith(ext))) return 'document';
  
  return 'unknown';
}
