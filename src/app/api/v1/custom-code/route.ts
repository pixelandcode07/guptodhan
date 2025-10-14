import { CustomCodeController } from '@/lib/modules/custom-code/customCode.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// Admin route to create or update Custom Code
export const POST = catchAsync(checkRole(['admin'])(CustomCodeController.createOrUpdateCode));

/**
 * @description Delete the custom CSS & JS code. (Admin Only)
 * @method DELETE
 */
export const DELETE = catchAsync(checkRole(['admin'])(CustomCodeController.deleteCode));