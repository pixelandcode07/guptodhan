import { catchAsync } from '@/lib/middlewares/catchAsync';
import { VendorController } from '@/lib/modules/vendors/vendor.controller';

export const GET = catchAsync(VendorController.getAllVendors);