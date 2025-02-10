import connectDB from './mongodb';
import Recipe from '@/models/Recipe';
import Category from '@/models/Category';
import mongoose from 'mongoose';

export async function getRecipes() {
  await connectDB();
  
  // Ensure Category model is registered before using populate
  if (!mongoose.models.Category) {
    mongoose.model('Category', Category.schema);
  }
  
  const recipes = await Recipe.find({})
    .populate('categories')
    .sort({ createdAt: -1 })
    .lean();
    
  return JSON.parse(JSON.stringify(recipes));
} 