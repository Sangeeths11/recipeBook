'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types/recipe';
import CategoryCard from '@/components/CategoryCard';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchCategories = async () => {
    setError(null);
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.error || 'Failed to fetch categories');
      }
    } catch (error) {
      setError('Error connecting to the server');
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      if (data.success) {
        setSuccess('Category created successfully!');
        setNewCategory({ name: '', description: '' });
        fetchCategories();
      } else {
        setError(data.error || 'Failed to create category');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating category');
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to delete category');
        return;
      }

      setSuccess('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      setError('Error deleting category');
      console.error('Error deleting category:', error);
    }
  };

  const handleUpdateCategory = async (id: string, data: { name: string; description: string }) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        setError(responseData.error || 'Failed to update category');
        return;
      }

      setSuccess('Category updated successfully!');
      fetchCategories();
    } catch (error) {
      setError('Error updating category');
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">Manage Categories</h1>
          <Link
            href="/"
            className="px-6 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 transition-opacity duration-500">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 transition-opacity duration-500">
            <p className="font-medium">Success</p>
            <p>{success}</p>
          </div>
        )}

        {/* Add New Category Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-primary-700 mb-4">Add New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Description
              </label>
              <input
                type="text"
                required
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            Add Category
          </button>
        </form>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-primary-700 mb-4">Existing Categories</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No categories found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onDelete={handleDeleteCategory}
                  onUpdate={handleUpdateCategory}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 