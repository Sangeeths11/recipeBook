import { Category } from '@/types/recipe';
import { useState } from 'react';

interface CategoryCardProps {
  category: Category;
  onDelete: (id: string) => void;
}

export default function CategoryCard({ category, onDelete }: CategoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    await onDelete(category._id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div className={`relative p-4 border rounded-lg hover:shadow-md transition-shadow group ${isDeleting ? 'scale-95 opacity-0' : ''}`}>
      <h3 className="font-semibold text-gray-900">{category.name}</h3>
      <p className="text-gray-600 text-sm">{category.description}</p>
      
      {/* Delete Button */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="absolute inset-0 bg-white/95 rounded-lg flex flex-col items-center justify-center space-y-2 p-2">
          <p className="text-xs text-gray-600 text-center">
            Delete "{category.name}"?
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? '...' : 'Delete'}
            </button>
            <button
              onClick={handleCancelDelete}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 