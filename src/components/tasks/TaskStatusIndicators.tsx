import React from 'react';
import { Calendar } from 'lucide-react';

// Yeah so this is just some status indicators... not rocket science
// Don't come crying if it doesn't look pretty enough for you

interface TaskStatusIndicatorsProps {
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  recurringFrequency?: string;
  recurringCustomDays?: number;
}

export const TaskStatusIndicators: React.FC<TaskStatusIndicatorsProps> = ({
  dueDate,
  priority,
  recurringFrequency,
  recurringCustomDays
}) => {
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
    if (!dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDateObj = new Date(dueDate);
    dueDateObj.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'overdue', class: 'text-red-500' };
    if (diffDays === 0) return { label: 'today', class: 'text-yellow-500' };
    if (diffDays <= 3) return { label: 'soon', class: 'text-blue-500' };
    return { label: 'upcoming', class: 'text-gray-400' };
  };

  // Get priority style
  const getPriorityStyle = () => {
    switch (priority) {
      case 'high': return { label: 'High', class: 'bg-red-50/50 dark:bg-dark-300 text-red-600 dark:text-red-400 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat' };
      case 'medium': return { label: 'Medium', class: 'bg-yellow-50/50 dark:bg-dark-300 text-yellow-600 dark:text-yellow-400 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat' };
      case 'low': return { label: 'Low', class: 'bg-green-50/50 dark:bg-dark-300 text-green-600 dark:text-green-400 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat' };
      default: return null;
    }
  };

  const dueStatus = getDueStatus();
  const priorityStyle = getPriorityStyle();

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
      {dueDate && dueStatus && (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-dark-200 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-dark-neu-raised`}>
          <Calendar size={14} className={`${dueStatus.class} transition-colors duration-300`} />
          <span className="text-gray-600 dark:text-gray-300">
            <span className={`${dueStatus.class} transition-colors duration-300`}>{dueStatus.label}</span>: {formatDate(dueDate)}
          </span>
        </div>
      )}
      
      {priorityStyle && (
        <div className={`px-2 py-0.5 rounded-full bg-gray-50 dark:bg-dark-200 ${priorityStyle.class} shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-dark-neu-raised`}>
          {priorityStyle.label}
        </div>
      )}

      {recurringFrequency && (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-flat transition-all duration-300`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          <span>
            {recurringFrequency === 'daily' && 'Daily'}
            {recurringFrequency === 'weekly' && 'Weekly'}
            {recurringFrequency === 'monthly' && 'Monthly'}
            {recurringFrequency === 'custom' && `Every ${recurringCustomDays} days`}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskStatusIndicators;