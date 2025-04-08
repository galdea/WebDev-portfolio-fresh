'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function GenerativeAI() {
  const [currentVideo, setCurrentVideo] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoDurations: Record<string, number> = {
    '/images/ComingSoon.webm': 14500,
    '/images/ComingSoon.mp4': 14500,
  };

  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    const initialVideo = isIOS
      ? '/images/ComingSoon.mp4'
      : '/images/ComingSoon.webm';
    setCurrentVideo(initialVideo);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      id="carpentry"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pb-12"
    >
      <motion.video
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0.8 }}
        key={currentVideo}
        src={currentVideo}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-6 items-center">
            <Link href="/#galleries" passHref>
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="text-gray-300 hover:text-white flex items-center gap-1 font-medium"
              >
                <ChevronLeft size={16} />
                <span>Back to Homepage</span>
              </motion.a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GenerativeAI;
