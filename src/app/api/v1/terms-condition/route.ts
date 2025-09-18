import { TermsController } from "@/lib/modules/terms-condition/termsCon.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(TermsController.getAllTerms);
export const POST = catchAsync(TermsController.createTerms);