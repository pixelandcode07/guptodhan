// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\editions\[id]\route.ts
import { EditionController } from '@/lib/modules/edition/edition.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const PATCH = catchAsync(checkRole(['admin'])(EditionController.updateEdition));
export const DELETE = catchAsync(checkRole(['admin'])(EditionController.deleteEdition));