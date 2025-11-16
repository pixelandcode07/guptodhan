'use client';

import { IStory } from '@/lib/modules/story/story.interface';
import Image from 'next/image';
import { useState, useCallback } from 'react';
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

  // Filter only active stories
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

  if (!activeStories || activeStories.length === 0) return null;

  const currentStory =
    currentStoryIndex !== null ? activeStories[currentStoryIndex] : null;

  return (
    <>
      <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 py-10 relative">
        <div className="flex justify-center">
          <PageHeader
            title='Stories'
          />
        </div>
        <Carousel opts={{ loop: false }}>
          <CarouselContent className="-ml-4">
            {activeStories.map((story, index) => (
              <CarouselItem
                key={story._id}
                className="pl-4 basis-1/3 md:basis-1/4 xl:basis-1/6"
              >
                <div
                  onClick={() => openStory(index)}
                  className="
                    relative 
                    h-[100px] sm:h-[100px] md:h-[360px] lg:h-[380px] xl:h-[350px]
                    rounded-xl overflow-hidden cursor-pointer
                    border-4 border-blue-700 
                  "
                >
                  <Image
                    src={story.imageUrl}
                    alt={story.title}
                    fill
                    className="object-cover blur-[2px] brightness-90 p-2"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {story.title}
                    </h3>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
            <ChevronLeft size={28} />
          </CarouselPrevious>
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 cursor-pointer">
            <ChevronRight size={28} />
          </CarouselNext>
        </Carousel>
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
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 p-2 flex gap-1 z-10">
              {activeStories.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 bg-gray-500 rounded-full overflow-hidden"
                >
                  {i < currentStoryIndex! && (
                    <div className="h-full bg-white w-full"></div>
                  )}
                  {i === currentStoryIndex! && (
                    <div
                      className="h-full bg-white"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}
                  {i > currentStoryIndex! && (
                    <div className="h-full bg-gray-700 w-full"></div>
                  )}
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
              aria-label={isPlaying ? 'Pause story' : 'Play story'}
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
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousStory();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors disabled:opacity-30"
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
