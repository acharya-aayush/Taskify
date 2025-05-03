import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import Button from '../ui/Button';
import { checkEasterEggs, logEasterEgg, getRandomFunTask } from '../../utils/easterEggs';
import { EasterEggType } from '../../types';
import Tooltip from '../ui/Tooltip';

interface TaskFormProps {
  onAddTask: (title: string, dueDate?: string, priority?: 'low' | 'medium' | 'high') => void;
  onTriggerEasterEgg: (type: EasterEggType) => void;
  isEmpty?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, onTriggerEasterEgg, isEmpty }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [showOptions, setShowOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Check for easter eggs
    const easterEggType = checkEasterEggs(title);
    
    if (easterEggType) {
      // Handle easter egg
      logEasterEgg(easterEggType);
      onTriggerEasterEgg(easterEggType);
      
      // For the "bored" easter egg, add a random fun task
      if (easterEggType === 'INJECT_RANDOM_TASK') {
        const funTask = getRandomFunTask();
        onAddTask(funTask, dueDate || undefined, priority || undefined);
      }
    } else {
      // Add regular task with animation delay
      await new Promise(resolve => setTimeout(resolve, 200));
      onAddTask(title, dueDate || undefined, priority || undefined);
    }
    
    // Reset form
    setTitle('');
    setDueDate('');
    setPriority('');
    setShowOptions(false);
    setIsSubmitting(false);
    
    // Focus input again
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full mb-6">
      <form onSubmit={handleSubmit} className="w-full">
        {isEmpty && (
          <div className="text-center mb-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🎯 Let's Get Things Done!
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Add your first task to start being productive
            </p>
          </div>
        )}
        
        {/* Neumorphic input container with improved light mode */}
        <div className="mb-3 rounded-xl bg-white dark:bg-dark-200 p-4 shadow-[12px_12px_24px_rgba(0,0,0,0.12),-12px_-12px_24px_rgba(255,255,255,0.95)] dark:shadow-dark-neu-raised transition-all duration-300 hover:shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] dark:hover:shadow-dark-neu-flat">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="⌕ What needs to be done?"
              className="w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-300 focus:placeholder-gray-500"
              aria-label="New task title"
            />
            
            <Tooltip content="Add task options">
              <Button 
                type="button"
                variant="neutral"
                size="sm"
                className={`p-1.5 rounded-full transition-transform duration-300 bg-gray-50 hover:bg-gray-100 dark:bg-dark-300 ${
                  showOptions 
                    ? 'scale-90 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed text-blue-500 dark:text-blue-400' 
                    : 'shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-raised hover:scale-105'
                }`}
                aria-label="Show options"
                onClick={() => setShowOptions(!showOptions)}
              >
                <Clock size={18} className="transition-colors duration-300" />
              </Button>
            </Tooltip>
            
            <Tooltip content="Add task">
              <Button 
                type="submit"
                variant="primary"
                size="sm"
                className={`p-1.5 rounded-full transition-all duration-300 bg-gray-50 hover:bg-gray-100 dark:bg-dark-300 ${
                  !title.trim() || isSubmitting 
                    ? 'opacity-50' 
                    : 'shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-raised hover:scale-105 hover:rotate-90'
                }`}
                disabled={!title.trim() || isSubmitting}
                aria-label="Add task"
              >
                <Plus size={18} className="transition-transform duration-300" />
              </Button>
            </Tooltip>
          </div>
          
          {/* Expanded options with enhanced light mode styling */}
          {showOptions && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-300 animate-slide-up">
              <div className="flex flex-wrap items-center gap-4">
                {/* Date picker with improved light mode */}
                <div className="flex items-center gap-2 min-w-[200px]">
                  <Calendar size={16} className="text-gray-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-dark-300 rounded-lg p-1.5 text-sm text-gray-700 dark:text-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed outline-none transition-all duration-300 hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] dark:hover:shadow-dark-neu-flat focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-dark-neu-flat"
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
                          ? 'bg-gray-50/50 dark:bg-dark-300 text-green-600 dark:text-green-400 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed'
                          : 'text-gray-400 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                    >
                      Low
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('medium')}
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
                      onClick={() => setPriority('high')}
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
                      onClick={() => setPriority('')}
                      className="p-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-raised hover:shadow-[1px_1px_2px_rgba(0,0,0,0.03),-1px_-1px_2px_rgba(255,255,255,0.6)] dark:hover:shadow-dark-neu-flat active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:active:shadow-dark-neu-pressed transition-all duration-300"
                      aria-label="Clear priority"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;