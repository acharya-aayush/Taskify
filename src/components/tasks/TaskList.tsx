import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import TaskItem from './TaskItem';
import Button from '../ui/Button';
import { Task } from '../../types';
import { useTaskAnimation } from '../../hooks/useTaskAnimation';
import useTasks from '../../hooks/useTasks';
import DraggableTaskList from './DraggableTaskList';

// Slapped together a basic task list with drag-n-drop
// If it breaks, that's your problem now, good luck with that

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onEdit }) => {
  const { animatingTaskId, animatingTasks, isRemoving, taskItemVariants, completedTaskMotion } = useTaskAnimation(tasks);
  
  // Properly extract all data we need from useTasks at component level
  const { reorderTask, tasks: allTasks } = useTasks();
  
  // Memoize the completed tasks calculation to avoid recalculating on every render
  const completedTasks = useMemo(() => tasks.filter(task => task.completed), [tasks]);
  
  // Memoize the clear completed handler to maintain referential equality
  const handleClearCompleted = useCallback(() => {
    completedTasks.forEach(task => onDelete(task.id));
  }, [completedTasks, onDelete]);

  // Memoize the reorder handler to avoid recreating on every render
  const handleReorder = useCallback((sourceIndex: number, targetIndex: number) => {
    console.debug(`[TaskList] Moving task from position ${sourceIndex} to ${targetIndex}`);
      
    // Map indices from filtered tasks to global task array
    const sourceTask = tasks[sourceIndex];
    const targetTask = tasks[targetIndex];
    
    if (sourceTask && targetTask) {
      const sourceGlobalIndex = allTasks.findIndex(t => t.id === sourceTask.id);
      const targetGlobalIndex = allTasks.findIndex(t => t.id === targetTask.id);
      
      if (sourceGlobalIndex !== -1 && targetGlobalIndex !== -1) {
        reorderTask(sourceGlobalIndex, targetGlobalIndex);
      }
    }
  }, [tasks, allTasks, reorderTask]);
  
  // Show empty state if no tasks
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-white dark:bg-dark-200 shadow-neu-raised dark:shadow-dark-neu-raised">
          <AlertCircle size={24} className="text-gray-600 dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-700 dark:text-gray-400">
          Try adjusting your search or filter settings
        </p>
      </div>
    );
  }

  // Memoize the task rendering function to avoid recreating function on every render
  const renderTask = useCallback((task: Task, _index: number, { dragProps }: any) => (
    <div {...dragProps}>
      <TaskItem
        task={task}
        onToggle={() => onToggle(task.id)}
        onDelete={() => onDelete(task.id)}
        onEdit={(updates) => onEdit(task.id, updates)}
        isAnimating={animatingTaskId === task.id}
        isRemoving={isRemoving && animatingTaskId === task.id}
        variants={taskItemVariants}
        completedVariants={completedTaskMotion}
      />
    </div>
  ), [onToggle, onDelete, onEdit, animatingTaskId, isRemoving, taskItemVariants, completedTaskMotion]);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Tasks
          </h2>
          <div className="px-2 py-1 rounded-full bg-white dark:bg-dark-200 shadow-neu-flat dark:shadow-dark-neu-flat">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
        </div>

        {completedTasks.length > 0 && (
          <Button
            onClick={handleClearCompleted}
            variant="ghost"
            size="sm"
            className="text-sm"
          >
            Clear completed
          </Button>
        )}
      </div>

      <DraggableTaskList 
        tasks={tasks}
        onReorder={handleReorder}
        renderItem={renderTask}
      />
    </div>
  );
}

// Wrap with memo to prevent unnecessary re-renders when props haven't changed
export default React.memo(TaskList);