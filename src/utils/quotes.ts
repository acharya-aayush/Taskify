// Motivational quotes for productivity
const quotes = [
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  },
  {
    quote: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    quote: "Sleep is temporary. Grind is eternal.",
    author: "Unknown"
  },
  {
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    quote: "The most difficult thing is the decision to act, the rest is merely tenacity.",
    author: "Amelia Earhart"
  }
];

// Get a random quote
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

// Get the "Sleep is temporary" quote that appears at 3:33PM
export const getSpecialQuote = () => {
  return quotes.find(quote => quote.quote.includes("Sleep is temporary"));
};

// Check if it's time for the special quote (3:33 PM)
export const isTimeForSpecialQuote = () => {
  const now = new Date();
  return now.getHours() === 15 && now.getMinutes() === 33;
};

export default quotes;