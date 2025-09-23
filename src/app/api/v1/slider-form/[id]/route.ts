import { SliderController } from "@/lib/modules/slider-form/sliderForm.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(SliderController.getSliderById);
export const PATCH = catchAsync(SliderController.updateSlider);
export const DELETE = catchAsync(SliderController.deleteSlider);
