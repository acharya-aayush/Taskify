import React, { useState } from 'react';
import { Task } from '../../types';
import Button from '../ui/Button';
import { Plus, X, Check } from 'lucide-react';

interface SubtaskListProps {
  subtasks?: Task['subtasks'];
  onSave: (subtasks: Task['subtasks']) => void;
  onCancel: () => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({ subtasks = [], onSave, onCancel }) => {
  const [currentSubtasks, setCurrentSubtasks] = useState(subtasks);
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    const subtask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false
    };

    setCurrentSubtasks([...currentSubtasks, subtask]);
    setNewSubtask('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    }
  };

  const handleToggleSubtask = (id: string) => {
    setCurrentSubtasks(prev => prev.map(subtask => 
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    ));
  };

  const handleRemoveSubtask = (id: string) => {
    setCurrentSubtasks(prev => prev.filter(subtask => subtask.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Add subtask input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a subtask..."
            className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-dark-300 text-gray-800 dark:text-gray-100 
              placeholder-gray-400 dark:placeholder-gray-500
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] 
              dark:shadow-dark-neu-pressed
              focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] 
              dark:focus:shadow-dark-neu-flat
              outline-none transition-all duration-300"
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddSubtask}
          disabled={!newSubtask.trim()}
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          Add
        </Button>
      </div>

      {/* Subtasks list */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {currentSubtasks.map((subtask) => (
          <div 
            key={subtask.id}
            className="group flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-dark-300 
              shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] 
              dark:shadow-dark-neu-raised
              hover:shadow-[1px_1px_2px_rgba(0,0,0,0.03),-1px_-1px_2px_rgba(255,255,255,0.6)] 
              dark:hover:shadow-dark-neu-flat
              transition-all duration-300"
          >
            <button
              onClick={() => handleToggleSubtask(subtask.id)}
              className={`relative flex-shrink-0 w-5 h-5 rounded-md transition-all duration-300 ${
                subtask.completed 
                  ? 'bg-blue-500 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]' 
                  : 'bg-white dark:bg-dark-200 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-raised hover:shadow-[1px_1px_2px_rgba(0,0,0,0.03),-1px_-1px_2px_rgba(255,255,255,0.6)] dark:hover:shadow-dark-neu-flat'
              }`}
            >
              <Check 
                size={14} 
                className={`absolute inset-0 m-auto transition-all duration-300 ${
                  subtask.completed 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-0'
                }`} 
              />
            </button>

            <span className={`flex-1 text-sm transition-all duration-300 ${
              subtask.completed 
                ? 'text-gray-400 line-through' 
                : 'text-gray-700 dark:text-gray-200'
            }`}>
              {subtask.title}
            </span>

            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveSubtask(subtask.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
            >
              <X size={14} />
            </Button>
          </div>
        ))}

        {currentSubtasks.length === 0 && (
          <div className="text-center py-4 text-gray-400 dark:text-gray-500">
            No subtasks yet. Add some to break down your task!
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="neutral" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onSave(currentSubtasks)}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SubtaskList;