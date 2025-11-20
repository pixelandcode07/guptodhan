import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createReviewValidationSchema, updateReviewValidationSchema } from './productReview.validation';
import { ReviewServices } from './productReview.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '@/lib/utils/cloudinary'; // ✅ আপনার ইউটিলিটি ইমপোর্ট

// Create a new review
const createReview = async (req: NextRequest) => {
    await dbConnect();

    try {
        // ❌ req.json() ব্যবহার করবেন না (এটিই এরর দিচ্ছিল)
        // ✅ req.formData() ব্যবহার করুন
        const formData = await req.formData();

        // ১. ইমেজ ফাইলগুলো প্রসেস করা
        const reviewImageFiles = formData.getAll('reviewImages');
        let uploadedImageUrls: string[] = [];

        if (reviewImageFiles && reviewImageFiles.length > 0) {
            // লুপ চালিয়ে সব ইমেজ আপলোড করা
            for (const file of reviewImageFiles) {
                if (file instanceof File) {
                    // File কে Buffer এ কনভার্ট করা (আপনার ইউটিলিটির জন্য প্রয়োজন)
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    // Cloudinary তে আপলোড (ফোল্ডার নাম: 'product-reviews')
                    const uploadResult = await uploadToCloudinary(buffer, 'product-reviews');
                    
                    if (uploadResult && uploadResult.secure_url) {
                        uploadedImageUrls.push(uploadResult.secure_url);
                    }
                }
            }
        }

        // ২. টেক্সট ডাটাগুলো সাজানো
        const rawData = {
            reviewId: formData.get('reviewId'),
            productId: formData.get('productId'),
            userId: formData.get('userId'),
            userName: formData.get('userName'),
            userEmail: formData.get('userEmail'),
            rating: Number(formData.get('rating')), // স্ট্রিং থেকে নাম্বারে কনভার্ট
            comment: formData.get('comment'),
            userImage: formData.get('userImage'),
            reviewImages: uploadedImageUrls, // আপলোড করা ইমেজের লিংক
        };

        // ৩. ভ্যালিডেশন (Zod)
        const validatedData = createReviewValidationSchema.parse(rawData);

        // ৪. ডাটাবেস পেইলড তৈরি
        const payload = {
            ...validatedData,
            userId: new Types.ObjectId(validatedData.userId),
            productId: new Types.ObjectId(validatedData.productId),
        };

        // ৫. ডাটাবেসে সেভ করা
        const result = await ReviewServices.createReviewInDB(payload);

        return sendResponse({
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Review created successfully!',
            data: result,
        });

    } catch (error: any) {
        console.error("Create Review Error:", error);
        return sendResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message || 'Failed to create review',
            data: null,
        });
    }
};

// Get all reviews
const getAllReviews = async () => {
    await dbConnect();
    const result = await ReviewServices.getAllReviewsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Reviews retrieved successfully!',
        data: result,
    });
};

// Get reviews by user
const getReviewsByUser = async (req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
    await dbConnect();
    const { userId } = await params;
    const result = await ReviewServices.getReviewsByUserFromDB(userId);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User reviews retrieved successfully!',
        data: result,
    });
};

// Update review
const updateReview = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    
    // নোট: আপডেটের সময় ইমেজ পাঠাতে চাইলে এখানেও formData() লজিক লাগবে।
    // আপাতত সাধারণ আপডেটের জন্য JSON রাখা হলো।
    const body = await req.json();
    const validatedData = updateReviewValidationSchema.parse(body);

    const payload = {
        ...validatedData,
        ...(validatedData.userId && { userId: new Types.ObjectId(validatedData.userId) }),
    };

    const result = await ReviewServices.updateReviewInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review updated successfully!',
        data: result,
    });
};

// Delete review
const deleteReview = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    await ReviewServices.deleteReviewFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review deleted successfully!',
        data: null,
    });
};

// Get reviews by product
const getReviewsByProduct = async (
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) => {
  await dbConnect();
  const { productId } = await params;
  const result = await ReviewServices.getReviewsByProductFromDB(productId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product reviews retrieved successfully!',
    data: result,
  });
};


export const ReviewController = {
    createReview,
    getAllReviews,
    getReviewsByUser,
    getReviewsByProduct,
    updateReview,
    deleteReview,
};