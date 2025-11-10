import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStoryValidationSchema, updateStoryValidationSchema } from './story.validation';
import { StoryServices } from './story.service';
import dbConnect from '@/lib/db';

// Create a new story
const createStory = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createStoryValidationSchema.parse(body);

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

  // Fetch all stories without filters
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
const updateStory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateStoryValidationSchema.parse(body);

  const result = await StoryServices.updateStoryInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Story updated successfully!',
    data: result,
  });
};

// Delete story
const deleteStory = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = await params;

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
