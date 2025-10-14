// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\about\team\route.ts
import { TeamMemberController } from '@/lib/modules/about-team/team.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
export const GET = catchAsync(TeamMemberController.getPublicTeam);