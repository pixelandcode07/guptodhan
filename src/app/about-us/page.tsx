import AboutClient from './component/aboutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Guptodhan',
  description: 'Guptodhan - An all-in-one platform for Shopping, Buying & Selling, Services, and Donations.',
};

// 🔥 Real-time update
export const dynamic = 'force-dynamic';

async function getAboutContent() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/v1/public/about/content`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching about content:', error);
    return null;
  }
}

export default async function AboutPage() {
  const aboutData = await getAboutContent();

  return (
    <div className="bg-gray-50 min-h-screen">
      <AboutClient content={aboutData?.aboutContent} />
    </div>
  );
}