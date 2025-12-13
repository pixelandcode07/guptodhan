// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\about\team\[id]\route.ts
import { TeamMemberController } from '@/lib/modules/about-team/team.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
export const PATCH = catchAsync(checkRole(['admin'])(TeamMemberController.updateTeamMember));
export const DELETE = catchAsync(checkRole(['admin'])(TeamMemberController.deleteTeamMember));