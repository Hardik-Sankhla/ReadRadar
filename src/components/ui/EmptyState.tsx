import React from 'react';

interface Props {
  title?: string;
  message?: string;
}

export function EmptyState({ 
  title = "No Results Found", 
  message = "We couldn't find any resources matching your current filters. Try adjusting your search or clearing some filters." 
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border bg-muted/30">
      <div className="text-gray-400 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="font-heading text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 max-w-sm">{message}</p>
    </div>
  );
}
