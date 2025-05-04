import React, { useState } from 'react';
import { Task } from '../../types';
import Button from '../ui/Button';
import { Bell, Plus, Trash2, Clock, Volume2, VolumeX } from 'lucide-react';

interface ReminderSettingsProps {
  reminderSettings?: Task['reminderSettings'];
  onSave: (settings: Task['reminderSettings']) => void;
  onCancel: () => void;
}

type NotificationSound = 'default' | 'bell' | 'chime' | 'notification';

const DEFAULT_INTERVALS = [30, 60, 1440]; // 30 mins, 1 hour, 24 hours
const NOTIFICATION_SOUNDS: Array<{ id: NotificationSound; label: string; url: string }> = [
  { id: 'default', label: 'Default', url: '/sounds/default.mp3' },
  { id: 'bell', label: 'Bell', url: '/sounds/bell.mp3' },
  { id: 'chime', label: 'Chime', url: '/sounds/chime.mp3' },
  { id: 'notification', label: 'Notification', url: '/sounds/notification.mp3' }
];

const ReminderSettings: React.FC<ReminderSettingsProps> = ({ reminderSettings, onSave, onCancel }) => {
  const defaultSettings: NonNullable<Task['reminderSettings']> = {
    enabled: false,
    intervals: DEFAULT_INTERVALS,
    customTimes: [],
    sound: 'default',
    volume: 0.5
  };

  const [settings, setSettings] = useState<NonNullable<Task['reminderSettings']>>(
    reminderSettings || defaultSettings
  );

  const handleToggleReminders = () => {
    setSettings(prev => ({
      ...defaultSettings,
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const handleAddInterval = () => {
    setSettings(prev => ({
      ...defaultSettings,
      ...prev,
      intervals: [...prev.intervals, 30]
    }));
  };

  const handleAddCustomTime = () => {
    // Add a default time of current time + 1 hour using today's date
    const defaultTime = new Date();
    const currentHour = defaultTime.getHours();
    const nextHour = (currentHour + 1) % 24;
    defaultTime.setHours(nextHour, 0, 0, 0);
    
    const timeStr = defaultTime.toISOString();
    
    setSettings(prev => ({
      ...defaultSettings,
      ...prev,
      customTimes: [...(prev.customTimes || []), timeStr]
    }));
  };

  const handleUpdateInterval = (index: number, value: number) => {
    setSettings(prev => ({
      ...defaultSettings,
      ...prev,
      intervals: prev.intervals.map((interval, i) => 
        i === index ? value : interval
      )
    }));
  };

  const handleUpdateCustomTime = (index: number, value: string) => {
    setSettings(prev => {
      try {
        // Create a new date with the current date but updated time
        const [hours, minutes] = value.split(':');
        const parsedHours = parseInt(hours, 10);
        const parsedMinutes = parseInt(minutes, 10);
        
        // Create a new date with just the current date (no time)
        const today = new Date();
        // Use the same date as today, but with the selected time
        const newDate = new Date(
          today.getFullYear(), 
          today.getMonth(), 
          today.getDate(), 
          parsedHours, 
          parsedMinutes, 
          0, 
          0
        );
        
        const newTimeStr = newDate.toISOString();
        
        // Update custom times array
        const newCustomTimes = [...(prev.customTimes || [])];
        newCustomTimes[index] = newTimeStr;
        
        return {
          ...defaultSettings,
          ...prev,
          customTimes: newCustomTimes
        };
      } catch (err) {
        return prev; // Return original if error
      }
    });
  };

  const handleRemoveInterval = (index: number) => {
    setSettings(prev => ({
      ...defaultSettings,
      ...prev,
      intervals: prev.intervals.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveCustomTime = (index: number) => {
    setSettings(prev => ({
      ...defaultSettings,
      ...prev,
      customTimes: (prev.customTimes || []).filter((_, i) => i !== index)
    }));
  };

  const handleUpdateSound = (sound: NotificationSound) => {
    setSettings(prev => ({
      ...defaultSettings,
      ...prev,
      sound
    }));
  };

  const handleUpdateVolume = (volume: number) => {
    setSettings(prev => ({
      ...defaultSettings,
      ...prev,
      volume
    }));
  };

  const handleSave = () => {
    const finalSettings = settings.enabled ? settings : undefined;
    onSave(finalSettings);
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
          <div className="space-y-4">
            {/* Intervals before due date */}
            <div className="pl-2 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Remind before due date
                </span>
              </div>

              {settings.intervals.map((interval, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={interval}
                    onChange={(e) => handleUpdateInterval(index, Number(e.target.value))}
                    className="bg-gray-50 dark:bg-dark-300 rounded-lg p-1 text-sm text-gray-800 dark:text-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] dark:shadow-dark-neu-pressed outline-none"
                  >
                    <option value="5">5 minutes before</option>
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

            {/* Custom reminder times */}
            <div className="pl-2 space-y-2 border-t pt-4 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Custom reminder times
                </span>
              </div>

              {(settings.customTimes || []).map((time, index) => {
                // Safely get time string even if date is invalid
                let timeString = '';
                try {
                  const date = new Date(time);
                  if (!isNaN(date.getTime())) {
                    timeString = date.toTimeString().slice(0, 5);
                  }
                } catch (e) {
                  // Silently handle invalid date
                }
                
                return (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={timeString}
                      onChange={(e) => handleUpdateCustomTime(index, e.target.value)}
                      className="bg-gray-50 dark:bg-dark-300 rounded-lg p-1 text-sm text-gray-800 dark:text-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] dark:shadow-dark-neu-pressed outline-none"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveCustomTime(index)}
                      className="p-1"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                );
              })}

              <Button
                variant="neutral"
                size="sm"
                onClick={handleAddCustomTime}
                className="flex items-center gap-1 text-sm"
              >
                <Plus size={14} />
                Add Custom Time
              </Button>
            </div>

            {/* Notification sound selection */}
            <div className="pl-2 space-y-4 border-t pt-4 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notification Sound & Volume
                </span>
              </div>

              {/* Sound selection */}
              <div className="grid grid-cols-2 gap-2">
                {NOTIFICATION_SOUNDS.map(sound => (
                  <button
                    key={sound.id}
                    onClick={() => handleUpdateSound(sound.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all
                      ${settings.sound === sound.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-50 dark:bg-dark-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-400'
                      }
                    `}
                  >
                    <Volume2 size={14} />
                    {sound.label}
                  </button>
                ))}
              </div>

              {/* Volume control */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => handleUpdateVolume(settings.volume === 0 ? 0.5 : 0)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-dark-400"
                >
                  {settings.volume === 0 ? (
                    <VolumeX size={16} className="text-gray-400" />
                  ) : (
                    <Volume2 size={16} className="text-blue-500 dark:text-blue-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round((settings.volume || 0) * 100)}
                  onChange={(e) => handleUpdateVolume(Number(e.target.value) / 100)}
                  className="flex-1 h-1.5 bg-gray-200 dark:bg-dark-400 rounded-lg appearance-none cursor-pointer range-sm [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 dark:[&::-webkit-slider-thumb]:bg-blue-400"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[2.5rem] text-right">
                  {Math.round((settings.volume || 0) * 100)}%
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1">Reminder functionality is currently under maintenance</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="neutral" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ReminderSettings;