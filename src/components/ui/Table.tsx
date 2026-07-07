import React, { useState, useMemo } from 'react';
import type { Book } from '../../types';
import { Badge } from './Badge';
import { Tag } from './Tag';
import { SkeletonTable } from './SkeletonTable';

interface Props {
  data: Book[];
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

  return (
    <div className="flex flex-col">
      <div className="data-table-container mb-4">
        <table className="data-table font-mono text-[13px] w-full" style={{ tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th className="w-10"></th>
              <th 
                className="cursor-pointer hover:text-[#7C3AED] select-none transition-colors"
                style={{ resize: 'horizontal', overflow: 'hidden', minWidth: '150px' }}
                onClick={() => handleSort('title')}
              >
                Title <SortIcon field="title" />
              </th>
              <th 
                className="cursor-pointer hover:text-[#7C3AED] select-none transition-colors"
                style={{ resize: 'horizontal', overflow: 'hidden' }}
                onClick={() => handleSort('type')}
              >
                Type <SortIcon field="type" />
              </th>
              <th style={{ resize: 'horizontal', overflow: 'hidden' }}>Domains</th>
              <th 
                className="cursor-pointer hover:text-[#7C3AED] select-none transition-colors"
                onClick={() => handleSort('score')}
              >
                Score <SortIcon field="score" />
              </th>
              <th 
                className="cursor-pointer hover:text-[#7C3AED] select-none transition-colors"
                onClick={() => handleSort('trend_score')}
              >
                Trend <SortIcon field="trend_score" />
              </th>
              <th>Source</th>
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
                    <td className="font-bold text-white transition-colors relative">
                      <div className="flex items-center gap-2 group-hover:text-[#7C3AED] flex-wrap">
                        {entity.title}
                        {isFoundational && <span className="px-1.5 py-0.5 bg-[#E11D48]/20 text-[#E11D48] text-[10px] border border-[#E11D48]/50 uppercase tracking-wider font-bold">Classic</span>}
                        {!isFoundational && isNew && <span className="px-1.5 py-0.5 bg-[#10B981]/20 text-[#10B981] text-[10px] border border-[#10B981]/50 uppercase tracking-wider font-bold">New</span>}
                        {!isFoundational && !isNew && isTrending && <span className="px-1.5 py-0.5 bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] border border-[#F59E0B]/50 uppercase tracking-wider font-bold">Trending</span>}
                      </div>
                    </td>
                    <td>{entity.type}</td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {entity.domains.map(d => <Badge key={d}>{d}</Badge>)}
                      </div>
                    </td>
                    <td className="font-bold text-[#10B981]">{entity.score.toFixed(1)}</td>
                    <td className="text-[#06B6D4]">{entity.trend_score.toFixed(1)}</td>
                    <td>
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
                      <td colSpan={7} className="p-6 border-b border-[#333333]">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-body text-sm">
                          <div className="col-span-3">
                            <h4 className="font-bold mb-2 uppercase tracking-wide font-heading text-xs text-gray-500">Description</h4>
                            <p className="text-gray-300 leading-relaxed">{entity.description}</p>
                            
                            <div className="mt-4 flex gap-2 flex-wrap">
                              {entity.tags.map(t => (
                                <Tag key={t}>{t}</Tag>
                              ))}
                            </div>
                          </div>
                          
                          <div className="neo-card p-4 h-fit border-[#333333]">
                            <dl className="space-y-3">
                              {entity.publisher && (
                                <div>
                                  <dt className="text-gray-500 font-heading text-xs uppercase mb-1">Publisher</dt>
                                  <dd className="text-gray-300 flex items-center gap-2">{entity.publisher} <span className="text-[#10B981] font-bold">✓</span></dd>
                                </div>
                              )}
                              <div>
                                <dt className="text-gray-500 font-heading text-xs uppercase mb-1">Updated</dt>
                                <dd className="text-gray-400 font-mono text-xs flex items-center gap-2">{new Date(entity.date_added).toLocaleDateString()} <span className="text-[#10B981] font-bold">✓</span></dd>
                              </div>
                            </dl>
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
