import { PromoCodeController } from "@/lib/modules/promo-code/promoCode.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";



export const PATCH = catchAsync(PromoCodeController.updatePromoCode);
export const DELETE = catchAsync(PromoCodeController.deletePromoCode);