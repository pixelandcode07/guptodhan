import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
import { VendorController } from '@/lib/modules/vendors/vendor.controller';

/**
 * @description Get all vendors (Admin Only)
 * @method GET
 */
export const GET = catchAsync(checkRole(['admin'])(VendorController.getAllVendors));