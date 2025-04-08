'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function with Next.js routing support
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    targetRoute: string,
  ) => {
    e.preventDefault();

    // Navigate to the route (if it's different from the current route)
    if (targetRoute !== pathname) {
      router.push(targetRoute);
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
        scrolled
          ? 'bg-background/95 dark:bg-dark/95 backdrop-blur-md py-4 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.route + link.href}
                className="nav-link font-medium text-foreground hover:text-primary dark:text-foreground"
                onClick={(e) => handleNavClick(e, link.href, link.route)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/gab_aldea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/galdea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              className="text-foreground hover:text-primary transition-colors"
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
              className="absolute top-full left-0 right-0 bg-background/95 dark:bg-dark/95 backdrop-blur-sm shadow-lg"
            >
              <div className="flex flex-col py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.route + link.href}
                    className="px-4 py-3 transition-colors text-foreground hover:text-primary font-medium"
                    onClick={(e) => handleNavClick(e, link.href, link.route)}
                  >
                    {link.label}
                  </Link>
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
