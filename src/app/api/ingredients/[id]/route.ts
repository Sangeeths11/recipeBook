import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ingredient from '@/models/Ingredient';
import Recipe from '@/models/Recipe';
import mongoose from 'mongoose';

const validUnits = (Ingredient.schema.path('defaultUnit') as any).enumValues;

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  try {
    await connectDB();
    const ingredient = await Ingredient.findById(id);
    
    if (!ingredient) {
      return NextResponse.json(
        { success: false, error: 'Ingredient not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: ingredient });
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ingredient' + error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid ID format' },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const data = await request.json();
    
    const currentIngredient = await Ingredient.findById(id);
    if (!currentIngredient) {
      return NextResponse.json(
        { success: false, error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    if (data.name && data.name !== currentIngredient.name) {
      const existingIngredient = await Ingredient.findOne({
        _id: { $ne: id },
        name: { $regex: `^${data.name}$`, $options: 'i' }
      });

      if (existingIngredient) {
        return NextResponse.json(
          { success: false, error: 'An ingredient with this name already exists' },
          { status: 400 }
        );
      }
    }

    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: ingredient });
  } catch (error: any) {
    console.error('Error updating ingredient:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update ingredient'
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid ID format' },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    
    const recipesUsingIngredient = await Recipe.findOne({ 'ingredients.ingredient': id });
    if (recipesUsingIngredient) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete ingredient that is used in recipes' },
        { status: 400 }
      );
    }

    const ingredient = await Ingredient.findByIdAndDelete(id);
    
    if (!ingredient) {
      return NextResponse.json(
        { success: false, error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete ingredient' },
      { status: 500 }
    );
  }
} 