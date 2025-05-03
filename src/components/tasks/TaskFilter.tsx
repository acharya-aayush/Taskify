import React from 'react';
import { Search, X } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed';

interface TaskFilterProps {
  filter: FilterType;
  searchQuery: string;
  onFilterChange: (filter: FilterType) => void;
  onSearchChange: (query: string) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  filter,
  searchQuery,
  onFilterChange,
  onSearchChange,
}) => {
  return (
    <div className="mb-4 space-y-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-200 shadow-[10px_10px_20px_rgba(0,0,0,0.1),-10px_-10px_20px_rgba(255,255,255,0.95)] dark:shadow-dark-neu-raised">
      {/* Search bar with floating effect */}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 transition-transform duration-300 group-focus-within:scale-90">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-300 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-dark-neu-pressed transition-all duration-300 focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] dark:focus:shadow-dark-neu-pressed"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300"
          >
            <X size={18} className="transition-transform hover:scale-110 active:scale-95" />
          </button>
        )}
      </div>
      
      {/* Filter tabs with deeper shadows */}
      <div className="flex items-center justify-center">
        <div className="flex rounded-lg overflow-hidden bg-white dark:bg-dark-300 shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-dark-neu-raised">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => onFilterChange(filterType as FilterType)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                filter === filterType
                  ? 'text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-dark-400 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-dark-400'
              } ${
                filterType === 'active' 
                  ? 'border-x border-gray-100 dark:border-dark-500' 
                  : ''
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;