import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ingredient from '@/models/Ingredient';

export async function GET() {
  try {
    await connectDB();
    const ingredients = await Ingredient.find({}).sort('name').lean();
    return NextResponse.json({ success: true, data: ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ingredients' },
      { status: 500 }
    );
  }
} 