import { Endpoint } from '../components/types';

export const endpoints: Endpoint[] = [
  // Recipe endpoints
  { method: 'GET', path: '/recipes', description: 'Get all recipes with optional filtering' },
  { method: 'GET', path: '/recipes/:id', description: 'Get a specific recipe by ID' },
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
  { method: 'PUT', path: '/recipes/:id', description: 'Update a recipe', exampleBody: JSON.stringify({
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
  { method: 'DELETE', path: '/recipes/:id', description: 'Delete a recipe' },
  // {
  //   method: 'POST',
  //   path: '/recipes/upload',
  //   description: 'Upload recipe image',
  //   exampleBody: JSON.stringify({
  //     note: "This endpoint requires multipart/form-data",
  //     formData: {
  //       image: "File (image/*)",
  //       recipeId: "string (recipe ID)"
  //     }
  //   }, null, 2)
  // },
  
  // Category endpoints
  { method: 'GET', path: '/categories', description: 'Get all categories' },
  { method: 'GET', path: '/categories/:id', description: 'Get a specific category' },
  { method: 'POST', path: '/categories', description: 'Create a new category', exampleBody: JSON.stringify({
    name: "New Category",
    description: "Category description"
  }, null, 2) },
  { method: 'PUT', path: '/categories/:id', description: 'Update a category', exampleBody: JSON.stringify({
    name: "Updated Category",
    description: "Updated description"
  }, null, 2) },
  { method: 'DELETE', path: '/categories/:id', description: 'Delete a category' },

  // Ingredient endpoints
  { method: 'GET', path: '/ingredients', description: 'Get all ingredients' },
  { method: 'GET', path: '/ingredients/:id', description: 'Get a specific ingredient' },
  { method: 'POST', path: '/ingredients', description: 'Create a new ingredient', exampleBody: JSON.stringify({
    name: "New Ingredient",
    defaultUnit: "g", // One of: g, kg, ml, l, piece, tbsp, tsp, cup
    description: "Optional ingredient description"
  }, null, 2) },
  { method: 'PUT', path: '/ingredients/:id', description: 'Update an ingredient', exampleBody: JSON.stringify({
    name: "Updated Ingredient",
    defaultUnit: "g", // One of: g, kg, ml, l, piece, tbsp, tsp, cup
    description: "Updated description"
  }, null, 2) },
  { method: 'DELETE', path: '/ingredients/:id', description: 'Delete an ingredient' },

  // Comment endpoints
  { method: 'GET', path: '/recipes/:id/comments', description: 'Get comments for a recipe with pagination' },
  { method: 'POST', path: '/recipes/:id/comments', description: 'Add a comment to a recipe', exampleBody: JSON.stringify({
    text: "Great recipe!",
    authorName: "John Doe",
    rating: 5
  }, null, 2) }
];