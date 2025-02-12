'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Ingredient } from '@/types/recipe';
import Link from 'next/link';

type RecipeIngredient = {
  ingredient: string;
  amount: number;
  unit: string;
};

export default function CreateRecipe() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    preparationTime: '',
    difficulty: '',
    instructions: '',
    categories: [] as string[],
    ingredients: [{ ingredient: '', amount: 0, unit: 'g' }] as RecipeIngredient[],
    image: null as File | null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ingredients
        const ingredientsResponse = await fetch('/api/ingredients');
        const ingredientsData = await ingredientsResponse.json();
        if (ingredientsData.success) {
          setIngredients(ingredientsData.data);
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient: '', amount: 0, unit: 'g' }]
    }));
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create the recipe
      const recipeResponse = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          preparationTime: formData.preparationTime,
          difficulty: formData.difficulty,
          instructions: formData.instructions,
          categories: formData.categories,
          ingredients: formData.ingredients,
        }),
      });

      const recipeData = await recipeResponse.json();
      if (!recipeResponse.ok) throw new Error('Failed to create recipe');

      // If there's an image, upload it
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.image);
        imageFormData.append('recipeId', recipeData.data._id);

        const imageResponse = await fetch('/api/recipes/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageResponse.ok) throw new Error('Failed to upload image');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error creating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">Create New Recipe</h1>
          <Link
            href="/"
            className="px-6 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md text-black"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  className="w-full p-2 border rounded-md text-black"
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full p-2 border rounded-md text-black"
                    value={formData.preparationTime}
                    onChange={e => setFormData({...formData, preparationTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    required
                    className="w-full p-2 border rounded-md text-black"
                    value={formData.difficulty}
                    onChange={e => setFormData({...formData, difficulty: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              categories: [...formData.categories, category._id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              categories: formData.categories.filter(id => id !== category._id)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  required
                  className="w-full p-2 border rounded-md text-black"
                  rows={4}
                  value={formData.instructions}
                  onChange={e => setFormData({...formData, instructions: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Image</label>
                <div className="mt-1 flex items-center">
                  {formData.image ? (
                    <div className="relative w-24 h-24 mr-4">
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: null })}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : null}
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choose Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({ ...formData, image: file });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
              <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      required
                      className="flex-1 p-2 border rounded-md text-black text-sm"
                      value={ingredient.ingredient}
                      onChange={(e) => updateIngredient(index, 'ingredient', e.target.value)}
                    >
                      <option value="">Select ingredient</option>
                      {ingredients.map((ing) => (
                        <option key={ing._id} value={ing._id}>{ing.name}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      required
                      min="0"
                      step="0.1"
                      className="w-16 p-2 border rounded-md text-black text-sm"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value))}
                    />

                    <select
                      required
                      className="w-20 p-2 border rounded-md text-black text-sm"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="piece">pc</option>
                      <option value="tbsp">tbsp</option>
                      <option value="tsp">tsp</option>
                      <option value="cup">cup</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addIngredient}
                className="mt-2 text-primary-600 hover:text-primary-800 text-sm flex items-center gap-1"
              >
                + Add Ingredient
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-primary-600 text-white py-3 px-4 rounded-full hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
} 