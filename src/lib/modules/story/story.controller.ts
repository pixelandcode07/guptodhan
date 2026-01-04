import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStoryValidationSchema, updateStoryValidationSchema } from './story.validation';
import { StoryServices } from './story.service';
import dbConnect from '@/lib/db';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/utils/cloudinary';

// Create a new story
export const createStory = async (req: NextRequest) => {
  await dbConnect();
  const formData = await req.formData();

  const payload: any = {
    title: formData.get('title') || undefined,
    description: formData.get('description') || undefined,
    duration: formData.get('duration') ? Number(formData.get('duration')) : 10,
    expiryDate: formData.get('expiryDate'),
    status: formData.get('status') || "active",
    productId: formData.get('productId') || undefined,
  };

  const imageFile = formData.get('imageUrl') as File | null;
  if (!imageFile) throw new Error('Image file is required.');

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const uploadResult = await uploadToCloudinary(buffer, 'stories');
  payload.imageUrl = uploadResult.secure_url;

  // Zod ভ্যালিডেশন
  const validatedData = createStoryValidationSchema.parse(payload);

  // String Date কে Actual Date Object এ কনভার্ট করা (TS Error fix)
  const finalPayload = {
    ...validatedData,
    expiryDate: new Date(validatedData.expiryDate),
    productId: (validatedData.productId === "null" || !validatedData.productId) ? undefined : validatedData.productId
  };

  const result = await StoryServices.createStoryInDB(finalPayload as any);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Story created successfully!',
    data: result,
  });
};

// UPDATE STORY
export const updateStory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const formData = await req.formData();

  const payload: any = {
    title: formData.get('title') || undefined,
    description: formData.get('description') || undefined,
    duration: formData.get('duration') ? Number(formData.get('duration')) : undefined,
    expiryDate: formData.get('expiryDate') || undefined,
    status: formData.get('status') || undefined,
    productId: formData.get('productId') || undefined,
  };

  const imageFile = formData.get('imageUrl') as File | null;
  if (imageFile && imageFile.size > 0) {
    const oldStory = await StoryServices.getSingleStoryFromDB(id);
    if (oldStory.imageUrl) await deleteFromCloudinary(oldStory.imageUrl);
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'stories');
    payload.imageUrl = uploadResult.secure_url;
  }

  const validatedData = updateStoryValidationSchema.parse(payload);
  
  // Date কনভার্ট করা যদি ডেট থাকে
  const finalPayload: any = { ...validatedData };
  if (validatedData.expiryDate) {
    finalPayload.expiryDate = new Date(validatedData.expiryDate);
  }

  const result = await StoryServices.updateStoryInDB(id, finalPayload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Story updated successfully!',
    data: result,
  });
};

// Get all stories
const getAllStories = async () => {
  await dbConnect();
  const result = await StoryServices.getAllStoriesFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Stories retrieved successfully!',
    data: result,
  });
};

// Get all active stories
const getActiveStories = async () => {
  await dbConnect();
  const result = await StoryServices.getAllActiveStoriesFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Active stories retrieved successfully!',
    data: result,
  });
};

// Get single story by ID
const getSingleStory = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const result = await StoryServices.getSingleStoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Story retrieved successfully!',
    data: result,
  });
};



// Delete story
const deleteStory = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;

  const story = await StoryServices.getSingleStoryFromDB(id);

  if (story.imageUrl) {
    await deleteFromCloudinary(story.imageUrl);
  }

  await StoryServices.deleteStoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Story deleted successfully!',
    data: null,
  });
};

export const StoryController = {
  createStory,
  getAllStories,
  getSingleStory,
  getActiveStories,
  updateStory,
  deleteStory,
};
