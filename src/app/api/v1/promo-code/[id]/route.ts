import { PromoCodeController } from "@/lib/modules/promo-code/promoCode.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";


export const GET = catchAsync(PromoCodeController.getPromoCodeByCode);
// export const GET = catchAsync((req, {params}) => PromoCodeController.getPromoCodeByCode(req, { params }));
export const PATCH = catchAsync(PromoCodeController.updatePromoCode);
export const DELETE = catchAsync(PromoCodeController.deletePromoCode);