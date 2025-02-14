import fs from 'fs/promises';
import path from 'path';
import connectDB from './mongodb';
import Category from '../models/Category';
import Ingredient from '../models/Ingredient';
import Recipe from '../models/Recipe';
import Comment from '../models/Comment';
import dotenv from 'dotenv';

dotenv.config();

async function loadImageAsBuffer(imagePath: string): Promise<{ data: Buffer; contentType: string }> {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'src/lib/seed-images', imagePath));
    const contentType = `image/${path.extname(imagePath).slice(1)}`;
    return { 
      data: data,
      contentType: contentType 
    };
  } catch (error) {
    console.error(`Error loading image ${imagePath}:`, error);
    return { 
      data: Buffer.from([]),
      contentType: 'image/jpeg' 
    };
  }
}

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

    // Load images
    const pancakeImage = await loadImageAsBuffer('pancakes.jpg');
    const carbonaraImage = await loadImageAsBuffer('carbonara.jpg');
    const friedRiceImage = await loadImageAsBuffer('fried-rice.jpeg');

    // Create categories
    const categories = await Category.create([
      { name: 'Breakfast', description: 'Start your day right' },
      { name: 'Main Course', description: 'Hearty main dishes' },
      { name: 'Dessert', description: 'Sweet treats' },
      { name: 'Vegetarian', description: 'Meat-free dishes' },
      { name: 'Quick & Easy', description: 'Ready in 30 minutes or less' },
      { name: 'Italian', description: 'Traditional Italian cuisine' },
      { name: 'Asian', description: 'Asian-inspired dishes' },
      { name: 'Healthy', description: 'Nutritious and balanced meals' }
    ]);

    // Create ingredients with units
    const ingredients = await Ingredient.create([
      { name: 'Eggs', defaultUnit: 'piece', description: 'Fresh chicken eggs' },
      { name: 'All-Purpose Flour', defaultUnit: 'g', description: 'Regular wheat flour' },
      { name: 'Milk', defaultUnit: 'ml', description: 'Full-fat milk' },
      { name: 'Sugar', defaultUnit: 'g', description: 'Granulated white sugar' },
      { name: 'Butter', defaultUnit: 'g', description: 'Unsalted butter' },
      { name: 'Rice', defaultUnit: 'g', description: 'White long-grain rice' },
      { name: 'Chicken Breast', defaultUnit: 'g', description: 'Skinless chicken breast' },
      { name: 'Olive Oil', defaultUnit: 'ml', description: 'Extra virgin olive oil' },
      { name: 'Garlic', defaultUnit: 'piece', description: 'Fresh garlic cloves' },
      { name: 'Onion', defaultUnit: 'piece', description: 'Fresh onion' },
      { name: 'Tomatoes', defaultUnit: 'g', description: 'Fresh tomatoes' },
      { name: 'Pasta', defaultUnit: 'g', description: 'Dried pasta' },
      { name: 'Parmesan', defaultUnit: 'g', description: 'Grated Parmesan cheese' },
      { name: 'Soy Sauce', defaultUnit: 'ml', description: 'Traditional soy sauce' },
      { name: 'Ginger', defaultUnit: 'g', description: 'Fresh ginger root' }
    ]);

    // Create recipes with images
    const recipes = await Recipe.create([
      {
        title: 'Classic Pancakes',
        description: 'Fluffy and delicious breakfast pancakes',
        categories: [categories[0]._id, categories[4]._id],
        ingredients: [
          { ingredient: ingredients[0]._id, amount: 2 },
          { ingredient: ingredients[1]._id, amount: 200 },
          { ingredient: ingredients[2]._id, amount: 250 },
          { ingredient: ingredients[3]._id, amount: 30 },
          { ingredient: ingredients[4]._id, amount: 50 }
        ],
        instructions: '1. Mix dry ingredients\n2. Combine wet ingredients\n3. Mix until just combined\n4. Cook on hot griddle\n5. Serve with maple syrup',
        preparationTime: 20,
        difficulty: 'easy',
        image: pancakeImage
      },
      {
        title: 'Spaghetti Carbonara',
        description: 'Traditional Italian pasta dish',
        categories: [categories[1]._id, categories[5]._id],
        ingredients: [
          { ingredient: ingredients[11]._id, amount: 400 },
          { ingredient: ingredients[0]._id, amount: 4 },
          { ingredient: ingredients[12]._id, amount: 100 },
          { ingredient: ingredients[8]._id, amount: 3 }
        ],
        instructions: '1. Cook pasta al dente\n2. Prepare sauce with eggs and cheese\n3. Combine hot pasta with sauce\n4. Add pepper and extra cheese',
        preparationTime: 25,
        difficulty: 'medium',
        image: carbonaraImage
      },
      {
        title: 'Stir-Fried Rice',
        description: 'Quick and flavorful Asian-style fried rice',
        categories: [categories[1]._id, categories[6]._id, categories[4]._id],
        ingredients: [
          { ingredient: ingredients[5]._id, amount: 300 },
          { ingredient: ingredients[6]._id, amount: 200 },
          { ingredient: ingredients[9]._id, amount: 1 },
          { ingredient: ingredients[14]._id, amount: 20 },
          { ingredient: ingredients[13]._id, amount: 45 }
        ],
        instructions: '1. Cook rice and let it cool\n2. Dice chicken and vegetables\n3. Heat wok over high heat\n4. Stir-fry chicken until cooked\n5. Add vegetables and rice\n6. Season with soy sauce and ginger\n7. Stir-fry until hot and fragrant',
        preparationTime: 30,
        difficulty: 'medium',
        image: friedRiceImage
      }
    ]);

    // Create comments
    await Comment.create([
      {
        recipe: recipes[0]._id,
        text: 'Perfect breakfast recipe! The pancakes were super fluffy.',
        authorName: 'Sarah',
        rating: 5
      },
      {
        recipe: recipes[0]._id,
        text: 'Good recipe but needed more sugar for my taste.',
        authorName: 'Mike',
        rating: 4
      },
      {
        recipe: recipes[1]._id,
        text: 'Authentic Italian taste! Restaurant quality.',
        authorName: 'Marco',
        rating: 5
      },
      {
        recipe: recipes[2]._id,
        text: 'Quick and delicious weeknight dinner.',
        authorName: 'David',
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