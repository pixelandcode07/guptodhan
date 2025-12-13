import { SupportTicketController } from "@/lib/modules/crm-modules/support-ticket/supportTicket.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

/**
 * @description Get a single support ticket by ID (Admin Only)
 * @method GET
 */
export const GET = catchAsync(checkRole(['admin'])(SupportTicketController.getTicketById));

/**
 * @description Update a ticket's status (Admin Only)
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(SupportTicketController.updateTicketStatus));

/**
 * @description Delete a ticket (Admin Only)
 * @method DELETE
 */
export const DELETE = catchAsync(checkRole(['admin'])(SupportTicketController.deleteTicket));