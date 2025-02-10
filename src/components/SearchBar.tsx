'use client';

import { SearchBarProps } from '@/types/recipe';

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Search recipes..."
          className="w-full pl-12 pr-4 py-4 border-2 border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900 placeholder-gray-500"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </div>
  );
} 