import { useState, useCallback } from 'react';
import { Task, TaskState } from '../types';
import useLocalStorage from './useLocalStorage';

const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  searchQuery: '',
};

const useTasks = () => {
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

  // Filter and search tasks
  const filteredTasks = useCallback(() => {
    return state.tasks.filter(task => {
      // Apply filter (all, active, completed)
      const filterMatch = 
        state.filter === 'all' || 
        (state.filter === 'active' && !task.completed) || 
        (state.filter === 'completed' && task.completed);
      
      // Apply search
      const searchMatch = 
        state.searchQuery === '' || 
        task.title.toLowerCase().includes(state.searchQuery.toLowerCase());
      
      return filterMatch && searchMatch;
    });
  }, [state]);

  // Add a new task
  const addTask = useCallback((title: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', recurring?: boolean, recurringInterval?: 'daily' | 'weekly' | 'monthly') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
      priority,
      recurring,
      recurringInterval
    };

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  }, [setState]);

  // Toggle task completion
  const toggleTask = useCallback((id: string) => {
    setState(prev => {
      const taskIndex = prev.tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) return prev;

      const wasCompleted = prev.tasks[taskIndex].completed;
      const newTasks = [...prev.tasks];
      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        completed: !wasCompleted
      };

      // If task was not completed before but is now completed
      if (!wasCompleted) {
        // Update stats
        const today = new Date().toDateString();
        const wasCompletedToday = stats.lastCompleted === today;
        
        setStats(prevStats => ({
          totalCompleted: prevStats.totalCompleted + 1,
          streak: wasCompletedToday ? prevStats.streak : prevStats.streak + 1,
          lastCompleted: today
        }));
      }

      return {
        ...prev,
        tasks: newTasks
      };
    });
  }, [setState, setStats, stats.lastCompleted]);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
  }, [setState]);

  // Edit a task
  const editTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setState(prev => {
      const taskIndex = prev.tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) return prev;

      const newTasks = [...prev.tasks];
      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        ...updates
      };

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

  // Clear completed tasks
  const clearCompleted = useCallback(() => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => !task.completed)
    }));
  }, [setState]);

  // Calculate completion progress (percentage)
  const getProgress = useCallback(() => {
    const total = state.tasks.length;
    if (total === 0) return 0;
    
    const completed = state.tasks.filter(task => task.completed).length;
    return Math.round((completed / total) * 100);
  }, [state.tasks]);

  // Export tasks as JSON
  const exportTasks = useCallback(() => {
    const dataStr = JSON.stringify(state.tasks, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `taskify-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [state.tasks]);

  return {
    tasks: state.tasks,
    filteredTasks: filteredTasks(),
    filter: state.filter,
    searchQuery: state.searchQuery,
    stats,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    setFilter,
    setSearchQuery,
    clearCompleted,
    getProgress,
    exportTasks
  };
};

export default useTasks;