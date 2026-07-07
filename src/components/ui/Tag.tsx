import React from 'react';

interface Props {
  children: React.ReactNode;
}

export function Tag({ children }: Props) {
  return (
    <span className="text-[#7C3AED] font-mono text-xs before:content-['#']">
      {children}
    </span>
  );
}
