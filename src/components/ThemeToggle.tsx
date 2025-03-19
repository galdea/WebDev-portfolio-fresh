import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Assuming 'slides' is an array of objects that include 'websiteUrl'
const slides = [
  { websiteUrl: 'https://example1.com' },
  { websiteUrl: 'https://example2.com' },
  // Add more slides here
];

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Example: assuming you want to keep track of the current slide's index
  const currentIndex = 0; // You need logic to set this index based on the current slide

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
