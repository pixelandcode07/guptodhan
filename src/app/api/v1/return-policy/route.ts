import { ReturnPolicyController } from '@/lib/modules/return-policy/return-policy.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Create or update the Return Policy. (Admin Only)
 * @method POST
 */
export const POST = catchAsync(checkRole(['admin'])(ReturnPolicyController.createOrUpdatePolicy));