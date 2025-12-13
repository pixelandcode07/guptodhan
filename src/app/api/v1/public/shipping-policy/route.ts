import { ShippingPolicyController } from '@/lib/modules/shipping-policy/shipping-policy.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get the public Shipping Policy.
 * @method GET
 */
export const GET = catchAsync(ShippingPolicyController.getPublicPolicy);