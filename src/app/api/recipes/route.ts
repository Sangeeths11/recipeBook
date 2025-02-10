import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

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