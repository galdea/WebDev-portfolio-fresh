import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => window.open(slides[currentIndex].websiteUrl, '_blank')}
    >
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-colors duration-200 ease-in-out transform hover:scale-120"
        aria-label={
          theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        }
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 fill-yellow-500" />
        )}
      </button>
    </motion.button>
  );
}
