export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  
  // New recurring settings
  recurringSettings?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    customDays?: number; // For custom frequency (every X days)
    lastReset?: string; // Last time this task was reset after completion
  };
  
  // Keep reminder settings for future reference
  reminderSettings?: {
    enabled: boolean;
    intervals: number[]; // minutes before due date
    customTimes?: string[]; // specific times in ISO format
    sound?: 'default' | 'bell' | 'chime' | 'notification';
    volume?: number; // volume between 0 and 1
  };
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  searchQuery: string;
}

export type EasterEggType = 
  | 'MATRIX_ANIMATION' 
  | 'CLI_TERMINAL_POPUP'
  | 'LAUNCH_GAME_MODAL'
  | 'INJECT_RANDOM_TASK'
  | 'NO_TASKS_MEME'
  | null;

export interface AppSettings {
  darkMode: boolean;
  showProgressBar: boolean;
  enableQuotes: boolean;
  enableDragAndDrop: boolean;
}