import { SupportTicketController } from "@/lib/modules/crm-modules/support-ticket/supportTicket.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(SupportTicketController.getPendingTickets);