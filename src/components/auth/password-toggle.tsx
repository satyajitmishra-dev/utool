"use client";

import React, { useState, forwardRef } from 'react';
import { AuthInput } from './auth-input';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordToggle = forwardRef<HTMLInputElement, React.ComponentProps<typeof AuthInput>>(
  (props, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative">
        <AuthInput
          ref={ref}
          type={show ? "text" : "password"}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-[34px] text-white/40 hover:text-white/70 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  }
);
PasswordToggle.displayName = 'PasswordToggle';
