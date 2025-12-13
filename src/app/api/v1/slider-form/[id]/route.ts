import { SliderController } from "@/lib/modules/slider-form/sliderForm.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(SliderController.getSliderById);
export const PATCH = catchAsync(checkRole(["admin"])(SliderController.updateSlider));
export const DELETE = catchAsync(checkRole(["admin"])(SliderController.deleteSlider));
