import { SupportTicketController } from '@/lib/modules/crm-modules/support-ticket/supportTicket.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Get ticket count stats for admin dashboard. (Admin Only)
 * @method GET
 */
export const GET = catchAsync(checkRole(['admin'])(SupportTicketController.getTicketStats));