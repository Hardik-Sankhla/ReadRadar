import React, { useState, useEffect } from 'react';

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-[#171717] border-2 border-[#333333] shadow-[8px_8px_0px_0px_#7C3AED] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center border-b-2 border-[#333333] p-4">
          <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            autoFocus
            placeholder="Search resources, tags, authors... (Esc to close)" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-grow bg-transparent text-white font-mono text-lg focus:outline-none placeholder-gray-500"
          />
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-[#333333] text-xs font-mono text-gray-400 border border-[#444] rounded-sm">ESC</span>
          </div>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query ? (
            <div className="text-center py-12 text-gray-500 font-mono">
              Press Enter to search for "{query}" across the intelligence layer.
              <br/>
              <button 
                onClick={() => {
                  window.location.href = `/discover?q=${encodeURIComponent(query)}`;
                }}
                className="mt-4 px-4 py-2 bg-[#7C3AED] text-white font-bold hover:bg-[#5B21B6] transition-colors border-2 border-transparent"
              >
                Go to Discover →
              </button>
            </div>
          ) : (
            <div className="text-gray-500 font-mono text-sm">
              <p className="mb-2 uppercase text-xs font-bold text-gray-400">Quick Links</p>
              <ul className="space-y-2">
                <li><a href="/trending" className="hover:text-[#7C3AED] transition-colors block">🔥 Trending Intelligence</a></li>
                <li><a href="/discover" className="hover:text-[#7C3AED] transition-colors block">🔍 Discover Resources</a></li>
                <li><a href="/domains" className="hover:text-[#7C3AED] transition-colors block">📚 Explore Domains</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
