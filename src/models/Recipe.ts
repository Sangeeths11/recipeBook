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
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'kg', 'ml', 'l', 'piece', 'tbsp', 'tsp', 'cup']
  }
});

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  ingredients: [RecipeIngredientSchema],
  instructions: {
    type: String,
    required: [true, 'Please provide cooking instructions']
  },
  imageUrl: {
    type: String
  },
  preparationTime: {
    type: Number,
    min: 1,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema); 