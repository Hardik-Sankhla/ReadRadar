import React, { useState, useMemo, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { DomainFilter } from './DomainFilter';
import { ResourceTable } from './Table';
import type { Resource, Domain } from '../../types';

interface Props {
  resources: Resource[];
  domains: Domain[];
  collections?: any[];
  edges?: any[];
}

export default function DiscoverApp({ resources, domains, collections = [], edges = [] }: Props) {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [density, setDensity] = useState<"standard" | "compact" | "spacious">("standard");
  const [showColumns, setShowColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const domainQuery = params.get('domain');
    const qQuery = params.get('q');
    
    if (domainQuery) setSelectedDomain(domainQuery);
    if (qQuery) setSearch(qQuery);

    // Simulate short network delay for skeleton loader
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase()) || 
                            resource.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
                            resource.authorId.toLowerCase().includes(search.toLowerCase());
      const matchesDomain = selectedDomain === "All" || resource.domains.includes(selectedDomain);
      return matchesSearch && matchesDomain;
    });
  }, [resources, search, selectedDomain]);

  const domainNames = domains.map(d => d.name);

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Type", "Score", "Trend Score", "Domains", "Tags", "URL"];
    const rows = filteredResources.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.type,
      r.score,
      r.trend_score,
      `"${r.domains.join(', ')}"`,
      `"${r.tags.join(', ')}"`,
      r.official_url
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "readradar_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Sticky Top Bar */}
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md pt-4 pb-4 border-b-2 border-border -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 shadow-xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search resources, tags, authors..." />
            <DomainFilter domains={domainNames} selectedDomain={selectedDomain} onSelect={setSelectedDomain} />
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-3 bg-muted border-2 border-border p-3">
            <span className="font-mono text-gray-300 text-sm">Showing {filteredResources.length} results</span>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center relative">
              
              {/* Density Selector */}
              <div className="flex bg-background border border-border rounded-sm overflow-hidden">
                <button 
                  onClick={() => setDensity("compact")}
                  className={`px-3 py-1 font-mono text-xs transition-colors ${density === 'compact' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'}`}
                  title="Compact Density"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="14" x2="3" y2="14"></line></svg>
                </button>
                <button 
                  onClick={() => setDensity("standard")}
                  className={`px-3 py-1 font-mono text-xs transition-colors border-l border-border ${density === 'standard' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'}`}
                  title="Standard Density"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="8" x2="3" y2="8"></line><line x1="21" y1="16" x2="3" y2="16"></line></svg>
                </button>
                <button 
                  onClick={() => setDensity("spacious")}
                  className={`px-3 py-1 font-mono text-xs transition-colors border-l border-border ${density === 'spacious' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'}`}
                  title="Spacious Density"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                </button>
              </div>

              {/* Column Visibility */}
              <button 
                onClick={() => setShowColumns(!showColumns)}
                className="px-3 py-1.5 border border-border hover:border-primary hover:text-primary text-gray-300 text-xs font-mono transition-colors flex items-center gap-2"
              >
                Columns 
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>

              {showColumns && (
                <div className="absolute top-10 right-24 bg-muted border-2 border-border p-4 shadow-neo-purple z-50 min-w-[200px]">
                  <h4 className="font-heading font-bold text-white mb-3 uppercase text-xs">Visible Columns</h4>
                  <div className="space-y-2 font-mono text-sm text-gray-300">
                    {['Title', 'Type', 'Domains', 'Score', 'Trend', 'Source'].map(col => (
                      <label key={col} className="flex items-center gap-2 cursor-pointer hover:text-white">
                        <input type="checkbox" defaultChecked className="accent-[var(--color-primary)]" />
                        {col}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Export CSV */}
              <button 
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-border hover:bg-primary text-white font-mono text-xs transition-colors flex items-center gap-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {collections.length > 0 && search === "" && selectedDomain === "All" && (
        <div className="mb-8">
          <h3 className="text-xl font-heading font-bold text-white mb-4 border-l-4 border-primary pl-3">Curated Learning Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(col => {
              const items = col.resources?.length || 0;
              return (
                <a href={`/ReadRadar/collections/${col.id}`} key={col.id} className="neo-card p-4 hover:border-primary transition-colors cursor-pointer group block">
                  <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{col.title}</h4>
                  <p className="text-sm text-gray-300 mt-1">{col.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-mono bg-border px-2 py-1">{items} Resources</span>
                    <span className="text-xs text-primary group-hover:underline">Explore Path &rarr;</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className={`table-density-${density}`}>
        <ResourceTable data={filteredResources} isLoading={isLoading} />
      </div>
    </div>
  );
}
