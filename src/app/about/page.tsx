import AboutClient from './component/aboutClient';
import { Metadata } from 'next';

// পেজের মেটাডাটা
export const metadata: Metadata = {
  title: 'About Us | Guptodhan',
  description: 'Learn more about Guptodhan, our mission, and our vision.',
};

// 🔥 ডাটা যাতে ক্যাশ না হয় (Real-time update)
export const dynamic = 'force-dynamic';

async function getAboutContent() {
  // Localhost বা Live URL হ্যান্ডেল করা
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/v1/public/about/content`, {
      cache: 'no-store', // সব সময় নতুন ডাটা আনবে
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
      {/* Hero Section (Static) */}
      <div className="bg-[#00005E] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">About Guptodhan</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Unlocking Hidden Treasures: Where Commerce Meets Compassion.
          </p>
        </div>
      </div>

      {/* Main Content (Dynamic) */}
      <AboutClient content={aboutData?.aboutContent} />
    </div>
  );
}