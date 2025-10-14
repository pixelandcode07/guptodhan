// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\about\team\route.ts
import { TeamMemberController } from '@/lib/modules/about-team/team.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
export const POST = catchAsync(checkRole(['admin'])(TeamMemberController.createTeamMember));