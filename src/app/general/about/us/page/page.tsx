import SectionTitle from '@/components/ui/SectionTitle';
import AboutUsForm from './Components/AboutUsForm';
import { AboutContentServices } from '@/lib/modules/about-content/content.service';
import dbConnect from '@/lib/db';

export const dynamic = 'force-dynamic'; // ডাটা যাতে ক্যাশ না হয়

export default async function AboutUsPage() {
  await dbConnect();
  
  // ডাটা আনবে (status active/inactive যাই হোক)
  const contentData = await AboutContentServices.getContentFromDB();

  return (
    <div className="bg-white pt-5 px-4 min-h-screen">
      <SectionTitle text="General Information Form" />
      <div className="max-w-5xl mx-auto">
        {/* ডাটা থাকলে সেটা যাবে, না থাকলে null যাবে */}
        <AboutUsForm aboutData={contentData ? JSON.parse(JSON.stringify(contentData)) : null} />
      </div>
    </div>
  );
}