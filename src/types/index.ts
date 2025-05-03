export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  recurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  // New reminder settings
  reminderSettings?: {
    enabled: boolean;
    intervals: number[]; // minutes before due date
  };
  // New subtasks support
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