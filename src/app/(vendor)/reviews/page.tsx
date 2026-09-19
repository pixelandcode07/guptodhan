import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import StoreReviewClient from './StoreReviewClient';

export default async function Reviews() {
  const session = await getServerSession(authOptions);
  const vendorId = session?.user?.vendorId;
  const token = (session?.user as any)?.accessToken;

  // ✅ vendorId না থাকলে early return
  if (!vendorId) {
    return (
      <div className="p-6">
        <p className="text-red-500">Session expired or invalid vendor. Please login again.</p>
      </div>
    );
  }

  await dbConnect();
  
  // ✅ ভেন্ডরের স্টোর খুঁজে বের করা হচ্ছে
  const StoreModel = mongoose.models.StoreModel || mongoose.model('StoreModel', new mongoose.Schema({ vendorId: mongoose.Schema.Types.ObjectId }, { strict: false }));
  const store = await StoreModel.findOne({ vendorId }).lean();

  let reviews = [];
  if (store) {
    // ✅ স্টোরের রিভিউগুলো ডাটাবেস থেকে ফেচ করা হচ্ছে
    const StoreReview = mongoose.models.StoreReview || mongoose.model('StoreReview', new mongoose.Schema({}, { strict: false }));
    const rawReviews = await StoreReview.find({ storeId: store._id }).sort({ createdAt: -1 }).lean();
    reviews = JSON.parse(JSON.stringify(rawReviews));
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Store Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Manage what customers are saying about your store.</p>
      </div>
      
      <main>
        {!store ? (
           <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md border border-yellow-200">
             You haven't set up a store yet.
           </div>
        ) : (
           // ✅ নতুন ক্লায়েন্ট কম্পোনেন্টে রিভিউগুলো পাঠানো হচ্ছে
           <StoreReviewClient initialReviews={reviews} token={token} />
        )}
      </main>
    </div>
  );
}