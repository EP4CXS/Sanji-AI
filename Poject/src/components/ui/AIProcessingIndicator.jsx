import React from 'react';
import Icon from '../AppIcon';

const AIProcessingIndicator = ({ 
  isProcessing = false, 
  type = 'default',
  size = 'default',
  className = ''
}) => {
  if (!isProcessing) return null;

  const getProcessingMessage = () => {
    switch (type) {
      case 'camera':
        return 'Processing image...';
      case 'meal-plan':
        return 'Generating meal plan...';
      case 'recipe':
        return 'Finding recipes...';
      case 'ingredient':
        return 'Recognizing ingredients...';
      default:
        return 'Processing...';
    }
  };

  const sizeClasses = {
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6'
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${sizeClasses[size] || sizeClasses.default} ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Icon 
            name="Loader2" 
            size={size === 'sm' ? 20 : size === 'lg' ? 32 : 24} 
            className="animate-spin text-primary" 
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {getProcessingMessage()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please wait while we process your request
          </p>
        </div>
      </div>
      
      {/* Progress bar animation */}
      <div className="mt-3 w-full bg-muted rounded-full h-1.5 overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-progress" style={{
          animation: 'progress 2s ease-in-out infinite'
        }}></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default AIProcessingIndicator;
