export interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  categories: string[];
  ingredients: {
    ingredient: string;
    amount: number;
    unit: string;
  }[];
  instructions: string;
  createdAt: string;
  updatedAt: string;
} 