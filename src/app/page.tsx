'use client';

import { Suspense, useState, useEffect } from 'react';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import Loading from '@/components/Loading';
import { Recipe } from '@/types/recipe';
import Link from 'next/link';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: undefined as 'easy' | 'medium' | 'hard' | undefined,
    category: ''
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filters.difficulty) params.append('difficulty', filters.difficulty);
        if (filters.category) params.append('category', filters.category);

        const response = await fetch(`/api/recipes?${params.toString()}`);
        const data = await response.json();
        if (data.success) {
          setRecipes(data.data);
          setFilteredRecipes(data.data);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    // Debounce the fetch to avoid too many requests
    const timeoutId = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete recipe');

      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.category) params.append('category', filters.category);

      // Fetch updated recipes
      const recipesResponse = await fetch(`/api/recipes?${params.toString()}`);
      const data = await recipesResponse.json();
      if (data.success) {
        setRecipes(data.data);
        setFilteredRecipes(data.data);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-700 mb-4">
            Discover Delicious Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Find your next culinary inspiration from our collection of handpicked recipes
          </p>
          
          <Link 
            href="/recipes/create" 
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="absolute -inset-full group-hover:inset-0 bg-gradient-to-r from-primary-400 to-primary-600 transform rotate-180 group-hover:rotate-0 transition-all duration-500" />
            <span className="relative flex items-center gap-2">
              <svg className="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Create Your Recipe</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-4/5">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="w-full sm:w-1/5">
              <FilterBar onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredRecipes.map((recipe: Recipe) => (
                <RecipeCard 
                  key={recipe._id} 
                  recipe={recipe} 
                  onDelete={handleDeleteRecipe}
                />
              ))
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
