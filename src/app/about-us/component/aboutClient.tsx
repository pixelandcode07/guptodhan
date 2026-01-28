'use client';

import { Target, Users, ShoppingBag, Heart, ShieldCheck } from 'lucide-react';

interface AboutClientProps {
  content: string | null;
}

export default function AboutClient({ content }: AboutClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
      
      {/* Dynamic Content Section */}
      <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        {content ? (
          // 🔥 HTML Content Rendering (Tailwind Typography 'prose' class recommended here if installed)
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-3 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        ) : (
          // Fallback if no content found
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-400">No information available yet.</h2>
            <p className="text-gray-500">Please check back later.</p>
          </div>
        )}
      </section>

      {/* Static Features Section (Optional - ডিজাইনের সৌন্দর্যের জন্য রাখা হয়েছে) */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Guptodhan?</h2>
          <p className="text-gray-500 mt-2">We strive to provide the best experience for everyone.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className="w-14 h-14 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="text-purple-600" size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Multi-Vendor Store</h4>
            <p className="text-gray-600 text-sm">
              A vast collection of products from verified local and international vendors.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className="w-14 h-14 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="text-red-600" size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Donation Platform</h4>
            <p className="text-gray-600 text-sm">
              A unique feature to request aid or donate money/items to verified campaigns.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
            <div className="w-14 h-14 mx-auto bg-teal-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-teal-600" size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Secure & Trusted</h4>
            <p className="text-gray-600 text-sm">
              We ensure secure payment gateways and verified delivery for your peace of mind.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}