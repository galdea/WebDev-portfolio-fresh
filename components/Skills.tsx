'use client';

import { motion } from 'framer-motion';
import { Calculator, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectCalculator from './ProjectCalculator';

const Skills = () => {
  const [text, setText] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // Added missing state for direction

  const slides = Array(5).fill(null); // Placeholder for slides array

  const codeSnippet = `const skills =\n\n  languages: ['JavaScript', 'Python', 'TypeScript'];\n  frameworks: ['ReactJS', 'NextJS', 'Flask', 'Vite'];\n  databases: ['PostgreSQL', 'MongoDB', 'SQLAlchemy'];\n  styling: ['Bootstrap', 'SemanticUI', 'TailwindCSS'];\n  emerging: ['AI Integration'];\n  tools: ['Git', 'CodeSpace', 'Postman','VSCode']; \n  methodologies: ['Scrum', 'Kanban', 'Agile']; \n  deployment:  ['Vercel', 'Netlify', 'Supabase', 'Heroku']; \n  and: Much, much more...;`;

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.muted = true;
    video.playsInline = true;

    // Detect if the user is on iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isMobile) {
      // Mobile: Play one looping video
      video.src = isIOS ? '/images/skills6.mp4' : '/images/skills6.webm';
      video.loop = true;
      video.load();
      video.play().catch((err) => console.error('Video play error:', err));
    } else {
      // Desktop: Cycle through videos
      video.loop = false; // Ensure loop is disabled for sequential playback
      video.src = isIOS
        ? `/images/skills${currentVideoIndex}.mp4`
        : `/images/skills${currentVideoIndex}.webm`;
      video.load();
      video.play().catch((err) => console.error('Video play error:', err));

      const handleEnded = () => {
        const nextVideoIndex = (currentVideoIndex % 14) + 1;

        // Replay current video while the next video is loading
        video.play().catch((err) => console.error('Video replay error:', err));

        const tempVideo = document.createElement('video');
        tempVideo.src = isIOS
          ? `/images/skills${nextVideoIndex}.mp4`
          : `/images/skills${nextVideoIndex}.webm`;
        tempVideo.load();

        tempVideo.oncanplaythrough = () => {
          setCurrentVideoIndex(nextVideoIndex);
          video.src = tempVideo.src;
          video.load();
          video.play().catch((err) => console.error('Video play error:', err));
        };
      };

      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }
  }, [isMobile, currentVideoIndex]);

  // Typewriter effect
  useEffect(() => {
    const section = document.getElementById('skills');
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let currentText = '';
          let currentIndex = 0;

          const typeText = () => {
            if (currentIndex < codeSnippet.length) {
              currentText += codeSnippet[currentIndex];
              setText(currentText);
              currentIndex++;
              setTimeout(typeText, 20);
            }
          };

          typeText();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !(popupRef.current as Node).contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <section
      id="skills"
      className="min-h-screen flex items-center relative overflow-hidden pt-12"
    >
      <motion.video
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0.5 }}
        ref={videoRef}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-20 container mx-auto px-4">
        {/* Code snippet */}
        <div
          className="bg-black/50 mb-4 rounded"
          style={{ minHeight: '420px' }}
        >
          <pre className="text-[#64ffda] font-mono text-lg p-4 whitespace-pre-line break-words">
            {text}
          </pre>

          {/* Project Quote Calculator button */}
          <div className="flex justify-center pt-12 mb-20 pb-4">
            <div className="flex justify-center item-center pt-3 pr-4">
              <Calculator size={28} />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPopupOpen(true)}
              className="flex flex-col sm:flex-row gap-4 justify-center btn-primary over:scale-110 text-center bg-black/10 border-[#64ffda] text-[#64ffda]"
            >
              <code>Project Quote Calculator</code>
            </motion.button>
            <div className="flex justify-center item-center pt-3 pl-4">
              <Calculator size={28} />
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <>
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black/60 z-40 "></div>

          {/* Background overlay */}
          <div className="fixed flex items-center justify-center z-50 inset-0 p-4">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-200 z-50 text-lg md:text-xl lg:text-2xl"
              onClick={() => setIsPopupOpen(false)}
            >
              ✕
            </button>
            <motion.div
              ref={popupRef}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className=" shadow-lg max-w-lg w-full relative bg-white/20 rounded-lg"
            >
              <ProjectCalculator />
            </motion.div>
          </div>
        </>
      )}
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: 10 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
      >
        <ChevronDown className="text-secondary w-8 h-8" />
      </motion.div>
    </section>
  );
};

export default Skills;
