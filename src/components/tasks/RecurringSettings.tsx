import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../../types';
import Button from '../ui/Button';
import { RefreshCw, Plus, Check } from 'lucide-react';

interface RecurringSettingsProps {
  recurringSettings?: Task['recurringSettings'];
  onSave: (settings: Task['recurringSettings']) => void;
  onCancel: () => void;
}

const DEFAULT_SETTINGS: NonNullable<Task['recurringSettings']> = {
  enabled: false,
  frequency: 'daily',
  customDays: 2,
};

const RecurringSettings: React.FC<RecurringSettingsProps> = ({ 
  recurringSettings, 
  onSave, 
  onCancel 
}) => {
  const [settings, setSettings] = useState<NonNullable<Task['recurringSettings']>>(
    recurringSettings || DEFAULT_SETTINGS
  );
  
  // Reference for custom days input for focus management
  const customDaysInputRef = useRef<HTMLInputElement>(null);
  
  // Focus the custom days input when custom frequency is selected
  useEffect(() => {
    if (settings.frequency === 'custom' && customDaysInputRef.current) {
      customDaysInputRef.current.focus();
    }
  }, [settings.frequency]);

  const handleToggleRecurring = () => {
    setSettings(prev => ({
      ...DEFAULT_SETTINGS,
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const handleFrequencyChange = (frequency: 'daily' | 'weekly' | 'monthly' | 'custom') => {
    setSettings(prev => ({
      ...prev,
      frequency
    }));
  };

  const handleCustomDaysChange = (days: number) => {
    setSettings(prev => ({
      ...prev,
      customDays: days
    }));
  };

  const handleSave = (e: React.MouseEvent) => {
    // Prevent any event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    const finalSettings = settings.enabled ? settings : undefined;
    onSave(finalSettings);
  };
  
  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
  
  // New handler to ensure events don't bubble up
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Create an ID for the recurring settings section for aria-controls
  const recurringSettingsSectionId = "recurring-settings-section";
  
  // Descriptive text for screen readers based on current state
  const toggleButtonAriaLabel = settings.enabled 
    ? `Recurring is on. Frequency: ${settings.frequency}. Click to turn off recurring.`
    : "Make task recurring. Currently off. Click to turn on.";

  return (
    <div className="space-y-4" role="region" aria-label="Recurring task settings">
      <div className="space-y-3">
        <Button
          variant="neutral"
          size="sm"
          onClick={handleToggleRecurring}
          onKeyDown={(e) => handleKeyDown(e, handleToggleRecurring)}
          className={`flex items-center gap-2 ${
            settings.enabled ? 'text-purple-500' : 'text-gray-500'
          }`}
          aria-expanded={settings.enabled}
          aria-controls={recurringSettingsSectionId}
          aria-label={toggleButtonAriaLabel}
        >
          <RefreshCw size={16} aria-hidden="true" />
          <span>{settings.enabled ? 'Recurring On' : 'Make Task Recurring'}</span>
        </Button>

        {settings.enabled && (
          <div 
            id={recurringSettingsSectionId}
            className="pl-2 space-y-4" 
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
                  active={settings.frequency === 'daily'} 
                  onClick={() => handleFrequencyChange('daily')}
                  onKeyDown={(e) => handleKeyDown(e, () => handleFrequencyChange('daily'))}
                  label="Daily"
                  ariaSelected={settings.frequency === 'daily'}
                />
                <FrequencyButton 
                  active={settings.frequency === 'weekly'} 
                  onClick={() => handleFrequencyChange('weekly')}
                  onKeyDown={(e) => handleKeyDown(e, () => handleFrequencyChange('weekly'))}
                  label="Weekly"
                  ariaSelected={settings.frequency === 'weekly'}
                />
                <FrequencyButton 
                  active={settings.frequency === 'monthly'} 
                  onClick={() => handleFrequencyChange('monthly')}
                  onKeyDown={(e) => handleKeyDown(e, () => handleFrequencyChange('monthly'))}
                  label="Monthly"
                  ariaSelected={settings.frequency === 'monthly'}
                />
                <FrequencyButton 
                  active={settings.frequency === 'custom'} 
                  onClick={() => handleFrequencyChange('custom')}
                  onKeyDown={(e) => handleKeyDown(e, () => handleFrequencyChange('custom'))}
                  label="Custom"
                  ariaSelected={settings.frequency === 'custom'}
                />
              </div>
            </div>

            {settings.frequency === 'custom' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" id="custom-days-label">
                  Custom repeat interval
                </h3>
                <div className="flex items-center gap-2">
                  <input 
                    ref={customDaysInputRef}
                    type="number" 
                    min="1"
                    max="365"
                    value={settings.customDays || 1}
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
                  Task will repeat every {settings.customDays || 1} {settings.customDays === 1 ? 'day' : 'days'}
                </p>
              </div>
            )}

            <div 
              className="bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-100 dark:border-purple-900/20 mt-4"
              role="region"
              aria-label="Information about recurring tasks"
            >
              <h4 className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
                <RefreshCw size={14} className="text-purple-500 dark:text-purple-400" aria-hidden="true" />
                How recurring tasks work
              </h4>
              <ul className="text-xs text-gray-700 dark:text-gray-300 mt-2 space-y-1 pl-5 list-disc">
                <li>When you mark a recurring task as complete, it will automatically reset to active after the specified interval</li>
                <li>All subtasks will be reset to incomplete</li>
                {settings.frequency === 'daily' && (
                  <li>This task will reset every 1 day</li>
                )}
                {settings.frequency === 'weekly' && (
                  <li>This task will reset once per week on the same day</li>
                )}
                {settings.frequency === 'monthly' && (
                  <li>This task will reset once per month on the same date</li>
                )}
                {settings.frequency === 'custom' && (
                  <li>This task will reset every {settings.customDays || 1} {settings.customDays === 1 ? 'day' : 'days'}</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div 
        className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700"
        onClick={handleButtonClick}
      >
        <Button 
          variant="neutral" 
          onClick={onCancel} 
          type="button"
          aria-label="Cancel recurring settings changes"
        >
          Cancel
        </Button>
        <Button 
          variant="primary"
          onClick={handleSave}
          type="button"
          className="z-10 relative pointer-events-auto"
          aria-label={settings.enabled ? "Save recurring task settings" : "Disable recurring for this task"}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

// Helper component for frequency buttons
const FrequencyButton: React.FC<{
  active: boolean;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  label: string;
  ariaSelected: boolean;
}> = ({ active, onClick, onKeyDown, label, ariaSelected }) => (
  <button
    onClick={onClick}
    onKeyDown={onKeyDown}
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
    {active && <Check size={14} aria-hidden="true" />}
    {label}
  </button>
);

export default RecurringSettings;