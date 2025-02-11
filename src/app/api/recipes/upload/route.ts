import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const recipeId = formData.get('recipeId') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type;

    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        image: {
          data: buffer,
          contentType: contentType
        }
      },
      { new: true }
    );

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: recipe
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 