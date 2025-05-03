import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Get color based on progress
  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500 dark:bg-green-600';
    if (progress >= 66) return 'bg-blue-500 dark:bg-blue-600';
    if (progress >= 33) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-red-500 dark:bg-red-600';
  };

  return (
    <div className="relative pt-1">
      {/* Label with improved contrast */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{normalizedProgress}%</span>
      </div>
      
      {/* Progress bar container with enhanced neumorphic effect */}
      <div className="h-3 rounded-full bg-gray-100 dark:bg-dark-300 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] overflow-hidden">
        {/* Progress indicator with neumorphic design */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()} shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.1)] dark:shadow-[1px_1px_2px_rgba(0,0,0,0.2)]`}
          style={{
            width: `${normalizedProgress}%`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;