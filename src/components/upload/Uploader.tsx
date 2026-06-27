"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File as FileIcon, X, CheckCircle, AlertCircle, Loader2, Type, FileText } from 'lucide-react';
import { RegistryTool } from '@/types/tool-registry';
import { ConversionFeedback } from '@/components/support/conversion-feedback';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface UploaderProps {
  config: RegistryTool;
}

export function Uploader({ config }: UploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'converting' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rawPreviewText, setRawPreviewText] = useState<string | null>(null);

  const isTextSupported = (config.supportedInputFormats || []).some(fmt => 
    ['.json', '.csv', '.md', '.html', '.yaml', '.txt', '.xml'].includes(fmt.toLowerCase())
  );
  const [inputType, setInputType] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    const ext = config.supportedInputFormats?.[0] || '.txt';
    const blob = new Blob([textInput], { type: 'text/plain' });
    const textFile = new File([blob], `input${ext}`, { type: 'text/plain' });
    setFile(textFile);
    setStatus('idle');
    setErrorMessage(null);
    setResultUrl(null);
  };

  const previewUrl = React.useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
      setErrorMessage(null);
      setResultUrl(null);
    }
  }, []);

  const mimeTypeMap: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.tiff': 'image/tiff',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.csv': 'text/csv',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.md': 'text/markdown',
    '.html': 'text/html',
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1, // Single file for now, will expand to batch later
    accept: (config.supportedInputFormats || []).reduce((acc, format) => {
      const ext = format.toLowerCase();
      const mimeType = mimeTypeMap[ext] || 'application/octet-stream';
      if (!acc[mimeType]) {
        acc[mimeType] = [];
      }
      acc[mimeType].push(ext);
      return acc;
    }, {} as Record<string, string[]>),
  });

  const handleProcess = async () => {
    if (!file) return;

    try {
      setStatus('uploading');
      setProgress(10);

      const MAX_LOCAL_SIZE = 5 * 1024 * 1024; // 5MB
      let requestBody: any = { originalName: file.name };

      if (file.size <= MAX_LOCAL_SIZE && config.isConverter) {
        // Encode directly to base64 for small files, completely bypassing server uploads
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        requestBody.rawContent = base64;
        setProgress(50);
        setStatus('converting');
      } else {
        // 1. Upload file via our Next.js API
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Upload to server failed');
        const { key } = await uploadRes.json();
        requestBody.fileKey = key;
        
        setProgress(50);
        setStatus('converting');
      }

      // 3. Trigger Conversion
      const convertRes = await fetch(`/api/convert/${config.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await convertRes.json();
      if (!convertRes.ok || !data.success) {
        throw new Error(data.error || 'Conversion failed');
      }

      setProgress(100);
      setStatus('done');
      
      if (data.rawOutputContent !== undefined) {
        const byteCharacters = atob(data.rawOutputContent);
        
        try {
          // Properly decode utf-8 from binary string
          const decodedText = decodeURIComponent(escape(byteCharacters));
          setRawPreviewText(decodedText.length > 5000 ? decodedText.substring(0, 5000) + '\n\n... (preview truncated)' : decodedText);
        } catch (e) {
          // Fallback if decoding fails
          setRawPreviewText(byteCharacters.substring(0, 1000));
        }

        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        setResultUrl(URL.createObjectURL(blob));
      } else {
        setResultUrl(data.downloadUrl);
      }

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus('idle');
    setRawPreviewText(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            {isTextSupported && (
              <div className="flex justify-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setInputType('file')}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                    inputType === 'file' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <FileText className="w-4 h-4" /> File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('text')}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                    inputType === 'text' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <Type className="w-4 h-4" /> Text Input
                </button>
              </div>
            )}
            
            {inputType === 'file' ? (
              <div
                {...(getRootProps() as any)}
                className={cn(
                  "border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300",
                  isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-card/50"
                )}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {isDragActive ? 'Drop file here' : 'Click or Drag & Drop'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Supported formats: {(config.supportedInputFormats || []).join(', ').toUpperCase()}
                </p>
                <Button size="lg" className="rounded-full px-8">
                  Select File
                </Button>
              </div>
            ) : (
              <div className="text-left w-full">
                <textarea 
                  className="w-full min-h-[250px] p-4 rounded-2xl border border-border bg-card focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y font-mono text-sm"
                  placeholder={`Paste your ${(config.supportedInputFormats?.[0] || 'text').toUpperCase()} content here...`}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <div className="flex justify-center mt-6">
                  <Button size="lg" className="rounded-full px-12" onClick={handleTextSubmit} disabled={!textInput.trim()}>
                    Use Text
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8"
          >
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border mb-6">
              <div className="flex items-center gap-4">
                {previewUrl && file.type.startsWith('image/') ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <FileIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-sm truncate" title={file.name}>{file.name}</h4>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {status === 'idle' && (
                <button onClick={removeFile} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {status === 'idle' && (
              <div className="flex justify-center">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-12" onClick={handleProcess}>
                  Convert to {(config.supportedOutputFormats?.[0] || 'File').toUpperCase().replace('.', '')}
                </Button>
              </div>
            )}

            {(status === 'uploading' || status === 'converting') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    {status === 'uploading' ? 'Uploading...' : 'Converting...'}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {status === 'done' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto text-success mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Conversion Complete!</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">Your file is ready to download.</p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-4 max-h-[300px] overflow-auto text-left shadow-inner">
                  {rawPreviewText !== null ? (
                    <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">{rawPreviewText}</pre>
                  ) : resultUrl && ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(config.supportedOutputFormats?.[0]?.toLowerCase() || '') ? (
                    <img src={resultUrl} alt="Output Preview" className="w-full h-auto object-contain max-h-[250px] rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <FileIcon className="w-12 h-12 mb-2 opacity-30" />
                      <p className="text-sm">Preview not available for this format.</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button variant="outline" size="lg" className="rounded-full" onClick={removeFile}>
                    Convert Another
                  </Button>
                  {resultUrl && (
                    <a href={resultUrl} download>
                      <Button size="lg" className="rounded-full">
                        Download File
                      </Button>
                    </a>
                  )}
                </div>

                {/* Conversion Feedback Widget */}
                <ConversionFeedback 
                  toolSlug={config.id}
                  inputFileType={file?.type || inputType}
                  outputFileType={config.supportedOutputFormats?.[0] || 'text'}
                  onNegativeFeedback={() => {
                    // Logic to open support conversation modal
                    window.dispatchEvent(new CustomEvent('open-support-ticket', { 
                      detail: { 
                        toolSlug: config.id, 
                        inputFileType: file?.type || inputType,
                        outputFileType: config.supportedOutputFormats?.[0] || 'text',
                        errorLogs: 'User reported output issue manually'
                      } 
                    }));
                  }}
                />
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto text-destructive">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Conversion Failed</h3>
                  <p className="text-sm text-destructive mt-1">{errorMessage}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" variant="outline" className="rounded-full" onClick={() => setStatus('idle')}>
                    Try Again
                  </Button>
                  <Button 
                    size="lg" 
                    className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-support-ticket', { 
                        detail: { 
                          toolSlug: config.id, 
                          inputFileType: file?.type || inputType,
                          outputFileType: config.supportedOutputFormats?.[0] || 'text',
                          errorLogs: errorMessage
                        } 
                      }));
                    }}
                  >
                    Report Issue
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
