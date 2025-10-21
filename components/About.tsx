'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const [text, setText] = useState('');
  const [currentVideo, setCurrentVideo] =
    useState<string>('/images/About.webm');
  const timeoutRef = useRef<number | null>(null);
  const { t } = useTranslation();

  const codeSnippet =
    "const aboutMe = \n \n Hi, I'm Gabriel and I love building things.\n \n  It's not a coincidence that I am both a passionate carpenter and an innovative web developer.\n\n  Coming to think about it, what I enjoy the most is materializing ideas into reality.\n \n  When I create apps, I bring the same precision, creativity, and attention to detail that I apply in my workshop. Every project is an opportunity to construct something meaningful that stands the test of time.";

  const videoDurations: Record<string, number> = {
    '/images/About.webm': 14500,
    '/images/About2.webm': 14500,
    '/images/About.mp4': 14500,
    '/images/About2.mp4': 14500,
  };

  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    setCurrentVideo(isIOS ? '/images/About.mp4' : '/images/About.webm');

    const cycleVideos = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      setCurrentVideo((prevVideo) => {
        const nextVideo =
          prevVideo === (isIOS ? '/images/About.mp4' : '/images/About.webm')
            ? isIOS
              ? '/images/About2.mp4'
              : '/images/About2.webm'
            : isIOS
            ? '/images/About.mp4'
            : '/images/About.webm';

        timeoutRef.current = window.setTimeout(
          cycleVideos,
          videoDurations[nextVideo],
        );
        return nextVideo;
      });
    };

    timeoutRef.current = window.setTimeout(
      cycleVideos,
      videoDurations[currentVideo],
    );

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentVideo]);

  useEffect(() => {
    const section = document.getElementById('about');
    if (!section) return;

    const isLargeScreen = window.innerWidth >= 1024; // Tailwind's lg breakpoint

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (isLargeScreen) {
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
          } else {
            setText(codeSnippet); // On mobile, just render full text
          }
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
      id="about"
      className="min-h-screen flex items-center relative overflow-hidden pb-12"
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div className="container mx-auto px-4 z-10 pt-12 pb-8">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="w-full lg:w-1/3 flex justify-center items-center mb-8 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">
                Crafting Digital <br />
                <span className="text-white">Experiences</span>
              </h1>
              <motion.div className="w-full">
                <div
                  className="bg-bg-light/50 backdrop-blur-sm p-6 rounded-lg mb-8 font-fira"
                  style={{ minHeight: '320px' }}
                >
                  <pre className="text-text-secondary whitespace-pre-wrap">
                    <code>{text}</code>
                  </pre>
                  <pre className="text-text-secondary whitespace-pre-wrap absolute opacity-0 pointer-events-none">
                    <code>{codeSnippet}</code>
                  </pre>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#skills"
                  className="btn-primary hover:scale-110 text-center "
                >
                  <code>{t('Skills')}</code>
                </a>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-3/5 flex justify-center items-center lg:px-4">
            <div className="w-full max-w-full lg:max-w-none px-4 lg:px-8">
              <div className="relative">
                <motion.video
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0.8 }}
                  key={currentVideo}
                  src={currentVideo}
                  className="rounded-lg shadow-lg w-full h-auto"
                  autoPlay
                  loop
                  muted
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
      >
        <ChevronDown className="text-secondary w-8 h-8" />
      </motion.div>
    </section>
  );
};

export default About;
