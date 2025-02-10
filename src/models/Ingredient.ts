import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an ingredient name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  defaultUnit: {
    type: String,
    required: [true, 'Please provide a default unit'],
    enum: ['g', 'kg', 'ml', 'l', 'piece', 'tbsp', 'tsp', 'cup']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  }
}, {
  timestamps: true
});

export default mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema); 