import React, { useState, useEffect } from 'react';
import { X, Quote } from 'lucide-react';
import { getRandomQuote } from '../utils/quotes';

interface QuotePopupProps {
  enabled: boolean;
}

const QuotePopup: React.FC<QuotePopupProps> = ({ enabled }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (!enabled) return;

    // Show quote after 2 minutes of inactivity
    const timer = setTimeout(() => {
      const { quote, author } = getRandomQuote();
      setQuote(quote);
      setAuthor(author);
      setIsVisible(true);
    }, 120000);

    return () => clearTimeout(timer);
  }, [enabled]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="relative p-4 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-[2px_2px_8px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.7)] dark:shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(30,41,59,0.2)]">
        {/* Quote icon with enhanced glow */}
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-white dark:bg-slate-700/90 shadow-neu-raised dark:shadow-[3px_3px_6px_rgba(0,0,0,0.25),-3px_-3px_6px_rgba(30,41,59,0.15)] flex items-center justify-center">
          <Quote 
            size={16} 
            className="text-blue-500 dark:text-blue-400 animate-glow-pulse" 
          />
        </div>
        
        {/* Close button with improved contrast */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-white dark:bg-slate-700/90 text-gray-600 dark:text-gray-300 shadow-neu-raised dark:shadow-[3px_3px_6px_rgba(0,0,0,0.25),-3px_-3px_6px_rgba(30,41,59,0.15)] hover:shadow-neu-flat dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(30,41,59,0.1)] active:shadow-neu-pressed dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)] transition-all duration-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <X size={14} />
        </button>
        
        {/* Quote content with enhanced visibility */}
        <div className="pl-6 border-l-2 border-blue-500/30 dark:border-blue-400/30">
          <p className="text-gray-700 dark:text-gray-100 text-sm italic">
            {quote}
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-xs">
            — {author}
          </p>
        </div>
        
        {/* Enhanced gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 dark:via-blue-400/30 to-transparent" />
      </div>
    </div>
  );
};

export default QuotePopup;