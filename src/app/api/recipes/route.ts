import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import Category from '@/models/Category';
import Ingredient from '@/models/Ingredient';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectDB();

    // Get search params from URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (category) {
      // Ensure Category model is registered
      if (!mongoose.models.Category) {
        mongoose.model('Category', Category.schema);
      }
      
      // Find category by name
      const categoryDoc = await mongoose.models.Category.findOne({ 
        name: { $regex: `^${category}$`, $options: 'i' } 
      });
      
      if (categoryDoc) {
        query.categories = categoryDoc._id;
      }
    }

    // Ensure models are registered
    if (!mongoose.models.Ingredient) {
      mongoose.model('Ingredient', Ingredient.schema);
    }
    
    const recipes = await Recipe.find(query)
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