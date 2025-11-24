// ফাইল: src/lib/MainHomePage/fetchLandingPageProducts.ts

import { unstable_cache } from 'next/cache';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service'; // পাথ ঠিক আছে কিনা চেক করবেন
import dbConnect from '../db';

const getCachedLandingPageProducts = unstable_cache(
  async () => {
    try {
      // ১. ডাটাবেস কানেক্ট করুন (সার্ভার একশন বা লিবে এটি জরুরি)
      await dbConnect();

      // ২. সরাসরি সার্ভিস ফাংশন কল করুন (কোনো Axios বা URL লাগবে না)
      const data = await VendorProductServices.getLandingPageProductsFromDB();

      // ৩. ডাটা রিটার্ন করুন (JSON সিরিয়ালাইজেশন এর জন্য stringify করা হলো)
      // Next.js মাঝে মাঝে Mongoose Object সরাসরি পাস করলে ওয়ার্নিং দেয়
      return JSON.parse(JSON.stringify(data));

    } catch (error: any) {
      console.error('Failed to fetch landing page products directly from DB:', error.message);
      // এরর হলে খালি অ্যারে রিটার্ন করুন যাতে সাইট ক্র্যাশ না করে
      return { runningOffers: [], bestSelling: [], randomProducts: [] };
    }
  },
  ['landing-page-products'], // Cache key
  {
    revalidate: 600, // টিপস: 1 সেকেন্ড খুবই কম, অন্তত ১০ মিনিট (600s) বা ১ ঘণ্টা দিন। সার্ভারের ওপর লোড কমবে।
  }
);

export async function fetchLandingPageProducts() {
  return await getCachedLandingPageProducts();
}