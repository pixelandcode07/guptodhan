import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { StoreReviewServices } from './storeReview.service';
import {
  createStoreReviewValidationSchema,
  updateStoreReviewValidationSchema,
} from './storeReview.validation';
import { verifyToken } from "@/lib/utils/jwt";

const getUserDetailsFromToken = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Authorization token missing or invalid.");
  }
  const token = authHeader.split(" ")[1];
  // Token verify করে userId এবং role বের করা হচ্ছে
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as {
    userId: string;
    role: string;
    profilePicture:string;
  };
  return { userId: decoded.userId, role: decoded.role };
};

/* =========================
   CREATE STORE REVIEW
========================= */
 const createStoreReview = async (req: NextRequest) => {
  const {userId} = getUserDetailsFromToken(req);
  const body = await req.json();

  const bodyWithUserId = { ...body, userId: userId };

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
      message: 'Store review created successfully',
      data: result,
    },
    { status: StatusCodes.CREATED }
  );
};

/* =========================
   GET ALL REVIEWS
========================= */
 const getAllStoreReviews = async () => {
  const result =
    await StoreReviewServices.getAllStoreReviewsFromDB();

  return NextResponse.json({
    success: true,
    data: result,
  });
};

/* =========================
   GET REVIEW BY ID
========================= */
 const getStoreReviewById = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const result =
    await StoreReviewServices.getStoreReviewByIdFromDB(
      params.id
    );

  return NextResponse.json({
    success: true,
    data: result,
  });
};

/* =========================
   GET REVIEWS BY STORE ID
========================= */
 const getStoreReviewsByStoreId = async (
  req: NextRequest,
  { params }: { params: { storeId: string } }
) => {
  const result =
    await StoreReviewServices.getStoreReviewsByStoreIdFromDB(
      params.storeId
    );

  return NextResponse.json({
    success: true,
    data: result,
  });
};

/* =========================
   GET REVIEWS BY USER (TOKEN)
========================= */
 const getMyStoreReviews = async (req: NextRequest) => {
  const {userId} = getUserDetailsFromToken(req);

  const result =
    await StoreReviewServices.getStoreReviewsByUserIdFromDB(
      userId
    );

  return NextResponse.json({
    success: true,
    data: result,
  });
};

/* =========================
   UPDATE REVIEW (PATCH)
========================= */
 const updateStoreReview = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const {userId} = getUserDetailsFromToken(req);
  const body = await req.json();

  const validatedData =
    updateStoreReviewValidationSchema.parse(body);

  const review =
    await StoreReviewServices.getStoreReviewByIdFromDB(
      params.id
    );

  if (!review || review.userId !== userId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized to update this review',
      },
      { status: StatusCodes.FORBIDDEN }
    );
  }

  const result =
    await StoreReviewServices.updateStoreReviewInDB(
      params.id,
      validatedData
    );

  return NextResponse.json({
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
};

/* =========================
   DELETE REVIEW
========================= */
 const deleteStoreReview = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const {userId} = getUserDetailsFromToken(req);

  const review =
    await StoreReviewServices.getStoreReviewByIdFromDB(
      params.id
    );

  if (!review || review.userId !== userId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized to delete this review',
      },
      { status: StatusCodes.FORBIDDEN }
    );
  }

  await StoreReviewServices.deleteStoreReviewFromDB(
    params.id
  );

  return NextResponse.json({
    success: true,
    message: 'Review deleted successfully',
  });
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
