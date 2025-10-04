/**
 * Food Data Utility
 * Parses and provides access to the Common_PH_foods.csv dataset
 */

let foodDataCache = null;

/**
 * Parse CSV data into structured objects
 */
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Handle CSV parsing with quoted fields
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // Push the last value
    
    // Skip if we don't have enough values or if meal_name is empty
    if (values.length < headers.length || !values[1]) continue;
    
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
};

/**
 * Load and cache food data from CSV
 */
export const loadFoodData = async () => {
  if (foodDataCache) {
    return foodDataCache;
  }
  
  try {
    const response = await fetch('/Common_PH_foods.csv');
    const csvText = await response.text();
    foodDataCache = parseCSV(csvText);
    return foodDataCache;
  } catch (error) {
    console.error('Error loading food data:', error);
    return [];
  }
};

/**
 * Get all food items
 */
export const getAllFoods = async () => {
  const data = await loadFoodData();
  return data.filter(item => item.meal_name && item.meal_name.trim() !== '');
};

/**
 * Get food by ID
 */
export const getFoodById = async (id) => {
  const data = await loadFoodData();
  return data.find(item => item.id === id);
};

/**
 * Search foods by name
 */
export const searchFoodsByName = async (query) => {
  const data = await loadFoodData();
  const lowerQuery = query.toLowerCase();
  return data.filter(item => 
    item.meal_name && 
    (item.meal_name.toLowerCase().includes(lowerQuery) || 
     item.common_name?.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get foods by meal type
 */
export const getFoodsByMealType = async (mealType) => {
  const data = await loadFoodData();
  return data.filter(item => 
    item.meal_type && 
    item.meal_type.toLowerCase().includes(mealType.toLowerCase())
  );
};

/**
 * Get foods by tags
 */
export const getFoodsByTag = async (tag) => {
  const data = await loadFoodData();
  return data.filter(item => 
    item.tags && 
    item.tags.toLowerCase().includes(tag.toLowerCase())
  );
};

/**
 * Get random foods
 */
export const getRandomFoods = async (count = 5) => {
  const data = await loadFoodData();
  const validFoods = data.filter(item => item.meal_name && item.meal_name.trim() !== '');
  const shuffled = [...validFoods].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get foods by difficulty
 */
export const getFoodsByDifficulty = async (difficulty) => {
  const data = await loadFoodData();
  return data.filter(item => 
    item.difficulty && 
    item.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
};

/**
 * Get popular foods (based on popularity_score)
 */
export const getPopularFoods = async (count = 10) => {
  const data = await loadFoodData();
  const validFoods = data.filter(item => 
    item.meal_name && 
    item.meal_name.trim() !== '' && 
    item.popularity_score
  );
  
  return validFoods
    .sort((a, b) => (parseInt(b.popularity_score) || 0) - (parseInt(a.popularity_score) || 0))
    .slice(0, count);
};

/**
 * Get foods by dietary restrictions
 */
export const getFoodsByDietaryRestriction = async (restriction) => {
  const data = await loadFoodData();
  return data.filter(item => 
    item.dietary_restrictions && 
    item.dietary_restrictions.toLowerCase().includes(restriction.toLowerCase())
  );
};

/**
 * Get foods by calorie range
 */
export const getFoodsByCalorieRange = async (minCal, maxCal) => {
  const data = await loadFoodData();
  return data.filter(item => {
    const calories = parseFloat(item.calories_kcal);
    return calories >= minCal && calories <= maxCal;
  });
};

/**
 * Get foods by ingredients
 */
export const getFoodsByIngredient = async (ingredient) => {
  const data = await loadFoodData();
  const lowerIngredient = ingredient.toLowerCase();
  return data.filter(item => 
    item.ingredients && 
    item.ingredients.toLowerCase().includes(lowerIngredient)
  );
};

/**
 * Format food data for display
 * Uses image_url from dataset, falls back to no_image.png if not available
 */
export const formatFoodForDisplay = (food) => {
  if (!food) return null;
  
  // Use image_url from dataset, fallback to placeholder if empty
  const imageUrl = food.image_url && food.image_url.trim() !== '' 
    ? food.image_url 
    : '/assets/images/no_image.png';
  
  return {
    id: food.id,
    name: food.meal_name || food.common_name,
    commonName: food.common_name,
    description: food.description || 'No description available',
    
    // Display values - keep original for display
    prepTime: food.prep_time || 'N/A',
    servings: food.servings || 'N/A',
    calories: food.calories_kcal || 'N/A',
    protein: food.protein_g || 'N/A',
    carbs: food.carbs_g || 'N/A',
    fat: food.fat_g || 'N/A',
    fiber: food.fiber_g || 'N/A',
    sugar: food.sugar_g || 'N/A',
    sodium: food.sodium_mg || 'N/A',
    cholesterol: food.cholesterol_mg || 'N/A',
    
    // Raw values for calculations
    caloriesRaw: parseFloat(food.calories_kcal) || 0,
    proteinRaw: parseFloat(food.protein_g) || 0,
    carbsRaw: parseFloat(food.carbs_g) || 0,
    fatRaw: parseFloat(food.fat_g) || 0,
    fiberRaw: parseFloat(food.fiber_g) || 0,
    sugarRaw: parseFloat(food.sugar_g) || 0,
    sodiumRaw: parseFloat(food.sodium_mg) || 0,
    cholesterolRaw: parseFloat(food.cholesterol_mg) || 0,
    
    difficulty: food.difficulty || 'N/A',
    cost: food.estimated_cost_php || 'N/A',
    availability: food.availability || 'N/A',
    tags: food.tags ? food.tags.split(';').map(t => t.trim()).filter(Boolean) : [],
    roleFit: food.role_fit || 'N/A',
    mealType: food.meal_type || 'N/A',
    dietaryRestrictions: food.dietary_restrictions || 'None',
    ingredients: food.ingredients ? food.ingredients.split(',').map(i => i.trim()).filter(Boolean) : [],
    popularityScore: food.popularity_score || 0,
    imageUrl: imageUrl
  };
};

/**
 * Get nutritional summary
 */
export const getNutritionalSummary = (food) => {
  return {
    calories: parseFloat(food.calories_kcal) || 0,
    protein: parseFloat(food.protein_g) || 0,
    carbs: parseFloat(food.carbs_g) || 0,
    fat: parseFloat(food.fat_g) || 0,
    fiber: parseFloat(food.fiber_g) || 0,
    sugar: parseFloat(food.sugar_g) || 0,
    sodium: parseFloat(food.sodium_mg) || 0,
    cholesterol: parseFloat(food.cholesterol_mg) || 0
  };
};

export default {
  loadFoodData,
  getAllFoods,
  getFoodById,
  searchFoodsByName,
  getFoodsByMealType,
  getFoodsByTag,
  getRandomFoods,
  getFoodsByDifficulty,
  getPopularFoods,
  getFoodsByDietaryRestriction,
  getFoodsByCalorieRange,
  getFoodsByIngredient,
  formatFoodForDisplay,
  getNutritionalSummary
};
