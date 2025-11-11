import { SupportTicketController } from "@/lib/modules/crm-modules/support-ticket/supportTicket.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

/**
 * @description Add a reply message to a support ticket (User or Admin)
 * @method POST
 */
export const POST = catchAsync(checkRole(['user', 'admin', 'vendor', 'service-provider'])(SupportTicketController.addReply));