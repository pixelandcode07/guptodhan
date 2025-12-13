
import { fetchStory } from '@/lib/MainHomePage/fetchStory';
import StoryFeed from './StoryFeed';

export default async function StoryFeedWrapper() {
    const storyData = await fetchStory();
    return <StoryFeed stories={storyData} />;
}
