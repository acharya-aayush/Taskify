import React, { useState } from 'react';
import { Task } from '../../types';
import Button from '../ui/Button';
import { Bell, Plus, Trash2 } from 'lucide-react';

interface ReminderSettingsProps {
  reminderSettings?: Task['reminderSettings'];
  onSave: (settings: Task['reminderSettings']) => void;
  onCancel: () => void;
}

const DEFAULT_INTERVALS = [30, 60, 1440]; // 30 mins, 1 hour, 24 hours

const ReminderSettings: React.FC<ReminderSettingsProps> = ({ reminderSettings, onSave, onCancel }) => {
  const [settings, setSettings] = useState<Task['reminderSettings']>(
    reminderSettings || { enabled: false, intervals: DEFAULT_INTERVALS }
  );

  const handleToggleReminders = () => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const handleAddInterval = () => {
    setSettings(prev => ({
      ...prev,
      intervals: [...prev.intervals, 30]
    }));
  };

  const handleUpdateInterval = (index: number, value: number) => {
    setSettings(prev => ({
      ...prev,
      intervals: prev.intervals.map((interval, i) => 
        i === index ? value : interval
      )
    }));
  };

  const handleRemoveInterval = (index: number) => {
    setSettings(prev => ({
      ...prev,
      intervals: prev.intervals.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Button
          variant="neutral"
          size="sm"
          onClick={handleToggleReminders}
          className={`flex items-center gap-2 ${
            settings.enabled ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <Bell size={16} />
          {settings.enabled ? 'Reminders On' : 'Add Reminders'}
        </Button>

        {settings.enabled && (
          <div className="pl-2 space-y-2">
            {settings.intervals.map((interval, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={interval}
                  onChange={(e) => handleUpdateInterval(index, Number(e.target.value))}
                  className="bg-gray-50 dark:bg-dark-300 rounded-lg p-1 text-sm text-gray-800 dark:text-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] dark:shadow-dark-neu-pressed outline-none"
                >
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="120">2 hours before</option>
                  <option value="1440">1 day before</option>
                </select>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveInterval(index)}
                  className="p-1"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            
            <Button
              variant="neutral"
              size="sm"
              onClick={handleAddInterval}
              className="flex items-center gap-1 text-sm"
            >
              <Plus size={14} />
              Add Interval
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="neutral" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onSave(settings.enabled ? settings : undefined)}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ReminderSettings;