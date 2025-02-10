'use client';

import { FilterBarProps } from '@/types/recipe';

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-row gap-2 w-full">
      <select 
        className="w-1/2 px-3 pr-8 py-4 border-2 border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900 text-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
        onChange={(e) => onFilterChange?.({ difficulty: e.target.value as 'easy' | 'medium' | 'hard' | undefined })}
      >
        <option value="">Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      
      <select 
        className="w-1/2 px-3 pr-8 py-4 border-2 border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900 text-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
        onChange={(e) => onFilterChange?.({ category: e.target.value })}
      >
        <option value="">Category</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Main Course">Main Course</option>
        <option value="Dessert">Dessert</option>
        <option value="Vegetarian">Vegetarian</option>
      </select>
    </div>
  );
} 