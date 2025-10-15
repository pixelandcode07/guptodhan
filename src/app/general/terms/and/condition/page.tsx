import SectionTitle from '@/components/ui/SectionTitle';
import TermsForm from './Components/TermsForm';
// ✅ সরাসরি সার্ভিস এবং ডেটাবেস কানেকশন ইম্পোর্ট করা হয়েছে
import dbConnect from '@/lib/db';
import { TermsServices } from '@/lib/modules/terms-condition/termsCon.service';

// পেজ কম্পোনেন্টকে async করা হয়েছে
export default async function TermsAndConditionPage() {
  // সার্ভারেই ডেটাবেস কানেক্ট করে সরাসরি সার্ভিস ফাংশনকে কল করা হচ্ছে
  await dbConnect();
  const termsData = await TermsServices.getAllTermsFromDB();

  return (
    <div className="bg-white pt-5 min-h-screen">
      <SectionTitle text="Terms And Condition Update Form" />
      <div className="p-5">
        <p className="mb-4">Write Terms And Condition Here:</p>
        
        {/* ✅ Fetch করা ডেটা props হিসেবে ক্লায়েন্ট কম্পোনেন্টে পাঠানো হচ্ছে */}
        <TermsForm initialData={JSON.parse(JSON.stringify(termsData))} />
      </div>
    </div>
  );
}