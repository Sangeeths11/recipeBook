'use client';

import { useState, useEffect, useRef } from 'react';
import { Recipe } from '@/types/recipe';
import Image from 'next/image';
import Link from 'next/link';

export default function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState<any[]>([]);
  const commentFormRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { id } = await params;
      const response = await fetch(`/api/recipes/${id}`);
      const data = await response.json();
      if (data.success) {
        setRecipe(data.data);
      }
    };

    fetchRecipe();
  }, [params]);

  useEffect(() => {
    const fetchComments = async () => {
      const { id } = await params;
      const response = await fetch(`/api/recipes/${id}/comments?page=${currentPage}`);
      const data = await response.json();
      if (data.success) {
        setComments(data.data);
        setTotalPages(data.pagination.pages);
      }
    };

    fetchComments();
  }, [params, currentPage]);

  const handleAddComment = async () => {
    if (!comment.trim() || !authorName.trim()) {
      alert('Please fill in both name and comment fields');
      return;
    }

    const { id } = await params;
    try {
      const response = await fetch(`/api/recipes/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: comment,
          authorName,
          rating
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      // Reset form
      setComment('');
      setAuthorName('');
      setRating(5);

      // Refresh comments (go to first page)
      setCurrentPage(1);
      
      // Scroll to comment form
      commentFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!recipe) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Recipe Header with Glass Effect */}
        <div className="relative mb-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-primary-700 font-display">{recipe.title}</h1>
            <Link 
              href={`/recipes/${recipe._id}/edit`}
              className="group relative inline-flex items-center justify-center px-6 py-2 bg-primary-600 text-white rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="absolute -inset-full group-hover:inset-0 bg-gradient-to-r from-primary-400 to-primary-600 transform rotate-180 group-hover:rotate-0 transition-all duration-500" />
              <span className="relative">Edit Recipe</span>
            </Link>
          </div>
          
          {/* Recipe Image with Gradient Overlay */}
          <div className="relative h-[500px] w-full mb-6 rounded-lg overflow-hidden">
            {recipe.image ? (
              <>
                <Image
                  src={`data:${recipe.image.contentType};base64,${
                    typeof recipe.image.data === 'string'
                      ? recipe.image.data
                      : Buffer.from(recipe.image.data).toString('base64')
                  }`}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </>
            ) : (
              <div className="h-full bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center">
                <span className="text-primary-600 text-xl">No image available</span>
              </div>
            )}
          </div>

          {/* Recipe Info Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-4 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-primary-600 font-medium">Prep Time</p>
                  <p className="text-2xl font-bold text-gray-900">{recipe.preparationTime} min</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-4">
              <p className="text-sm text-primary-600 font-medium text-center mb-2">Categories</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {recipe.categories.map((category: any) => (
                  <span 
                    key={typeof category === 'string' ? category : category._id}
                    className="px-2.5 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full shadow-sm border border-primary-100"
                  >
                    {typeof category === 'string' ? category : category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">{recipe.description}</p>
        </div>

        {/* Ingredients Section */}
        <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary-700 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Ingredients
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recipe.ingredients.map((ing: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3 transform hover:scale-105 transition-transform duration-200">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <div>
                  <span className="font-medium text-gray-900">
                    {typeof ing.ingredient === 'string' ? ing.ingredient : ing.ingredient.name}
                  </span>
                  <span className="text-gray-600 text-sm ml-2">
                    {ing.amount} {ing.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary-700 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Instructions
          </h2>
          <div className="space-y-4">
            {recipe.instructions.split('\n').map((instruction, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary-700 mb-6">Comments & Ratings</h2>
          
          {/* Comment Form */}
          <div ref={commentFormRef} className="mb-8 bg-white rounded-lg p-4 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                  rows={3}
                  placeholder="Share your thoughts about this recipe..."
                />
              </div>

              <button
                onClick={handleAddComment}
                className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors duration-200"
              >
                Add Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div 
                key={comment._id || index} 
                className={`bg-white p-4 rounded-lg shadow-sm transform transition-all duration-300 ${
                  index === 0 && currentPage === 1 ? 'animate-slide-in' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{comment.authorName}</span>
                    <div className="text-yellow-400 text-sm">{'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}</div>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>

          {/* Add Pagination Controls here */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary-600 border border-primary-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
              >
                ←
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary-600 border border-primary-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 