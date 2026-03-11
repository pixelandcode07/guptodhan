import { Metadata } from 'next';
import CreateJobClient from './components/CreateJobClient';

// ✅ Server-side metadata for SEO
export const metadata: Metadata = {
  title: 'Post a New Job | Guptodhan',
  description: 'Post a new job opening on Guptodhan and find the best candidates.',
};

export default function CreateJobPage() {
  return (
    <main className="w-full">
      <CreateJobClient />
    </main>
  );
}