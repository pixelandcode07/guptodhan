import { TestimonialController } from '@/lib/modules/testimonial/testimonial.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(TestimonialController.getAllTestimonials);
export const POST = catchAsync(TestimonialController.createTestimonial);
