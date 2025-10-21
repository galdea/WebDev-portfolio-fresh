'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export function Films() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const colors = {
    primary: '#5b8382',
    dark: '#080e1d',
    accent: '#65fbda',
    secondary: '#8e6c54',
  };

  useEffect(() => {
    const sampleVideos = [
      {
        id: '6fXgAzSW-ZE',
        title: 'Between Worlds: Whispers from the Drowned Coast',
        thumbnailUrl: `https://img.youtube.com/vi/6fXgAzSW-ZE/maxresdefault.jpg`,
        videoUrl: 'https://www.youtube.com/watch?v=6fXgAzSW-ZE',
      },
    ];
    setVideos(sampleVideos);
    setLoading(false);
  }, []);

  const openVideo = (index: number) => {
    setCurrentIndex(index);
    setSelectedVideo(videos[index]);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setCurrentIndex(null);
  };

  const prevVideo = () => {
    if (currentIndex !== null && currentIndex > 0) {
      openVideo(currentIndex - 1);
    }
  };

  const nextVideo = () => {
    if (currentIndex !== null && currentIndex < videos.length - 1) {
      openVideo(currentIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedVideo) return;
      if (e.key === 'ArrowLeft') prevVideo();
      if (e.key === 'ArrowRight') nextVideo();
      if (e.key === 'Escape') closeVideo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo, currentIndex]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextVideo,
    onSwipedRight: prevVideo,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const getYoutubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  // Choose layout class based on number of videos
  const getGridClassName = () => {
    if (videos.length === 1) return 'flex justify-center';
    if (videos.length === 2)
      return 'grid grid-cols-1 md:grid-cols-2 gap-6 justify-center';
    if (videos.length === 3)
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center';
    return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center';
  };

  return (
    <div
      className="flex h-full justify-center"
      style={{ backgroundColor: colors.dark }}
    >
      <div
        className="flex-grow overflow-y-auto w-full max-w-7xl flex flex-col items-center"
        id="films"
      >
        <div
          className="w-full px-4 py-8 min-h-screen flex flex-col items-center"
          style={{ color: 'white' }}
        >
          {/* Centered Title */}
          <div className="w-full flex justify-center mb-8">
            <h1
              className="text-4xl font-bold text-center mb-4"
              style={{ color: colors.accent }}
            >
              Films
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <Loader2
                className="animate-spin w-8 h-8"
                style={{ color: colors.accent }}
              />
            </div>
          ) : error ? (
            <div
              className="text-center rounded-lg p-4 my-8 w-full"
              style={{
                color: 'white',
                backgroundColor: `${colors.secondary}30`,
              }}
            >
              Error loading videos: {error}
            </div>
          ) : videos.length === 0 ? (
            <div
              className="text-center p-6 rounded-lg my-8 w-full"
              style={{
                color: colors.accent,
                backgroundColor: `${colors.dark}80`,
              }}
            >
              No videos found
            </div>
          ) : (
            <div className={`${getGridClassName()} w-full max-w-5xl`}>
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="relative aspect-video overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 mb-8 w-full max-w-xl"
                  style={{ boxShadow: `0 4px 20px rgba(101, 251, 218, 0.15)` }}
                  onClick={() => openVideo(index)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-20 h-20 flex items-center justify-center rounded-full bg-opacity-80"
                      style={{ backgroundColor: `${colors.dark}CC` }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-10 h-10"
                        style={{ fill: colors.accent }}
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end"
                    style={{
                      background:
                        'linear-gradient(transparent 50%, rgba(8, 14, 29, 0.7) 100%)',
                    }}
                  >
                    <div
                      className="p-4 w-full text-lg"
                      style={{ color: colors.accent }}
                    >
                      {video.title}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 p-4 flex justify-center items-center"
          style={{ backgroundColor: 'rgba(8, 14, 29, 0.9)' }}
          {...swipeHandlers}
          onClick={closeVideo}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full transition-transform duration-200 hover:scale-110"
            style={{ color: colors.accent }}
            onClick={closeVideo}
          >
            <XCircle size={32} />
          </button>

          {videos.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-opacity-50 rounded-full p-2 sm:block hidden transition-transform duration-200 hover:scale-125"
                style={{ color: colors.accent }}
                onClick={(e) => {
                  e.stopPropagation();
                  prevVideo();
                }}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={48} />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-opacity-50 rounded-full p-2 sm:block hidden transition-transform duration-200 hover:scale-125"
                style={{ color: colors.accent }}
                onClick={(e) => {
                  e.stopPropagation();
                  nextVideo();
                }}
                disabled={currentIndex === videos.length - 1}
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedVideo.id}
              className="w-full max-w-5xl aspect-video rounded-lg overflow-hidden"
              style={{ boxShadow: `0 10px 30px rgba(101, 251, 218, 0.1)` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getYoutubeEmbedUrl(selectedVideo.id)}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
