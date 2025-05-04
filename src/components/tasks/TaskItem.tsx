import React, { useState } from 'react';
import { Check, Edit2, Trash2, RefreshCw, List, Bell } from 'lucide-react';
import { Task } from '../../types';
import Button from '../ui/Button';
import SubtaskList from './SubtaskList';
import Modal from '../ui/Modal';
import RecurringSettings from './RecurringSettings';
import TaskEditForm from './TaskEditForm';
import TaskStatusIndicators from './TaskStatusIndicators';
import TaskSubtasksPreview from './TaskSubtasksPreview';
import Tooltip from '../ui/Tooltip';

// Look, I refactored this mess into smaller components
// Maybe now it won't crash your browser... no promises though

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  isAnimating?: boolean;
  isRemoving?: boolean;
  variants?: any;
  completedVariants?: any;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggle, 
  onDelete, 
  onEdit,
  isAnimating,
  isRemoving,
  variants,
  completedVariants
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showSubtasksModal, setShowSubtasksModal] = useState(false);

  const handleSaveEdit = (updates: { 
    title: string; 
    dueDate?: string; 
    priority?: 'low' | 'medium' | 'high' | undefined 
  }) => {
    if (!updates.title.trim()) return;
    onEdit(task.id, updates);
    setIsEditing(false);
  };

  const handleRecurringUpdate = (recurringSettings: Task['recurringSettings']) => {
    onEdit(task.id, { recurringSettings });
    setShowRecurringModal(false);
  };

  const handleSubtasksUpdate = (subtasks: Task['subtasks']) => {
    onEdit(task.id, { subtasks });
    setShowSubtasksModal(false);
  };

  return (
    <>
      <div 
        className={`mb-3 rounded-xl p-4 transition-all duration-300 ${
          task.completed 
            ? 'bg-gray-50 dark:bg-dark-200 shadow-[4px_4px_8px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.9)] dark:shadow-dark-neu-flat opacity-85 scale-98' 
            : 'bg-white dark:bg-dark-200 shadow-[12px_12px_24px_rgba(0,0,0,0.12),-12px_-12px_24px_rgba(255,255,255,0.95)] dark:shadow-dark-neu-raised hover:shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] dark:hover:shadow-dark-neu-flat'
        }`}
      >
        {isEditing ? (
          <TaskEditForm
            initialTitle={task.title}
            initialDueDate={task.dueDate}
            initialPriority={task.priority}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => onToggle(task.id)}
                className={`relative mt-0.5 flex-shrink-0 w-5 h-5 rounded-md transition-all duration-300 group ${
                  task.completed 
                    ? 'bg-blue-500 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]' 
                    : 'bg-gray-50 dark:bg-dark-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-raised hover:shadow-[1px_1px_2px_rgba(0,0,0,0.03),-1px_-1px_2px_rgba(255,255,255,0.6)] dark:hover:shadow-dark-neu-flat'
                }`}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                <Check 
                  size={16} 
                  className={`absolute inset-0 m-auto p-0.5 transition-all duration-300 ${
                    task.completed 
                      ? 'text-white scale-100 rotate-0' 
                      : 'text-blue-500 dark:text-blue-400 scale-0 -rotate-45 opacity-0 group-hover:scale-90 group-hover:rotate-0 group-hover:opacity-70'
                  }`} 
                />
              </button>
              
              <div className="flex-1 min-w-0">
                {/* Title */}
                <p className={`text-gray-800 dark:text-gray-100 break-words transition-all duration-300 ${
                  task.completed 
                    ? 'line-through text-gray-400 dark:text-gray-400' 
                    : ''
                }`}>
                  {task.title}
                </p>
                
                {/* Status indicators (due date, priority, recurring) */}
                <TaskStatusIndicators 
                  dueDate={task.dueDate}
                  priority={task.priority}
                  recurringFrequency={task.recurringSettings?.frequency}
                  recurringCustomDays={task.recurringSettings?.customDays}
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-1">
                {/* Reminder button - inactive with coming soon tooltip */}
                <Tooltip content="Reminders coming soon! (Maybe... if I feel like coding it)">
                  <Button 
                    variant="neutral" 
                    size="sm" 
                    className="p-1.5 rounded-full transition-transform opacity-60 cursor-not-allowed" 
                    disabled={true}
                    aria-label="Set reminders (coming soon)"
                  >
                    <Bell size={16} className="text-gray-400" />
                  </Button>
                </Tooltip>
              
                {/* Recurring button - now with coming soon tooltip */}
                <Tooltip content="Recurring tasks coming soon! (Probably won't work properly though)">
                  <Button 
                    variant="neutral" 
                    size="sm" 
                    className="p-1.5 rounded-full transition-transform opacity-60 cursor-not-allowed" 
                    disabled={true}
                    aria-label="Set recurring schedule (coming soon)"
                  >
                    <RefreshCw size={16} className="text-gray-400" />
                  </Button>
                </Tooltip>

                <Button 
                  variant="neutral" 
                  size="sm" 
                  className="p-1.5 rounded-full transition-transform hover:scale-105 active:scale-95" 
                  onClick={() => setShowSubtasksModal(true)}
                  aria-label="Manage subtasks"
                >
                  <List size={16} className={`transition-colors ${
                    task.subtasks?.length 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : 'text-gray-400'
                  }`} />
                </Button>

                <Button 
                  variant="neutral" 
                  size="sm" 
                  className="p-1.5 rounded-full transition-transform hover:scale-105 active:scale-95" 
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit task"
                >
                  <Edit2 size={16} className="text-gray-400 transition-colors hover:text-blue-500 dark:hover:text-blue-400" />
                </Button>
                
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="p-1.5 rounded-full transition-transform hover:scale-105 active:scale-95" 
                  onClick={() => onDelete(task.id)}
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            {/* Subtasks preview */}
            {task.subtasks && task.subtasks.length > 0 && (
              <TaskSubtasksPreview subtasks={task.subtasks} />
            )}
          </>
        )}
      </div>

      {/* Subtasks Modal */}
      <Modal
        isOpen={showSubtasksModal}
        onClose={() => setShowSubtasksModal(false)}
        title="Manage Subtasks"
      >
        <SubtaskList
          subtasks={task.subtasks}
          onSave={handleSubtasksUpdate}
          onCancel={() => setShowSubtasksModal(false)}
        />
      </Modal>
    </>
  );
};

export default TaskItem;