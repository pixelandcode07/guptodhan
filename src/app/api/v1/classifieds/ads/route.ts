
import { ClassifiedAdController } from '@/lib/modules/classifieds/ad.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(ClassifiedAdController.getAllAds);
export const POST = catchAsync(ClassifiedAdController.createAd);