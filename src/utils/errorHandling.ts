/**
 * Error handling utilities for Taskify application
 * This helps suppress common browser extension related errors
 * and other non-critical errors that shouldn't affect functionality
 */

/**
 * Sets up global error handlers to catch and manage runtime errors
 * particularly those related to browser extensions and message channels
 */
export function setupErrorHandlers(): void {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  // Original console error function
  const originalConsoleError = console.error;

  // Filtered console error to suppress known benign errors
  console.error = function(...args: any[]) {
    // Check if this is a runtime.lastError related to message channels closing
    const errorString = args.join(' ');
    if (
      errorString.includes('runtime.lastError') && 
      errorString.includes('message channel closed')
    ) {
      // Just suppress it - likely from browser extensions
      console.debug('Suppressed runtime.lastError related to message channels.');
      return;
    }
    
    // Allow other console errors to pass through
    originalConsoleError.apply(console, args);
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    // Check if this is a benign error we want to suppress
    if (
      event.reason && 
      (
        (typeof event.reason.message === 'string' && 
         event.reason.message.includes('runtime.lastError')) ||
        (typeof event.reason === 'string' && 
         event.reason.includes('runtime.lastError'))
      )
    ) {
      event.preventDefault();
      console.debug('Suppressed unhandled rejection related to runtime.lastError');
    }
  });

  // Optional: Override React error boundaries for more graceful handling
  // This would require additional setup in your component tree
}