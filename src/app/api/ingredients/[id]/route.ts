import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ingredient from '@/models/Ingredient';
import Recipe from '@/models/Recipe';

// Get the valid units from the Mongoose schema
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

  try {
    await connectDB();
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.defaultUnit) {
      return NextResponse.json(
        { success: false, error: 'Name and default unit are required' },
        { status: 400 }
      );
    }

    // Validate defaultUnit enum values
    if (!validUnits.includes(data.defaultUnit)) {
      return NextResponse.json(
        { success: false, error: 'Invalid default unit. Must be one of: ' + validUnits.join(', ') },
        { status: 400 }
      );
    }

    // Check if new name already exists (excluding current ingredient)
    const existingIngredient = await Ingredient.findOne({
      _id: { $ne: id },
      name: { $regex: `^${data.name}$`, $options: 'i' }
    });

    if (existingIngredient) {
      return NextResponse.json(
        { success: false, error: 'Ingredient name already exists' },
        { status: 400 }
      );
    }

    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!ingredient) {
      return NextResponse.json(
        { success: false, error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ingredient });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ingredient' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  try {
    await connectDB();
    
    // Check if ingredient is used in any recipes
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
      { success: false, error: 'Failed to delete ingredient' + error },
      { status: 500 }
    );
  }
} 