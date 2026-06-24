import SectionTitle from '@/components/ui/SectionTitle';
import TermsForm from './Components/TermsForm';
import dbConnect from '@/lib/db';
import { TermsServices } from '@/lib/modules/terms-condition/termsCon.service';

export default async function TermsAndConditionPage() {
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