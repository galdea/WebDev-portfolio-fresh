import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const [text, setText] = useState('');
  const [currentVideo, setCurrentVideo] = useState<
    'src/images/About.webm' | 'src/images/About2.webm'
  >('src/images/About.webm');

  const timeoutRef = useRef<number | null>(null);
  const { t } = useTranslation();

  const codeSnippet =
    "const aboutMe = Hi, I'm Gabriel and I love building things.\nIt's not a coincidence that, among other things, I'm a passionate carpenter and an innovative web developer.\nBecause what I enjoy the most is materializing ideas into reality.";

  const videoDurations: Record<
    'src/images/About.webm' | 'src/images/About2.webm',
    number
  > = {
    'src/images/About.webm': 14500,
    'src/images/About2.webm': 14500,
  };

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const cycleVideos = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      setCurrentVideo((prevVideo) => {
        const nextVideo =
          prevVideo === 'src/images/About.webm'
            ? 'src/images/About2.webm'
            : 'src/images/About.webm';

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
  }, []);

  return (
    <section
      id="about"
      className="min-h-screen flex items-center relative overflow-hidden sm:my-4"
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="w-full lg:w-1/3 flex justify-center items-center mb-8 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text text-center lg:text-left">
                {t('hero.title')}{' '}
                <span className="text-secondary">
                  {t('hero.titleHighlight')}
                </span>
              </h1>

              <div className="bg-bg-light/50 backdrop-blur-sm p-6 rounded-lg mb-8 font-fira">
                <pre className="text-text-secondary whitespace-pre-wrap">
                  <code>{text}</code>
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#skills" className="btn-primary text-center">
                  <code>{t('hero.viewWork')}</code>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Updated to use <video> instead of <img> */}
          <div className="w-full lg:w-3/5 flex justify-center items-center">
            <div className="w-full max-w-full lg:max-w-none px-4 lg:px-8">
              <div className="relative">
                <motion.video
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
