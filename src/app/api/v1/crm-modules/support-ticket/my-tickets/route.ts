import { SupportTicketController } from '@/lib/modules/crm-modules/support-ticket/supportTicket.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Get all support tickets for the currently logged-in user.
 * @method GET
 */
export const GET = catchAsync(checkRole(['user', 'vendor', 'service-provider', 'admin'])(SupportTicketController.getMySupportTickets));