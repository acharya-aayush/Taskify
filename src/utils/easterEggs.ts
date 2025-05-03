import { EasterEggType } from '../types';

// Check if input triggers an easter egg
export function checkEasterEggs(input: string): EasterEggType {
  if (input.toLowerCase().includes("acharya")) return "MATRIX_ANIMATION";
  if (input === "/aayush") return "CLI_TERMINAL_POPUP";
  if (input === "/tictactoe") return "LAUNCH_GAME_MODAL";
  if (input === "/bored") return "INJECT_RANDOM_TASK";
  return null;
}

// Generate a random fun task
export function getRandomFunTask(): string {
  const funTasks = [
    "Touch grass for 5 minutes",
    "Call a friend you haven't spoken to in a while",
    "Do 20 jumping jacks",
    "Learn to say 'hello' in a new language",
    "Draw a doodle of your favorite animal",
    "Write a haiku about your day",
    "Drink a glass of water (stay hydrated!)",
    "Look out the window for 2 minutes",
    "Organize your desk",
    "Send a thank you message to someone"
  ];
  
  return funTasks[Math.floor(Math.random() * funTasks.length)];
}

// Log easter egg activations
export function logEasterEgg(type: EasterEggType): void {
  if (!type) return;
  
  const easterEggLogs = JSON.parse(localStorage.getItem('taskify-easter-eggs') || '{}');
  const count = (easterEggLogs[type] || 0) + 1;
  
  easterEggLogs[type] = count;
  easterEggLogs.lastTriggered = new Date().toISOString();
  
  localStorage.setItem('taskify-easter-eggs', JSON.stringify(easterEggLogs));
  
  // Easter egg activation message in console
  console.log(`🥚 Easter egg activated: ${type} (${count} times)`);
}