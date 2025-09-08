// নতুন ফাইল: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\reports\[id]\route.ts

import { ReportController } from '@/lib/modules/reports/report.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// রিপোর্টের স্ট্যাটাস আপডেট করা (শুধুমাত্র অ্যাডমিন)
export const PATCH = catchAsync(checkRole(['admin'])(ReportController.updateReportStatus));