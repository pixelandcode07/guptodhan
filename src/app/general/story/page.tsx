import SectionTitle from '@/components/ui/SectionTitle';
import StoryClient from './Components/StoryClient';

export default function StoryManagerPage() {
  return (
    <div className="p-4 sm:p-6">
      <SectionTitle text="Story Management" />
      <p className="text-gray-600 text-md mb-6">
        Create, manage, and organize your stories with linked products.
      </p>
      <StoryClient /> 
    </div>
  );
}