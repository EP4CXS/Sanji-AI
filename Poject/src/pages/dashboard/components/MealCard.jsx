import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MealCard = ({ meal, onLogMeal }) => {
  const [isLogged, setIsLogged] = useState(meal?.logged || false);
  const [logStatus, setLogStatus] = useState(meal?.status || null);

  const handleLogMeal = (status) => {
    setIsLogged(true);
    setLogStatus(status);
    onLogMeal(meal?.id, status);
  };

  const getStatusColor = () => {
    if (!isLogged) return 'text-muted-foreground';
    return logStatus === 'ate' ? 'text-success' : 'text-warning';
  };

  const getStatusIcon = () => {
    if (!isLogged) return 'Clock';
    return logStatus === 'ate' ? 'CheckCircle' : 'XCircle';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Horizontal Layout */}
      <div className="flex">
        {/* Left Side - Image and Buttons */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={meal?.image}
              alt={meal?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium font-caption">
                {meal?.type}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                <Icon name={getStatusIcon()} size={20} />
              </div>
            </div>
          </div>
          
          {/* Action Buttons - Below Image */}
          <div className="p-4">
            <div className="flex space-x-2">
              <Button
                variant="success"
                size="lg"
                onClick={() => handleLogMeal('ate')}
                iconName="Check"
                iconPosition="left"
                className="flex-1"
                disabled={isLogged}
              >
                Ate
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleLogMeal('skipped')}
                iconName="X"
                iconPosition="left"
                className="flex-1"
                disabled={isLogged}
              >
                Skipped
              </Button>
            </div>
            {isLogged && (
              <p className={`text-sm font-medium text-center mt-2 ${getStatusColor()} font-body`}>
                {logStatus === 'ate' ? '✓ Meal completed!' : '✗ Meal skipped'}
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Title and Rating */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground font-heading mb-1">
                {meal?.name}
              </h3>
              <p className="text-sm text-muted-foreground font-body">
                Classic Filipino dish with balanced nutrition
              </p>
            </div>
            <div className="flex items-center space-x-1 ml-4">
              <Icon name="Star" size={20} className="text-warning fill-current" />
              <span className="text-lg font-semibold text-foreground">{meal?.rating}</span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Basic Info
            </h4>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Serves</p>
                <p className="text-lg font-semibold text-foreground">{meal?.servings || 4}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Prep Time</p>
                <p className="text-lg font-semibold text-foreground">{meal?.prepTime}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Cost</p>
                <p className="text-lg font-semibold text-primary">₱{meal?.cost}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Calories</p>
                <p className="text-lg font-semibold text-foreground">{meal?.calories} kcal</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Protein</p>
                <p className="text-lg font-semibold text-foreground">{meal?.protein}g</p>
              </div>
            </div>
          </div>

          {/* Nutrition Details */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Nutrition Details
            </h4>
            <div className="grid grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                <p className="text-base font-semibold text-foreground">{meal?.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Fat</p>
                <p className="text-base font-semibold text-foreground">{meal?.fat}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Fiber</p>
                <p className="text-base font-semibold text-foreground">{meal?.fiber}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Sugar</p>
                <p className="text-base font-semibold text-foreground">{meal?.sugar}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Sodium</p>
                <p className="text-base font-semibold text-foreground">{meal?.sodium}mg</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Cholesterol</p>
                <p className="text-base font-semibold text-foreground">{meal?.cholesterol}mg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;