import React, { useState, useMemo, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { DomainFilter } from './DomainFilter';
import { ResourceTable } from './Table';
import type { Book, Domain } from '../../types';

interface Props {
  books: Book[];
  domains: Domain[];
}

export default function DiscoverApp({ books, domains }: Props) {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");

  useEffect(() => {
    // Parse URL for initial domain
    const params = new URLSearchParams(window.location.search);
    const domainQuery = params.get('domain');
    const qQuery = params.get('q');
    
    if (domainQuery) setSelectedDomain(domainQuery);
    if (qQuery) setSearch(qQuery);
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                            book.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
                            book.authorId.toLowerCase().includes(search.toLowerCase()); // in reality we'd resolve author name
      const matchesDomain = selectedDomain === "All" || book.domains.includes(selectedDomain);
      return matchesSearch && matchesDomain;
    }).sort((a, b) => b.score - a.score);
  }, [books, search, selectedDomain]);

  const domainNames = domains.map(d => d.name);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search resources, tags, authors..." />
        <DomainFilter domains={domainNames} selectedDomain={selectedDomain} onSelect={setSelectedDomain} />
      </div>
      
      <div className="bg-[#171717] border-2 border-[#333333] p-4 flex justify-between items-center">
        <span className="font-mono text-gray-400 text-sm">Showing {filteredBooks.length} results</span>
      </div>

      <ResourceTable data={filteredBooks} />
    </div>
  );
}
