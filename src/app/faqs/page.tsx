import React from 'react';
import { HelpCircle } from 'lucide-react';
import FAQClientAccordion from './components/FAQClientAccordion';

// Helper to get Base URL
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return 'http://localhost:3000';
};

// Fetch Data from the new Public API
async function getFaqData() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/v1/public/faq`, {
      next: { revalidate: 3600 }, // ১ ঘন্টা ক্যাশ থাকবে (যেহেতু FAQ খুব বেশি চেঞ্জ হয় না)
    });
    
    if (!res.ok) throw new Error('Failed to fetch FAQs');
    
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const metadata = {
  title: 'Frequently Asked Questions | Guptodhan',
  description: 'Find answers to common questions about our services.',
};

export default async function FAQPage() {
  const faqData = await getFaqData();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="md:max-w-[95vw] xl:container sm:px-8 mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Have questions? We're here to help. Find the answers you need below, categorized for your convenience.
          </p>
        </div>

        {/* FAQ Content Section */}
        <div className="max-w-4xl mx-auto">
          {faqData.length > 0 ? (
            <div className="space-y-10">
              {faqData.map((categoryGroup: any) => (
                <div key={categoryGroup._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-[#00005E] mb-6 border-b border-gray-100 pb-4">
                    {categoryGroup.categoryName}
                  </h2>
                  
                  {/* Client Component for Interactive Accordion */}
                  <FAQClientAccordion faqs={categoryGroup.faqs} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">No FAQs available at the moment. Please check back later.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}