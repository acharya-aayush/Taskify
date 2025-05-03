import { useState, useEffect } from 'react';
import { Task } from '../types';

export const useTaskAnimation = (tasks: Task[]) => {
  const [animatingTasks, setAnimatingTasks] = useState<Task[]>([]);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentIds = new Set(tasks.map(t => t.id));
    const previousIds = new Set(animatingTasks.map(t => t.id));
    
    // Find tasks that were removed
    const newRemovedIds = [...previousIds].filter(id => !currentIds.has(id));
    
    if (newRemovedIds.length > 0) {
      // Add to removed set
      setRemovedIds(prev => new Set([...prev, ...newRemovedIds]));
      
      // Keep removed tasks in animation list briefly
      const tasksToAnimate = [
        ...tasks,
        ...animatingTasks.filter(t => newRemovedIds.includes(t.id))
      ];
      setAnimatingTasks(tasksToAnimate);
      
      // Remove after animation
      setTimeout(() => {
        setAnimatingTasks(current => current.filter(t => !newRemovedIds.includes(t.id)));
        setRemovedIds(prev => {
          const next = new Set(prev);
          newRemovedIds.forEach(id => next.delete(id));
          return next;
        });
      }, 300);
    } else {
      setAnimatingTasks(tasks);
    }
  }, [tasks]);

  return {
    animatingTasks,
    isRemoving: (id: string) => removedIds.has(id)
  };
};