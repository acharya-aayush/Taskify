import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    
    // Ensure smooth transitions
    requestAnimationFrame(() => {
      root.style.setProperty('color-scheme', effectiveTheme);
    });
  }, [theme, systemTheme]);

  return {
    theme,
    setTheme,
    effectiveTheme: theme === 'system' ? systemTheme : theme,
    isSystem: theme === 'system'
  };
};

export default useTheme;