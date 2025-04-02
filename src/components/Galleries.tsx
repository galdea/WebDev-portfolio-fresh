import { motion } from 'framer-motion';
import { Brain, Camera, ChevronRight, Eye, Hammer } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Galleries = () => {
  const { t } = useTranslation();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Combine all gallery items into a single array
  const galleryData = {
    1: [
      {
        id: 1,
        title: 'AI Generative Art & Videos',
        description:
          'A showcase of my AI-generated artwork and video creations using cutting-edge generative models',
        videoSrc: '/images/GenerativeAI.webm',
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
        videoSrc: '/images/Photographer.webm',
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
        videoSrc: '/images/Carpenter.webm',
        component: '/carpentry',
        icon: <Hammer size={20} />,
      },
    ],
  };

  // Flatten all gallery entries into a single array
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

  const handleItemClick = (componentPath: string) => {
    if (componentPath) {
      window.location.href = componentPath;
    }
  };

  return (
    <section id="galleries">
      <div className="min-h-screen w-full flex flex-col justify-center items-center py-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-8xl w-full px-12">
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 w-12 bg-teal-500 mr-4"></div>
            <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">
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
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
                onMouseEnter={() => handleVideoHover(index, true)}
                onMouseLeave={() => handleVideoHover(index, false)}
                onClick={() => handleItemClick(item.component)}
              >
                <div className="aspect-video bg-gray-800 relative hover:scale-120">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={item.videoSrc}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                  />
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
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center text-blue-500 font-medium text-sm">
                    View Gallery <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Galleries;
