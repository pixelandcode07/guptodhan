import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/db";
import { JobService } from "./job.service";
import { jobZodSchema, updateStatusZodSchema } from "./job.validation";
import { catchAsync } from "@/lib/middlewares/catchAsync";

// Admin: Get All Jobs (Pending, Approved, Rejected)
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
  const { status } = updateStatusZodSchema.parse(await req.json());
  const result = await JobService.updateJobStatusInDB(id, status);
  return NextResponse.json({ success: true, data: result });
});


const getSingleJob = catchAsync(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  
  const { id } = await params;

  const result = await JobService.getSingleJobByIdFromDB(id);

  if (!result) {
    return NextResponse.json(
      { success: false, message: "Job not found or not approved yet!" },
      { status: StatusCodes.NOT_FOUND }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Job details retrieved successfully",
    data: result,
  });
});

export const JobController = {
  getAllJobsForAdmin,
  getPublicJobs,
  createJob,
  updateStatus,
  getSingleJob,
};