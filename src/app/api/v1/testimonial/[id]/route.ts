import { TestimonialController } from '@/lib/modules/testimonial/testimonial.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(TestimonialController.getTestimonialsByProduct);
export const PATCH = catchAsync(TestimonialController.updateTestimonial);
export const DELETE = catchAsync(TestimonialController.deleteTestimonial);
