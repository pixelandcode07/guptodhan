// ফাইল: src/app/api/v1/classifieds/ads/[id]/status/route.ts

import { catchAsync } from '@/lib/middlewares/catchAsync';
import { ClassifiedAdController } from '@/lib/modules/classifieds/ad.controller';

export const PATCH = catchAsync(ClassifiedAdController.updateAdStatus);