import React from 'react';
import { AlertCircle } from 'lucide-react';
import TaskItem from './TaskItem';
import Button from '../ui/Button';
import { Task } from '../../types';
import { useTaskAnimation } from '../../hooks/useTaskAnimation';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onEdit }) => {
  const { animatingTasks, isRemoving } = useTaskAnimation(tasks);
  const completedTasks = tasks.filter(task => task.completed);
  
  const handleClearCompleted = () => {
    completedTasks.forEach(task => onDelete(task.id));
  };

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
            variant="neutral"
            size="sm"
            onClick={handleClearCompleted}
            className="p-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 group transition-colors"
          >
            <span className="flex items-center gap-2">
              Clear completed
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-dark-400 text-xs group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {completedTasks.length}
              </span>
            </span>
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {animatingTasks.map((task, index) => (
          <div
            key={task.id}
            className={`transition-all duration-300 ${
              isRemoving(task.id) 
                ? 'opacity-0 scale-95 -translate-x-full' 
                : 'opacity-100 scale-100 translate-x-0'
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
              transform: `translateY(${index * 2}px)`
            }}
          >
            <TaskItem
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;