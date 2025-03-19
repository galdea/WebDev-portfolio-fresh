import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Skills = () => {
  const [text, setText] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(1);

  const codeSnippet = `const skills =\n\n  frameworks: ['ReactJS', 'NextJS', 'Flask', 'Vite'];\n  languages: ['JavaScript', 'Python', 'TypeScript'];\n  methodologies: ['Scrum', 'Kanban', 'Agile'];\n  databases: ['PostgreSQL', 'MongoDB', 'SQLAlchemy'];\n  styling: ['Bootstrap', 'SemanticUI', 'TailwindCSS'];\n  testing: ['Jest'];\n  emerging: ['AI Integration'];\n  devOps: ['Git', 'CodeSpace', 'Netlify', 'Supabase'];\n  and: much, much more...;`;

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle video setup
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.muted = true;
    video.playsInline = true;

    if (isMobile) {
      // Mobile: Play one looping video
      video.src = '/images/skills12.webm';
      video.loop = true;
      video.load();
      video.play().catch((err) => console.error('Video play error:', err));
    } else {
      // Desktop: Cycle through videos
      video.loop = false; // Ensure loop is disabled for sequential playback
      video.src = `/images/skills${currentVideoIndex}.webm`;
      video.load();
      video.play().catch((err) => console.error('Video play error:', err));

      const handleEnded = () => {
        setCurrentVideoIndex((prev) => (prev % 14) + 1); // Cycle through 1-14
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
              setTimeout(typeText, 50);
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

  return (
    <section
      id="skills"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-20 container mx-auto px-4">
        <pre className="text-secondary font-mono text-lg bg-black/50 p-4 rounded whitespace-pre-line break-words">
          {text}
        </pre>
      </div>

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
