// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\users\route.ts
import { UserController } from '@/lib/modules/user/user.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// checkRole দিয়ে কন্ট্রোলারটিকে সুরক্ষিত করা হয়েছে, শুধুমাত্র 'admin' অ্যাক্সেস করতে পারবে
export const GET = catchAsync(checkRole(['admin'])(UserController.getAllUsers));