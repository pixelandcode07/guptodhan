import { StoryController } from "@/lib/modules/story/story.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(StoryController.getSingleStory);
// export const PATCH = catchAsync(checkRole(["admin"])(StoryController.updateStory));
export const PATCH = catchAsync(StoryController.updateStory);
export const DELETE = catchAsync(StoryController.deleteStory);
// export const DELETE = catchAsync(checkRole(["admin"])(StoryController.deleteStory));
