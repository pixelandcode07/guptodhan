import { Suspense } from 'react';
import dbConnect from '@/lib/db';
import { StoryServices } from '@/lib/modules/story/story.service';
// ✅ প্রোডাক্ট সার্ভিস ইম্পোর্ট করুন
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service'; 
import FancyLoadingPage from '@/app/general/loading';
import SectionTitle from '@/components/ui/SectionTitle';
import StoryClient from './Components/StoryClient';

export default async function StoryManagerPage() {
  await dbConnect();
  
  // ১. স্টোরিগুলো আনুন
  const stories = await StoryServices.getAllStoriesFromDB();

  // ২. ✅ সব একটিভ প্রোডাক্ট আনুন (স্টোরির সাথে লিঙ্ক করার জন্য)
  const products = await VendorProductServices.getActiveVendorProductsFromDB();

  return (
    <div className="p-4 sm:p-6">
      <SectionTitle text="Story Management" />
      <p className="text-gray-600 text-md mb-6">
        Create, manage, and organize your stories with linked products.
      </p>
      
      <Suspense fallback={<FancyLoadingPage />}>
        <StoryClient 
          initialStories={JSON.parse(JSON.stringify(stories))} 
          // ✅ প্রোডাক্টগুলো প্রপস হিসেবে পাঠাচ্ছি
          productList={JSON.parse(JSON.stringify(products))} 
        />
      </Suspense>
    </div>
  );
}