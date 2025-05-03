import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none active:scale-95";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const variantClasses = {
    primary: `bg-white dark:bg-dark-200 text-blue-600 dark:text-blue-400 
      ${disabled || isLoading
        ? 'opacity-50 cursor-not-allowed shadow-neu-flat dark:shadow-dark-neu-flat' 
        : 'shadow-neu-raised dark:shadow-dark-neu-raised hover:shadow-neu-flat dark:hover:shadow-dark-neu-flat active:shadow-neu-pressed dark:active:shadow-dark-neu-pressed hover:text-blue-500 dark:hover:text-blue-300'}
      after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-300 
      after:bg-gradient-to-r after:from-blue-500/10 after:to-blue-600/10 dark:after:from-blue-400/10 dark:after:to-purple-400/10 
      hover:after:opacity-100`,
    
    secondary: `bg-white dark:bg-dark-200 text-purple-600 dark:text-purple-400 
      ${disabled || isLoading
        ? 'opacity-50 cursor-not-allowed shadow-neu-flat dark:shadow-dark-neu-flat' 
        : 'shadow-neu-raised dark:shadow-dark-neu-raised hover:shadow-neu-flat dark:hover:shadow-dark-neu-flat active:shadow-neu-pressed dark:active:shadow-dark-neu-pressed hover:text-purple-500 dark:hover:text-purple-300'}
      after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-300 
      after:bg-gradient-to-r after:from-purple-500/10 after:to-pink-500/10 dark:after:from-purple-400/10 dark:after:to-pink-400/10 
      hover:after:opacity-100`,
    
    danger: `bg-white dark:bg-dark-200 text-red-600 dark:text-red-400 
      ${disabled || isLoading
        ? 'opacity-50 cursor-not-allowed shadow-neu-flat dark:shadow-dark-neu-flat' 
        : 'shadow-neu-raised dark:shadow-dark-neu-raised hover:shadow-neu-flat dark:hover:shadow-dark-neu-flat active:shadow-neu-pressed dark:active:shadow-dark-neu-pressed hover:text-red-500 dark:hover:text-red-300'}
      after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-300 
      after:bg-gradient-to-r after:from-red-500/10 after:to-red-600/10 dark:after:from-red-400/10 dark:after:to-orange-400/10 
      hover:after:opacity-100`,
    
    success: `bg-white dark:bg-dark-200 text-green-600 dark:text-green-400 
      ${disabled || isLoading
        ? 'opacity-50 cursor-not-allowed shadow-neu-flat dark:shadow-dark-neu-flat' 
        : 'shadow-neu-raised dark:shadow-dark-neu-raised hover:shadow-neu-flat dark:hover:shadow-dark-neu-flat active:shadow-neu-pressed dark:active:shadow-dark-neu-pressed hover:text-green-500 dark:hover:text-green-300'}
      after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-300 
      after:bg-gradient-to-r after:from-green-500/10 after:to-emerald-500/10 dark:after:from-green-400/10 dark:after:to-emerald-400/10 
      hover:after:opacity-100`,
    
    neutral: `bg-white dark:bg-dark-200 text-gray-600 dark:text-gray-400
      ${disabled || isLoading
        ? 'opacity-50 cursor-not-allowed shadow-neu-flat dark:shadow-dark-neu-flat' 
        : 'shadow-neu-raised dark:shadow-dark-neu-raised hover:shadow-neu-flat dark:hover:shadow-dark-neu-flat active:shadow-neu-pressed dark:active:shadow-dark-neu-pressed hover:text-gray-700 dark:hover:text-gray-300'}
      after:absolute after:inset-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-300 
      after:bg-gradient-to-r after:from-gray-500/10 after:to-gray-600/10 dark:after:from-gray-400/10 dark:after:to-gray-500/10 
      hover:after:opacity-100`
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const loadingClass = isLoading ? "cursor-wait" : "";
  
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${loadingClass} ${className}`;

  return (
    <button 
      className={combinedClasses} 
      disabled={disabled || isLoading} 
      {...props}
    >
      <span className={`relative z-10 inline-flex items-center gap-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {icon}
        {children}
      </span>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={size === 'lg' ? 'md' : 'sm'} />
        </div>
      )}
    </button>
  );
};

export default Button;