'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchNodes = useStore((s) => s.searchNodes);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        const res = await searchNodes(query);
        setResults(res);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchNodes]);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10] w-[400px]">
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-full border shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
          placeholder="Semantic Search (e.g., 'productivity')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isSearching && (
          <div className="absolute right-4 top-2 text-xs text-gray-400">Searching...</div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-xl border overflow-hidden max-h-[300px] overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-0 text-black"
            >
              <div className="font-bold text-sm">{result.label}</div>
              <div className="text-xs text-gray-500 truncate">{result.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
