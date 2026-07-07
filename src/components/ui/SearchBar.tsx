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
      className="bg-[#171717] border-2 border-[#333333] p-3 text-white focus:outline-none focus:border-[#F59E0B] w-full md:w-96 font-mono text-sm shadow-[4px_4px_0px_0px_#333333] focus:shadow-[4px_4px_0px_0px_#F59E0B] transition-all"
    />
  );
}
