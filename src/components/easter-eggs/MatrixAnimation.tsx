import React, { useEffect, useRef } from 'react';
import Button from '../ui/Button';
import { X } from 'lucide-react';

interface MatrixAnimationProps {
  onClose: () => void;
}

const MatrixAnimation: React.FC<MatrixAnimationProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters (using simpler character set to avoid potential display issues)
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    // Column settings
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Drops - one per column, starting at random position
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height);
    }
    
    // Drawing the characters
    function draw() {
      // Set semi-transparent black background to show trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0'; // Green text
      ctx.font = `${fontSize}px monospace`;
      
      // Loop over drops
      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Randomly reset drop to top with randomization
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
      }
    }
    
    // Animation loop
    const interval = setInterval(draw, 50);
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-auto">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 bg-black z-10 animate-fade-in"
        style={{ animation: 'fadeIn 0.5s ease-in-out' }}
      />
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="neutral"
          size="sm"
          onClick={onClose}
          className="bg-black/50 text-green-500 p-1.5 rounded-full shadow-lg"
          aria-label="Close matrix animation"
        >
          <X size={20} />
        </Button>
      </div>
      
      <div className="relative z-20 text-center p-6 max-w-lg">
        <h2 className="text-green-500 text-2xl font-mono mb-3 tracking-widest">
          WELCOME TO THE MATRIX
        </h2>
        <p className="text-green-400 font-mono">
          There is no spoon. Wake up, Neo...
        </p>
      </div>
    </div>
  );
};

export default MatrixAnimation;