import { PromoCodeController } from "@/lib/modules/promo-code/promoCode.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(PromoCodeController.getAllPromoCodes);
export const POST = catchAsync(PromoCodeController.createPromoCode);