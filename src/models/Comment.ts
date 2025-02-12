import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  authorName: {
    type: String,
    required: [true, 'Please provide your name'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Index to optimize queries for comments by recipe
CommentSchema.index({ recipe: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema); 