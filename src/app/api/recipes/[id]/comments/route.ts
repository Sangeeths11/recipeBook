import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Recipe from '@/models/Recipe';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 3;
    
    const skip = (page - 1) * limit;
    
    const comments = await Comment.find({ recipe: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Comment.countDocuments({ recipe: id });
    const pages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        total,
        pages,
        current: page
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    await connectDB();
    const body = await request.json();

    const comment = await Comment.create({
      recipe: id,
      text: body.text,
      authorName: body.authorName,
      rating: body.rating,
    });

    return NextResponse.json({
      success: true,
      data: comment
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create comment' },
      { status: 400 }
    );
  }
} 