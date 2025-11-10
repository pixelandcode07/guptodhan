import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
import { VendorController } from '@/lib/modules/vendors/vendor.controller';

/**
 * @description Update a vendor's status (e.g., approve/reject) (Admin Only)
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(VendorController.updateVendorStatus));

export const DELETE = catchAsync(checkRole(['admin'])(VendorController.deleteVendor));