import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getAllFoods } from '../../../utils/foodData';

const IngredientRecognition = ({ 
  capturedImage, 
  onIngredientsConfirmed, 
  isProcessing = false 
}) => {
  const [recognizedIngredients, setRecognizedIngredients] = useState([]);
  const [manualIngredients, setManualIngredients] = useState([]);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');

  // Generate mock ingredients from CSV data
  const generateMockIngredients = async () => {
    try {
      const allFoods = await getAllFoods();
      const commonIngredients = [
        'Tomatoes', 'Onions', 'Garlic', 'Chicken', 'Pork', 'Rice',
        'Soy sauce', 'Vinegar', 'Ginger', 'Bell Peppers', 'Carrots'
      ];
      
      // Pick 3-5 random common ingredients
      const numIngredients = Math.floor(Math.random() * 3) + 3;
      const selectedIngredients = [];
      
      for (let i = 0; i < numIngredients; i++) {
        const ingredient = commonIngredients[Math.floor(Math.random() * commonIngredients.length)];
        const confidence = 0.7 + Math.random() * 0.25;
        
        selectedIngredients.push({
          id: i + 1,
          name: ingredient,
          confidence: confidence,
          quantity: `${Math.floor(Math.random() * 3) + 1} pieces`,
          category: "Ingredients",
          nutrition: { 
            calories: Math.floor(Math.random() * 50) + 10, 
            carbs: Math.floor(Math.random() * 10) + 1, 
            protein: Math.floor(Math.random() * 5) + 1, 
            fat: Math.floor(Math.random() * 3) + 0.1 
          },
          freshness: "Fresh",
          alternatives: []
        });
      }
      
      return selectedIngredients;
    } catch (error) {
      console.error('Error generating ingredients:', error);
      return [
        {
          id: 1,
          name: "Tomatoes",
          confidence: 0.95,
          quantity: "3 pieces",
          category: "Vegetables",
          nutrition: { calories: 18, carbs: 3.9, protein: 0.9, fat: 0.2 },
          freshness: "Fresh",
          alternatives: []
        }
      ];
    }
  };

  useEffect(() => {
    if (capturedImage && !isProcessing) {
      // Simulate AI processing delay
      setTimeout(async () => {
        const ingredients = await generateMockIngredients();
        setRecognizedIngredients(ingredients);
      }, 2000);
    }
  }, [capturedImage, isProcessing]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.7) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  const updateIngredientQuantity = (id, quantity) => {
    setRecognizedIngredients(prev =>
      prev?.map(ingredient =>
        ingredient?.id === id ? { ...ingredient, quantity } : ingredient
      )
    );
  };

  const removeIngredient = (id) => {
    setRecognizedIngredients(prev =>
      prev?.filter(ingredient => ingredient?.id !== id)
    );
  };

  const addManualIngredient = () => {
    if (!newIngredient?.trim()) return;

    const ingredient = {
      id: Date.now(),
      name: newIngredient,
      confidence: 1.0,
      quantity: "1 piece",
      category: "Manual",
      nutrition: { calories: 0, carbs: 0, protein: 0, fat: 0 },
      freshness: "Unknown",
      alternatives: [],
      isManual: true
    };

    setManualIngredients(prev => [...prev, ingredient]);
    setNewIngredient('');
    setShowManualAdd(false);
  };

  const confirmIngredients = () => {
    const allIngredients = [...recognizedIngredients, ...manualIngredients];
    onIngredientsConfirmed(allIngredients);
  };

  const totalIngredients = recognizedIngredients?.length + manualIngredients?.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recognized Ingredients</h3>
          <p className="text-sm text-muted-foreground">
            {totalIngredients} ingredient{totalIngredients !== 1 ? 's' : ''} detected
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowManualAdd(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Manual
        </Button>
      </div>
      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="relative">
          <img
            src={capturedImage?.url}
            alt="Captured ingredients"
            className="w-full h-48 object-cover rounded-organic border border-border"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {capturedImage?.lightingQuality} lighting
          </div>
        </div>
      )}
      {/* Recognition Results */}
      <div className="space-y-4">
        {recognizedIngredients?.map((ingredient) => (
          <div key={ingredient?.id} className="bg-card border border-border rounded-organic p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground">{ingredient?.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full bg-muted ${getConfidenceColor(ingredient?.confidence)}`}>
                    {getConfidenceLabel(ingredient?.confidence)} ({Math.round(ingredient?.confidence * 100)}%)
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{ingredient?.category}</p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeIngredient(ingredient?.id)}
                className="text-error hover:text-error"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs text-muted-foreground">Quantity</label>
                <input
                  type="text"
                  value={ingredient?.quantity}
                  onChange={(e) => updateIngredientQuantity(ingredient?.id, e?.target?.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-organic text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Freshness</label>
                <div className="mt-1 px-3 py-2 bg-muted rounded-organic text-sm">
                  {ingredient?.freshness}
                </div>
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Calories</div>
                <div className="text-sm font-medium">{ingredient?.nutrition?.calories}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Carbs</div>
                <div className="text-sm font-medium">{ingredient?.nutrition?.carbs}g</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Protein</div>
                <div className="text-sm font-medium">{ingredient?.nutrition?.protein}g</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Fat</div>
                <div className="text-sm font-medium">{ingredient?.nutrition?.fat}g</div>
              </div>
            </div>

            {/* Alternatives */}
            {ingredient?.alternatives?.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">Alternatives:</div>
                <div className="flex flex-wrap gap-2">
                  {ingredient?.alternatives?.map((alt, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full cursor-pointer hover:bg-secondary/30"
                      onClick={() => {
                        const updated = { ...ingredient, name: alt };
                        setRecognizedIngredients(prev =>
                          prev?.map(ing => ing?.id === ingredient?.id ? updated : ing)
                        );
                      }}
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Manual Ingredients */}
        {manualIngredients?.map((ingredient) => (
          <div key={ingredient?.id} className="bg-accent/10 border border-accent/20 rounded-organic p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Plus" size={16} className="text-accent" />
                <span className="font-medium text-foreground">{ingredient?.name}</span>
                <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">Manual</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setManualIngredients(prev => prev?.filter(ing => ing?.id !== ingredient?.id))}
                className="text-error hover:text-error"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Manual Add Modal */}
      {showManualAdd && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-organic-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Add Ingredient Manually</h4>
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e?.target?.value)}
              placeholder="Enter ingredient name"
              className="w-full px-3 py-2 border border-border rounded-organic mb-4"
              onKeyPress={(e) => e?.key === 'Enter' && addManualIngredient()}
            />
            <div className="flex space-x-3">
              <Button
                variant="default"
                onClick={addManualIngredient}
                disabled={!newIngredient?.trim()}
                className="flex-1"
              >
                Add Ingredient
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowManualAdd(false);
                  setNewIngredient('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Button */}
      {totalIngredients > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="default"
            size="lg"
            onClick={confirmIngredients}
            iconName="ChefHat"
            iconPosition="left"
            className="px-8"
          >
            Generate Recipes ({totalIngredients} ingredients)
          </Button>
        </div>
      )}
    </div>
  );
};

export default IngredientRecognition;