import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { StoreReviewServices } from './storeReview.service';
import {
  createStoreReviewValidationSchema,
  updateStoreReviewValidationSchema,
} from './storeReview.validation';
import { verifyToken } from "@/lib/utils/jwt";
import mongoose from 'mongoose';

const getUserDetailsFromToken = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Authorization token missing or invalid.");
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as {
    userId: string;
    role: string;
    profilePicture: string;
  };
  return { userId: decoded.userId, role: decoded.role };
};

/* =========================
   CREATE STORE REVIEW
========================= */
const createStoreReview = async (req: NextRequest) => {
  try {
    const { userId } = getUserDetailsFromToken(req);
    const body = await req.json();
    const bodyWithUserId = {
      ...body,
      userId,
    };
    const validatedData =
      createStoreReviewValidationSchema.parse(bodyWithUserId);
    const result =
      await StoreReviewServices.createStoreReviewInDB({
        ...validatedData,
        userId,
      });
    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (err) {
    throw err;
  }
};

/* =========================
   GET ALL REVIEWS
========================= */
const getAllStoreReviews = async () => {
  const result = await StoreReviewServices.getAllStoreReviewsFromDB();
  return NextResponse.json({ success: true, data: result });
};

/* =========================
   GET REVIEW BY ID
========================= */
const getStoreReviewById = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // ✅ MAGIC FIX: Promise add kora hoyeche
) => {
  const { id } = await params; // ✅ MAGIC FIX: params ke await kora hoyeche
  const result = await StoreReviewServices.getStoreReviewByIdFromDB(id);
  return NextResponse.json({ success: true, data: result });
};

/* =========================
   GET REVIEWS BY STORE ID
========================= */
const getStoreReviewsByStoreId = async (
  req: NextRequest, 
  { params }: { params: Promise<{ storeId: string }> }
) => {
  const { storeId } = await params;
  const result = await StoreReviewServices.getStoreReviewsByStoreIdFromDB(storeId);
  return NextResponse.json({ success: true, data: result });
};

/* =========================
   GET REVIEWS BY USER (TOKEN)
========================= */
const getMyStoreReviews = async (req: NextRequest) => {
  const { userId } = getUserDetailsFromToken(req);
  const result = await StoreReviewServices.getStoreReviewsByUserIdFromDB(userId);
  return NextResponse.json({ success: true, data: result });
};

/* =========================
   UPDATE REVIEW (PATCH)
========================= */
const updateStoreReview = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
  const { userId } = getUserDetailsFromToken(req);
  const { id } = await params;
  const body = await req.json();
  
  const validatedData = updateStoreReviewValidationSchema.parse(body);
  const review = await StoreReviewServices.getStoreReviewByIdFromDB(id);

  if (!review || review.userId !== userId) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized to update this review' },
      { status: StatusCodes.FORBIDDEN }
    );
  }

  const result = await StoreReviewServices.updateStoreReviewInDB(id, validatedData);
  return NextResponse.json({ success: true, message: 'Review updated successfully', data: result });
};

/* =========================
   DELETE REVIEW
========================= */
const deleteStoreReview = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { userId, role } = getUserDetailsFromToken(req);
    const { id } = await params; // ✅ MAGIC FIX: params ke await kora hoyeche

    const review = await StoreReviewServices.getStoreReviewByIdFromDB(id);

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    // Check Authorization: Reviewer, Admin, or Store Owner (Vendor)
    let isAuthorized = false;

    if (review.userId === userId) {
      isAuthorized = true; // Reviewer
    } else if (role === 'admin') {
      isAuthorized = true; // Admin
    } else if (role === 'vendor') {
      // Find user to get vendorInfo
      const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
      const user = await User.findById(userId).lean();
       
      // Find store to get vendorId
      const StoreModel = mongoose.models.StoreModel || mongoose.model('StoreModel', new mongoose.Schema({}, { strict: false }));
      const store = await StoreModel.findById(review.storeId).lean() as any;

      if (store && user && store.vendorId?.toString() === (user as any).vendorInfo?.toString()) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to delete this review' },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    await StoreReviewServices.deleteStoreReviewFromDB(id);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const StoreReviewController = {
  createStoreReview,
  getAllStoreReviews,
  getStoreReviewById,
  getStoreReviewsByStoreId,
  getMyStoreReviews,
  updateStoreReview,
  deleteStoreReview,
};