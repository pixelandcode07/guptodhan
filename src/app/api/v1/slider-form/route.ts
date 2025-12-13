import { SliderController } from "@/lib/modules/slider-form/sliderForm.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(SliderController.getAllSliders);
export const POST = catchAsync(checkRole(["admin"])(SliderController.createSlider));
export const PATCH = catchAsync(checkRole(["admin"])(SliderController.reorderSliders));