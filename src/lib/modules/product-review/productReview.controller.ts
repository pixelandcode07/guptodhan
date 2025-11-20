import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createReviewValidationSchema, updateReviewValidationSchema } from './productReview.validation';
import { ReviewServices } from './productReview.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { IReview } from './productReview.interface';

// Create a new review
const createReview = async (req: NextRequest) => {
    await dbConnect();

    try {
        const formData = await req.formData();

        // ১. ইমেজ ফাইলগুলো প্রসেস করা
        const reviewImageFiles = formData.getAll('reviewImages');
        let uploadedImageUrls: string[] = [];

        if (reviewImageFiles && reviewImageFiles.length > 0) {
            for (const file of reviewImageFiles) {
                if (file instanceof File) {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    // Cloudinary তে আপলোড
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
            rating: Number(formData.get('rating')),
            comment: formData.get('comment'),
            userImage: formData.get('userImage'),
            reviewImages: uploadedImageUrls,
        };

        // ৩. ভ্যালিডেশন
        const validatedData = createReviewValidationSchema.parse(rawData);

        // ৪. ডাটাবেস পেইলড তৈরি (টাইপ এরর ফিক্স করা হয়েছে)
        // as unknown as Partial<IReview> ব্যবহার করা হয়েছে যাতে টাইপ মিসম্যাচ না হয়
        const payload = {
            ...validatedData,
            userId: new Types.ObjectId(validatedData.userId),
            productId: new Types.ObjectId(validatedData.productId),
            uploadedTime: validatedData.uploadedTime ? new Date(validatedData.uploadedTime) : undefined,
            reviewImages: uploadedImageUrls
        } as unknown as Partial<IReview>;

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
    
    const body = await req.json();
    const validatedData = updateReviewValidationSchema.parse(body);

    // আপডেট পে-লোড ফিক্স (টাইপ কাস্টিং)
    const payload = {
        ...validatedData,
        ...(validatedData.userId && { userId: new Types.ObjectId(validatedData.userId) }),
        ...(validatedData.productId && { productId: new Types.ObjectId(validatedData.productId) }),
        ...(validatedData.uploadedTime && { uploadedTime: new Date(validatedData.uploadedTime) }),
    } as unknown as Partial<IReview>;

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