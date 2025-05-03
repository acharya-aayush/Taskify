import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import { X, Terminal } from 'lucide-react';

interface CliTerminalProps {
  onClose: () => void;
}

const CliTerminal: React.FC<CliTerminalProps> = ({ onClose }) => {
  const [commandHistory, setCommandHistory] = useState<string[]>([
    "Aayush CLI v1.0.0",
    "Type 'help' for available commands."
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus the input field when the terminal opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Scroll to the bottom of the terminal when new commands are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);
  
  // Handle command submission
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentInput.trim()) return;
    
    // Add the command to history
    setCommandHistory(prev => [...prev, `> ${currentInput}`]);
    
    // Process the command
    processCommand(currentInput);
    
    // Clear the input
    setCurrentInput('');
  };
  
  // Process the command and generate a response
  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    
    switch (command) {
      case 'help':
        setCommandHistory(prev => [
          ...prev,
          "Available commands:",
          "- help: Show this help menu",
          "- about: About the developer",
          "- clear: Clear the terminal",
          "- date: Show current date and time",
          "- quote: Get a random quote",
          "- exit: Close the terminal"
        ]);
        break;
        
      case 'about':
        setCommandHistory(prev => [
          ...prev,
          "Created by Aayush",
          "A passionate developer who builds sleek, user-friendly web applications.",
          "When not coding, can be found exploring new technologies or enjoying a good book."
        ]);
        break;
        
      case 'clear':
        setCommandHistory([
          "Aayush CLI v1.0.0",
          "Type 'help' for available commands."
        ]);
        break;
        
      case 'date':
        setCommandHistory(prev => [
          ...prev,
          new Date().toString()
        ]);
        break;
        
      case 'quote':
        const quotes = [
          "Success is not final, failure is not fatal: It is the courage to continue that counts.",
          "The only way to do great work is to love what you do.",
          "The future belongs to those who believe in the beauty of their dreams.",
          "It does not matter how slowly you go as long as you do not stop.",
          "Sleep is temporary. Grind is eternal."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCommandHistory(prev => [...prev, randomQuote]);
        break;
        
      case 'exit':
        onClose();
        break;
        
      default:
        setCommandHistory(prev => [
          ...prev,
          `Command not found: ${command}`,
          "Type 'help' for available commands."
        ]);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl rounded-xl bg-gray-900 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] overflow-hidden"
        style={{ 
          animation: "modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}
      >
        <style jsx>{`
          @keyframes modal-pop {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          @keyframes cursor-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
        
        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Terminal size={18} />
            <span className="font-mono text-sm">aayush@taskify:~</span>
          </div>
          
          <Button
            variant="danger"
            size="sm"
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white"
            aria-label="Close terminal"
          >
            <X size={16} />
          </Button>
        </div>
        
        {/* Terminal content */}
        <div 
          ref={terminalRef}
          className="h-96 p-4 font-mono text-sm overflow-y-auto bg-gray-900"
        >
          {commandHistory.map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))}
          
          {/* Command input */}
          <form onSubmit={handleCommandSubmit} className="flex items-center mt-2">
            <span className="mr-2">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-green-500 font-mono"
              autoFocus
            />
            <span 
              className="w-2 h-4 bg-green-500 inline-block" 
              style={{ animation: 'cursor-blink 1s step-end infinite' }}
            ></span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CliTerminal;