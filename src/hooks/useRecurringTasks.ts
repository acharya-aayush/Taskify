import { useCallback } from 'react';
import { Task } from '../types';

// RECURRING TASKS TEMPORARILY DISABLED
// This functionality has been disabled to prevent update loops
// Original implementation was causing maximum update depth exceeded errors

interface UseRecurringTasksProps {
  updateTasks: (updateFn: (tasks: Task[]) => Task[]) => void;
}

const useRecurringTasks = ({ updateTasks }: UseRecurringTasksProps) => {
  // Stub implementation that does nothing to prevent infinite update loops
  const updateRecurringSettings = useCallback((
    task: Task, 
    recurringSettings: Task['recurringSettings']
  ) => {
    console.debug('[RecurringTasksHook] DISABLED - Recurring tasks functionality has been disabled');
    
    // Just preserve the settings in the task but don't do any recurring logic
    return {
      ...task,
      recurringSettings
    };
  }, []);

  // Stub method that does nothing - prevents errors in other components that might call this
  const checkRecurringTasks = useCallback(() => {
    console.debug('[RecurringTasksHook] DISABLED - Check recurring tasks called but functionality is disabled');
    // Do nothing
    return;
  }, []);

  return {
    updateRecurringSettings,
    checkRecurringTasks
  };
};

export default useRecurringTasks;