import { UserController } from "@/lib/modules/user/user.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

/**
 * @description Create a new user directly by Admin (Bypasses OTP)
 * @method POST
 */
export const POST = catchAsync(checkRole(['admin'])(UserController.createUserByAdmin));