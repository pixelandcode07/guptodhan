import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
import { VendorController } from '@/lib/modules/vendors/vendor.controller';

export const PATCH = catchAsync(checkRole(['admin'])(VendorController.updateVendor));