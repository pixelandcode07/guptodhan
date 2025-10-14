import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createReviewValidationSchema, updateReviewValidationSchema } from './productReview.validation';
import { ReviewServices } from './productReview.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// Create a new review
const createReview = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createReviewValidationSchema.parse(body);

    const payload = {
        ...validatedData,
        userId: new Types.ObjectId(validatedData.userId),
    };

    const result = await ReviewServices.createReviewInDB(payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Review created successfully!',
        data: result,
    });
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
const getReviewsByUser = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    await dbConnect();
    const { userId } = params;
    const result = await ReviewServices.getReviewsByUserFromDB(userId);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User reviews retrieved successfully!',
        data: result,
    });
};

// Update review
const updateReview = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
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
const deleteReview = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await ReviewServices.deleteReviewFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review deleted successfully!',
        data: null,
    });
};

export const ReviewController = {
    createReview,
    getAllReviews,
    getReviewsByUser,
    updateReview,
    deleteReview,
};
