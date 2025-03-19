import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const [text, setText] = useState('');
  const { t } = useTranslation();
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

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/images/Intro-image.webm" type="video/webm" />
        <source src="/images/Intro-image.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Scroll Indicator */}
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

export default Hero;
