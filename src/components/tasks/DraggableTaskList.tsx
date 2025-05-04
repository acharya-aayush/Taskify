import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../../types';

// Just a half-baked drag-n-drop implementation
// Don't expect fancy animations and stuff... ain't nobody got time for that

interface DraggableTaskListProps {
  tasks: Task[];
  renderItem: (task: Task, index: number, dragHandleProps: DragHandleProps) => React.ReactNode;
  onReorder: (sourceIndex: number, targetIndex: number) => void;
}

interface DragHandleProps {
  dragProps: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
  isDragging: boolean;
  isOver: boolean;
}

const DraggableTaskList: React.FC<DraggableTaskListProps> = ({ tasks, renderItem, onReorder }) => {
  // State for tracking drag and drop
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  // Reset drag state if tasks change
  useEffect(() => {
    setDraggedItem(null);
    setDraggedOverItem(null);
    setIsDragging(false);
  }, [tasks]);

  // Add body class effect when dragging
  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('is-dragging');
    } else {
      document.body.classList.remove('is-dragging');
    }
    
    return () => {
      document.body.classList.remove('is-dragging');
    };
  }, [isDragging]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, position: number) => {
    setDraggedItem(position);
    setIsDragging(true);
    
    // Set the drag image to be the current element
    const target = e.currentTarget as HTMLElement;
    if (target) {
      // Add a 'ghost' class to the drag preview for better visuals
      target.classList.add('dragging-ghost');
      
      // Create a custom drag image if needed
      try {
        const rect = target.getBoundingClientRect();
        const dragImage = target.cloneNode(true) as HTMLElement;
        dragImage.style.width = `${rect.width}px`;
        dragImage.style.transform = 'translateY(-1000px)';
        dragImage.style.opacity = '0.85';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setTimeout(() => {
          document.body.removeChild(dragImage);
        }, 0);
      } catch (err) {
        console.error('Error setting drag image:', err);
      }
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    if (draggedItem === null) return;
    
    setDraggedOverItem(position);
    
    // Update the UI to show where the item will be dropped
    const items = listRef.current?.querySelectorAll('li');
    if (items) {
      items.forEach((item, index) => {
        if (index === draggedOverItem) {
          item.classList.add('drag-over');
        } else {
          item.classList.remove('drag-over');
        }
      });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    // Clean up
    const items = listRef.current?.querySelectorAll('li');
    if (items) {
      items.forEach((item) => {
        item.classList.remove('dragging-ghost', 'drag-over');
      });
    }
    
    // Reorder if we have valid source and destination
    if (draggedItem !== null && draggedOverItem !== null && draggedItem !== draggedOverItem) {
      onReorder(draggedItem, draggedOverItem);
    }
    
    // Reset state
    setDraggedItem(null);
    setDraggedOverItem(null);
    setIsDragging(false);
  };

  // Handle drag enter
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    
    // Clean up styling
    const items = listRef.current?.querySelectorAll('li');
    if (items) {
      items.forEach((item) => {
        item.classList.remove('drag-over');
      });
    }
    
    // We'll handle the actual reordering in handleDragEnd
    setDraggedOverItem(position);
  };

  return (
    <ul className="space-y-2" ref={listRef}>
      {tasks.map((task, index) => (
        <li 
          key={task.id}
          className={`cursor-grab active:cursor-grabbing ${
            index === draggedItem ? 'opacity-70' : ''
          } ${
            index === draggedOverItem ? 'drag-over' : ''
          }`}
          data-task-id={task.id}
        >
          {renderItem(task, index, {
            dragProps: {
              draggable: true,
              onDragStart: (e) => handleDragStart(e, index),
              onDragOver: (e) => handleDragOver(e, index),
              onDragEnter: handleDragEnter,
              onDragLeave: handleDragLeave,
              onDrop: (e) => handleDrop(e, index),
              onDragEnd: handleDragEnd,
            },
            isDragging: index === draggedItem,
            isOver: index === draggedOverItem,
          })}
        </li>
      ))}
    </ul>
  );
};

export default DraggableTaskList;