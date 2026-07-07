import React from 'react';

interface Props {
  children: React.ReactNode;
}

export function Tag({ children }: Props) {
  return (
    <span className="text-[#8B5CF6] font-mono text-xs before:content-['#']">
      {children}
    </span>
  );
}
