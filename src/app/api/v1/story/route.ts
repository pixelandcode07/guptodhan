// src/app/api/v1/story/route.ts
import { StoryController } from "@/lib/modules/story/story.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(StoryController.getAllStories);
export const POST = catchAsync(StoryController.createStory);