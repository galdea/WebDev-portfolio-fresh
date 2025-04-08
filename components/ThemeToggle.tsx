'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => {
        if (theme === 'system') {
          setTheme('dark');
        } else if (theme === 'dark') {
          setTheme('light');
        } else {
          setTheme('system');
        }
      }}
      className="rounded-full p-2 hover:bg-primary/10 transition-colors duration-300 focus:outline-none focus:ring-offset-background"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-yellow-500" />
      )}
    </button>
  );
}
