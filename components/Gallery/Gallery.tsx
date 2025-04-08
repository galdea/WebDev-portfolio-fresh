'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
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

export function Gallery() {
  const [subfolders, setSubfolders] = useState<Subfolder[]>([]);
  const [selectedSubfolder, setSelectedSubfolder] = useState<Subfolder | null>(
    null,
  );
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Color palette
  const colors = {
    primary: '#5b8382',
    dark: '#080e1d',
    accent: '#65fbda',
    secondary: '#8e6c54',
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/fetch-data-gallery');
        console.log('Response status:', response.status);

        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const data = await response.json();
        console.log('Fetched data:', data);

        if (!data.subfolders || !Array.isArray(data.subfolders))
          throw new Error('Invalid data format');

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
        console.error('Error fetching data:', error);
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

  return (
    <div className="flex h-full" style={{ backgroundColor: colors.dark }}>
      {/* Sidebar Component */}
      <Sidebar
        subfolders={subfolders}
        selectedSubfolder={selectedSubfolder}
        onSelectSubfolder={selectSubfolder}
        loading={loading}
      />

      {/* Main Gallery Content */}
      <div className="flex-grow overflow-y-auto w-full" id="gallery">
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
              className="text-center rounded-lg p-4 my-8"
              style={{
                color: 'white',
                backgroundColor: `${colors.secondary}30`,
              }}
            >
              Error loading gallery: {error}
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
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Lightbox for Selected Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 p-4 flex justify-center items-center"
          style={{ backgroundColor: 'rgba(8, 14, 29, 0.9)' }}
          {...swipeHandlers}
          onClick={closeImage}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full transition-transform duration-200 hover:scale-110"
            style={{ color: colors.accent }}
            onClick={closeImage}
          >
            <XCircle size={32} />
          </button>

          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-opacity-50 rounded-full p-2 sm:block hidden transition-transform duration-200 hover:scale-125"
            style={{ color: colors.accent }}
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={48} />
          </button>

          <AnimatePresence mode="wait">
            <motion.img
              key={selectedImage.id}
              src={selectedImage.webContentLink}
              alt={selectedImage.name}
              className="max-h-[80vh] max-w-[90vw] w-auto rounded-lg"
              style={{ boxShadow: `0 10px 30px rgba(101, 251, 218, 0.1)` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-opacity-50 rounded-full p-2 sm:block hidden transition-transform duration-200 hover:scale-125"
            style={{ color: colors.accent }}
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight size={48} />
          </button>

          {/* Image title and counter */}
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full"
            style={{
              backgroundColor: `${colors.dark}CC`,
              color: colors.accent,
            }}
          >
            <div className="text-center">{selectedImage.name}</div>
            <div className="text-sm text-center opacity-80">
              {currentIndex !== null
                ? `${currentIndex + 1} / ${images.length}`
                : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
