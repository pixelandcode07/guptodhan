import { StoryController } from "@/lib/modules/story/story.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(StoryController.getActiveStories);