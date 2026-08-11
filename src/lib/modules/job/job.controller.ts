import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/db";
import { JobService } from "./job.service";
import { jobZodSchema, updateStatusZodSchema } from "./job.validation";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { isValidObjectId } from "mongoose";
import { verifyToken } from "@/lib/utils/jwt"; // ✅ Token verifier added

// Admin: Get All Jobs
const getAllJobsForAdmin = catchAsync(async () => {
  await dbConnect();
  const result = await JobService.getAllJobsForAdminFromDB();
  return NextResponse.json({ success: true, data: result });
});

// Public: Get Only Approved Jobs
const getPublicJobs = catchAsync(async () => {
  await dbConnect();
  const result = await JobService.getApprovedJobsFromDB();
  return NextResponse.json({ success: true, data: result });
});

// User: Create Job
const createJob = catchAsync(async (req: NextRequest) => {
  await dbConnect();
  
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const validatedData = jobZodSchema.parse(body);

  const result = await JobService.createJobIntoDB({
    ...validatedData,
    postedBy: userId,
  } as any);

  return NextResponse.json({ success: true, data: result }, { status: StatusCodes.CREATED });
});

// Admin: Update Status
const updateStatus = catchAsync(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid Job ID" }, { status: 400 });
  }

  const { status } = updateStatusZodSchema.parse(await req.json());
  const result = await JobService.updateJobStatusInDB(id, status);

  if (!result) return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });

  return NextResponse.json({ success: true, data: result });
});

// Single Job Details
const getSingleJob = catchAsync(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid Job ID format" }, { status: 400 });
  }

  const result = await JobService.getSingleJobByIdFromDB(id);

  if (!result) {
    return NextResponse.json({ success: false, message: "Job not found or not approved yet!" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Job details retrieved successfully",
    data: result,
  });
});

const getMyJobs = catchAsync(async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const result = await JobService.getMyJobsFromDB(userId);
  return NextResponse.json({ success: true, data: result });
});

// Update My Job
const updateMyJob = catchAsync(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  let userId = req.headers.get('x-user-id');
  let userRole = req.headers.get('x-user-role');

  // ✅ MAGIC FIX: Token থেকে রোল ও আইডি নিশ্চিত করা হচ্ছে (যদি হেডার কাজ না করে)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as any;
      userId = userId || decoded.userId;
      userRole = userRole || decoded.role;
    } catch (err) {}
  }

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid Job ID" }, { status: 400 });
  }
  
  const body = await req.json();
  const result = await JobService.updateMyJobInDB(id, userId, userRole as string, body);
  
  if (!result) {
    return NextResponse.json({ success: false, message: "Job not found or unauthorized" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: result });
});

// Delete My Job
const deleteMyJob = catchAsync(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  
  let userId = req.headers.get('x-user-id');
  let userRole = req.headers.get('x-user-role');

  // ✅ MAGIC FIX: Token থেকে রোল ও আইডি নিশ্চিত করা হচ্ছে (যদি হেডার কাজ না করে)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as any;
      userId = userId || decoded.userId;
      userRole = userRole || decoded.role;
    } catch (err) {}
  }

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid Job ID" }, { status: 400 });
  }
  
  // ✅ সার্ভিসে role পাস করা হচ্ছে, যাতে অ্যাডমিন সরাসরি ডিলিট করতে পারে
  const result = await JobService.deleteMyJobFromDB(id, userId, userRole as string);
  
  if (!result) {
    return NextResponse.json({ success: false, message: "Job not found or unauthorized" }, { status: 404 });
  }
  
  return NextResponse.json({ success: true, message: "Job deleted successfully" });
});

export const JobController = {
  getAllJobsForAdmin,
  getPublicJobs,
  createJob,
  updateStatus,
  getSingleJob,
  getMyJobs,    
  updateMyJob,  
  deleteMyJob,
};