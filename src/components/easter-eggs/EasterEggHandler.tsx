import React, { useState, useEffect } from 'react';
import MatrixAnimation from './MatrixAnimation';
import CliTerminal from './CliTerminal';
import TicTacToe from './TicTacToe';
import { EasterEggType } from '../../types';

interface EasterEggHandlerProps {
  easterEggType: EasterEggType;
  onClose: () => void;
}

const EasterEggHandler: React.FC<EasterEggHandlerProps> = ({ easterEggType, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (easterEggType) {
      setIsActive(true);
      
      // Auto-close some easter eggs after a delay
      if (easterEggType === 'MATRIX_ANIMATION') {
        const timer = setTimeout(() => {
          setIsActive(false);
          setTimeout(onClose, 500); // Allow for exit animation
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsActive(false);
    }
  }, [easterEggType, onClose]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        setIsActive(false);
        setTimeout(onClose, 500); // Allow for exit animation
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isActive, onClose]);
  
  if (!easterEggType || !isActive) return null;
  
  // Render the appropriate easter egg based on type
  switch (easterEggType) {
    case 'MATRIX_ANIMATION':
      return <MatrixAnimation onClose={() => {
        setIsActive(false);
        setTimeout(onClose, 500);
      }} />;
      
    case 'CLI_TERMINAL_POPUP':
      return <CliTerminal onClose={() => {
        setIsActive(false);
        setTimeout(onClose, 500);
      }} />;
      
    case 'LAUNCH_GAME_MODAL':
      return <TicTacToe onClose={() => {
        setIsActive(false);
        setTimeout(onClose, 500);
      }} />;
      
    default:
      return null;
  }
};

export default EasterEggHandler;