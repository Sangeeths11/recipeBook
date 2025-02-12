import { Endpoint } from '../components/types';

export const endpoints: Endpoint[] = [
    { method: 'GET', path: '/recipes', description: 'Get all recipes with optional filtering' },
    { method: 'GET', path: '/recipes/123', description: 'Get a specific recipe by ID' },
    { method: 'POST', path: '/recipes', description: 'Create a new recipe', exampleBody: JSON.stringify({
      title: "New Recipe",
      description: "Description",
      preparationTime: 30,
      difficulty: "medium",
      categories: ["categoryId1", "categoryId2"],
      ingredients: [
        { ingredient: "ingredientId", amount: 100 }
      ],
      instructions: "Step by step instructions"
    }, null, 2) },
    { method: 'PUT', path: '/recipes/123', description: 'Update a recipe', exampleBody: JSON.stringify({
      title: "Updated Recipe",
      description: "Updated description",
      preparationTime: 45,
      difficulty: "hard",
      categories: ["categoryId1", "categoryId2"],
      ingredients: [
        { ingredient: "ingredientId", amount: 150 }
      ],
      instructions: "Updated step by step instructions"
    }, null, 2) },
    { method: 'DELETE', path: '/recipes/123', description: 'Delete a recipe' },
    { method: 'POST', path: '/recipes/123/comments', description: 'Add a comment to a recipe', exampleBody: JSON.stringify({
      text: "Great recipe!",
      authorName: "John Doe",
      rating: 5
    }, null, 2) },
    { method: 'POST', path: '/categories', description: 'Create a new category', exampleBody: JSON.stringify({
      name: "New Category",
      description: "Category description"
    }, null, 2) },
    { method: 'DELETE', path: '/ingredients/123', description: 'Delete an ingredient' },
    { method: 'POST', path: '/ingredients', description: 'Create a new ingredient', exampleBody: JSON.stringify({
      name: "New Ingredient",
      defaultUnit: "g",
      description: "Ingredient description"
    }, null, 2) }
  ];