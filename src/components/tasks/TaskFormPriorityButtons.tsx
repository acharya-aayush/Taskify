import React from 'react';
import { X } from 'lucide-react';

// Just some fancy buttons to select priority
// Don't blame me if the colors hurt your eyes

interface TaskFormPriorityButtonsProps {
  priority: 'low' | 'medium' | 'high' | '';
  onPriorityChange: (priority: 'low' | 'medium' | 'high' | '') => void;
}

const TaskFormPriorityButtons: React.FC<TaskFormPriorityButtonsProps> = ({ priority, onPriorityChange }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-lg overflow-hidden bg-gray-50 dark:bg-dark-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-raised">
        <button
          type="button"
          onClick={() => onPriorityChange('low')}
          className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
            priority === 'low'
              ? 'bg-gray-50/50 dark:bg-dark-300 text-green-600 dark:text-green-400 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed'
              : 'text-gray-400 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
          }`}
        >
          Low
        </button>
        <button
          type="button"
          onClick={() => onPriorityChange('medium')}
          className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 border-x border-dark-300 dark:border-dark-300 ${
            priority === 'medium'
              ? 'bg-gray-50/50 dark:bg-dark-300 text-yellow-600 dark:text-yellow-400 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed'
              : 'text-gray-400 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
          }`}
        >
          Medium
        </button>
        <button
          type="button"
          onClick={() => onPriorityChange('high')}
          className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
            priority === 'high'
              ? 'bg-gray-50/50 dark:bg-dark-300 text-red-600 dark:text-red-400 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed'
              : 'text-gray-400 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
          }`}
        >
          High
        </button>
      </div>
      {priority && (
        <button
          type="button"
          onClick={() => onPriorityChange('')}
          className="p-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-raised hover:shadow-[1px_1px_2px_rgba(0,0,0,0.03),-1px_-1px_2px_rgba(255,255,255,0.6)] dark:hover:shadow-dark-neu-flat active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:active:shadow-dark-neu-pressed transition-all duration-300"
          aria-label="Clear priority"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default TaskFormPriorityButtons;