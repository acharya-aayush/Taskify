import React, { useState } from 'react';
import { Sun, Moon, Download } from 'lucide-react';
import TaskForm from './components/tasks/TaskForm';
import TaskList from './components/tasks/TaskList';
import TaskFilter from './components/tasks/TaskFilter';
import ProgressBar from './components/ui/ProgressBar';
import Button from './components/ui/Button';
import EasterEggHandler from './components/easter-eggs/EasterEggHandler';
import QuotePopup from './components/QuotePopup';
import useTasks from './hooks/useTasks';
import useTheme from './hooks/useTheme';
import useLocalStorage from './hooks/useLocalStorage';
import { EasterEggType, AppSettings } from './types';

const initialSettings: AppSettings = {
  darkMode: false,
  showProgressBar: true,
  enableQuotes: true,
  enableDragAndDrop: false
};

function App() {
  const { 
    filteredTasks, 
    filter, 
    searchQuery, 
    stats,
    addTask, 
    toggleTask, 
    deleteTask, 
    editTask, 
    setFilter, 
    setSearchQuery, 
    clearCompleted, 
    getProgress,
    exportTasks
  } = useTasks();
  
  const { effectiveTheme, setTheme } = useTheme();
  const [settings] = useLocalStorage<AppSettings>('taskify-settings', initialSettings);
  const [activeEasterEgg, setActiveEasterEgg] = useState<EasterEggType>(null);
  
  const toggleDarkMode = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  // Handle easter egg triggers
  const handleEasterEgg = (type: EasterEggType) => {
    setActiveEasterEgg(type);
  };
  
  // Close easter egg modal
  const closeEasterEgg = () => {
    setActiveEasterEgg(null);
  };
  
  // Count completed tasks
  const completedCount = filteredTasks.filter(task => task.completed).length;
  
  // Show console signature
  React.useEffect(() => {
    console.log(`
    ████████╗ █████╗ ███████╗██╗  ██╗██╗███████╗██╗   ██╗
    ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██║██╔════╝╚██╗ ██╔╝
       ██║   ███████║███████╗█████╔╝ ██║█████╗   ╚████╔╝ 
       ██║   ██╔══██║╚════██║██╔═██╗ ██║██╔══╝    ╚██╔╝  
       ██║   ██║  ██║███████║██║  ██╗██║██║        ██║   
       ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝        ╚═╝   
                                                         
    Taskify v1.0.0 - Manage your tasks with ease!
    Created using React + TypeScript + Tailwind CSS
    
    Some Easter eggs i inserted in here: Try typing 'acharya', '/aayush', or '/tictactoe' for surprise
    `);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${effectiveTheme === 'dark' ? 'dark bg-dark' : 'bg-gray-100'}`}>
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        {/* Header with increased depth */}
        <header className="mb-8 p-6 rounded-2xl bg-white dark:bg-dark-200 shadow-[16px_16px_32px_rgba(0,0,0,0.12),-16px_-16px_32px_rgba(255,255,255,1)] dark:shadow-dark-neu-raised">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Taskify</h1>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="neutral" 
                size="sm" 
                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-dark-200" 
                onClick={toggleDarkMode}
                aria-label={effectiveTheme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              >
                {effectiveTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              
              <Button 
                variant="primary" 
                size="sm" 
                className="text-xs bg-gray-50 hover:bg-gray-100 dark:bg-dark-200" 
                onClick={exportTasks}
              >
                <Download size={14} className="mr-1" />
                Export
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main content with increased depth */}
        <main className="space-y-6 p-6 rounded-2xl bg-white dark:bg-dark-200 shadow-[16px_16px_32px_rgba(0,0,0,0.12),-16px_-16px_32px_rgba(255,255,255,1)] dark:shadow-dark-neu-raised">
          {/* Task count and input section */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-300 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-dark-neu-pressed">
            <div className="text-sm text-gray-700 dark:text-gray-400 mb-4">
              <span className="font-medium">{filteredTasks.length}</span> task{filteredTasks.length !== 1 ? 's' : ''}
              {stats.streak > 1 && (
                <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
                  {stats.streak} day streak! 🔥
                </span>
              )}
            </div>
            
            {/* Task form with increased spacing */}
            <TaskForm onAddTask={addTask} onTriggerEasterEgg={handleEasterEgg} isEmpty={filteredTasks.length === 0} />
          </div>
          
          {/* Progress bar with proper spacing */}
          {settings.showProgressBar && filteredTasks.length > 0 && (
            <div className="mt-6">
              <ProgressBar progress={getProgress()} />
            </div>
          )}
          
          {/* Task filters */}
          <TaskFilter 
            filter={filter}
            searchQuery={searchQuery}
            onFilterChange={setFilter}
            onSearchChange={setSearchQuery}
            onClearCompleted={clearCompleted}
            completedCount={completedCount}
          />
          
          {/* Task list */}
          <TaskList 
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        </main>
        
        {/* Easter egg handler */}
        <EasterEggHandler 
          easterEggType={activeEasterEgg} 
          onClose={closeEasterEgg}
        />
        
        {/* Motivational quote popup */}
        <QuotePopup enabled={settings.enableQuotes} />
      </div>
    </div>
  );
}

export default App;