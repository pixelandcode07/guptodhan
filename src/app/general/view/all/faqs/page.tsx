import SectionTitle from '@/components/ui/SectionTitle';
import FAQSTabile from './Components/FAQSTabile';
import dbConnect from '@/lib/db';
import { FAQServices } from '@/lib/modules/faq/faq.service';
import { Suspense } from 'react';
import Loadding from './Components/Loadding';

// Force dynamic rendering ensures latest data
export const dynamic = 'force-dynamic';

export default async function FaqsPage() {
  await dbConnect();
  
  // Fetch data from DB directly
  const faqsData = await FAQServices.getAllFAQsFromDB();

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 lg:p-8">
      {/* Alignment Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Title */}
        <div className="flex flex-col gap-2">
            <SectionTitle text="FAQ Management" />
            <p className="text-sm text-gray-500">Manage your Frequently Asked Questions here.</p>
        </div>

        {/* Content with Suspense/Loading */}
        <Suspense fallback={<Loadding />}>
            {/* JSON.parse(JSON.stringify()) is needed to pass Mongoose objects to Client Components */}
            <FAQSTabile initialFaqs={JSON.parse(JSON.stringify(faqsData))} />
        </Suspense>

      </div>
    </div>
  );
}