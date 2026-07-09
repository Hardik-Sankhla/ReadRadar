import React, { useState, useMemo } from 'react';
import type { Entity, EntityType } from '../types';
import { EmptyState } from './ui/EmptyState';

interface Props {
  entities: Entity[];
}

const ALL_DOMAINS = [
  "AI Engineering",
  "Agentic AI",
  "LLMs",
  "MLOps",
  "System Design",
  "Math",
  "Startups"
];

export default function IntelligenceFeed({ entities }: Props) {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filter and sort entities
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchesSearch = entity.title.toLowerCase().includes(search.toLowerCase()) || 
                            entity.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesDomain = selectedDomain === "All" || entity.domains.includes(selectedDomain);
      return matchesSearch && matchesDomain;
    }).sort((a, b) => b.score - a.score);
  }, [entities, search, selectedDomain]);

  // Trending entities
  const trendingEntities = useMemo(() => {
    return [...entities].sort((a, b) => b.trend_score - a.trend_score).slice(0, 3);
  }, [entities]);

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  return (
    <div className="space-y-16">
      
      {/* Trending Section */}
      <section id="trending">
        <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                <span className="w-10 h-10 bg-white text-black flex items-center justify-center font-heading font-bold text-xl border-2 border-border shadow-neo-purple">#</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase">Trending Intelligence</h2>
            </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingEntities.map((entity, i) => (
            <a key={entity.id} href={entity.official_url} target="_blank" rel="noopener noreferrer" className="neo-card p-6 block">
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-sm text-primary">Trend: {entity.trend_score}</span>
                <span className="bg-background px-2 py-1 text-xs border border-border text-gray-300">{entity.type}</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">{entity.title}</h3>
              <p className="text-sm text-gray-300 line-clamp-2">{entity.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Main Feed Section */}
      <section id="feed">
        <header className="mb-10">
            <div className="flex items-center gap-4 mb-4">
                <span className="w-10 h-10 bg-white text-black flex items-center justify-center font-heading font-bold text-xl border-2 border-border shadow-neo-purple">D</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase">Intelligence Database</h2>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <input 
                type="text" 
                placeholder="Search resources or tags..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-muted border-2 border-border p-3 text-white focus:outline-none focus:border-primary w-full md:w-96 font-mono text-sm"
              />
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  onClick={() => setSelectedDomain("All")}
                  className={`px-4 py-2 border-2 text-sm font-mono whitespace-nowrap ${selectedDomain === "All" ? 'bg-primary border-primary text-white font-bold' : 'bg-muted border-border text-gray-300 hover:text-white'}`}
                >
                  All
                </button>
                {ALL_DOMAINS.map(domain => (
                  <button 
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                    className={`px-4 py-2 border-2 text-sm font-mono whitespace-nowrap ${selectedDomain === domain ? 'bg-primary border-primary text-white font-bold' : 'bg-muted border-border text-gray-300 hover:text-white'}`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>
        </header>

        <div className="data-table-container w-full overflow-x-auto border border-[#262626] rounded-sm">
            <table className="data-table font-mono text-[13px] w-full min-w-max table-auto">
                <thead>
                    <tr>
                        <th className="w-10 whitespace-nowrap"></th>
                        <th className="whitespace-nowrap pr-8">Title</th>
                        <th className="hidden md:table-cell whitespace-nowrap pr-8">Type</th>
                        <th className="hidden lg:table-cell whitespace-nowrap pr-8">Domains</th>
                        <th className="whitespace-nowrap pr-8">Score</th>
                        <th className="hidden sm:table-cell whitespace-nowrap pr-8">Trend</th>
                        <th className="whitespace-nowrap">Source</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                  {filteredEntities.map(entity => (
                    <React.Fragment key={entity.id}>
                      <tr className="cursor-pointer group" onClick={() => toggleRow(entity.id)}>
                        <td className="text-center font-bold text-primary">
                          {expandedRows.has(entity.id) ? '-' : '+'}
                        </td>
                        <td className="font-bold text-white group-hover:text-primary transition-colors whitespace-nowrap pr-8">{entity.title}</td>
                        <td className="hidden md:table-cell">{entity.type}</td>
                        <td className="hidden lg:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {entity.domains.map(d => <span key={d} className="px-1.5 py-0.5 bg-border/50 text-gray-300 text-[10px] uppercase border border-border">{d}</span>)}
                          </div>
                        </td>
                        <td className="w-auto whitespace-nowrap font-bold text-success">{entity.score.toFixed(1)}</td>
                        <td className="hidden sm:table-cell w-auto whitespace-nowrap text-secondary">{entity.trend_score.toFixed(1)}</td>
                        <td className="w-auto whitespace-nowrap"><a href={entity.official_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" onClick={(e) => e.stopPropagation()}>Link ↗</a></td>
                      </tr>
                      
                      {expandedRows.has(entity.id) && (
                        <tr className="bg-[#1a1a1a]">
                          <td colSpan={7} className="p-6 border-b border-border">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-body text-sm">
                              <div className="col-span-1 md:col-span-3">
                                <h4 className="text-white font-bold mb-2 uppercase tracking-wide font-heading text-xs text-gray-400">Description</h4>
                                <p className="text-gray-300 leading-relaxed">{entity.description}</p>
                                
                                <div className="mt-4 flex gap-2 flex-wrap">
                                  {entity.tags.map(t => (
                                    <span key={t} className="text-[#8B5CF6] font-mono text-xs before:content-['#']">{t}</span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="neo-card p-4 h-fit border-border">
                                <dl className="space-y-3">
                                  <div>
                                    <dt className="text-gray-400 font-heading text-xs uppercase mb-1">Author / Org</dt>
                                    <dd className="text-white font-medium">{entity.author}</dd>
                                  </div>
                                  {entity.publisher && (
                                    <div>
                                      <dt className="text-gray-400 font-heading text-xs uppercase mb-1">Publisher</dt>
                                      <dd className="text-gray-300">{entity.publisher}</dd>
                                    </div>
                                  )}
                                  <div>
                                    <dt className="text-gray-400 font-heading text-xs uppercase mb-1">Added</dt>
                                    <dd className="text-gray-300 font-mono text-xs">{new Date(entity.date_added).toLocaleDateString()}</dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {filteredEntities.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-0 border-none">
                        <EmptyState />
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
        </div>
      </section>

      {/* Community Suggestions */}
      <section id="suggest" className="callout-box">
        <h4 className="font-heading font-bold text-white text-xl uppercase mb-3">Community Submissions</h4>
        <p className="text-sm text-gray-300 mb-4">Have an intelligence resource to add? Submit it via our Telegram bot. Approved resources are automatically processed by the Agent Layer and added to this dashboard.</p>
        <button className="bg-gradient-to-r from-primary to-[#5B21B6] text-white font-bold font-heading px-6 py-2 uppercase hover:shadow-[2px_2px_0px_0px_#FFFFFF] transition-all border-2 border-transparent hover:border-white">
          Submit Resource ↗
        </button>
      </section>
      
    </div>
  );
}
