// Base types for MongoDB documents
interface BaseDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Category type
export interface Category extends BaseDocument {
  name: string;
  description: string;
}

// Ingredient type
export interface Ingredient extends BaseDocument {
  name: string;
  defaultUnit: 'g' | 'kg' | 'ml' | 'l' | 'piece' | 'tbsp' | 'tsp' | 'cup';
  description?: string;
}

// Recipe Ingredient type (for the ingredients array in Recipe)
export interface RecipeIngredient {
  ingredient: string | Ingredient;
  amount: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'piece' | 'tbsp' | 'tsp' | 'cup';
}

// Comment type
export interface Comment extends BaseDocument {
  recipe: string | Recipe;
  text: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

// Recipe type
export interface Recipe extends BaseDocument {
  title: string;
  description: string;
  imageUrl?: string;
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  categories: (Category | string)[];
  ingredients: RecipeIngredient[];
  instructions: string;
}

// Props types for components
export interface RecipeCardProps {
  recipe: Recipe;
}

export interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
}

export interface FilterBarProps {
  onFilterChange?: (filters: {
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
  }) => void;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
