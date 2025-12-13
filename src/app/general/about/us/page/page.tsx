import SectionTitle from '@/components/ui/SectionTitle';
import AboutUsForm from './Components/AboutUsForm';
import { AboutContentServices } from '@/lib/modules/about-content/content.service'; // ✅ সার্ভিস ইম্পোর্ট করুন
import dbConnect from '@/lib/db'; // ✅ ডেটাবেস কানেকশন ইম্পোর্ট করুন

// পেজ কম্পোনেন্টকে async করা হয়েছে
export default async function AboutUsPage() {
  // সার্ভারেই ডেটাবেস কানেক্ট করে সরাসরি সার্ভিস ফাংশনকে কল করা হচ্ছে
  await dbConnect();
  const contentData = await AboutContentServices.getContentFromDB();

  return (
    <div className="bg-white pt-5 px-4">
      <SectionTitle text="General Information Form" />
      {/* ✅ Fetch করা ডেটা props হিসেবে ক্লায়েন্ট কম্পোনেন্টে পাঠানো হচ্ছে।
        JSON.parse(JSON.stringify(...)) ব্যবহার করা হয়েছে Mongoose ডকুমেন্টকে 
        সাধারণ অবজেক্টে রূপান্তর করার জন্য, যা Server Component থেকে Client Component-এ পাঠানো নিরাপদ।
      */}
      <AboutUsForm aboutData={JSON.parse(JSON.stringify(contentData))} />
    </div>
  );
}