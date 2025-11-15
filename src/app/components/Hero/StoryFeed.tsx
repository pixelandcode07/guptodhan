'use client';

import { IStory } from '@/lib/modules/story/story.interface';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface StoryFeedProps {
  stories: IStory[];
}

const StoryFeed = ({ stories }: StoryFeedProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const activeStories = stories.filter(story => new Date(story.expiryDate) > new Date());

  const openStory = useCallback((index: number) => {
    setCurrentStoryIndex(index);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const closeStory = useCallback(() => {
    setCurrentStoryIndex(null);
    setIsPlaying(false);
  }, []);

  const goToNextStory = useCallback(() => {
    if (currentStoryIndex !== null && activeStories.length > 0) {
      setCurrentStoryIndex((prevIndex) => (prevIndex! + 1) % activeStories.length);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [currentStoryIndex, activeStories.length]);

  const goToPreviousStory = useCallback(() => {
    if (currentStoryIndex !== null && activeStories.length > 0) {
      setCurrentStoryIndex((prevIndex) => 
        (prevIndex! - 1 + activeStories.length) % activeStories.length
      );
      setProgress(0);
      setIsPlaying(true);
    }
  }, [currentStoryIndex, activeStories.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentStoryIndex !== null) {
        if (e.key === 'ArrowRight') goToNextStory();
        else if (e.key === 'ArrowLeft') goToPreviousStory();
        else if (e.key === 'Escape') closeStory();
        else if (e.key === ' ') setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStoryIndex, goToNextStory, goToPreviousStory, closeStory, setIsPlaying]);

  // Auto-play / Progress bar logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentStoryIndex !== null && isPlaying) {
      const duration = activeStories[currentStoryIndex]?.duration || 10; // Default 10s
      const increment = 100 / (duration * 1000 / 50); // Update every 50ms

      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval!);
            goToNextStory();
            return 0;
          }
          return prevProgress + increment;
        });
      }, 50);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStoryIndex, isPlaying, goToNextStory, activeStories]);

  if (!activeStories || activeStories.length === 0) {
    return null;
  }

  const currentStory = currentStoryIndex !== null ? activeStories[currentStoryIndex] : null;

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Stories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {activeStories.map((story, index) => (
            <div 
              key={story._id} 
              className="flex-shrink-0 text-center cursor-pointer group"
              onClick={() => openStory(index)}
            >
              <div className="w-20 h-20 rounded-full p-1 border-2 border-blue-500 hover:border-blue-700 transition-all">
                <Image
                  src={story.imageUrl}
                  alt={story.title || 'Story'}
                  width={72}
                  height={72}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <p className="text-sm mt-2 line-clamp-1 group-hover:text-blue-600">
                {story.title || 'View Story'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Fullscreen Story Viewer Modal --- */}
      {currentStory && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          onClick={closeStory}
        >
          <div 
            className="relative w-full max-w-md h-[90vh] sm:h-[95vh] rounded-lg overflow-hidden flex flex-col bg-gray-900 shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 p-2 flex gap-1 z-10">
              {activeStories.map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-gray-500 rounded-full overflow-hidden">
                  {i < currentStoryIndex! && <div className="h-full bg-white w-full"></div>}
                  {i === currentStoryIndex! && <div className="h-full bg-white" style={{ width: `${progress}%` }}></div>}
                  {i > currentStoryIndex! && <div className="h-full bg-gray-700 w-full"></div>}
                </div>
              ))}
            </div>
            <button 
              onClick={closeStory}
              className="absolute top-4 right-4 z-20 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label="Close story"
            >
              <X size={24} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-4 left-4 z-20 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label={isPlaying ? "Pause story" : "Play story"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <div className="relative flex-grow">
              <Image
                src={currentStory.imageUrl}
                alt={currentStory.title || 'Story'}
                fill
                priority
                objectFit="contain"
                className="select-none pointer-events-none"
              />
            </div>

            <div className="absolute bottom-0 w-full p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-2xl font-bold mb-1">{currentStory.title}</h3>
              <p className="text-sm">{currentStory.description}</p>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); goToPreviousStory(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors disabled:opacity-30"
              disabled={activeStories.length <= 1}
              aria-label="Previous story"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); goToNextStory(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors disabled:opacity-30"
              disabled={activeStories.length <= 1}
              aria-label="Next story"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryFeed;