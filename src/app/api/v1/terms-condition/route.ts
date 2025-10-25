import { TermsController } from "@/lib/modules/terms-condition/termsCon.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(TermsController.getAllTerms);
export const POST = catchAsync(checkRole(["admin"])(TermsController.createTerms));