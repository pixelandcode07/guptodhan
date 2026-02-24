'use client';

import { IStory } from '@/lib/modules/story/story.interface';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play, ShoppingBag } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import PageHeader from '@/components/ReusableComponents/PageHeader';
import { useRouter } from 'next/navigation';

interface StoryFeedProps {
  stories: IStory[];
}

const StoryFeed = ({ stories }: StoryFeedProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Filter Logic: Active status check (Expiry temporarily disabled as per previous discussion)
  const activeStories = stories.filter(
    story => story.status === 'active'
  );

  const openStory = useCallback((index: number) => {
    setCurrentStoryIndex(index);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const closeStory = useCallback(() => {
    setCurrentStoryIndex(null);
    setIsPlaying(false);
    setProgress(0);
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

  // ✅ PRODUCT NAVIGATION FUNCTION (FIXED URL WITH SLUG)
  const handleNavigateToProduct = (e: React.MouseEvent, story: IStory) => {
    e.stopPropagation(); // Prevent modal from closing or sliding

    if (story.productId) {
      // Extract slug safely. We assume productId is populated with product details including slug.
      const productSlug = typeof story.productId === 'object'
        ? (story.productId as any).slug
        : null;

      if (productSlug) {
        // Redirect using slug instead of ID
        router.push(`/products/${productSlug}`);
      } else {
        console.log("Product slug not found");
        // Fallback: If slug is missing but we have an ID, you might want to handle it, 
        // but since you removed ID based routing, we'll just log or fallback to shop
        router.push('/shop');
      }
    } else {
      // Redirect to shop if no specific product linked
      router.push('/shop');
    }
  };

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || currentStoryIndex === null) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentStoryIndex, goToNextStory]);

  if (!activeStories.length) return null;

  const currentStory = currentStoryIndex !== null ? activeStories[currentStoryIndex] : null;

  return (
    <>
      <div className="bg-gray-100 py-2 md:py-2 relative ">
        <div className='container mx-auto'>
          <div className="max-w-[95vw] xl:container sm:px-10 mx-auto">
            <div className="hidden lg:flex justify-center mb-1">
              <PageHeader title="Stories" />
            </div>

            <Carousel opts={{ loop: false }}>
              <CarouselContent className="-ml-4">
                {activeStories.map((story, index) => (
                  <CarouselItem
                    key={String(story._id)}
                    className="pl-4 basis-1/3 md:basis-1/4 xl:basis-1/6"
                  >
                    {/* Story Preview Card */}
                    <div
                      onClick={() => openStory(index)}
                      className="relative aspect-[12/18] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 group border-2 border-transparent hover:border-yellow-400"
                    >
                      <Image
                        src={story.imageUrl}
                        alt={story.title || 'Story image'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                        <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight">
                          {story.title || 'Untitled'}
                        </h3>

                        <div className="flex justify-between items-center mt-2">
                          {story.productId && (
                            <button
                              onClick={(e) => handleNavigateToProduct(e, story)}
                              className="text-yellow-400 text-xs font-semibold flex items-center gap-1 hover:underline"
                            >
                              ORDER NOW <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-white bg-black/40 border-none hover:bg-yellow-500 hover:text-black transition-all">
                <ChevronLeft size={24} />
              </CarouselPrevious>
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 cursor-pointer text-white bg-black/40 border-none hover:bg-yellow-500 hover:text-black transition-all">
                <ChevronRight size={24} />
              </CarouselNext>
            </Carousel>
          </div>

          {/* Fullscreen Story Modal */}
          {currentStory && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
              onClick={closeStory}
            >
              <div
                className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-2xl overflow-hidden flex flex-col bg-gray-900 shadow-2xl border border-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress Bar */}
                <div className="absolute top-4 left-2 right-2 flex gap-1 z-30">
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

                {/* Top Controls */}
                <div className="absolute top-8 left-4 right-4 z-30 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-white/50 overflow-hidden relative">
                      <Image src={currentStory.imageUrl} alt="avt" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm drop-shadow-md">{currentStory.title}</p>
                      {/* Show Linked Badge */}
                      {currentStory.productId && (
                        <p className="text-yellow-400 text-xs flex items-center gap-1">
                          <ShoppingBag size={10} /> Product Linked
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-yellow-400 transition-colors"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button
                      onClick={closeStory}
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      <X size={28} />
                    </button>
                  </div>
                </div>

                {/* Main Image */}
                <div className="relative flex-grow bg-black">
                  <Image
                    src={currentStory.imageUrl}
                    alt={currentStory.title || 'Story detail'}
                    fill
                    priority
                    className="object-contain"
                  />
                </div>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/60 to-transparent z-20">
                  {currentStory.description && (
                    <p className="text-white/90 text-sm mb-6 line-clamp-3 text-center">
                      {currentStory.description}
                    </p>
                  )}

                  <div className="flex flex-col gap-3">
                    {currentStory.productId ? (
                      <button
                        onClick={(e) => handleNavigateToProduct(e, currentStory)}
                        className="w-full bg-yellow-500 text-black font-bold py-3.5 px-6 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                      >
                        ORDER NOW <ShoppingBag size={18} />
                      </button>
                    ) : (
                      <button
                        className="w-full bg-gray-700/50 text-white font-semibold py-3.5 px-6 rounded-full cursor-default"
                      >
                        Enjoy the Story
                      </button>
                    )}
                  </div>
                </div>

                {/* Tap Navigation Areas */}
                <div className="absolute inset-0 flex z-10">
                  <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); goToPreviousStory(); }}></div>
                  <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying) }}></div>
                  <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); goToNextStory(); }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoryFeed;