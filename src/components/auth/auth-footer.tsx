import Link from 'next/link';
import React from 'react';

export function AuthFooter({ 
  text, 
  linkText, 
  href 
}: { 
  text: string; 
  linkText: string; 
  href: string 
}) {
  return (
    <p className="mt-6 text-center text-sm text-white/50">
      {text}{" "}
      <Link href={href} className="text-white hover:text-violet-400 transition-colors font-medium">
        {linkText}
      </Link>
    </p>
  );
}
