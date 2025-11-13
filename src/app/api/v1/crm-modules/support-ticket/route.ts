import { SupportTicketController } from "@/lib/modules/crm-modules/support-ticket/supportTicket.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

/**
 * @description Get all support tickets (Admin Only)
 * @method GET
 */
export const GET = catchAsync(checkRole(['admin'])(SupportTicketController.getAllTickets));

/**
 * @description Create a new support ticket (User or Admin)
 * @method POST
 */
export const POST = catchAsync(checkRole(['user', 'admin', 'vendor', 'service-provider'])(SupportTicketController.createTicket));