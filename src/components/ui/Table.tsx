import React, { useState, useMemo } from 'react';
import type { Resource } from '../../types';
import { Badge } from './Badge';
import { Tag } from './Tag';
import { SkeletonTable } from './SkeletonTable';

interface Props {
  data: Resource[];
  isLoading?: boolean;
}

type SortField = 'title' | 'type' | 'score' | 'trend_score';
type SortOrder = 'asc' | 'desc';

export function ResourceTable({ data, isLoading = false }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('trend_score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const copyToClipboard = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [data, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <SkeletonTable />;
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="opacity-30 inline-block ml-1">↕</span>;
    return <span className="inline-block ml-1 text-[#7C3AED]">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  const renderKnowledgeDNA = (dna: Record<string, number> | undefined) => {
    if (!dna) return null;
    return (
      <div className="mt-2 font-mono text-xs">
        {Object.entries(dna).map(([topic, score]) => (
          <div key={topic} className="flex items-center mb-1">
            <span className="w-24 text-gray-500">{topic}</span>
            <span className="text-[#7C3AED] tracking-widest">
              {'█'.repeat(score)}{'░'.repeat(10 - score)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="data-table-container mb-4 w-full overflow-x-auto border border-[#262626] rounded-sm">
        <table className="data-table font-mono text-[13px] w-full table-fixed">
          <thead>
            <tr>
              <th className="w-10 whitespace-nowrap"></th>
              <th 
                className="w-full cursor-pointer hover:text-[#7C3AED] select-none transition-colors"
                style={{ resize: 'horizontal', overflow: 'hidden' }}
                onClick={() => handleSort('title')}
              >
                Title <SortIcon field="title" />
              </th>
              <th 
                className="hidden md:table-cell w-24 cursor-pointer hover:text-[#7C3AED] select-none transition-colors"
                style={{ resize: 'horizontal', overflow: 'hidden' }}
                onClick={() => handleSort('type')}
              >
                Type <SortIcon field="type" />
              </th>
              <th className="hidden lg:table-cell w-48" style={{ resize: 'horizontal', overflow: 'hidden' }}>Domains</th>
              <th 
                className="w-auto whitespace-nowrap cursor-pointer hover:text-[#7C3AED] select-none transition-colors"
                onClick={() => handleSort('score')}
              >
                Score <SortIcon field="score" />
              </th>
              <th 
                className="hidden sm:table-cell w-auto whitespace-nowrap cursor-pointer hover:text-[#7C3AED] select-none transition-colors"
                onClick={() => handleSort('trend_score')}
              >
                Trend <SortIcon field="trend_score" />
              </th>
              <th className="w-auto whitespace-nowrap">Source</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {paginatedData.map(entity => {
              const isNew = new Date(entity.date_added).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
              const isTrending = entity.trend_score > 90;
              const isFoundational = entity.score >= 9.8;

              return (
                <React.Fragment key={entity.id}>
                  <tr className="cursor-pointer group hover:bg-[#262626]" onClick={() => toggleRow(entity.id)}>
                    <td className="text-center font-bold text-[#7C3AED]">
                      {expandedRows.has(entity.id) ? '-' : '+'}
                    </td>
                    <td className="font-bold text-white transition-colors relative whitespace-normal min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a href={`${import.meta.env.BASE_URL}/resource/${entity.id}`.replace(/\/\/+/g, '/')} onClick={(e) => e.stopPropagation()} className="hover:text-[#7C3AED] hover:underline transition-colors">
                          {entity.title}
                        </a>
                        {isFoundational && <span className="px-1.5 py-0.5 bg-[#E11D48]/20 text-[#E11D48] text-[10px] border border-[#E11D48]/50 uppercase tracking-wider font-bold">Classic</span>}
                        {!isFoundational && isNew && <span className="px-1.5 py-0.5 bg-[#10B981]/20 text-[#10B981] text-[10px] border border-[#10B981]/50 uppercase tracking-wider font-bold">New</span>}
                        {!isFoundational && !isNew && isTrending && <span className="px-1.5 py-0.5 bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] border border-[#F59E0B]/50 uppercase tracking-wider font-bold">Trending</span>}
                      </div>
                    </td>
                    <td className="hidden md:table-cell">{entity.type}</td>
                    <td className="hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {entity.domains.map(d => <Badge key={d}>{d}</Badge>)}
                      </div>
                    </td>
                    <td className="w-auto whitespace-nowrap font-bold text-[#10B981]">{entity.score.toFixed(1)}</td>
                    <td className="hidden sm:table-cell w-auto whitespace-nowrap text-[#06B6D4]">{entity.trend_score.toFixed(1)}</td>
                    <td className="w-auto whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <a href={entity.official_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" onClick={(e) => e.stopPropagation()}>
                          Link ↗
                        </a>
                        <button 
                          onClick={(e) => copyToClipboard(entity.official_url, e)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-all"
                          title="Copy Link"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedRows.has(entity.id) && (
                  <tr className="bg-[#1a1a1a]">
                      <td colSpan={7} className="p-6 border-b border-[#333333] expanded-panel">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 font-body text-sm overflow-hidden">
                          
                          {/* Left Column: Description & ROI */}
                          <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
                            <div>
                              <h4 className="font-bold mb-2 uppercase tracking-wide font-heading text-xs text-[#7C3AED]">Why Read This</h4>
                              <p className="text-gray-300 leading-relaxed text-xs">{entity.description}</p>
                            </div>

                            {entity.learning_outcomes && entity.learning_outcomes.length > 0 && (
                              <div>
                                <h4 className="font-bold mb-2 uppercase tracking-wide font-heading text-xs text-[#7C3AED]">Learning Outcomes</h4>
                                <ul className="space-y-1 text-xs text-gray-300">
                                  {entity.learning_outcomes.map((outcome, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-[#10B981] mt-0.5">✓</span>
                                      {outcome}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex gap-4">
                              <div className="neo-card p-3 flex-1 bg-[#171717] border-[#333333]">
                                <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Difficulty</div>
                                <div className="font-bold text-white text-sm">{entity.difficulty || "Unknown"}</div>
                              </div>
                              <div className="neo-card p-3 flex-1 bg-[#171717] border-[#333333]">
                                <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Time Req</div>
                                <div className="font-bold text-white text-sm">{entity.estimated_hours ? `${entity.estimated_hours} hours` : "Unknown"}</div>
                              </div>
                            </div>
                          </div>

                          {/* Middle Column: Knowledge DNA & Prerequisites */}
                          <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
                            <div>
                              <h4 className="font-bold mb-2 uppercase tracking-wide font-heading text-xs text-gray-400">Knowledge DNA</h4>
                              {renderKnowledgeDNA(entity.knowledge_dna)}
                            </div>

                            {entity.prerequisites && entity.prerequisites.length > 0 && (
                              <div>
                                <h4 className="font-bold mb-2 uppercase tracking-wide font-heading text-xs text-gray-400">Prerequisites</h4>
                                <ul className="space-y-1 text-xs text-gray-400 font-mono">
                                  {entity.prerequisites.map((prereq, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 bg-[#333333] rounded-full"></span>
                                      {prereq}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {entity.skip_if && entity.skip_if.length > 0 && (
                              <div className="bg-[#E11D48]/10 border border-[#E11D48]/30 p-3 rounded-sm">
                                <h4 className="font-bold mb-1 uppercase tracking-wide font-heading text-[10px] text-[#E11D48]">Skip This If...</h4>
                                <ul className="text-xs text-gray-300 list-disc list-inside">
                                  {entity.skip_if.map((reason, idx) => (
                                    <li key={idx}>{reason}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          {/* Right Column: Trust Indicators & Metadata */}
                          <div className="col-span-1 md:col-span-4">
                            <div className="neo-card p-4 border-[#333333] h-full flex flex-col justify-between">
                              <dl className="space-y-4">
                                <div>
                                  <dt className="text-gray-500 font-heading text-[10px] uppercase mb-1 tracking-wider">Verification Status</dt>
                                  <dd className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-mono">
                                      <span className="text-gray-400">Official Source</span>
                                      <span className={entity.verification?.official ? "text-[#10B981] font-bold" : "text-gray-500"}>
                                        {entity.verification?.official ? "Yes ✓" : "No"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-mono">
                                      <span className="text-gray-400">Agent Confidence</span>
                                      <span className="text-white font-bold">{entity.verification?.agent_confidence || 0}%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-mono">
                                      <span className="text-gray-400">Community Score</span>
                                      <span className="text-[#F59E0B] font-bold">★ {entity.verification?.community_score || "N/A"}</span>
                                    </div>
                                  </dd>
                                </div>
                                
                                <div className="h-[1px] bg-[#333333] w-full"></div>

                                <div>
                                  <dt className="text-gray-500 font-heading text-[10px] uppercase mb-1 tracking-wider">Metadata</dt>
                                  <dd className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-mono">
                                      <span className="text-gray-500">Publisher</span>
                                      <span className="text-gray-300">{entity.publisher || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono">
                                      <span className="text-gray-500">Last Verified</span>
                                      <span className="text-gray-300">{entity.metadata?.last_verified ? new Date(entity.metadata.last_verified).toLocaleDateString() : "Unknown"}</span>
                                    </div>
                                    {entity.metadata?.edition && (
                                      <div className="flex justify-between text-[10px] font-mono">
                                        <span className="text-gray-500">Edition</span>
                                        <span className="text-gray-300">{entity.metadata.edition}</span>
                                      </div>
                                    )}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500 font-body">
                  No resources found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center font-mono text-sm">
          <div className="text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
          </div>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 border-2 border-[#333333] bg-[#171717] hover:bg-[#333333] disabled:opacity-50 transition-colors"
            >
              Prev
            </button>
            <div className="flex items-center px-4 font-bold">
              {currentPage} / {totalPages}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-4 py-2 border-2 border-[#333333] bg-[#171717] hover:bg-[#333333] disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
