import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      {/* Outer spinner */}
      <div className="absolute inset-0 rounded-full border-blue-400 opacity-20 animate-[spin_1s_linear_infinite]" />
      
      {/* Inner spinner with glow */}
      <div className="absolute inset-0 rounded-full border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent animate-[spin_0.8s_linear_infinite] after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
    </div>
  );
};

export default LoadingSpinner;