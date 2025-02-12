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
              difficulty: "easy|medium|hard",
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
          description: "Create a new recipe",
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
          response: {
            success: true
          }
        },
        {
          method: "PUT",
          path: "/categories/:id",
          description: "Update a category",
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
          response: {
            success: true,
            data: [{
              _id: "string",
              name: "string (required, max 50 chars, unique)",
              defaultUnit: "g|kg|ml|l|piece|tbsp|tsp|cup (required)",
              description: "string (optional, max 200 chars)"
            }]
          }
        },
        {
          method: "POST",
          path: "/ingredients",
          description: "Create a new ingredient",
          requestBody: {
            name: "string",
            defaultUnit: "g|kg|ml|l|piece|tbsp|tsp|cup",
            description: "string (optional)"
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
          response: {
            success: true
          }
        }
      ]
    }
  ]; 