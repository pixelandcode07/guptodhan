import { IStory } from './story.interface';
import { StoryModel } from './story.model';

// Create story
const createStoryInDB = async (payload: Partial<IStory>) => {
  const result = await StoryModel.create(payload);
  return result;
};

// Get all stories (optional filter: status)
const getAllStoriesFromDB = async (): Promise<IStory[]> => {
  const result = await StoryModel.find().populate('productId').sort({ createdAt: -1 });
  return result;
};

// Get all active stories
const getAllActiveStoriesFromDB = async (): Promise<IStory[]> => {
  const result = await StoryModel.find({ status: 'active', expiryDate: { $gt: new Date() } }).populate('productId').sort({ createdAt: -1 });
  return result;
};

// Get single story by ID
const getSingleStoryFromDB = async (id: string) => {
  const result = await StoryModel.findById(id).populate('productId');
  if (!result) {
    throw new Error('Story not found.');
  }
  return result;
};

// Update story
const updateStoryInDB = async (id: string, payload: Partial<IStory>) => {
  const result = await StoryModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Story not found to update.');
  }
  return result;
};

// Delete story
const deleteStoryFromDB = async (id: string) => {
  const result = await StoryModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Story not found to delete.');
  }
  return null;
};

export const StoryServices = {
  createStoryInDB,
  getAllStoriesFromDB,
  getSingleStoryFromDB,
  getAllActiveStoriesFromDB,
  updateStoryInDB,
  deleteStoryFromDB,
};
