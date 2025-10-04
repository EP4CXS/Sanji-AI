import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const RecipeHeader = ({ recipe }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'hard': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getRoleFitColor = (fit) => {
    switch (fit?.toLowerCase()) {
      case 'excellent': return 'text-success bg-success/10';
      case 'good': return 'text-primary bg-primary/10';
      case 'fair': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Recipe Image */}
        <div className="relative h-64 lg:h-80 overflow-hidden">
          <Image
            src={recipe?.image}
            alt={recipe?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe?.difficulty)}`}>
              {recipe?.difficulty}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <button className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
              <Icon name="Heart" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Recipe Info */}
        <div className="p-6 lg:p-8">
          <div className="mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground font-heading mb-2">
              {recipe?.title}
            </h1>
            <p className="text-muted-foreground font-body">
              {recipe?.description}
            </p>
          </div>

          {/* Quick Stats - Row 1: Serves, Prep Time, Cost, Calories, Protein */}
          <div className="mb-4">
            <div className="grid grid-cols-5 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-1 mx-auto">
                  <Icon name="Users" size={18} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-caption">Serves</p>
                <p className="text-base font-semibold text-foreground font-body">{recipe?.servings}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg mb-1 mx-auto">
                  <Icon name="Clock" size={18} className="text-accent" />
                </div>
                <p className="text-xs text-muted-foreground font-caption">Prep Time</p>
                <p className="text-base font-semibold text-foreground font-body">{recipe?.prepTime}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg mb-1 mx-auto">
                  <Icon name="DollarSign" size={18} className="text-success" />
                </div>
                <p className="text-xs text-muted-foreground font-caption">Cost</p>
                <p className="text-base font-semibold text-foreground font-body">{recipe?.costPerServing}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg mb-1 mx-auto">
                  <Icon name="Zap" size={18} className="text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground font-caption">Calories</p>
                <p className="text-base font-semibold text-foreground font-body">{recipe?.nutrition?.calories}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-1 mx-auto">
                  <Icon name="Activity" size={18} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-caption">Protein</p>
                <p className="text-base font-semibold text-foreground font-body">{recipe?.nutrition?.protein}g</p>
              </div>
            </div>
          </div>

          {/* Quick Stats - Row 2: Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol */}
          <div className="mb-6">
            <div className="grid grid-cols-6 gap-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-caption">Carbs</p>
                <p className="text-sm font-semibold text-foreground font-body">{recipe?.nutrition?.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-caption">Fat</p>
                <p className="text-sm font-semibold text-foreground font-body">{recipe?.nutrition?.fat}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-caption">Fiber</p>
                <p className="text-sm font-semibold text-foreground font-body">{recipe?.nutrition?.fiber}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-caption">Sugar</p>
                <p className="text-sm font-semibold text-foreground font-body">{recipe?.nutrition?.sugar}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-caption">Sodium</p>
                <p className="text-sm font-semibold text-foreground font-body">{recipe?.nutrition?.sodium}mg</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-caption">Cholesterol</p>
                <p className="text-sm font-semibold text-foreground font-body">{recipe?.nutrition?.cholesterol}mg</p>
              </div>
            </div>
          </div>

          {/* Tags and Role Fit */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground font-body mb-2">Role Fit</p>
              <div className="flex flex-wrap gap-2">
                {recipe?.roleFit?.map((role, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleFitColor(role?.fit)}`}
                  >
                    {role?.role}: {role?.fit}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground font-body mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {recipe?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHeader;