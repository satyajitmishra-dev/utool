import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="mb-4">
        <label htmlFor={inputId} className="block text-sm font-medium text-white/70 mb-1.5">
          {label}
        </label>
        <motion.div
          animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20",
              "focus:outline-none focus:ring-2 transition-all",
              error 
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                : "border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20",
              className
            )}
            {...props}
          />
        </motion.div>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);
AuthInput.displayName = 'AuthInput';
