'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Films } from './Films';
import { Sidebar } from './Sidebar';

interface Image {
  id: string;
  name: string;
  thumbnailLink: string;
  webContentLink: string;
}

interface Subfolder {
  id: string;
  name: string;
  files: Image[];
}

interface GenerativeAIProps {
  onViewChange: (view: 'films' | 'folder') => void;
  currentView?: 'films' | 'folder';
}

export function GenerativeAI({
  onViewChange,
  currentView = 'folder',
}: GenerativeAIProps) {
  const [subfolders, setSubfolders] = useState<Subfolder[]>([]);
  const [selectedSubfolder, setSelectedSubfolder] = useState<Subfolder | null>(
    null,
  );
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'films' | 'folder'>(
    currentView || 'folder',
  );
  const [currentVideo, setCurrentVideo] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when prop changes
  useEffect(() => {
    if (currentView) {
      setSelectedView(currentView);
    }
  }, [currentView]);

  const colors = {
    primary: '#8e6c54',
    dark: '#080e1d',
    accent: '#65fbda',
    secondary: '#5b8382',
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/fetch-data-generativeAI');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.details || `Network error: ${response.status}`,
          );
        }

        const data = await response.json();

        if (!data.subfolders || !Array.isArray(data.subfolders)) {
          throw new Error('Invalid data format received from server');
        }

        const processedSubfolders = data.subfolders.map((subfolder: any) => ({
          ...subfolder,
          files: (subfolder.files || []).map((image: Image) => ({
            ...image,
            thumbnailLink:
              image.thumbnailLink ||
              `https://drive.google.com/thumbnail?id=${image.id}&sz=w400`,
            webContentLink: `https://lh3.googleusercontent.com/d/${image.id}`,
          })),
        }));

        setSubfolders(processedSubfolders);

        if (processedSubfolders.length > 0) {
          setSelectedSubfolder(processedSubfolders[0]);
          setImages(processedSubfolders[0].files || []);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectSubfolder = (subfolder: Subfolder) => {
    setSelectedSubfolder(subfolder);
    setImages(subfolder.files || []);
    setSelectedImage(null);
    setCurrentIndex(null);
    setSelectedView('folder');
    onViewChange('folder');
  };

  const openImage = (index: number) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setCurrentIndex(null);
  };

  const prevImage = () => {
    if (currentIndex !== null && currentIndex > 0) {
      openImage(currentIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentIndex !== null && currentIndex < images.length - 1) {
      openImage(currentIndex + 1);
    }
  };

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleFilmsClick = () => {
    setSelectedView('films');
    onViewChange('films');
    console.log("Films clicked, view changed to 'films'");
  };

  return (
    <div className="flex h-full" style={{ backgroundColor: colors.dark }}>
      <Sidebar
        subfolders={subfolders}
        selectedSubfolder={selectedSubfolder}
        onSelectSubfolder={selectSubfolder}
        loading={loading}
        onSelectFilms={handleFilmsClick}
        selectedView={selectedView}
      />

      {selectedView === 'films' ? (
        <div className="w-full flex justify-center mb-8">
          <Films />
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto w-full" id="generativeAI">
          <div
            className="container mx-auto px-4 py-8 min-h-screen"
            style={{ color: 'white' }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2
                  className="animate-spin w-8 h-8"
                  style={{ color: colors.accent }}
                />
              </div>
            ) : error ? (
              <div
                className="text-center rounded-lg p-4 my-8 relative h-screen"
                style={{
                  color: 'white',
                  backgroundColor: `${colors.secondary}30`,
                }}
              >
                <motion.video
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0.8 }}
                  key={currentVideo}
                  src={currentVideo}
                  className="absolute inset-0 w-full h-full object-cover object-[68%]"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/50 z-0" />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Link href="/#galleries" passHref legacyBehavior>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <a className="text-gray-300 hover:text-white flex items-center gap-1 font-medium text-lg">
                        <ChevronLeft size={20} />
                        <span>Back to Homepage</span>
                      </a>
                    </motion.div>
                  </Link>
                </div>
              </div>
            ) : images.length === 0 ? (
              <div
                className="text-center p-6 rounded-lg my-8"
                style={{
                  color: colors.accent,
                  backgroundColor: `${colors.dark}80`,
                }}
              >
                {selectedSubfolder
                  ? `No images found in folder "${selectedSubfolder.name}"`
                  : 'No images found'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12 pt-3">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="relative aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
                    style={{
                      boxShadow: `0 4px 20px rgba(101, 251, 218, 0.15)`,
                    }}
                    onClick={() => openImage(index)}
                    {...swipeHandlers}
                  >
                    <img
                      src={image.thumbnailLink}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end"
                      style={{
                        background:
                          'linear-gradient(transparent 50%, rgba(8, 14, 29, 0.7) 100%)',
                      }}
                    >
                      <div
                        className="p-3 w-full truncate text-sm"
                        style={{ color: colors.accent }}
                      >
                        {image.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerativeAI;
