import React, { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import TaskFormPriorityButtons from './TaskFormPriorityButtons';
import { Task } from '../../types';
import Button from '../ui/Button';

// Extra options that nobody ever uses
// But hey, gotta make it look fancy

interface TaskFormOptionsProps {
  dueDate: string;
  onDueDateChange: (date: string) => void;
  priority: 'low' | 'medium' | 'high' | '';
  onPriorityChange: (priority: 'low' | 'medium' | 'high' | '') => void;
  recurringSettings?: Task['recurringSettings'];
  onRecurringSettingsChange?: (settings: Task['recurringSettings']) => void;
}

const TaskFormOptions: React.FC<TaskFormOptionsProps> = ({
  dueDate,
  onDueDateChange,
  priority,
  onPriorityChange,
  recurringSettings,
  onRecurringSettingsChange
}) => {
  const [showRecurringOptions, setShowRecurringOptions] = useState(
    recurringSettings?.enabled || false
  );

  // Handle toggling of recurring options
  const handleToggleRecurring = () => {
    const newState = !showRecurringOptions;
    setShowRecurringOptions(newState);
    
    // When closing recurring options, disable recurring
    if (!newState && onRecurringSettingsChange) {
      onRecurringSettingsChange(undefined);
    }
  };

  // Handle changes to recurring frequency
  const handleFrequencyChange = (frequency: 'daily' | 'weekly' | 'monthly' | 'custom') => {
    if (onRecurringSettingsChange) {
      onRecurringSettingsChange({
        enabled: true,
        frequency,
        customDays: recurringSettings?.customDays || 2,
        lastReset: recurringSettings?.lastReset
      });
    }
  };

  // Handle changes to custom days
  const handleCustomDaysChange = (days: number) => {
    if (onRecurringSettingsChange) {
      onRecurringSettingsChange({
        enabled: true,
        frequency: recurringSettings?.frequency || 'custom',
        customDays: days,
        lastReset: recurringSettings?.lastReset
      });
    }
  };

  // Create an ID for the recurring settings section for aria-controls
  const recurringSettingsSectionId = "form-recurring-settings-section";
  
  // Descriptive text for screen readers based on current state
  const toggleButtonAriaLabel = showRecurringOptions 
    ? `Recurring is on. ${recurringSettings?.frequency || 'daily'} frequency. Click to turn off recurring.`
    : "Make task recurring. Currently off. Click to turn on.";

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-300 animate-slide-up">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Date picker with improved light mode */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <Calendar size={16} className="text-gray-400" aria-hidden="true" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-dark-300 rounded-lg p-1.5 text-sm text-gray-700 dark:text-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed outline-none transition-all duration-300 hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] dark:hover:shadow-dark-neu-flat focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-dark-neu-flat"
            aria-label="Due date"
          />
        </div>
        
        {/* Priority buttons */}
        <TaskFormPriorityButtons 
          priority={priority} 
          onPriorityChange={onPriorityChange} 
        />

        {/* Only show recurring option if the handler is provided */}
        {onRecurringSettingsChange && (
          <Button
            variant="neutral"
            size="sm"
            onClick={handleToggleRecurring}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleRecurring();
              }
            }}
            className={`flex items-center gap-2 ${
              showRecurringOptions ? 'text-purple-500' : 'text-gray-500'
            }`}
            aria-expanded={showRecurringOptions}
            aria-controls={recurringSettingsSectionId}
            aria-label={toggleButtonAriaLabel}
          >
            <RefreshCw size={16} aria-hidden="true" />
            <span>{showRecurringOptions ? 'Recurring On' : 'Make Recurring'}</span>
          </Button>
        )}
      </div>
      
      {/* Recurring options */}
      {onRecurringSettingsChange && showRecurringOptions && (
        <div 
          id={recurringSettingsSectionId}
          className="mb-4 pl-2 space-y-4" 
          role="group" 
          aria-label="Recurring task options"
        >
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" id="frequency-heading">
              Repeat frequency
            </h3>
            <div 
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-labelledby="frequency-heading"
            >
              <FrequencyButton 
                active={recurringSettings?.frequency === 'daily' || !recurringSettings?.frequency} 
                onClick={() => handleFrequencyChange('daily')}
                label="Daily"
                ariaSelected={recurringSettings?.frequency === 'daily' || !recurringSettings?.frequency}
              />
              <FrequencyButton 
                active={recurringSettings?.frequency === 'weekly'} 
                onClick={() => handleFrequencyChange('weekly')}
                label="Weekly"
                ariaSelected={recurringSettings?.frequency === 'weekly'}
              />
              <FrequencyButton 
                active={recurringSettings?.frequency === 'monthly'} 
                onClick={() => handleFrequencyChange('monthly')}
                label="Monthly"
                ariaSelected={recurringSettings?.frequency === 'monthly'}
              />
              <FrequencyButton 
                active={recurringSettings?.frequency === 'custom'} 
                onClick={() => handleFrequencyChange('custom')}
                label="Custom"
                ariaSelected={recurringSettings?.frequency === 'custom'}
              />
            </div>
          </div>

          {recurringSettings?.frequency === 'custom' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" id="custom-days-label">
                Custom repeat interval
              </h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1"
                  max="365"
                  value={recurringSettings?.customDays || 2}
                  onChange={(e) => handleCustomDaysChange(parseInt(e.target.value) || 1)}
                  className="w-20 bg-gray-50 dark:bg-dark-300 rounded-lg p-2 text-sm text-gray-800 dark:text-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed outline-none"
                  aria-labelledby="custom-days-label"
                  aria-describedby="custom-days-description"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">days</span>
              </div>
              <p 
                id="custom-days-description" 
                className="text-xs text-gray-500 dark:text-gray-400 mt-1"
              >
                Task will repeat every {recurringSettings?.customDays || 2} {recurringSettings?.customDays === 1 ? 'day' : 'days'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper component for frequency buttons
const FrequencyButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
  ariaSelected: boolean;
}> = ({ active, onClick, label, ariaSelected }) => (
  <button
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
      ${active
        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat'
        : 'bg-gray-50 dark:bg-dark-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-400'
      }
    `}
    role="radio"
    aria-checked={ariaSelected}
    tabIndex={active ? 0 : -1}
  >
    {active && <span className="sr-only">Selected: </span>}
    {label}
  </button>
);

export default TaskFormOptions;