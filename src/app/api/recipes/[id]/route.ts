import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import mongoose from 'mongoose';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid ID format. Must be a 24-character hexadecimal string.' 
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    
    // Check if recipe exists
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Delete recipe
    await Recipe.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Recipe deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid ID format. Must be a 24-character hexadecimal string.' 
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const recipe = await Recipe.findById(id)
      .populate('categories')
      .populate('ingredients.ingredient');
    
    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  
  try {
    const body = await request.json();
    await connectDB();
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );
    
    if (!updatedRecipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: updatedRecipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
} 