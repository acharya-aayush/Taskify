import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface TicTacToeProps {
  onClose: () => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ onClose }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  
  // Possible winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  
  // Handle player move
  const handleClick = (index: number) => {
    // Return if square is already filled or game is won
    if (board[index] || winner) return;
    
    // Create a copy of the board
    const newBoard = board.slice();
    
    // Set X or O in the clicked square
    newBoard[index] = xIsNext ? 'X' : 'O';
    
    // Update state
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };
  
  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine(null);
  };
  
  // Check for winner
  useEffect(() => {
    const checkWinner = () => {
      for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          setWinner(board[a]);
          setWinningLine(winningCombinations[i]);
          return;
        }
      }
      
      // Check for draw
      if (board.every(square => square !== null)) {
        setWinner('Draw');
      }
    };
    
    checkWinner();
  }, [board]);
  
  // Computer move (simple AI)
  useEffect(() => {
    // If it's computer's turn (O) and no winner yet
    if (!xIsNext && !winner) {
      const timeoutId = setTimeout(() => {
        makeComputerMove();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [xIsNext, winner]);
  
  // Simple AI for computer moves
  const makeComputerMove = () => {
    const newBoard = [...board];
    
    // Try to win
    for (const [a, b, c] of winningCombinations) {
      if (board[a] === 'O' && board[b] === 'O' && board[c] === null) {
        newBoard[c] = 'O';
        setBoard(newBoard);
        setXIsNext(true);
        return;
      }
      if (board[a] === 'O' && board[c] === 'O' && board[b] === null) {
        newBoard[b] = 'O';
        setBoard(newBoard);
        setXIsNext(true);
        return;
      }
      if (board[b] === 'O' && board[c] === 'O' && board[a] === null) {
        newBoard[a] = 'O';
        setBoard(newBoard);
        setXIsNext(true);
        return;
      }
    }
    
    // Block player from winning
    for (const [a, b, c] of winningCombinations) {
      if (board[a] === 'X' && board[b] === 'X' && board[c] === null) {
        newBoard[c] = 'O';
        setBoard(newBoard);
        setXIsNext(true);
        return;
      }
      if (board[a] === 'X' && board[c] === 'X' && board[b] === null) {
        newBoard[b] = 'O';
        setBoard(newBoard);
        setXIsNext(true);
        return;
      }
      if (board[b] === 'X' && board[c] === 'X' && board[a] === null) {
        newBoard[a] = 'O';
        setBoard(newBoard);
        setXIsNext(true);
        return;
      }
    }
    
    // Take center if available
    if (board[4] === null) {
      newBoard[4] = 'O';
      setBoard(newBoard);
      setXIsNext(true);
      return;
    }
    
    // Take a random empty square
    const emptySquares = board.map((square, index) => square === null ? index : -1).filter(index => index !== -1);
    if (emptySquares.length > 0) {
      const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
      newBoard[randomIndex] = 'O';
      setBoard(newBoard);
      setXIsNext(true);
    }
  };
  
  // Render a square with enhanced neumorphic styling
  const renderSquare = (index: number) => {
    const isWinningSquare = winningLine?.includes(index);
    const value = board[index];
    const isX = value === 'X';
    
    return (
      <button
        className={`w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center text-2xl font-bold 
          ${isWinningSquare 
            ? 'bg-green-50/80 dark:bg-slate-800' 
            : 'bg-light dark:bg-slate-800'} 
          rounded-xl transition-all duration-300 
          ${isWinningSquare 
            ? 'shadow-[0_0_15px_rgba(34,197,94,0.3),inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[0_0_15px_rgba(34,197,94,0.2),inset_2px_2px_5px_rgba(0,0,0,0.3)]'
            : 'shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,1)] dark:shadow-dark-neu-raised hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,1)] dark:hover:shadow-dark-neu-flat active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,1)] dark:active:shadow-dark-neu-pressed'
          }
          disabled:opacity-80 disabled:cursor-not-allowed
          ${!value && !winner && xIsNext ? 'hover:bg-blue-50/30 dark:hover:bg-slate-700/50' : ''}`}
        onClick={() => handleClick(index)}
        disabled={!!value || !!winner || !xIsNext}
      >
        {value && (
          <span 
            className={`relative inline-flex items-center justify-center
              ${isX ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}
              ${isWinningSquare ? 'animate-bounce' : 'animate-scale-in'}
              after:absolute after:inset-0 after:rounded-full after:opacity-10 
              ${isX ? 'after:bg-blue-500' : 'after:bg-red-500'}`}
          >
            {value}
          </span>
        )}
      </button>
    );
  };
  
  // Get status message
  const getStatusMessage = () => {
    if (winner === 'Draw') {
      return "It's a draw!";
    } else if (winner) {
      return `Winner: ${winner}`;
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} title="Tic Tac Toe" size="md">
      <div className="text-center">
        <div className={`mb-6 p-3 rounded-xl bg-light dark:bg-dark-200 
          shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] 
          dark:shadow-dark-neu-pressed
          ${winner ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}
        >
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {getStatusMessage()}
          </p>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-2xl bg-light/50 dark:bg-dark-300 
            shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] 
            dark:shadow-dark-neu-pressed"
          >
            <div className="grid grid-cols-3 gap-3">
              {renderSquare(0)}
              {renderSquare(1)}
              {renderSquare(2)}
              {renderSquare(3)}
              {renderSquare(4)}
              {renderSquare(5)}
              {renderSquare(6)}
              {renderSquare(7)}
              {renderSquare(8)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            onClick={resetGame} 
            variant="primary"
            className="min-w-[100px]"
          >
            New Game
          </Button>
          <Button 
            onClick={onClose} 
            variant="neutral"
            className="min-w-[100px]"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TicTacToe;