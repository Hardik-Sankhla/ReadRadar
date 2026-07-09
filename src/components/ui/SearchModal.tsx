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
        className="w-full max-w-2xl bg-muted border-2 border-border shadow-neo-purple flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center border-b-2 border-border p-4">
          <svg className="w-6 h-6 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            autoFocus
            placeholder="Search resources, tags, authors... (Esc to close)" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-grow bg-transparent text-white font-mono text-lg focus:outline-none placeholder-gray-500"
          />
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-border text-xs font-mono text-gray-300 border border-[#444] rounded-sm">ESC</span>
          </div>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query ? (
            <div className="text-center py-12 text-gray-400 font-mono">
              Press Enter to search for "{query}" across the intelligence layer.
              <br/>
              <button 
                onClick={() => {
                  window.location.href = `${import.meta.env.BASE_URL}/discover?q=${encodeURIComponent(query)}`.replace(/\/\/+/g, '/');
                }}
                className="mt-4 px-4 py-2 bg-primary text-white font-bold hover:bg-primary-dark transition-colors border-2 border-transparent"
              >
                Go to Discover →
              </button>
            </div>
          ) : (
            <div className="text-gray-400 font-mono text-sm">
              <p className="mb-2 uppercase text-xs font-bold text-gray-300">Quick Links</p>
              <ul className="space-y-2">
                <li><a href={`${import.meta.env.BASE_URL}/trending`.replace(/\/\/+/g, '/')} className="hover:text-primary transition-colors block">🔥 Trending Intelligence</a></li>
                <li><a href={`${import.meta.env.BASE_URL}/discover`.replace(/\/\/+/g, '/')} className="hover:text-primary transition-colors block">🔍 Discover Resources</a></li>
                <li><a href={`${import.meta.env.BASE_URL}/domains`.replace(/\/\/+/g, '/')} className="hover:text-primary transition-colors block">📚 Explore Domains</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
