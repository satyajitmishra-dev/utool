import React from 'react';

export function AuthHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">{title}</h2>
      <p className="text-white/50 text-sm">{description}</p>
    </div>
  );
}
