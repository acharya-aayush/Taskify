/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        'light': '#F0F0F3',
        'dark': '#121212',  // Darker base
        'light-100': '#FFFFFF',
        'light-200': '#E8E8E8',
        'light-400': '#CACACA',
        'light-500': '#B8B8B8',
        'dark-100': '#1A1A1A',  // Darkest shade
        'dark-200': '#1E1E1E',  // Card background
        'dark-300': '#242424',  // Elevated surfaces
        'dark-400': '#2A2A2A',  // Hover states
        'dark-500': '#333333',  // Highest elevation
        'primary-light': '#007AFF',
        'primary-dark': '#0A84FF',
        'text-light': '#1A1A1A',
        'text-dark': '#F0F0F3',
        'text-light-secondary': '#666666',
        'text-dark-secondary': '#A1A1A1',
      },
      boxShadow: {
        'neu-flat': '-5px -5px 10px #FFFFFF, 5px 5px 10px rgba(0, 0, 0, 0.1)',
        'dark-neu-flat': '-5px -5px 10px rgba(255, 255, 255, 0.03), 5px 5px 10px rgba(0, 0, 0, 0.5)',
        'neu-raised': '-8px -8px 15px #FFFFFF, 8px 8px 15px rgba(0, 0, 0, 0.1)',
        'dark-neu-raised': '-8px -8px 15px rgba(255, 255, 255, 0.03), 8px 8px 15px rgba(0, 0, 0, 0.5)',
        'neu-pressed': 'inset -2px -2px 5px #FFFFFF, inset 2px 2px 5px rgba(0, 0, 0, 0.1)',
        'dark-neu-pressed': 'inset -2px -2px 5px rgba(255, 255, 255, 0.03), inset 2px 2px 5px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15%)' }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.2' }
        }
      },
      animation: {
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce': 'bounce 0.5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}