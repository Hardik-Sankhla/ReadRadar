import React from 'react';

interface Props {
  children: React.ReactNode;
  variant?: 'outline' | 'solid' | 'tag';
}

export function Badge({ children, variant = 'outline' }: Props) {
  if (variant === 'solid') {
    return (
      <span className="bg-background px-2 py-1 text-xs border border-border text-gray-300 font-mono uppercase">
        {children}
      </span>
    );
  }
  if (variant === 'tag') {
    return (
      <span className="text-primary font-mono text-xs before:content-['#']">
        {children}
      </span>
    );
  }
  return (
    <span className="px-1.5 py-0.5 bg-border/50 text-gray-300 text-[10px] uppercase border border-border">
      {children}
    </span>
  );
}
