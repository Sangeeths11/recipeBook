import { Suspense } from 'react';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import Loading from '@/components/Loading';
import { getRecipes } from '@/lib/recipes';
import { Recipe } from '@/types/recipe';

export default async function Home() {
  const recipes = await getRecipes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-700 mb-4">
            Discover Delicious Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your next culinary inspiration from our collection of handpicked recipes
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-4/5">
              <SearchBar />
            </div>
            <div className="w-full sm:w-1/5">
              <FilterBar />
            </div>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe: Recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
