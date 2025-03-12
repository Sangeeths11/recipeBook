import mongoose from 'mongoose';

const RecipeIngredientSchema = new mongoose.Schema({
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  ingredients: [RecipeIngredientSchema],
  instructions: {
    type: String,
    required: [true, 'Please provide cooking instructions']
  },
  image: {
    data: Buffer,
    contentType: String
  },
  preparationTime: {
    type: Number,
    min: 1,
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    index: true
  }
}, {
  timestamps: true,
  autoIndex: true
});

RecipeSchema.index({ difficulty: 1, preparationTime: 1 });
RecipeSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);