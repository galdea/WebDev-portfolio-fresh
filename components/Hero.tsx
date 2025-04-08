'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [videoKey, setVideoKey] = useState(0); // Key to force re-render when source changes

  // Check if device is mobile on component mount and window resize
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Check for light theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsLightTheme(e.matches);
    };

    setIsLightTheme(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  // Update video key when theme or device changes
  useEffect(() => {
    setVideoKey((prev) => prev + 1);
    setIsLoading(true);
  }, [isMobile, isLightTheme]);

  // Handle video loading and play safely
  const handleVideoLoad = async () => {
    setIsLoading(false);
    try {
      await videoRef.current?.play();
    } catch (error) {
      console.error('Video play error:', error);
    }
  };

  const getVideoSources = () => {
    if (isMobile) {
      return isLightTheme
        ? { webm: '/images/About-sm.webm', mp4: '/images/About-sm.mp4' }
        : {
            webm: '/images/Intro-image-sm.webm',
            mp4: '/images/Intro-image-sm.mp4',
          };
    } else {
      return isLightTheme
        ? { webm: '/images/About.webm', mp4: '/images/About.mp4' }
        : { webm: '/images/Intro-image.webm', mp4: '/images/Intro-image.mp4' };
    }
  };

  const sources = getVideoSources();

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
          <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* Video Background */}
      <motion.video
        key={videoKey} // Force re-render when key changes
        ref={videoRef}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0.5 }}
        muted
        playsInline
        autoPlay
        loop
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadedData={handleVideoLoad}
      >
        <source src={sources.webm} type="video/webm" />
        <source src={sources.mp4} type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
      >
        <ChevronDown className="text-secondary w-8 h-8" />
      </motion.div>
    </section>
  );
};

export default Hero;
