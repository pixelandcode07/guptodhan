import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { FAQCategoryModel } from '@/lib/modules/faq-category/faqCategory.model';
import { FAQModel } from '@/lib/modules/faq/faq.model';
import dbConnect from '@/lib/db';
import { catchAsync } from '@/lib/middlewares/catchAsync';

const getPublicFAQs = async (req: NextRequest) => {
    await dbConnect();

    // ১. প্রথমে সব অ্যাক্টিভ ক্যাটাগরি নিয়ে আসবো
    const activeCategories = await FAQCategoryModel.find({ isActive: true }).sort({ name: 1 }).lean();

    // ২. এবার সব অ্যাক্টিভ FAQ নিয়ে আসবো
    const activeFAQs = await FAQModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    // ৩. ক্যাটাগরির আইডি অনুযায়ী FAQ গুলোকে গ্রুপ করবো
    const groupedData = activeCategories.map((category) => {
        return {
            _id: category._id,
            categoryName: category.name,
            faqs: activeFAQs.filter((faq) => String(faq.category) === String(category._id))
        };
    });

    // যেসব ক্যাটাগরিতে কোনো FAQ নেই সেগুলো বাদ দিয়ে দিবো
    const finalData = groupedData.filter(item => item.faqs.length > 0);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Public FAQs retrieved successfully!',
        data: finalData,
    });
};

export const GET = catchAsync(getPublicFAQs);