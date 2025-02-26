import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import Category from '@/models/Category';
import Ingredient from '@/models/Ingredient';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');

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
      if (!mongoose.models.Category) {
        mongoose.model('Category', Category.schema);
      }
      
      const categoryDoc = await mongoose.models.Category.findOne({ 
        name: { $regex: `^${category}$`, $options: 'i' } 
      });
      
      if (categoryDoc) {
        query.categories = categoryDoc._id;
      }
    }

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
    const body = await request.json();
    const recipe = await Recipe.create({
      ...body,
      ingredients: body.ingredients.map((ing: any) => ({
        ingredient: ing.ingredient,
        amount: ing.amount
      }))
    });

    await recipe.populate('ingredients.ingredient categories');
    return NextResponse.json({ success: true, data: recipe });
  } catch (error: any) {
    console.error('Error creating recipe:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors: string[] = [];
      
      Object.keys(error.errors).forEach((key) => {
        if (error.errors[key].name === 'CastError') {
          if (key.includes('ingredients')) {
            if (key.includes('ingredient')) {
              validationErrors.push(`Invalid ingredient ID format`);
            } else if (key.includes('amount')) {
              validationErrors.push(`Ingredient amount must be a number`);
            }
          } else if (key === 'preparationTime') {
            validationErrors.push('Preparation time must be a number');
          } else if (key.includes('categories')) {
            validationErrors.push('Invalid category ID format');
          }
        } else if (error.errors[key].name === 'EnumError') {
          validationErrors.push(`Difficulty must be one of: easy, medium, hard`);
        } else {
          validationErrors.push(error.errors[key].message);
        }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    if (error.name === 'CastError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid ID format',
          details: ['Please provide valid IDs for ingredients and categories']
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create recipe',
        details: [error.message || 'An unexpected error occurred']
      },
      { status: 500 }
    );
  }
} 