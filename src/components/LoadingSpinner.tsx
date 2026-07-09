import React from 'react';
import { Brain, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message = "Analyzing your form...", size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin`}>
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
      </div>
      <div className="text-center">
        <p className="text-gray-600 font-semibold text-lg">{message}</p>
        <div className="flex items-center justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}
