import { useCallback, useMemo } from 'react';
import { Task } from '../types';

// Just a dumb little hook to filter tasks
// Don't blame me if it filters the wrong ones

interface UseTaskFiltersProps {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  searchQuery: string;
}

const useTaskFilters = ({ tasks, filter, searchQuery }: UseTaskFiltersProps) => {
  // Filter and search tasks - use useMemo to avoid recreating array on every render
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Apply filter (all, active, completed)
      const filterMatch = 
        filter === 'all' || 
        (filter === 'active' && !task.completed) || 
        (filter === 'completed' && task.completed);
      
      // Apply search
      const searchMatch = 
        searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return filterMatch && searchMatch;
    });
  }, [tasks, filter, searchQuery]);

  // Calculate completion progress (percentage)
  const getProgress = useCallback(() => {
    const total = tasks.length;
    if (total === 0) return 0;
    
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / total) * 100);
  }, [tasks]);

  return {
    filteredTasks,
    getProgress,
  };
};

export default useTaskFilters;