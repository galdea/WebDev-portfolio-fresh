import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Skills = () => {
  const [text, setText] = useState('');
  const videoRefs = {
    current: useRef<HTMLVideoElement | null>(null), // Explicit type for videoRefs
    next: useRef<HTMLVideoElement | null>(null), // Explicit type for videoRefs
  };
  const [activeIndex, setActiveIndex] = useState(0); // Tracks which video is active
  const [currentVideo, setCurrentVideo] = useState(1); // Tracks the current playing video index
  const { t } = useTranslation();

  const codeSnippet = `const skills =\n \n  frameworks: ['ReactJS', 'NextJS', 'Flask', 'Vite'];\n  languages: ['JavaScript', 'Python', 'TypeScript'];\n  methodologies: ['Scrum', 'Kanban', 'Agile'];\n  databases: ['PostgreSQL', 'MongoDB', 'SQLAlchemy'];\n  styling: ['Bootstrap', 'SemanticUI', 'TailwindCSS'];\n  testing: ['Jest'];\n  emerging: ['AI Integration'];\n  devOps: ['Git', 'CodeSpace', 'Netlify', 'Supabase']; \n  and: much, much more...;`;

  // Preload all videos
  useEffect(() => {
    const preloadVideos = async () => {
      const videoPromises = [];
      for (let i = 1; i <= 14; i++) {
        const promise = new Promise<void>((resolve) => {
          // Specify void here
          const video = document.createElement('video');
          video.style.display = 'none';
          video.preload = 'auto';
          video.muted = true;
          video.src = `src/images/skills${i}.webm`;
          video.oncanplaythrough = () => {
            document.body.removeChild(video);
            resolve(); // resolve without arguments (implicitly undefined)
          };
          document.body.appendChild(video);
        });
        videoPromises.push(promise);
      }
      await Promise.all(videoPromises);
      console.log('All videos preloaded');
    };

    preloadVideos();
  }, []);

  // Function to handle video transitions
  const playNextVideo = (endedIndex: number): void => {
    const nextVideoIndex = endedIndex === 0 ? 1 : 0;
    const nextVideoNumber = (currentVideo % 14) + 1;

    // Ensure videoRefs.current and videoRefs.next are not null
    const videoElements = [videoRefs.current.current, videoRefs.next.current];

    // Check if video elements are valid (not null)
    if (!videoElements[0] || !videoElements[1]) return;

    // Fade out the current video before loading the next
    videoElements[endedIndex]?.classList.add('opacity-0');
    videoElements[nextVideoIndex]?.classList.remove('opacity-0');

    // Set new video source and play
    videoElements[
      nextVideoIndex
    ]!.src = `src/images/skills${nextVideoNumber}.webm`;
    videoElements[nextVideoIndex]!.load();
    videoElements[nextVideoIndex]!.play().catch((err) =>
      console.error('Video play error:', err),
    );

    setActiveIndex(nextVideoIndex);
    setCurrentVideo(nextVideoNumber);
  };

  // Initialize first video and attach event listeners
  useEffect(() => {
    const videoElements = [videoRefs.current.current, videoRefs.next.current];

    if (!videoElements[0] || !videoElements[1]) return;

    // Initialize video sources
    videoElements[0].src = `src/images/skills${currentVideo}.webm`;
    videoElements[0].load();

    videoElements[0]
      .play()
      .catch((err) => console.error('Video play error:', err));

    videoElements[0].onended = () => playNextVideo(0);
    videoElements[1].onended = () => playNextVideo(1);
  }, [currentVideo]);

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
          observer.disconnect(); // Stop observing once the effect starts
        }
      },
      { threshold: 0.5 }, // Trigger when 50% of the section is visible
    );

    observer.observe(section);

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, []);

  return (
    <section
      id="skills"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Two video elements for crossfade effect */}
      <video
        ref={videoRefs.current}
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 opacity-100`}
      />
      <video
        ref={videoRefs.next}
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 opacity-0`}
      />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        <pre className="text-secondary font-mono text-lg bg-black/50 p-4 rounded whitespace-pre-line break-words">
          {text}
        </pre>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
      >
        <ChevronDown className="text-secondary w-8 h-8" />
      </motion.div>
    </section>
  );
};

export default Skills;
