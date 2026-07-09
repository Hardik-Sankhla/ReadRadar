import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search resources..." }: Props) {
  return (
    <input 
      type="text" 
      placeholder={placeholder} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted border-2 border-border p-3 text-white focus:outline-none focus:border-primary w-full md:w-96 font-mono text-sm shadow-neo focus:shadow-neo-purple transition-all"
    />
  );
}
