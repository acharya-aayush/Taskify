# Taskify 📝

> A modern task management application built with React, TypeScript, and Tailwind CSS, featuring a beautiful neumorphic design system.

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC.svg)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## ✨ Features

### 🎯 Core Features
- **Task Management**
  - Create, edit, and delete tasks with ease
  - Mark tasks as complete/incomplete
  - Set priorities (Low/Medium/High)
  - Add due dates with smart status indicators

- **Organization**
  - Filter tasks by status (All/Active/Completed)
  - Search functionality with real-time results
  - Drag-and-drop task reordering
  - Progress tracking with visual feedback

- **Data Management**
  - Automatic local storage persistence
  - Export tasks as JSON
  - Task statistics and streak tracking

### 🎨 UI/UX Features
- **Modern Design System**
  - Neumorphic UI elements
  - Smooth transitions and animations
  - Micro-interactions for better feedback
  - Responsive layout for all devices

- **Theme Support**
  - Light/Dark mode with system preference sync
  - Automatic theme persistence
  - High contrast accessibility

### 🎮 Fun Extras
- **Easter Eggs**
  - Type "acharya" for a Matrix animation
  - Use "/aayush" to open CLI mode
  - Try "/tictactoe" for a quick game break
  - More secrets to discover! 🕵️‍♂️

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or newer)
- npm or yarn
- A modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/acharya-aayush/taskify.git
   cd taskify
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

4. Open http://localhost:5173 in your browser

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── easter-eggs/    # Fun extra features
│   ├── tasks/          # Task-related components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## 🧩 Key Components

- **TaskForm**: Main input interface for creating tasks
- **TaskList**: Displays and manages task items
- **TaskFilter**: Handles filtering and search
- **ProgressBar**: Visual progress tracking
- **ThemeToggle**: Manages light/dark mode

## 🛠️ Built With

- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [@dnd-kit](https://dndkit.com/) - Drag and drop

## 📚 Development Guide

### Component Structure
Components are organized by feature and follow a consistent pattern:
```typescript
import React from 'react';

interface ComponentProps {
  // Props definition
}

const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // Component logic
};

export default Component;
```

### Styling Approach
We use Tailwind CSS with custom neumorphic design utilities:
- Light shadows for raised effects
- Inset shadows for pressed states
- Smooth transitions between states
- Consistent color palette

### Best Practices
- Use TypeScript for type safety
- Follow React hooks patterns
- Keep components focused and reusable
- Add JSDoc comments for complex logic
- Test critical functionality

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ Need Help?

- Check out the [documentation](docs/)
- Create an [issue](https://github.com/yourusername/taskify/issues)
- Read our [contributing guide](CONTRIBUTING.md)

---

## 🚀 Upcoming Features & Implementation Roadmap

### Phase 1 - Core Functionality Enhancement

#### ⏰ Task Reminders & Notifications
- **Technical Stack:**
  - Browser Notifications API
  - `date-fns` for date handling
  - Web Workers for background timing
- **Implementation Plan:**
  ```typescript
  interface TaskReminder {
    id: string;
    taskId: string;
    time: Date;
    type: 'once' | 'recurring';
    interval?: number;
  }
  ```
- **Key Components:**
  - ReminderManager service
  - NotificationHandler component
  - DateTime picker integration

#### 🔄 Recurring Tasks
- **Technical Stack:**
  - `rrule.js` for recurrence rules
  - Custom scheduling logic
- **Implementation Plan:**
  ```typescript
  interface RecurrenceRule {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    endDate?: Date;
    daysOfWeek?: number[];
  }
  ```
- **Key Components:**
  - RecurrenceEditor component
  - TaskScheduler service

#### ✅ Subtasks & Checklists
- **Technical Stack:**
  - Recursive component architecture
  - State management optimization
- **Implementation Plan:**
  ```typescript
  interface Subtask {
    id: string;
    parentId: string;
    title: string;
    completed: boolean;
    children?: Subtask[];
  }
  ```
- **Key Components:**
  - SubtaskList component
  - SubtaskEditor
  - Progress tracking

### Phase 2 - Organization & Visualization

#### 🏷️ Task Categories & Tags
- **Technical Stack:**
  - Custom tag management system
  - Fuzzy search for tag suggestions
- **Implementation Plan:**
  ```typescript
  interface Tag {
    id: string;
    name: string;
    color: string;
    tasks: string[];
  }
  ```
- **Key Components:**
  - TagManager
  - TagSelector with autocomplete
  - TagFilterSystem

#### 📅 Calendar Integration
- **Technical Stack:**
  - `@fullcalendar/react` for calendar views
  - Drag-and-drop integration
- **Implementation Plan:**
  - Month/Week/Day view components
  - Task-calendar synchronization
  - Date-based task grouping
- **Key Components:**
  - CalendarView
  - TaskScheduler
  - DateNavigator

#### 📎 Task Attachments
- **Technical Stack:**
  - File API
  - IndexedDB for storage
  - URL.createObjectURL for previews
- **Implementation Plan:**
  ```typescript
  interface Attachment {
    id: string;
    taskId: string;
    type: 'file' | 'image' | 'link';
    url: string;
    name: string;
    size?: number;
  }
  ```
- **Key Components:**
  - AttachmentUploader
  - AttachmentPreview
  - AttachmentList

### Phase 3 - Productivity Tools

#### 📊 Statistics & Insights
- **Technical Stack:**
  - `recharts` for data visualization
  - Custom analytics engine
- **Implementation Plan:**
  - Task completion tracking
  - Time-based analytics
  - Achievement system
- **Key Components:**
  - StatsDisplay
  - ProgressCharts
  - AchievementTracker

#### 🎯 Task Prioritization Matrix
- **Technical Stack:**
  - Custom grid system
  - Drag-and-drop functionality
- **Implementation Plan:**
  ```typescript
  interface TaskPriority {
    urgency: number;
    importance: number;
    quadrant: 1 | 2 | 3 | 4;
  }
  ```
- **Key Components:**
  - EisenhowerMatrix
  - QuadrantView
  - PriorityEditor

#### ⏱️ Focus Mode & Pomodoro Timer
- **Technical Stack:**
  - Custom timer implementation
  - Web Audio API for notifications
- **Implementation Plan:**
  ```typescript
  interface PomodoroSettings {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    intervalsUntilLongBreak: number;
  }
  ```
- **Key Components:**
  - Timer
  - SessionController
  - FocusModeUI
  - StatsTracker

## 📦 Required Dependencies
- `date-fns`: Date manipulation
- `rrule.js`: Recurrence rules
- `@fullcalendar/react`: Calendar views
- `recharts`: Data visualization
- `idb`: IndexedDB wrapper
- Additional dev dependencies for TypeScript and testing

## 🛠️ Development Approach
- Modular component architecture
- Progressive enhancement strategy
- Mobile-first responsive design
- Extensive TypeScript type safety
- Comprehensive test coverage
- Performance optimization focus
