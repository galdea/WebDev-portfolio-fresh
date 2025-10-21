'use client';

import { motion } from 'framer-motion';
import { Brain, Camera, ChevronRight, Eye, Hammer } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useRef, useState } from 'react';

interface GalleriesProps {
  children?: ReactNode;
}

const Galleries = ({ children }: GalleriesProps) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Remove unused state
  // const [activeTab, setActiveTab] = useState('about');

  const galleryData = {
    1: [
      {
        id: 1,
        title: 'AI Generative Art & Videos',
        description:
          'A showcase of my AI-generated artwork and video creations using cutting-edge generative models',
        videoSrc: '/images/GenerativeAI',
        // Match the route exactly as defined in your file structure
        component: '/generativeAI',
        icon: <Brain size={20} />,
      },
    ],
    2: [
      {
        id: 2,
        title: 'Travel Photography',
        description:
          'A curated selection of my photography from adventures across 33 countries',
        videoSrc: '/images/Photographer',
        component: '/gallery',
        icon: <Camera size={20} />,
      },
    ],
    3: [
      {
        id: 3,
        title: 'Carpentry Projects',
        description:
          'Handcrafted wooden creations showcasing traditional craftsmanship and modern design',
        videoSrc: '/images/Carpenter',
        component: '/carpentry',
        icon: <Hammer size={20} />,
      },
    ],
  };

  const items = Object.values(galleryData).flat();

  const handleVideoHover = (index: number, isHovering: boolean) => {
    const video = videoRefs.current[index];
    if (video) {
      if (isHovering) {
        video.play().catch((err) => console.error('Error playing video:', err));
        setHoveredIndex(index);
      } else {
        video.pause();
        video.currentTime = 0;
        setHoveredIndex(null);
      }
    }
  };

  return (
    <section id="galleries">
      <div className="min-h-screen w-full flex flex-col justify-center items-center py-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl w-full px-6 md:px-12">
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-12 bg-teal-500 mr-4"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">
              Creative Galleries
            </h1>
            <div className="h-1 w-12 bg-teal-200 ml-4"></div>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Explore my diverse portfolio spanning digital art, global
            photography, and handcrafted woodworking projects.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <Link
                href={item.component}
                key={item.id}
                passHref
                target="_blank"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="relative rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
                  onMouseEnter={() => handleVideoHover(index, true)}
                  onMouseLeave={() => handleVideoHover(index, false)}
                >
                  <div className="aspect-video bg-gray-800 relative">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      autoPlay
                      playsInline
                    >
                      <source src={`${item.videoSrc}.webm`} type="video/webm" />
                      <source src={`${item.videoSrc}.mp4`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        hoveredIndex === index ? 'opacity-0' : 'opacity-80'
                      }`}
                      style={{ backgroundColor: 'rgba(8, 14, 29, 0.3)' }}
                    ></div>

                    {hoveredIndex === index && (
                      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                        <Eye size={18} className="text-blue-500" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-400 dark:bg-teal-600 mr-3">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center text-teal-500  font-medium text-sm">
                      View Gallery <ChevronRight size={16} className="ml-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Galleries;
