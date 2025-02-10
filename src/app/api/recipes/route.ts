import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import Category from '@/models/Category';
import Ingredient from '@/models/Ingredient';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();

    // Ensure models are registered
    if (!mongoose.models.Category) {
      mongoose.model('Category', Category.schema);
    }
    if (!mongoose.models.Ingredient) {
      mongoose.model('Ingredient', Ingredient.schema);
    }
    
    const recipes = await Recipe.find({})
      .populate('categories')
      .populate('ingredients.ingredient')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      data: JSON.parse(JSON.stringify(recipes))
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const data = await request.json();
    const recipe = await Recipe.create(data);
    
    return NextResponse.json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
} 