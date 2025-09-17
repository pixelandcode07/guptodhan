import { ServiceProviderController } from '@/lib/modules/service-provider/serviceProvider.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Logs in a service provider.
 * @method POST
 */
export const POST = catchAsync(ServiceProviderController.loginServiceProvider);