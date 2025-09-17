import { ServiceProviderController } from '@/lib/modules/service-provider/serviceProvider.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description একটি নির্দিষ্ট সার্ভিস প্রোভাইডারের পাবলিক প্রোফাইল ডেটা প্রদান করে।
 * @method GET
 */
export const GET = catchAsync(ServiceProviderController.getServiceProviderProfile);