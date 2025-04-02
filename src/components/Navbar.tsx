import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function with routing support
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    targetRoute: string,
  ) => {
    e.preventDefault();

    // Navigate to the route (if it's different from the current route)
    if (targetRoute !== window.location.pathname) {
      navigate(targetRoute);
      setIsOpen(false); // Close the mobile menu after navigation
      return;
    }

    // Handle scroll within the same page
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
      });
    }

    // Close mobile menu if open
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const navLinks = [
    { href: '#home', label: t('nav.home'), route: '/' },
    { href: '#about', label: t('nav.about'), route: '/' },
    { href: '#skills', label: t('nav.skills'), route: '/' },
    { href: '#projects', label: t('nav.projects'), route: '/' },
    { href: '#galleries', label: t('Gallery'), route: '/' },
    { href: '#contact', label: t('nav.contact'), route: '/' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-dark/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 w-full">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-[#f1f5f9]"
                onClick={(e) => handleNavClick(e, link.href, link.route)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://www.instagram.com/gab_aldea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#65fbda] transition-colors"
            >
              <FaInstagram className="w-6 h-6" />{' '}
            </a>
            <a
              href="https://github.com/galdea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#65fbda] transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4 ">
            <LanguageToggle />
            <button
              className="text-text hover:text-secondary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-bg-dark/95 backdrop-blur-sm "
            >
              <div className="flex flex-col py-4 bg-black/35">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 transition-colors text-[#f1f5f9] hover:text-[#65fbda] "
                    onClick={(e) => handleNavClick(e, link.href, link.route)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
