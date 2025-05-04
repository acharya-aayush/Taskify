import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

// Basic form for editing tasks... probably buggy
// But hey, if it works it works

interface TaskEditFormProps {
  initialTitle: string;
  initialDueDate?: string;
  initialPriority?: 'low' | 'medium' | 'high' | '';
  onSave: (updates: { title: string; dueDate?: string; priority?: 'low' | 'medium' | 'high' | undefined }) => void;
  onCancel: () => void;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
  initialTitle,
  initialDueDate = '',
  initialPriority = '',
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [priority, setPriority] = useState(initialPriority);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title,
      dueDate: dueDate || undefined,
      priority: priority as 'low' | 'medium' | 'high' | undefined
    });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-gray-50 dark:bg-dark-300 rounded-lg p-2 text-gray-800 dark:text-gray-100 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed outline-none transition-all duration-300 focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-dark-neu-flat"
        autoFocus
        placeholder="Task title... or whatever"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-dark-300 rounded-lg p-1.5 text-sm text-gray-800 dark:text-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed outline-none transition-all duration-300"
          />
        </div>
        
        {/* Priority buttons with improved light mode */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden bg-gray-50 dark:bg-dark-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-raised">
            <button
              type="button"
              onClick={() => setPriority('low')}
              className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                priority === 'low'
                  ? 'text-green-400 shadow-neu-pressed dark:shadow-dark-neu-pressed after:absolute after:inset-0 after:bg-green-400/10 after:animate-glow-pulse'
                  : 'text-gray-400 dark:text-gray-400 hover:text-green-400'
              }`}
            >
              Low
            </button>
            <button
              type="button"
              onClick={() => setPriority('medium')}
              className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 border-x border-dark-300 dark:border-dark-300 ${
                priority === 'medium'
                  ? 'text-yellow-400 shadow-neu-pressed dark:shadow-dark-neu-pressed after:absolute after:inset-0 after:bg-yellow-400/10 after:animate-glow-pulse'
                  : 'text-gray-400 dark:text-gray-400 hover:text-yellow-400'
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setPriority('high')}
              className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                priority === 'high'
                  ? 'text-red-400 shadow-neu-pressed dark:shadow-dark-neu-pressed after:absolute after:inset-0 after:bg-red-400/10 after:animate-glow-pulse'
                  : 'text-gray-400 dark:text-gray-400 hover:text-red-400'
              }`}
            >
              High
            </button>
          </div>
          {priority && (
            <button
              type="button"
              onClick={() => setPriority('')}
              className="p-1.5 rounded-lg text-sm text-gray-400 shadow-neu-raised dark:shadow-dark-neu-raised hover:shadow-neu-flat dark:hover:shadow-dark-neu-flat active:shadow-neu-pressed dark:active:shadow-dark-neu-pressed transition-all duration-300"
              aria-label="Clear priority"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-3">
        <Button 
          variant="neutral" 
          size="sm" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleSave}
          disabled={!title.trim()}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default TaskEditForm;