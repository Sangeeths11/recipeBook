import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import { useState } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: string) => void;
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    setShowConfirm(true);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    setIsDeleting(true);
    await onDelete(recipe._id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    setShowConfirm(false);
  };

  return (
    <div className={`relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isDeleting ? 'scale-95 opacity-0' : ''}`}>
      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Link
          href={`/recipes/${recipe._id}/edit`}
          className="p-2 rounded-full bg-white/80 hover:bg-primary-50 text-primary-500 hover:text-primary-600 transition-colors duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={handleDeleteClick}
          className="p-2 rounded-full bg-white/80 hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Delete confirmation overlay */}
      {showConfirm && (
        <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center gap-4 p-4">
          <p className="text-gray-800 font-medium text-center">Are you sure you want to delete "{recipe.title}"?</p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Yes, Delete
            </button>
            <button
              onClick={handleCancelDelete}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Link href={`/recipes/${recipe._id}`} className="block">
        <div className="relative">
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
          
          {/* Categories */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
            {recipe.categories.map((category) => (
              <span
                key={typeof category === 'string' ? category : category._id}
                className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-medium rounded-full shadow-sm border border-primary-100"
              >
                {typeof category === 'string' ? category : category.name}
              </span>
            ))}
          </div>
        </div>

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
      </Link>
    </div>
  );
} 