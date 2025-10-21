'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

const Projects = () => {
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    {
      videoId: 'IMRO7PH6SGc',
      title: 'Austral Escapes',
      description:
        'Website created for a Patagonian tour agency, targeting American and Canadian travelers, offering curated tour packages. Blog section features travel tips and local insights. Tour packages are managed through a custom e-commerce solution.',
      websiteUrl: 'https://australescapes.squarespace.com',
      tags: [
        'Squarespace',
        'CSS',
        'Javascript',
        'E-Commerce',
        'Video editing',
        'Web Design',
        'Creative content',
        'Blog management',
      ],
    },
    {
      videoId: 'umQhd0LE2Y0',
      title: 'European Hobbes Society',
      description:
        'Website created for the European Hobbes Society, promoting scholarly research and discussion on Thomas Hobbes, fostering a community of academics worldwide. Libraries are managed through a custom database and new publications are shown in landing page carousels.',
      websiteUrl: 'https://europeanhobbessociety.squarespace.com/',
      tags: [
        'Squarespace',
        'CSS',
        'Video library',
        'Document Database',
        'Web Design',
      ],
    },
    {
      videoId: '3t2nWpHMn3A',
      title: 'Dron Estudio',
      description:
        'Landing page for a drone filming agency, showcasing professional aerial videography and photography services. Includes a project quote calculator and a video gallery',
      websiteUrl: 'https://dronestudio.netlify.app',
      tags: [
        'React',
        'Vite',
        'Tailwind CSS',
        'Web Design',
        'Project Calculator',
        'Video Gallery',
        'Landing Page',
      ],
    },
    {
      videoId: 'GZtDlMj8W9E',
      title: 'Antonio Elizalde',
      description:
        'Website created for scholar Antonio Elizalde, featuring APIs to access private Google Drive folders, where material containing publications, image libraries, and extensive malacology data is instantly updated to the website, facilitating research and collaboration between academics worldwide.',
      websiteUrl: 'https://antonioelizalde.cl',
      tags: [
        'Javascript',
        'React',
        'NextJS',
        'Tailwind CSS',
        'Google API',
        'Document database',
        'Image database',
        'Excel database',
        'Web Design',
      ],
    },
    {
      videoId: '0BeFwdgfyNk',
      title: 'Digital Content Website',
      description:
        'Website created for Aldeaza Digital, a platform specializing in digital content solutions, including web design, creative media, and data-driven content management. Features custom-built tools for efficient content organization, and a sleek, responsive interface optimized with NextJS and Tailwind CSS.',
      websiteUrl: 'https://aldeazadigital.com',
      tags: [
        'Javascript',
        'React',
        'NextJS',
        'Tailwind CSS',
        'Web Design',
        'Landing Page',
      ],
    },
    {
      videoId: 'DfgJA3QlMvc',
      title: 'Forever Clothing Store',
      description:
        'Forever Clothing Store is a modern e-commerce platform offering a curated selection of stylish and timeless apparel. Designed with a sleek and user-friendly interface, the website provides a seamless shopping experience, integrating advanced filtering options, secure checkout, and engaging product visuals.',
      websiteUrl: 'https://foreverclothes.netlify.app',
      tags: [
        'Squarespace',
        'CSS',
        'Javascript',
        'Typescript',
        'E-Commerce',
        'API Integration',
        'Product Filtering',
        'Secure Checkout',
        'Creative content',
      ],
    },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === slides.length - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex === 0 ? slides.length - 1 : prevIndex - 1;
    });
  };

  const codeSnippet = ' ';

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
      id="projects"
      className="bg-black/30 min-h-screen py-14 sm:py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <div className="h-1 w-12 bg-teal-500 mr-4"></div>

          <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">
            Projects
          </h1>
          <div className="h-1 w-12 bg-teal-300 ml-4"></div>
        </div>

        <div className="backdrop-blur-sm pb-6 text-center rounded-lg mb-8">
          <code>
            Explore some of my projects, each site showcasing unique challenges
            and creative solutions.
          </code>
        </div>

        <div className="relative h-[600px] w-full overflow-hidden rounded-2xl shadow-2xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full h-full"
            >
              <div className="h-full flex flex-col md:flex-row">
                <div className="w-full md:w-3/5 md:h-full relative">
                  <div
                    className="absolute inset-0 z-10"
                    style={{ backgroundColor: '#639185', opacity: 0.8 }}
                  >
                    <iframe
                      className="w-full h-full rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                      src={`https://www.youtube.com/embed/${slides[currentIndex].videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${slides[currentIndex].videoId}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <div className="w-full md:w-2/5 p-8 flex flex-col justify-between bg-[#121f34]">
                  <div>
                    <code className="text-2xl text-[#64ffda]">
                      {slides[currentIndex].title}
                    </code>
                    <p className="mt-10 mb-10 text-[#f1f5f9]">
                      {slides[currentIndex].description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {slides[currentIndex].tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#64ffda]/10 text-[#64ffda] rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        window.open(slides[currentIndex].websiteUrl, '_blank')
                      }
                      className="w-full py-3 px-6 border border-[#64ffda] text-[#64ffda] rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#64ffda]/10 transition-all duration-300"
                    >
                      <code>Visit Website</code>
                      <ExternalLink size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="md:block hidden">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="left-chevron-button bg-black/30 absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 text-[#64ffda] rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-[#07121e]/60 transition-all duration-300 z-10"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="bg-black/30 absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-[#64ffda] rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-[#07121e]/60 transition-all duration-300 z-10"
              onClick={() => paginate(1)}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#64ffda] w-8' : 'bg-[#8892af] w-3'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
