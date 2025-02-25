'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ingredient } from '@/types/recipe';
import IngredientCard from '@/components/IngredientCard';

export default function ManageIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    defaultUnit: 'g',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchIngredients();
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

  const fetchIngredients = async () => {
    setError(null);
    try {
      const response = await fetch('/api/ingredients');
      const data = await response.json();
      if (data.success) {
        setIngredients(data.data);
      } else {
        setError(data.error || 'Failed to fetch ingredients');
      }
    } catch (error) {
      setError('Error connecting to the server');
      console.error('Error fetching ingredients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIngredient),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create ingredient');
      }

      if (data.success) {
        setSuccess('Ingredient created successfully!');
        setNewIngredient({ name: '', defaultUnit: 'g', description: '' });
        fetchIngredients();
      } else {
        setError(data.error || 'Failed to create ingredient');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating ingredient');
      console.error('Error creating ingredient:', error);
    }
  };

  const handleDeleteIngredient = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to delete ingredient');
        return false;
      }

      setSuccess('Ingredient deleted successfully!');
      fetchIngredients();
      return true;
    } catch (error) {
      setError('Error deleting ingredient');
      console.error('Error deleting ingredient:', error);
      return false;
    }
  };

  const handleUpdateIngredient = async (id: string, data: { name: string; defaultUnit: string; description: string }) => {
    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        setError(responseData.error || 'Failed to update ingredient');
        return;
      }

      setSuccess('Ingredient updated successfully!');
      fetchIngredients();
    } catch (error) {
      setError('Error updating ingredient');
      console.error('Error updating ingredient:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-700">Manage Ingredients</h1>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p className="font-medium">Success</p>
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-8">
          <h2 className="text-xl font-semibold text-primary-700 mb-4">Add New Ingredient</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Ingredient Name
              </label>
              <input
                type="text"
                required
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Default Unit
              </label>
              <select
                required
                value={newIngredient.defaultUnit}
                onChange={(e) => setNewIngredient({ ...newIngredient, defaultUnit: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              >
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="l">Liters (l)</option>
                <option value="piece">Pieces</option>
                <option value="tbsp">Tablespoon</option>
                <option value="tsp">Teaspoon</option>
                <option value="cup">Cup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newIngredient.description}
                onChange={(e) => setNewIngredient({ ...newIngredient, description: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors w-full sm:w-auto"
          >
            Add Ingredient
          </button>
        </form>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-primary-700 mb-4">Existing Ingredients</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : ingredients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No ingredients found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ingredients.map((ingredient) => (
                <IngredientCard
                  key={ingredient._id}
                  ingredient={ingredient}
                  onDelete={handleDeleteIngredient}
                  onUpdate={handleUpdateIngredient}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 