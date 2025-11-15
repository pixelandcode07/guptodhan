import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStoryValidationSchema, updateStoryValidationSchema } from './story.validation';
import { StoryServices } from './story.service';
import dbConnect from '@/lib/db';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/utils/cloudinary'; // Cloudinary ইম্পোর্ট করুন

// Create a new story
const createStory = async (req: NextRequest) => {
  await dbConnect();
  const formData = await req.formData();
  
  const payload: any = {
    title: formData.get('title'),
    description: formData.get('description'),
    duration: Number(formData.get('duration')),
    expiryDate: formData.get('expiryDate'),
  };

  const imageFile = formData.get('imageUrl') as File | null;
  if (!imageFile) {
    throw new Error('Image file is required.');
  }

  // Upload image to Cloudinary
  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const uploadResult = await uploadToCloudinary(buffer, 'stories');
  payload.imageUrl = uploadResult.secure_url;

  const validatedData = createStoryValidationSchema.parse(payload);
  const result = await StoryServices.createStoryInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Story created successfully!',
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
const getActiveStories = async (req: NextRequest) => {
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

// Update story
const updateStory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const formData = await req.formData();
  
  const payload: any = {
    title: formData.get('title'),
    description: formData.get('description'),
    duration: Number(formData.get('duration')),
    expiryDate: formData.get('expiryDate'),
    status: formData.get('status'),
  };

  const imageFile = formData.get('imageUrl') as File | null;
  
  if (imageFile && imageFile.size > 0) {
    // Delete old image first
    const oldStory = await StoryServices.getSingleStoryFromDB(id);
    if (oldStory.imageUrl) {
      await deleteFromCloudinary(oldStory.imageUrl);
    }
    // Upload new image
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'stories');
    payload.imageUrl = uploadResult.secure_url;
  }

  const validatedData = updateStoryValidationSchema.parse(payload);
  const result = await StoryServices.updateStoryInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Story updated successfully!',
    data: result,
  });
};

// Delete story
const deleteStory = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;

  // Delete image from Cloudinary first
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