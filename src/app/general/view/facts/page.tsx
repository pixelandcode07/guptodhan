import SectionTitle from '@/components/ui/SectionTitle';
import FactsTable from './Components/FactTabile';
import { AboutFactServices } from '@/lib/modules/about-fact/fact.service'; // ✅ সার্ভিস ইম্পোর্ট করুন
import dbConnect from '@/lib/db'; // ✅ ডেটাবেস কানেকশন ইম্পোর্ট করুন

// এই পেজ কম্পোনেন্টটি এখন async এবং সার্ভারে রান হবে
export default async function FactsPage() {
  // সার্ভারেই ডেটাবেস কানেক্ট করে সরাসরি সার্ভিস ফাংশনকে কল করা হচ্ছে
  await dbConnect();
  // অ্যাডমিন প্যানেলের জন্য সব active এবং inactive ফ্যাক্ট আনা হচ্ছে
  const factsData = await AboutFactServices.getPublicFactsFromDB(); // Assuming this fetches all for now

  return (
    <div className="bg-white pt-5 px-5 min-h-screen">
      <SectionTitle text="View All Facts" />
      {/* ✅ Fetch করা ডেটা props হিসেবে ক্লায়েন্ট কম্পোনেন্টে পাঠানো হচ্ছে */}
      <FactsTable initialData={JSON.parse(JSON.stringify(factsData))} />
    </div>
  );
}