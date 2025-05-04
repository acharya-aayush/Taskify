import React, { useEffect, useState } from 'react';
import Button from './Button';

/**
 * This component provides simple debugging tools for testing notifications and sounds
 */
const NotificationDebugger: React.FC = () => {
  const [notificationStatus, setNotificationStatus] = useState<string>('unknown');
  const [audioStatus, setAudioStatus] = useState<string>('unknown');
  const [lastAction, setLastAction] = useState<string>('');
  const [expanded, setExpanded] = useState(false);
  const [soundsAvailable, setSoundsAvailable] = useState<{id: string, status: string}[]>([
    {id: 'default', status: 'unknown'},
    {id: 'bell', status: 'unknown'},
    {id: 'chime', status: 'unknown'},
    {id: 'notification', status: 'unknown'},
  ]);

  // Check notification permission
  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setNotificationStatus(Notification.permission);
    } else {
      setNotificationStatus('unavailable');
    }
  }, []);

  // Check audio support
  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      setAudioStatus('supported');
      // Check individual sound files
      checkSoundFiles();
    } else {
      setAudioStatus('unsupported');
    }
  }, []);

  const checkSoundFiles = async () => {
    const updatedSounds = [...soundsAvailable];
    
    for (const sound of updatedSounds) {
      const audio = new Audio(`/sounds/${sound.id}.mp3`);
      try {
        // Try to load the audio file
        sound.status = 'loading';
        setSoundsAvailable([...updatedSounds]);
        
        // Create a promise to check if the audio can load
        await new Promise<void>((resolve, reject) => {
          audio.addEventListener('canplaythrough', () => {
            sound.status = 'available';
            setSoundsAvailable([...updatedSounds]);
            resolve();
          });
          
          audio.addEventListener('error', () => {
            sound.status = 'error';
            setSoundsAvailable([...updatedSounds]);
            reject(new Error(`Failed to load ${sound.id} sound`));
          });
          
          // Set a timeout in case nothing happens
          setTimeout(() => {
            if (sound.status === 'loading') {
              sound.status = 'timeout';
              setSoundsAvailable([...updatedSounds]);
              reject(new Error('Audio loading timed out'));
            }
          }, 3000);
          
          audio.load();
        });
      } catch (err) {
        console.error(`Error checking sound ${sound.id}:`, err);
      }
    }
  };

  const testSystemSound = () => {
    setLastAction('Playing system sound...');
    // Use the Web Audio API for a simple beep (more reliable than audio files)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 880; // A5 note
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        setLastAction('System sound played successfully');
      }, 500);
    } catch (err) {
      setLastAction(`Failed to play system sound: ${err.message}`);
    }
  };

  const testNotificationSound = (sound: string) => {
    setLastAction(`Testing ${sound} sound...`);
    if (window.testTaskifySound) {
      const result = window.testTaskifySound(sound);
      if (result) {
        setLastAction(`${sound} sound test initiated`);
      } else {
        setLastAction(`Failed to play ${sound} sound`);
      }
    } else {
      // Fallback if the global test function isn't available
      try {
        const audio = new Audio(`/sounds/${sound}.mp3`);
        audio.volume = 0.5;
        const playPromise = audio.play();
        
        if (playPromise) {
          playPromise
            .then(() => setLastAction(`${sound} sound playing`))
            .catch(err => setLastAction(`Error playing ${sound}: ${err.message}`));
        }
      } catch (err) {
        setLastAction(`Error initializing ${sound} sound: ${err.message}`);
      }
    }
  };

  const testNotification = () => {
    setLastAction('Testing notification...');
    if (window.testTaskifyNotification) {
      const result = window.testTaskifyNotification('Debug Test', 'This is a test notification from the debugger', 'bell');
      setLastAction(`Notification test result: ${result ? 'success' : 'failed'}`);
    } else {
      setLastAction('Test function not available - reload the page');
    }
  };

  const requestPermission = async () => {
    setLastAction('Requesting notification permission...');
    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      setLastAction(`Permission request result: ${permission}`);
    } catch (err) {
      setLastAction(`Permission request error: ${err.message}`);
    }
  };

  const resetCustomTimes = () => {
    setLastAction('Attempting to fix custom times...');
    
    // Get all tasks from local storage
    try {
      const storageKey = 'taskify-tasks';
      const taskData = localStorage.getItem(storageKey);
      
      if (!taskData) {
        setLastAction('No tasks found in storage');
        return;
      }
      
      const tasksState = JSON.parse(taskData);
      let fixCount = 0;
      
      // Update custom times to today's date
      const today = new Date();
      const updatedTasks = tasksState.tasks.map(task => {
        if (task.reminderSettings?.customTimes?.length) {
          // Fix each custom time by preserving just the time part
          const updatedCustomTimes = task.reminderSettings.customTimes.map(timeStr => {
            try {
              const time = new Date(timeStr);
              if (isNaN(time.getTime())) return timeStr; // Skip if invalid date
              
              // Create a new time with today's date
              const updatedTime = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                time.getHours(),
                time.getMinutes(),
                0,
                0
              );
              
              fixCount++;
              return updatedTime.toISOString();
            } catch (e) {
              return timeStr; // Keep original if error
            }
          });
          
          // Update the task with fixed times
          return {
            ...task,
            reminderSettings: {
              ...task.reminderSettings,
              customTimes: updatedCustomTimes
            }
          };
        }
        return task;
      });
      
      // Save back to localStorage
      const updatedData = {
        ...tasksState,
        tasks: updatedTasks
      };
      
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
      setLastAction(`Fixed ${fixCount} custom times. Please reload the page.`);
    } catch (err) {
      setLastAction(`Error fixing custom times: ${err.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-dark-300 shadow-lg rounded-lg p-3 max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Notification Debugger</h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {expanded && (
        <>
          <div className="mb-4">
            <div className="text-xs mb-1">Status:</div>
            <div className="flex flex-wrap gap-2 text-xs mb-2">
              <span className={`px-2 py-1 rounded-full ${
                notificationStatus === 'granted' ? 'bg-green-100 text-green-800' : 
                notificationStatus === 'denied' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                Notification: {notificationStatus}
              </span>
              <span className={`px-2 py-1 rounded-full ${
                audioStatus === 'supported' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                Audio API: {audioStatus}
              </span>
            </div>
            
            <div className="text-xs mb-1">Sound Files:</div>
            <div className="flex flex-wrap gap-2 text-xs mb-2">
              {soundsAvailable.map(sound => (
                <span 
                  key={sound.id}
                  className={`px-2 py-1 rounded-full ${
                    sound.status === 'available' ? 'bg-green-100 text-green-800' : 
                    sound.status === 'error' ? 'bg-red-100 text-red-800' : 
                    sound.status === 'timeout' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {sound.id}: {sound.status}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Button 
              variant="neutral"
              size="sm"
              onClick={testSystemSound}
              className="text-xs py-1"
            >
              Test System Sound
            </Button>
            <Button 
              variant="neutral"
              size="sm"
              onClick={() => testNotificationSound('bell')}
              className="text-xs py-1"
            >
              Test Bell Sound
            </Button>
            <Button 
              variant="primary"
              size="sm"
              onClick={testNotification}
              className="text-xs py-1"
            >
              Test Notification
            </Button>
            {notificationStatus !== 'granted' && (
              <Button 
                variant="primary"
                size="sm"
                onClick={requestPermission}
                className="text-xs py-1"
              >
                Request Permission
              </Button>
            )}
          </div>
          
          <div className="mb-3">
            <Button 
              variant="neutral"
              size="sm"
              onClick={resetCustomTimes}
              className="text-xs py-1 w-full"
            >
              Fix Custom Times
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 italic">
            Last action: {lastAction || 'None'}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDebugger;