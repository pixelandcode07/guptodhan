import { TermsController } from "@/lib/modules/terms-condition/termsCon.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";


// export const GET = catchAsync(TermsController.getTermsByCategory);
export const PATCH = catchAsync(TermsController.updateTerms);
export const DELETE = catchAsync(TermsController.deleteTerms);
