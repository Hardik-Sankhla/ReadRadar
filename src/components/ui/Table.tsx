import React, { useState } from 'react';
import type { Book } from '../../types';
import { Badge } from './Badge';
import { Tag } from './Tag';

interface Props {
  data: Book[];
}

export function ResourceTable({ data }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
    <div className="data-table-container">
      <table className="data-table font-mono text-[13px] w-full">
        <thead>
          <tr>
            <th className="w-10"></th>
            <th>Title</th>
            <th>Type</th>
            <th>Domains</th>
            <th>Score</th>
            <th>Trend</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {data.map(entity => (
            <React.Fragment key={entity.id}>
              <tr className="cursor-pointer group hover:bg-[#262626]" onClick={() => toggleRow(entity.id)}>
                <td className="text-center font-bold text-[#7C3AED]">
                  {expandedRows.has(entity.id) ? '-' : '+'}
                </td>
                <td className="font-bold text-white group-hover:text-[#7C3AED] transition-colors">{entity.title}</td>
                <td>{entity.type}</td>
                <td>
                  <div className="flex gap-1 flex-wrap">
                    {entity.domains.map(d => <Badge key={d}>{d}</Badge>)}
                  </div>
                </td>
                <td className="font-bold text-[#10B981]">{entity.score.toFixed(1)}</td>
                <td className="text-[#06B6D4]">{entity.trend_score.toFixed(1)}</td>
                <td>
                  <a href={entity.official_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" onClick={(e) => e.stopPropagation()}>
                    Link ↗
                  </a>
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
                              <dd className="text-gray-300">{entity.publisher}</dd>
                            </div>
                          )}
                          <div>
                            <dt className="text-gray-500 font-heading text-xs uppercase mb-1">Added</dt>
                            <dd className="text-gray-400 font-mono text-xs">{new Date(entity.date_added).toLocaleDateString()}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          
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
  );
}
