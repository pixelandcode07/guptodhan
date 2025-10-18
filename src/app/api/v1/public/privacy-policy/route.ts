import { PrivacyPolicyController } from '@/lib/modules/privacy-policy/privacy-policy.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get the public Privacy Policy.
 * @method GET
 */
export const GET = catchAsync(PrivacyPolicyController.getPublicPolicy);