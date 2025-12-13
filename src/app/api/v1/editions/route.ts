// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\editions\route.ts
import { EditionController } from '@/lib/modules/edition/edition.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const GET = catchAsync(EditionController.getEditionsByModel);
export const POST = catchAsync(checkRole(['admin'])(EditionController.createEdition));