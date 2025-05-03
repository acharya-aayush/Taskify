import React, { useState } from 'react';
import { Calendar, Check, Edit2, Trash2, X, Bell, List } from 'lucide-react';
import { Task } from '../../types';
import Button from '../ui/Button';
import ReminderSettings from './ReminderSettings';
import SubtaskList from './SubtaskList';
import Modal from '../ui/Modal';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [editPriority, setEditPriority] = useState(task.priority || '');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showSubtasksModal, setShowSubtasksModal] = useState(false);

  // Format date to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };

  // Get due status (overdue, today, upcoming)
  const getDueStatus = () => {
    if (!task.dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'overdue', class: 'text-red-500' };
    if (diffDays === 0) return { label: 'today', class: 'text-yellow-500' };
    if (diffDays <= 3) return { label: 'soon', class: 'text-blue-500' };
    return { label: 'upcoming', class: 'text-gray-400' };
  };

  // Get priority style
  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'high': return { label: 'High', class: 'bg-red-50/50 dark:bg-dark-300 text-red-600 dark:text-red-400 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat' };
      case 'medium': return { label: 'Medium', class: 'bg-yellow-50/50 dark:bg-dark-300 text-yellow-600 dark:text-yellow-400 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat' };
      case 'low': return { label: 'Low', class: 'bg-green-50/50 dark:bg-dark-300 text-green-600 dark:text-green-400 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat' };
      default: return null;
    }
  };

  const dueStatus = getDueStatus();
  const priorityStyle = getPriorityStyle();

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    
    onEdit(task.id, { 
      title: editTitle,
      dueDate: editDueDate || undefined,
      priority: editPriority as 'low' | 'medium' | 'high' | undefined
    });
    
    setIsEditing(false);
  };

  const handleReminderUpdate = (reminderSettings: Task['reminderSettings']) => {
    onEdit(task.id, { reminderSettings });
    setShowReminderModal(false);
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
          // Edit mode with improved light mode inputs
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-gray-50 dark:bg-dark-300 rounded-lg p-2 text-gray-800 dark:text-gray-100 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed outline-none transition-all duration-300 focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-dark-neu-flat"
              autoFocus
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-dark-300 rounded-lg p-1.5 text-sm text-gray-800 dark:text-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed outline-none transition-all duration-300"
                />
              </div>
              
              {/* Priority buttons with improved light mode */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg overflow-hidden bg-gray-50 dark:bg-dark-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-raised">
                  <button
                    type="button"
                    onClick={() => setEditPriority('low')}
                    className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                      editPriority === 'low'
                        ? 'text-green-400 shadow-neu-pressed dark:shadow-dark-neu-pressed after:absolute after:inset-0 after:bg-green-400/10 after:animate-glow-pulse'
                        : 'text-gray-400 dark:text-gray-400 hover:text-green-400'
                    }`}
                  >
                    Low
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPriority('medium')}
                    className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 border-x border-dark-300 dark:border-dark-300 ${
                      editPriority === 'medium'
                        ? 'text-yellow-400 shadow-neu-pressed dark:shadow-dark-neu-pressed after:absolute after:inset-0 after:bg-yellow-400/10 after:animate-glow-pulse'
                        : 'text-gray-400 dark:text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPriority('high')}
                    className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                      editPriority === 'high'
                        ? 'text-red-400 shadow-neu-pressed dark:shadow-dark-neu-pressed after:absolute after:inset-0 after:bg-red-400/10 after:animate-glow-pulse'
                        : 'text-gray-400 dark:text-gray-400 hover:text-red-400'
                    }`}
                  >
                    High
                  </button>
                </div>
                {editPriority && (
                  <button
                    type="button"
                    onClick={() => setEditPriority('')}
                    className="p-1.5 rounded-lg text-sm text-gray-400 shadow-neu-raised dark:shadow-dark-neu-raised hover:shadow-neu-flat dark:hover:shadow-dark-neu-flat active:shadow-neu-pressed dark:active:shadow-dark-neu-pressed transition-all duration-300"
                    aria-label="Clear priority"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-3">
              <Button 
                variant="neutral" 
                size="sm" 
                onClick={() => {
                  setEditTitle(task.title);
                  setEditDueDate(task.dueDate || '');
                  setEditPriority(task.priority || '');
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleSaveEdit}
                disabled={!editTitle.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          // View mode
          <>
            <div className="flex items-start gap-3">
              {/* Checkbox with improved light mode */}
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
                {/* Title with improved light mode contrast */}
                <p className={`text-gray-800 dark:text-gray-100 break-words transition-all duration-300 ${
                  task.completed 
                    ? 'line-through text-gray-400 dark:text-gray-400' 
                    : ''
                }`}>
                  {task.title}
                </p>
                
                {/* Metadata with improved light mode styling */}
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  {task.dueDate && dueStatus && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-dark-200 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-dark-neu-raised`}>
                      <Calendar size={14} className={`${dueStatus.class} transition-colors duration-300`} />
                      <span className="text-gray-600 dark:text-gray-300">
                        <span className={`${dueStatus.class} transition-colors duration-300`}>{dueStatus.label}</span>: {formatDate(task.dueDate)}
                      </span>
                    </div>
                  )}
                  
                  {priorityStyle && (
                    <div className={`px-2 py-0.5 rounded-full bg-gray-50 dark:bg-dark-200 ${priorityStyle.class} shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-dark-neu-raised`}>
                      {priorityStyle.label}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action buttons with improved light mode hover effects */}
              <div className="flex space-x-1">
                <Button 
                  variant="neutral" 
                  size="sm" 
                  className="p-1.5 rounded-full transition-transform hover:scale-105 active:scale-95" 
                  onClick={() => setShowReminderModal(true)}
                  aria-label="Set reminders"
                >
                  <Bell size={16} className={`transition-colors ${
                    task.reminderSettings?.enabled 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : 'text-gray-400'
                  }`} />
                </Button>

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

            {/* Subtasks preview if any exist */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-3 pl-8">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks completed
                </div>
                <div className="space-y-1">
                  {task.subtasks.slice(0, 2).map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-sm ${
                        subtask.completed 
                          ? 'bg-blue-500/20 dark:bg-blue-400/20' 
                          : 'bg-gray-200 dark:bg-dark-300'
                      }`} />
                      <span className={`text-sm ${
                        subtask.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                  {task.subtasks.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{task.subtasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reminder Settings Modal */}
      <Modal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        title="Reminder Settings"
      >
        <ReminderSettings
          reminderSettings={task.reminderSettings}
          onSave={handleReminderUpdate}
          onCancel={() => setShowReminderModal(false)}
        />
      </Modal>

      {/* Subtasks Modal */}
      <Modal
        isOpen={showSubtasksModal}
        onClose={() => setShowSubtasksModal(false)}
        title="Manage Subtasks"
      >
        <SubtaskList
          subtasks={task.subtasks || []}
          onSave={handleSubtasksUpdate}
          onCancel={() => setShowSubtasksModal(false)}
        />
      </Modal>
    </>
  );
};

export default TaskItem;