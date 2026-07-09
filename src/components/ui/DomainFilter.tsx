import React from 'react';

interface Props {
  domains: string[];
  selectedDomain: string;
  onSelect: (domain: string) => void;
}

export function DomainFilter({ domains, selectedDomain, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button 
        onClick={() => onSelect("All")}
        className={`px-4 py-2 border-2 text-sm font-mono whitespace-nowrap transition-colors ${selectedDomain === "All" ? 'bg-primary border-primary text-white font-bold' : 'bg-muted border-border text-gray-300 hover:text-white'}`}
      >
        All
      </button>
      {domains.map(domain => (
        <button 
          key={domain}
          onClick={() => onSelect(domain)}
          className={`px-4 py-2 border-2 text-sm font-mono whitespace-nowrap transition-colors ${selectedDomain === domain ? 'bg-primary border-primary text-white font-bold' : 'bg-muted border-border text-gray-300 hover:text-white'}`}
        >
          {domain}
        </button>
      ))}
    </div>
  );
}
