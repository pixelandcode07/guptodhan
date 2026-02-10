import SectionTitle from '@/components/ui/SectionTitle';
import StoryClient from './Components/StoryClient';

export default function StoryManagerPage() {
  return (
    <div className="p-4 sm:p-6">
      <SectionTitle text="Story Management" />
      <p className="text-gray-600 text-md mb-6">
        Create, manage, and organize your stories with linked products.
      </p>
      {/* কোনো props পাঠানোর দরকার নেই কারণ আমরা ক্লায়েন্টেই fetch করব */}
      <StoryClie  nt /> 
    </div>
  );
}