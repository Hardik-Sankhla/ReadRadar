import React from 'react';

interface Props {
  children: React.ReactNode;
  variant?: 'outline' | 'solid';
}

export function Badge({ children, variant = 'outline' }: Props) {
  if (variant === 'solid') {
    return (
      <span className="bg-[#0A0A0A] px-2 py-1 text-xs border border-[#333333] text-gray-400 font-mono uppercase">
        {children}
      </span>
    );
  }
  return (
    <span className="px-1.5 py-0.5 bg-[#333333]/50 text-gray-300 text-[10px] uppercase border border-[#333333]">
      {children}
    </span>
  );
}
