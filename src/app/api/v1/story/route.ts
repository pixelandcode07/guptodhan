import { StoryController } from "@/lib/modules/story/story.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(checkRole(["admin"])(StoryController.getAllStories));
export const POST = catchAsync(checkRole(["admin"])(StoryController.createStory));