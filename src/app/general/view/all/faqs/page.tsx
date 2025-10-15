import SectionTitle from '@/components/ui/SectionTitle';
import FAQSTabile from './Components/FAQSTabile';
import dbConnect from '@/lib/db'; // ✅ ডেটাবেস কানেকশন ইম্পোর্ট করুন
import { FAQServices } from '@/lib/modules/faq/faq.service';

// এই পেজ কম্পোনেন্টটি এখন async এবং সার্ভারে রান হবে
export default async function FaqsPage() {
  // সার্ভারেই ডেটাবেস কানেক্ট করে সরাসরি সার্ভিস ফাংশনকে কল করা হচ্ছে
  await dbConnect();
  // ধরে নিচ্ছি, আপনার সার্ভিসে অ্যাডমিনদের জন্য সব FAQ আনার একটি ফাংশন আছে
  const faqsData = await FAQServices.getAllFAQsFromDB(); 

  return (
    <div className="bg-white min-h-screen">
      <div className="flex w-full justify-between items-center pt-5 px-5 flex-wrap">
        <SectionTitle text="FAQ List" />
      </div>

      {/* ✅ Fetch করা ডেটা props হিসেবে ক্লায়েন্ট কম্পোনেন্টে পাঠানো হচ্ছে।
        JSON.parse(JSON.stringify(...)) ব্যবহার করা হয়েছে Mongoose ডকুমেন্টকে 
        সাধারণ অবজেক্টে রূপান্তর করার জন্য, যা Server Component থেকে Client Component-এ পাঠানো নিরাপদ।
      */}
      <FAQSTabile initialFaqs={JSON.parse(JSON.stringify(faqsData))} />
    </div>
  );
}