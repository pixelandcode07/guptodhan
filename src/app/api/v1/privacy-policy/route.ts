import { PrivacyPolicyController } from '@/lib/modules/privacy-policy/privacy-policy.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Create or update the Privacy Policy. (Admin Only)
 * @method POST
 */
export const POST = catchAsync(checkRole(['admin'])(PrivacyPolicyController.createOrUpdatePolicy));