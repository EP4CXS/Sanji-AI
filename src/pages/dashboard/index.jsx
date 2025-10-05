import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import Button from '../../components/ui/Button';
import ProfileSummaryCard from './components/ProfileSummaryCard';

import NutritionProgressChart from './components/NutritionProgressChart';
import QuickStatsGrid from './components/QuickStatsGrid';
import TodaysMealPlan from './components/TodaysMealPlan';
import { getRandomFoods, formatFoodForDisplay, getFoodsByMealType } from '../../utils/foodData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Mock user profile data
  const userProfile = {
    name: "Cape, Jhon lloyd",
    role: "Fitness Enthusiast",
    age: 28,
    sex: "Male",
    height: "5\'6\"",
    currentWeight: 145,
    targetWeight: 135,
    activityLevel: "Active",
    dailyBudget: 25.00
  };

  // Load today's meal plan data from CSV
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        console.log('Loading meals from CSV...');
        const foods = await getRandomFoods(4);
        console.log('Foods loaded:', foods);
        
        if (!foods || foods.length === 0) {
          console.warn('No foods returned from CSV');
          setTodaysMeals([]);
          setIsLoadingMeals(false);
          return;
        }
        
        const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
        
        const meals = foods.map((food, index) => {
          const formatted = formatFoodForDisplay(food);
          return {
            id: formatted.id,
            name: formatted.name,
            type: mealTypes[index] || 'Meal',
            image: formatted.imageUrl,
            
            // All values from CSV dataset
            servings: formatted.servings,
            prepTime: formatted.prepTime,
            cost: formatted.cost,
            calories: formatted.calories,
            protein: formatted.protein,
            carbs: formatted.carbs,
            fat: formatted.fat,
            fiber: formatted.fiber,
            sugar: formatted.sugar,
            sodium: formatted.sodium,
            cholesterol: formatted.cholesterol,
            
            // Additional info
            rating: parseFloat(formatted.popularityScore) || 4,
            logged: false,
            status: null
          };
        });
        
        console.log('Meals formatted:', meals);
        setTodaysMeals(meals);
      } catch (error) {
        console.error('Error loading meals:', error);
        setError(error.message);
        setTodaysMeals([]);
      } finally {
        setIsLoadingMeals(false);
      }
    };
    
    loadMeals();
  }, []);

  // Mock nutrition progress data
  const nutritionData = {
    calories: { current: 1285, target: 1470 },
    protein: { current: 89, target: 101 },
    carbs: { current: 145, target: 184 },
    fat: { current: 42, target: 49 },
    fiber: { current: 18, target: 25 }
  };

  // Mock quick stats data
  const quickStats = {
    mealsLogged: 2,
    totalMeals: 4,
    weeklyAdherence: 85,
    budgetUsed: 15.75,
    dailyBudget: 25.00,
    recipesTried: 23
  };

  const handleLogMeal = (mealId, status) => {
    setTodaysMeals(prevMeals =>
      prevMeals?.map(meal =>
        meal?.id === mealId
          ? { ...meal, logged: true, status }
          : meal
      )
    );
  };

  const handleRegeneratePlan = () => {
    navigate('/meal-plan-generator');
  };

  const handleViewProgress = () => {
    navigate('/progress-tracking');
  };

  const handleManageShoppingList = () => {
    navigate('/shopping-list-manager');
  };

  // Show error if there's one
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      <Header />
      <main className="pt-16">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
              Welcome back, {userProfile?.name}!
            </h1>
            <p className="text-muted-foreground font-body">
              Here's your nutrition overview for today, {new Date()?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}.
            </p>
          </div>

          {/* Profile Summary */}
          <div className="mb-8">
            <ProfileSummaryCard profile={userProfile} />
          </div>

          {/* Quick Stats Grid */}
          <div className="mb-8">
            <QuickStatsGrid stats={quickStats} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Today's Meal Plan - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <TodaysMealPlan 
                meals={todaysMeals} 
                onLogMeal={handleLogMeal}
              />
            </div>

            {/* Nutrition Progress - Takes 1 column on xl screens */}
            <div className="xl:col-span-1">
              <NutritionProgressChart nutritionData={nutritionData} />
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActionMenu className="mb-8" />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;