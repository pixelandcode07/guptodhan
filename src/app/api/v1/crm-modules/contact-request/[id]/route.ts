import { ContactRequestController } from "@/lib/modules/crm-modules/contact-request/contactReq.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(ContactRequestController.updateContactRequest);
export const DELETE = catchAsync(ContactRequestController.deleteContactRequest);