import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Clock, FileText } from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

const changelogEntries: ChangelogEntry[] = [
  {
    version: 'v1.0.0',
    date: '2025-05-15',
    changes: [
      '✅ Initial release of Taskify with core task management features',
      '🎨 Implemented neumorphic design system for all UI components',
      '🧠 Added task persistence with localStorage',
      '🔍 Integrated search and filtering capabilities',
      '🌙 Added dark mode support with theme persistence',
      '🥚 Added easter eggs for a delightful user experience',
      '📊 Included progress tracking and statistics',
      '📱 Optimized for responsive design across all devices'
    ]
  },
  {
    version: 'v0.9.0',
    date: '2025-05-10',
    changes: [
      '✅ Added ability to set due dates and priorities for tasks',
      '🧩 Implemented feature checklist component to track development',
      '🎯 Added task completion statistics and streaks',
      '🥚 Added Matrix animation and CLI terminal easter eggs',
      '🎮 Added Tic Tac Toe game as an easter egg'
    ]
  },
  {
    version: 'v0.5.0',
    date: '2025-05-05',
    changes: [
      '✅ Created base task storage and retrieval system',
      '🧠 Implemented task filtering (All, Active, Completed)',
      '🎨 Set up initial neumorphic design foundation',
      '📦 Added ability to export tasks as JSON'
    ]
  }
];

const ChangelogModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Changelog button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        aria-label="View changelog"
      >
        <Clock size={14} />
        <span>Changelog</span>
      </button>
      
      {/* Changelog modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Taskify Changelog" size="md">
        <div className="space-y-6">
          {changelogEntries.map((entry, index) => (
            <div key={entry.version} className={index !== 0 ? "pt-6 border-t border-gray-200 dark:border-gray-700" : ""}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {entry.version}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {entry.date}
                </span>
              </div>
              
              <ul className="space-y-2">
                {entry.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="mt-0.5 text-gray-400">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="flex justify-end mt-4">
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChangelogModal;