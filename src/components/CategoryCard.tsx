import { Category } from '@/types/recipe';
import { useState } from 'react';

interface CategoryCardProps {
  category: Category;
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: (id: string, data: { name: string; description: string }) => Promise<void>;
}

export default function CategoryCard({ category, onDelete, onUpdate }: CategoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: category.name,
    description: category.description
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    
    try {
      const success = await onDelete(category._id);
      if (!success) {
        setIsDeleting(false);
      }
    } catch (error) {
      setIsDeleting(false);
    }
    setShowConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpdating(true);
    try {
      await onUpdate(category._id, editData);
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: category.name,
      description: category.description
    });
    setIsEditing(false);
  };

  return (
    <div className={`relative p-4 border rounded-lg hover:shadow-md transition-shadow group ${isDeleting ? 'scale-95 opacity-0' : ''}`}>
      {!isEditing ? (
        <>
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
          <p className="text-gray-800 text-sm">{category.description}</p>
          
          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              className="p-1.5 rounded-full text-gray-400 hover:text-primary-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full p-1 text-sm border rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
            placeholder="Category name"
          />
          <input
            type="text"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full p-1 text-sm border rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
            placeholder="Description"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {isUpdating ? '...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showConfirm && (
        <div className="absolute inset-0 bg-white/95 rounded-lg flex flex-col items-center justify-center space-y-2 p-2">
          <p className="text-xs text-gray-900 text-center">
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
              className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 