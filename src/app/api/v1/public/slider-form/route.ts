import { catchAsync } from "@/lib/middlewares/catchAsync";
import { SliderController } from "@/lib/modules/slider-form/sliderForm.controller";

export const GET = catchAsync(SliderController.getSliderById);