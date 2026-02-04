'use client';

import { ShoppingBag, Heart, Wrench, Repeat, CheckCircle2 } from 'lucide-react';

interface AboutClientProps {
  content: string | null;
}

export default function AboutClient({ content }: AboutClientProps) {
  // ✅ Standard Alignment Class (Same as Donation & Home)
  const containerClass = "md:max-w-[95vw] xl:container mx-auto px-4 md:px-8";

  return (
    <div>
      {/* 1. Hero Section */}
      <div className="bg-[#00005E] text-white py-20">
        <div className={`${containerClass} text-center space-y-6`}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
            More Than Just An E-Commerce
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Welcome to <span className="font-bold text-white">Guptodhan</span>. We are building Bangladesh's first 
            hybrid ecosystem where you can <span className="text-yellow-400 font-semibold">Shop</span> brand new items, 
            <span className="text-green-400 font-semibold"> Buy & Sell</span> used goods, 
            hire expert <span className="text-purple-400 font-semibold">Services</span>, and 
            <span className="text-red-400 font-semibold"> Donate</span> to humanity—all in one place.
          </p>
        </div>
      </div>

      <div className={`${containerClass} py-12 space-y-16`}>
        
        {/* 2. Dynamic Content Section (From Admin Panel) */}
        {content && (
          <section className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed 
              [&>h1]:text-2xl md:[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-[#00005E]
              [&>h2]:text-xl md:[&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:text-gray-800
              [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </section>
        )}

        {/* 3. Our Core Pillars (The 4 Features You Requested) */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">One Platform, Endless Possibilities</h2>
            <p className="text-gray-500 mt-3 text-lg">Everything you need, simplified in one app.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1: Multi-Vendor (E-commerce) */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="text-purple-600" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Multi-Vendor Store</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Shop brand new products from verified sellers across the country. Electronics, fashion, grocery, and more.
              </p>
            </div>

            {/* Feature 2: Buy & Sell (Bikroy style) */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Repeat className="text-green-600" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Buy & Sell Used</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Post your ads for free! Sell your old phone, bike, or furniture directly to other users like a classifieds board.
              </p>
            </div>

            {/* Feature 3: Services (Sheba.xyz style) */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wrench className="text-blue-600" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Expert Services</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Need a plumber, electrician, or AC repair? Find and hire expert service providers in your local area easily.
              </p>
            </div>

            {/* Feature 4: Donation (Humanity) */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="text-red-600" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Donate for Humanity</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Request help or donate items and money to the needy. A dedicated section to spread kindness and support.
              </p>
            </div>

          </div>
        </section>

        {/* 4. Trust Badges / Bottom Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Why Guptodhan is Different?</h3>
              <p className="text-gray-600 text-lg">
                We are not just a business; we are a community. By integrating commerce with compassion, we ensure that every transaction brings value to someone's life.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span>Verified Vendors & Service Providers</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span>Secure Payment & Fast Delivery</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span>Transparent Donation System</span>
                </li>
              </ul>
            </div>
            
            {/* Visual / CTA */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center space-y-4">
              <h4 className="text-xl font-bold text-[#00005E]">Ready to explore?</h4>
              <p className="text-gray-500 text-sm">Join thousands of users today.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-[#00005E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition w-full sm:w-auto">
                  Start Shopping
                </button>
                <button className="border-2 border-[#00005E] text-[#00005E] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition w-full sm:w-auto">
                  Post an Ad
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}