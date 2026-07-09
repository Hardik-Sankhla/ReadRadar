import React from 'react';

export function SkeletonTable() {
  return (
    <div className="w-full overflow-x-auto border-2 border-border bg-muted mb-12 animate-pulse">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr>
            <th className="p-4 border-b border-r border-border bg-background w-12"></th>
            <th className="p-4 border-b border-r border-border bg-background">
              <div className="h-4 bg-border rounded w-32"></div>
            </th>
            <th className="hidden md:table-cell p-4 border-b border-r border-border bg-background w-24">
              <div className="h-4 bg-border rounded w-16"></div>
            </th>
            <th className="hidden lg:table-cell p-4 border-b border-border bg-background w-64">
              <div className="h-4 bg-border rounded w-48"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-border">
              <td className="p-4 border-r border-border text-center">
                <div className="h-4 w-4 bg-border rounded mx-auto"></div>
              </td>
              <td className="p-4 border-r border-border">
                <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#262626] rounded w-1/2"></div>
              </td>
              <td className="hidden md:table-cell p-4 border-r border-border">
                <div className="h-6 bg-border rounded w-16"></div>
              </td>
              <td className="hidden lg:table-cell p-4">
                <div className="flex gap-2 mb-2">
                  <div className="h-6 bg-[#262626] rounded w-12"></div>
                  <div className="h-6 bg-[#262626] rounded w-16"></div>
                </div>
                <div className="h-3 bg-[#262626] rounded w-full max-w-[200px]"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
