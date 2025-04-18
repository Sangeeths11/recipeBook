import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      data: JSON.parse(JSON.stringify(categories))
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    let data;
    try {
      data = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }
    
    if (!data.name || !data.description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({ 
      name: { $regex: `^${data.name}$`, $options: 'i' }
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category already exists' },
        { status: 400 }
      );
    }
    
    const category = await Category.create(data);
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
} 