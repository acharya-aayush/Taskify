import React, { useState, useRef, useEffect } from 'react';
import { Clock, Plus } from 'lucide-react';
import Button from '../ui/Button';
import { checkEasterEggs, logEasterEgg, getRandomFunTask } from '../../utils/easterEggs';
import { EasterEggType, Task } from '../../types';
import Tooltip from '../ui/Tooltip';
import TaskFormOptions from './TaskFormOptions';

// Threw this form together in a hurry
// Might look fancy but it's probably buggy

interface TaskFormProps {
  onAddTask: (title: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', recurringSettings?: Task['recurringSettings']) => void;
  onTriggerEasterEgg: (type: EasterEggType) => void;
  isEmpty?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, onTriggerEasterEgg, isEmpty }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [recurringSettings, setRecurringSettings] = useState<Task['recurringSettings']>();
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
      onAddTask(title, dueDate || undefined, priority || undefined, recurringSettings);
    }
    
    // Reset form
    setTitle('');
    setDueDate('');
    setPriority('');
    setRecurringSettings(undefined);
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
                aria-label={showOptions ? "Hide task options" : "Show task options"}
                aria-expanded={showOptions}
                aria-controls="task-form-options"
                onClick={() => setShowOptions(!showOptions)}
              >
                <Clock size={18} className="transition-colors duration-300" aria-hidden="true" />
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
                <Plus size={18} className="transition-transform duration-300" aria-hidden="true" />
              </Button>
            </Tooltip>
          </div>
          
          {/* Expanded options */}
          {showOptions && (
            <div id="task-form-options">
              <TaskFormOptions
                dueDate={dueDate}
                onDueDateChange={setDueDate}
                priority={priority}
                onPriorityChange={setPriority}
                recurringSettings={recurringSettings}
                onRecurringSettingsChange={setRecurringSettings}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;