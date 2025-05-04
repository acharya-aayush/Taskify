import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Task, TaskState } from '../types';
import useLocalStorage from './useLocalStorage';
import useTaskFilters from './useTaskFilters';
import useRecurringTasks from './useRecurringTasks';

// Split this bloated hook because it was getting out of hand
// Not my problem if something breaks now... I did my part

const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  searchQuery: '',
};

const useTasks = () => {
  // RECURRING TASKS DISABLED: No longer tracking if we need to check
  
  const [state, setState] = useLocalStorage<TaskState>('taskify-tasks', initialState);
  const [stats, setStats] = useLocalStorage<{ 
    totalCompleted: number, 
    streak: number,
    lastCompleted: string | null 
  }>('taskify-stats', { 
    totalCompleted: 0, 
    streak: 0,
    lastCompleted: null 
  });
  
  // Use the extracted task filtering hook - optimized with useMemo in the hook implementation
  const { filteredTasks, getProgress } = useTaskFilters({
    tasks: state.tasks,
    filter: state.filter,
    searchQuery: state.searchQuery
  });

  // Helper function to update tasks array
  const updateTasks = useCallback((updateFn: (tasks: Task[]) => Task[]) => {
    setState(prev => ({
      ...prev,
      tasks: updateFn(prev.tasks)
    }));
  }, [setState]);

  // Use the extracted recurring tasks hook (now disabled)
  const { updateRecurringSettings } = useRecurringTasks({ updateTasks });
  
  // Add a new task - optimized with better task generation
  const addTask = useCallback((title: string, dueDate?: string, priority?: 'low' | 'medium' | 'high') => {
    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), // Use better ID generation if available
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
      priority
    };

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  }, [setState]);

  // Toggle task completion - optimized with better state updates
  // RECURRING TASKS DISABLED: No longer setting flags for recurring tasks
  const toggleTask = useCallback((id: string) => {
    setState(prev => {
      const taskIndex = prev.tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) {
        return prev;
      }

      const task = prev.tasks[taskIndex];
      const wasCompleted = task.completed;
      const isRecurring = !!task.recurringSettings?.enabled;
      
      const newTasks = [...prev.tasks];
      
      // Setting to completed
      if (!wasCompleted) {
        // Even though recurring is disabled, we'll still preserve the settings
        if (isRecurring) {
          newTasks[taskIndex] = {
            ...task,
            completed: true,
            // Keep recurring settings but don't update lastReset
            recurringSettings: {
              ...task.recurringSettings!
            }
          };
        } else {
          newTasks[taskIndex] = {
            ...task,
            completed: true
          };
        }
        
        // Update stats
        const today = new Date().toDateString();
        const wasCompletedToday = stats.lastCompleted === today;
        
        setStats(prevStats => ({
          totalCompleted: prevStats.totalCompleted + 1,
          streak: wasCompletedToday ? prevStats.streak : prevStats.streak + 1,
          lastCompleted: today
        }));
      } 
      // Setting to incomplete
      else {
        // If recurring, we need to ensure we don't lose the settings
        if (isRecurring) {
          newTasks[taskIndex] = {
            ...task,
            completed: false,
            // Keep existing recurring settings intact
            recurringSettings: {
              ...task.recurringSettings!
            }
          };
        } else {
          newTasks[taskIndex] = {
            ...task,
            completed: false
          };
        }
      }

      return {
        ...prev,
        tasks: newTasks
      };
    });
  }, [setState, setStats, stats.lastCompleted]);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    setState(prev => {
      // Filter is more efficient than finding first
      return {
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== id)
      };
    });
  }, [setState]);

  // Edit a task - optimized with direct map
  // RECURRING TASKS DISABLED: No longer setting flags for recurring tasks
  const editTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setState(prev => {
      const newTasks = prev.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      );
      
      return {
        ...prev,
        tasks: newTasks
      };
    });
  }, [setState]);

  // Set filter
  const setFilter = useCallback((filter: 'all' | 'active' | 'completed') => {
    setState(prev => ({
      ...prev,
      filter
    }));
  }, [setState]);

  // Set search query
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, [setState]);

  // Clear completed tasks - optimized to use filter directly
  const clearCompleted = useCallback(() => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => !task.completed)
    }));
  }, [setState]);

  // Reorder tasks (for drag and drop functionality)
  const reorderTask = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      // Copy the current tasks array
      const newTasks = [...prev.tasks];
      
      // Remove the task from the fromIndex
      const [movedTask] = newTasks.splice(fromIndex, 1);
      
      // Insert the task at the toIndex
      newTasks.splice(toIndex, 0, movedTask);
      
      return {
        ...prev,
        tasks: newTasks
      };
    });
  }, [setState]);

  // Export tasks as JSON - optimized for performance
  const exportTasks = useCallback(() => {
    // No need to read from state again, just use latest tasks
    const dataStr = JSON.stringify(state.tasks, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `taskify-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [state.tasks]);

  // RECURRING TASKS DISABLED: Removing recurring task check effect
  // This was likely causing the infinite update loop

  // Memoize stats to avoid unnecessary rerenders when nothing has changed
  const memoizedStats = useMemo(() => stats, [stats]);

  return {
    tasks: state.tasks,
    filteredTasks,
    filter: state.filter,
    searchQuery: state.searchQuery,
    stats: memoizedStats,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    setFilter,
    setSearchQuery,
    clearCompleted,
    reorderTask,
    getProgress,
    exportTasks,
    updateRecurringSettings
  };
};

export default useTasks;