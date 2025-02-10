import connectDB from './mongodb';
import Category from '../models/Category';
import Ingredient from '../models/Ingredient';
import Recipe from '../models/Recipe';
import Comment from '../models/Comment';

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Ingredient.deleteMany({}),
      Recipe.deleteMany({}),
      Comment.deleteMany({})
    ]);

    // Create categories
    const categories = await Category.create([
      { name: 'Breakfast', description: 'Start your day right' },
      { name: 'Main Course', description: 'Hearty main dishes' },
      { name: 'Dessert', description: 'Sweet treats' },
      { name: 'Vegetarian', description: 'Meat-free dishes' }
    ]);

    // Create ingredients
    const ingredients = await Ingredient.create([
      { name: 'Eggs', defaultUnit: 'piece', description: 'Fresh chicken eggs' },
      { name: 'Flour', defaultUnit: 'g', description: 'All-purpose flour' },
      { name: 'Milk', defaultUnit: 'ml', description: 'Full-fat milk' },
      { name: 'Sugar', defaultUnit: 'g', description: 'Granulated sugar' },
      { name: 'Butter', defaultUnit: 'g', description: 'Unsalted butter' }
    ]);

    // Create recipes
    const recipes = await Recipe.create([
      {
        title: 'Classic Pancakes',
        description: 'Fluffy and delicious breakfast pancakes',
        categories: [categories[0]._id, categories[3]._id],
        ingredients: [
          { ingredient: ingredients[1]._id, amount: 200, unit: 'g' },
          { ingredient: ingredients[2]._id, amount: 300, unit: 'ml' },
          { ingredient: ingredients[0]._id, amount: 2, unit: 'piece' },
          { ingredient: ingredients[3]._id, amount: 30, unit: 'g' }
        ],
        instructions: '1. Mix dry ingredients\n2. Add wet ingredients\n3. Cook on griddle',
        preparationTime: 20,
        difficulty: 'easy'
      },
      {
        title: 'French Toast',
        description: 'Classic breakfast treat',
        categories: [categories[0]._id],
        ingredients: [
          { ingredient: ingredients[0]._id, amount: 4, unit: 'piece' },
          { ingredient: ingredients[2]._id, amount: 200, unit: 'ml' },
          { ingredient: ingredients[4]._id, amount: 30, unit: 'g' }
        ],
        instructions: '1. Beat eggs and milk\n2. Soak bread\n3. Fry until golden',
        preparationTime: 15,
        difficulty: 'easy'
      }
    ]);

    // Create comments
    await Comment.create([
      {
        recipe: recipes[0]._id,
        text: 'Best pancakes ever!',
        authorName: 'John',
        rating: 5
      },
      {
        recipe: recipes[0]._id,
        text: 'Very easy to make',
        authorName: 'Alice',
        rating: 4
      },
      {
        recipe: recipes[1]._id,
        text: 'Delicious breakfast',
        authorName: 'Bob',
        rating: 5
      }
    ]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 