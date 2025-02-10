'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe, Ingredient } from '@/types/recipe';
import { use } from 'react';

type RecipeIngredient = {
  ingredient: string;
  amount: number;
  unit: string;
};

export default function EditRecipe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    preparationTime: '',
    difficulty: '',
    instructions: '',
    imageUrl: '',
    categories: [] as string[],
    ingredients: [{ ingredient: '', amount: 0, unit: 'g' }] as RecipeIngredient[]
  });

  useEffect(() => {
    const fetchRecipeAndIngredients = async () => {
      try {
        // Fetch recipe data
        const recipeResponse = await fetch(`/api/recipes/${id}`);
        const recipeData = await recipeResponse.json();
        
        if (recipeData.success) {
          const recipe = recipeData.data;
          setFormData({
            title: recipe.title,
            description: recipe.description,
            preparationTime: recipe.preparationTime.toString(),
            difficulty: recipe.difficulty,
            instructions: recipe.instructions,
            imageUrl: recipe.imageUrl || '',
            categories: recipe.categories.map((cat: any) => 
              typeof cat === 'string' ? cat : cat._id
            ),
            ingredients: recipe.ingredients.map((ing: any) => ({
              ingredient: typeof ing.ingredient === 'string' ? 
                ing.ingredient : ing.ingredient._id,
              amount: ing.amount,
              unit: ing.unit
            }))
          });
        }

        // Fetch ingredients
        const ingredientsResponse = await fetch('/api/ingredients');
        const ingredientsData = await ingredientsResponse.json();
        if (ingredientsData.success) {
          setIngredients(ingredientsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRecipeAndIngredients();
  }, [id]);

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
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update recipe');

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error updating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  // The JSX return is very similar to the create page
  return (
    <div className="h-screen bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-primary-700 mb-4">Edit Recipe</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
          {/* Left Column */}
          <div className="space-y-3">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded-md text-black"
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>
          </div>

          {/* Right Column - Ingredients */}
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

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
} 