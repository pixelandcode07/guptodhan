import { Suspense } from 'react';
import dbConnect from '@/lib/db';
import { StoryServices } from '@/lib/modules/story/story.service';
import FancyLoadingPage from '@/app/general/loading';
import SectionTitle from '@/components/ui/SectionTitle';
import StoryClient from './Components/StoryClient';

// This is a Server Component that fetches data
export default async function StoryManagerPage() {
  await dbConnect();
  
  // Fetch initial data on the server
  const stories = await StoryServices.getAllStoriesFromDB();

  return (
    <div className="p-4 sm:p-6">
      <SectionTitle text="Story Management" />
      <p className="text-gray-600 text-md mb-6">
        Create, manage, and organize your stories
      </p>
      
      <Suspense fallback={<FancyLoadingPage />}>
        <StoryClient 
          initialStories={JSON.parse(JSON.stringify(stories))} 
        />
      </Suspense>
    </div>
  );
}