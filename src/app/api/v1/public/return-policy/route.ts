import { ReturnPolicyController } from '@/lib/modules/return-policy/return-policy.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get the public Return Policy.
 * @method GET
 */
export const GET = catchAsync(ReturnPolicyController.getPublicPolicy);