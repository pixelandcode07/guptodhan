// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\reports\route.ts

import { ReportController } from '@/lib/modules/reports/report.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// সকল রিপোর্ট দেখা (শুধুমাত্র অ্যাডমিন)
export const GET = catchAsync(checkRole(['admin'])(ReportController.getAllReports));

// নতুন রিপোর্ট তৈরি করা (যেকোনো লগইন করা ইউজার)
export const POST = catchAsync(ReportController.createReport);