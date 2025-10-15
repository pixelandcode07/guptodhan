import { ContactRequestController } from "@/lib/modules/crm-modules/contact-request/contactReq.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";  

export const GET = catchAsync(ContactRequestController.getAllContactRequests);
export const POST = catchAsync(ContactRequestController.createContactRequest);