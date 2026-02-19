import { UserController } from "@/lib/modules/user/user.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(UserController.getAllUsers);
export const POST = catchAsync(UserController.registerUser);