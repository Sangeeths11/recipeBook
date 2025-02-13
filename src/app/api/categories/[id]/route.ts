import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Recipe from '@/models/Recipe';
import mongoose from 'mongoose';

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
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const data = await request.json();

    // First get the current category
    const currentCategory = await Category.findById(id);
    if (!currentCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Only check for name conflicts if the name is being changed
    if (data.name && data.name !== currentCategory.name) {
      const existingCategory = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: `^${data.name}$`, $options: 'i' }
      });

      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'Category name already exists' },
          { status: 400 }
        );
      }
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

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
    
    // Check if category is used in any recipes
    const recipesUsingCategory = await Recipe.findOne({ categories: id });
    if (recipesUsingCategory) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category that is used in recipes' },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 