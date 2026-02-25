import { IFAQ } from './faq.interface';
import { FAQModel } from './faq.model';
import { FAQCategoryModel } from '../faq-category/faqCategory.model'; // ✅ Imported Category Model
import { Types } from 'mongoose';

// Create FAQ
const createFAQInDB = async (payload: Partial<IFAQ>) => {
  const result = await FAQModel.create(payload);
  return result;
};

// Get all active FAQs
const getAllFAQsFromDB = async () => {
  const result = await FAQModel.find({}).sort({ createdAt: -1 }).lean();
  return result;
};

// Get FAQs by category
const getFAQsByCategoryFromDB = async (categoryId: string) => {
  const result = await FAQModel.find({ 
    category: categoryId, 
    isActive: true 
  }).sort({ question: 1 }).lean();
  return result;
};

// 🔥 NEW: Robust Aggregation with $lookup for Public API
const getPublicGroupedFAQsFromDB = async () => {
  return await FAQCategoryModel.aggregate([
    // ১. শুধু অ্যাক্টিভ ক্যাটাগরিগুলো নাও
    { $match: { isActive: true } }, 
    
    // ২. ক্যাটাগরির সাথে FAQ $lookup করো
    {
      $lookup: {
        from: 'faqmodels', // FAQ মডেলের কালেকশন নাম
        let: { catIdStr: { $toString: '$_id' }, catName: '$name' }, // Category ID কে String বানাও এবং Name নাও
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$isActive', true] }, // FAQ অ্যাক্টিভ হতে হবে
                  {
                    $or: [
                      { $eq: ['$category', '$$catIdStr'] }, // যদি FAQ তে Category ID সেভ থাকে
                      { $eq: ['$category', '$$catName'] }   // অথবা যদি FAQ তে Category Name সেভ থাকে
                    ]
                  }
                ]
              }
            }
          },
          { $sort: { createdAt: -1 } } // FAQ গুলোকে লেটেস্ট অনুযায়ী সাজাও
        ],
        as: 'faqs'
      }
    },
    
    // ৩. যেসব ক্যাটাগরিতে কোনো FAQ নেই, সেগুলো বাদ দাও
    { $match: { 'faqs.0': { $exists: true } } }, 
    
    // ৪. ক্যাটাগরির নাম অনুযায়ী সাজাও
    { $sort: { name: 1 } },
    
    // ৫. ফ্রন্টএন্ডে পাঠানোর জন্য সুন্দর করে সাজিয়ে দাও
    {
      $project: {
        _id: 1,
        categoryName: '$name',
        faqs: 1
      }
    }
  ]);
};

// Update FAQ
const updateFAQInDB = async (id: string, payload: Partial<IFAQ>) => {
  const result = await FAQModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error("FAQ not found to update.");
  }
  return result;
};

// Delete FAQ
const deleteFAQFromDB = async (id: string) => {
  const result = await FAQModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("FAQ not found to delete.");
  }
  return null;
};

export const FAQServices = {
  createFAQInDB,
  getAllFAQsFromDB,
  getFAQsByCategoryFromDB,
  getPublicGroupedFAQsFromDB, // ✅ Exported new function
  updateFAQInDB,
  deleteFAQFromDB,
};