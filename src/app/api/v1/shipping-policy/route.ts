import { ShippingPolicyController } from '@/lib/modules/shipping-policy/shipping-policy.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Create or update the Shipping Policy. (Admin Only)
 * @method POST
 */
export const POST = catchAsync(checkRole(['admin'])(ShippingPolicyController.createOrUpdatePolicy));