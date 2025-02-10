import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe._id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
        {recipe.imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-primary-50 flex items-center justify-center">
            <span className="text-primary-400">No image available</span>
          </div>
        )}
        <div className="p-6">
          <h3 className="font-semibold text-xl text-primary-700 mb-3">{recipe.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {recipe.description}
          </p>
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
                recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}`}>
              {recipe.difficulty}
            </span>
            <div className="flex items-center text-primary-600">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{recipe.preparationTime} min</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 