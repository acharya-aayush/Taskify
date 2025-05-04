import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] isolate flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-opacity duration-300 -z-10"
        onClick={onClose}
      />
      
      {/* Modal content with neumorphic design */}
      <div 
        className={`relative w-full ${sizeClasses[size]} animate-scale-in rounded-2xl 
          bg-gray-50 dark:bg-dark-200 
          shadow-neu-raised dark:shadow-dark-neu-raised`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-300">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h2>
          <Button
            variant="neutral"
            size="sm"
            className="p-1.5 rounded-full transition-transform hover:scale-105 active:scale-95"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </Button>
        </div>
        
        {/* Content with subtle inner shadow */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)] 
          bg-gray-50 dark:bg-dark-200 
          shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]">
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal at the root level using portal
  return createPortal(modalContent, document.body);
};

export default Modal;