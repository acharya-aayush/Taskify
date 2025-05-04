import React from 'react';

// Just a stupid little progress bar with some silly dots
// Don't expect miracles from this basic component

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskSubtasksPreviewProps {
  subtasks: Subtask[];
}

const TaskSubtasksPreview: React.FC<TaskSubtasksPreviewProps> = ({ subtasks }) => {
  // If no subtasks, don't bother rendering anything
  if (!subtasks || subtasks.length === 0) return null;

  // Get subtasks progress
  const getSubtasksProgress = () => {
    const completed = subtasks.filter(st => st.completed).length;
    return {
      completed,
      total: subtasks.length,
      percentage: Math.round((completed / subtasks.length) * 100)
    };
  };

  const subtasksProgress = getSubtasksProgress();

  return (
    <div className="mt-4 pl-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Subtasks ({subtasksProgress.completed}/{subtasksProgress.total})
        </span>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {subtasksProgress.percentage}% complete
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-dark-300 overflow-hidden">
        <div 
          className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300 rounded-full"
          style={{ width: `${subtasksProgress.percentage}%` }}
        />
      </div>

      {/* Preview of first 3 subtasks */}
      <div className="mt-2 space-y-1">
        {subtasks.slice(0, 3).map(subtask => (
          <div 
            key={subtask.id}
            className="flex items-center gap-2 text-sm"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${
              subtask.completed
                ? 'bg-blue-500 dark:bg-blue-400'
                : 'bg-gray-300 dark:bg-gray-600'
            }`} />
            <span className={subtask.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-300'}>
              {subtask.title}
            </span>
          </div>
        ))}
        {subtasks.length > 3 && (
          <div className="text-xs text-gray-400 dark:text-gray-500 pl-3">
            +{subtasks.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSubtasksPreview;