import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Skills = () => {
  const [text, setText] = useState('');
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const { t } = useTranslation();

  const gifs = [
    'src/images/skills-semidual.gif',
    'src/images/skills-one.gif',
    'src/images/skills-dual.gif',
    'src/images/skills-semidual2.gif',
    'src/images/skills-one2.gif',
    'src/images/skills-dual2.gif',
    'src/images/skills-semidual3.gif',
    'src/images/skills-one3.gif',
    'src/images/skills-dual3.gif',
    'src/images/skills-semidual4.gif',
    'src/images/skills-one4.gif',
    'src/images/skills-dual4.gif',
    'src/images/skills-semidual5.gif',
    'src/images/skills-one5.gif',
    'src/images/skills-dual5.gif',
    'src/images/skills-dual6.gif',
  ]; // Add all gif filenames

  const codeSnippet =
    "// Hi, I'm Gabriel, I love building things.\n// It's not a coincidence I'm a passionate carpenter or an innovative web developer.\n// What I enjoy the most is having great ideas materialize into reality.";

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
    const interval = setInterval(() => {
      setCurrentGifIndex((prevIndex) => (prevIndex + 1) % gifs.length);
    }, 5000); // Change gif every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="skills"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{
        backgroundImage: `url('${gifs[currentGifIndex]}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
      >
        <ChevronDown className="text-secondary w-8 h-8" />
      </motion.div>
    </section>
  );
};

export default Skills;
