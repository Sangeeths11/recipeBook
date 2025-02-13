import { Endpoint } from '../components/types';

export const sections: { title: string; endpoints: Endpoint[]; }[] = [
    {
      title: "Recipes",
      endpoints: [
        {
          method: "GET",
          path: "/recipes",
          description: "Get all recipes with optional filtering",
          params: [
            { name: "search", description: "Search in title and description" },
            { name: "difficulty", description: "Filter by difficulty (easy, medium, hard)" },
            { name: "category", description: "Filter by category name" }
          ],
          response: {
            success: true,
            data: [{
              _id: "string",
              title: "string",
              description: "string",
              difficulty: "string",
              preparationTime: "number",
              categories: ["Category"],
              ingredients: [{
                ingredient: {
                  _id: "string",
                  name: "string",
                  defaultUnit: "string"
                },
                amount: "number"
              }],
              instructions: "string",
              image: {
                data: "string (base64)",
                contentType: "string"
              },
              createdAt: "string (date)",
              updatedAt: "string (date)"
            }]
          }
        },
        {
          method: "POST",
          path: "/recipes",
          description: "Create a new recipe\n\nRequired fields:\n• title (max 100 chars)\n• description\n• preparationTime (min 1)\n• difficulty (easy|medium|hard)\n• ingredients (array)\n  - ingredient (ingredientId)\n  - amount (number)\n• instructions\n\nOptional fields:\n• categories (array of categoryIds)",
          requestBody: {
            title: "string",
            description: "string",
            preparationTime: "number",
            difficulty: "easy|medium|hard",
            categories: ["categoryId"],
            ingredients: [{
              ingredient: "ingredientId",
              amount: "number"
            }],
            instructions: "string"
          },
          response: {
            success: true,
            data: "Created Recipe Object"
          }
        },
        {
          method: "GET",
          path: "/recipes/:id",
          description: "Get a specific recipe by ID",
          response: {
            success: true,
            data: "Recipe Object with populated categories and ingredients"
          }
        },
        {
          method: "PUT",
          path: "/recipes/:id",
          description: "Update a recipe. For image updates, use the /recipes/upload endpoint separately.",
          requestBody: {
            title: "string",
            description: "string",
            preparationTime: "number",
            difficulty: "easy|medium|hard",
            categories: ["categoryId"],
            ingredients: [{
              ingredient: "ingredientId",
              amount: "number"
            }],
            instructions: "string"
          },
          response: {
            success: true,
            data: "Updated Recipe Object"
          }
        },
        {
          method: "DELETE",
          path: "/recipes/:id",
          description: "Delete a recipe",
          response: {
            success: true
          }
        },
        {
          method: "POST",
          path: "/recipes/upload",
          description: "Upload an image for a recipe",
          requestBody: {
            type: "multipart/form-data",
            fields: {
              image: "File (image/*)",
              recipeId: "string"
            }
          },
          response: {
            success: true,
            data: {
              _id: "string",
              image: {
                data: "Buffer",
                contentType: "string"
              }
              // ... other recipe fields
            }
          }
        }
      ]
    },
    {
      title: "Recipe Comments",
      endpoints: [
        {
          method: "GET",
          path: "/recipes/:id/comments",
          description: "Get comments for a recipe with pagination",
          params: [
            { name: "page", description: "Page number (default: 1)" }
          ],
          response: {
            success: true,
            data: [{
              _id: "string",
              text: "string",
              authorName: "string",
              rating: "number (1-5)",
              createdAt: "string (date)"
            }],
            pagination: {
              total: "number",
              pages: "number",
              current: "number"
            }
          }
        },
        {
          method: "POST",
          path: "/recipes/:id/comments",
          description: "Add a comment to a recipe",
          params: [
            { name: "text", description: "Text of the comment (required, max 500 chars)" },
            { name: "authorName", description: "Name of the author (required, max 50 chars)" },
            { name: "rating", description: "Rating of the comment (required, 1-5)" }
          ],
          requestBody: {
            text: "string",
            authorName: "string",
            rating: "number (1-5)"
          },
          response: {
            success: true,
            data: "Created Comment Object"
          }
        }
      ]
    },
    {
      title: "Categories",
      endpoints: [
        {
          method: "GET",
          path: "/categories",
          description: "Get all categories",
          response: {
            success: true,
            data: [{
              _id: "string",
              name: "string",
              description: "string"
            }]
          }
        },
        {
          method: "GET",
          path: "/categories/:id",
          description: "Get a specific category",
          response: {
            success: true,
            data: "Category Object"
          }
        },
        {
          method: "DELETE",
          path: "/categories/:id",
          description: "Delete a category (fails if used in recipes)",
          params: [
            { name: "id", description: "Category ID" }
          ],
          response: {
            success: true
          }
        },
        {
          method: "PUT",
          path: "/categories/:id",
          description: "Update a category",
          params: [
            { name: "id", description: "Category ID" }
          ],
          requestBody: {
            name: "string",
            description: "string"
          },
          response: {
            success: true,
            data: "Updated Category Object"
          }
        },
        {
          method: "POST",
          path: "/categories",
          params: [
            { name: "name", description: "Name of the category (max 50 chars, unique, required)" },
            { name: "description", description: "Description of the category (max 200 chars, required)" }
          ],
          description: "Create a new category",
          requestBody: {
            name: "string",
            description: "string"
          },
          response: {
            success: true,
            data: "Created Category Object"
          }
        }
      ]
    },
    {
      title: "Ingredients",
      endpoints: [
        {
          method: "GET",
          path: "/ingredients",
          description: "Get all ingredients",
          params: [
            { name: "name", description: "Name of the ingredient (required, max 50 chars, unique)" },
            { name: "defaultUnit", description: "Default unit (required, one of: g, kg, ml, l, piece, tbsp, tsp, cup)" },
            { name: "description", description: "Description of the ingredient (optional, max 200 chars)" }
          ],
          response: {
            success: true,
            data: [{
              _id: "string",
              name: "string",
              defaultUnit: "string",
              description: "string"
            }]
          }
        },
        {
          method: "POST",
          path: "/ingredients",
          description: "Create a new ingredient",
          requestBody: {
            name: "string",
            defaultUnit: "g",
            description: "string"
          },
          response: {
            success: true,
            data: "Created Ingredient Object"
          }
        },
        {
          method: "PUT",
          path: "/ingredients/:id",
          description: "Update an ingredient",
          params: [
            { name: "id", description: "Ingredient ID" }
          ],
          requestBody: {
            name: "string",
            defaultUnit: "g|kg|ml|l|piece|tbsp|tsp|cup",
            description: "string (optional)"
          },
          response: {
            success: true,
            data: "Updated Ingredient Object"
          }
        },
        {
          method: "DELETE",
          path: "/ingredients/:id",
          description: "Delete an ingredient (fails if used in recipes)",
          params: [
            { name: "id", description: "Ingredient ID" }
          ],
          response: {
            success: true
          }
        }
      ]
    },
  ]; 