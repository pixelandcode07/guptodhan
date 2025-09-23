import { SliderController } from "@/lib/modules/slider-form/sliderForm.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(SliderController.getAllSliders);
export const POST = catchAsync(SliderController.createSlider);