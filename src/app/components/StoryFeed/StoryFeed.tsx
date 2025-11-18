'use client';

import { IStory } from '@/lib/modules/story/story.interface';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import PageHeader from '@/components/ReusableComponents/PageHeader';

interface StoryFeedProps {
  stories: IStory[];
}

const StoryFeed = ({ stories }: StoryFeedProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Filter only active and unexpired stories
  const activeStories = stories.filter(
    story => story.status === 'active' && new Date(story.expiryDate) > new Date()
  );

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
      setCurrentStoryIndex((prev) => (prev! + 1) % activeStories.length);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [currentStoryIndex, activeStories.length]);

  const goToPreviousStory = useCallback(() => {
    if (currentStoryIndex !== null && activeStories.length > 0) {
      setCurrentStoryIndex(
        (prev) => (prev! - 1 + activeStories.length) % activeStories.length
      );
      setProgress(0);
      setIsPlaying(true);
    }
  }, [currentStoryIndex, activeStories.length]);

  // Auto-advance story every 10 seconds
  useEffect(() => {
    if (!isPlaying || currentStoryIndex === null) return;

    const timer = setTimeout(() => {
      goToNextStory();
    }, 10000); // 10000ms = 10 seconds

    return () => clearTimeout(timer);
  }, [isPlaying, currentStoryIndex, goToNextStory]);

  if (!activeStories.length) return null;

  const currentStory =
    currentStoryIndex !== null ? activeStories[currentStoryIndex] : null;

  return (
    <>
      {/* Carousel Section */}
      <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 py-10 relative">
        <div className="flex justify-center mb-6">
          <PageHeader title="Stories" />
        </div>

        <Carousel opts={{ loop: false }}>
          <CarouselContent className="-ml-4">
            {activeStories.map((story, index) => (
              <CarouselItem
                key={story._id}
                className="pl-4 basis-1/3 md:basis-1/4 xl:basis-1/6"
              >
                {/* Story Preview Card */}
                <div
                  onClick={() => openStory(index)}
                  className="relative aspect-[12/18] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  <Image
                    src={story.imageUrl}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-bold text-lg line-clamp-2">
                      {story.title}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-white/90 text-xs">1 story</p>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-yellow-400 text-xs font-semibold flex items-center gap-1"
                      >
                        ORDER NOW
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-white bg-black/30 rounded-full p-1 hover:bg-black/50 transition-colors">
            <ChevronLeft size={28} />
          </CarouselPrevious>
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-white bg-black/30 rounded-full p-1 hover:bg-black/50 transition-colors">
            <ChevronRight size={28} />
          </CarouselNext>
        </Carousel>
      </div>

      {/* Fullscreen Story Modal */}
      {currentStory && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={closeStory}
        >
          <div
            className="relative w-full max-w-md h-[95vh] rounded-lg overflow-hidden flex flex-col bg-gray-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Bar */}
            <div className="absolute top-2 left-2 right-2 p-2 flex gap-1 z-10">
              {activeStories.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  {i < currentStoryIndex! && (
                    <div className="h-full bg-white w-full rounded-full"></div>
                  )}
                  {i === currentStoryIndex! && (
                    <div
                      className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Top Buttons */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
                aria-label={isPlaying ? 'Pause story' : 'Play story'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={closeStory}
                className="text-white p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
                aria-label="Close story"
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative flex-grow">
              <Image
                src={currentStory.imageUrl}
                alt={currentStory.title || 'Story'}
                fill
                priority
                objectFit="cover"
                className="select-none pointer-events-none"
              />
            </div>

            {/* Bottom Buttons */}
            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-2xl font-bold mb-4 text-white">
                {currentStory.title}
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-opacity hover:opacity-90"
                >
                  Visit Now
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition-opacity hover:opacity-90"
                >
                  ORDER NOW
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousStory();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full text-white transition-colors disabled:opacity-30"
              disabled={activeStories.length <= 1}
              aria-label="Previous story"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextStory();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full text-white transition-colors disabled:opacity-30"
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
