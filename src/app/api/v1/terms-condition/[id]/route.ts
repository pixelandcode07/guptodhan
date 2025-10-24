import { TermsController } from "@/lib/modules/terms-condition/termsCon.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";


// export const GET = catchAsync(TermsController.getTermsByCategory);
export const PATCH = catchAsync(checkRole(["admin"])(TermsController.updateTerms));
export const DELETE = catchAsync(checkRole(["admin"])(TermsController.deleteTerms));
