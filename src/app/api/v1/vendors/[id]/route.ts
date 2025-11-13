import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
import { VendorController } from '@/lib/modules/vendors/vendor.controller';
// import { NextRequest } from 'next/server';

/**
 * @description Update a vendor's status (e.g., approve/reject) (Admin Only)
 * @method PATCH
 */

export const GET = catchAsync(checkRole(['admin'])(VendorController.getVendorById));



export const PATCH = catchAsync(checkRole(['admin'])(VendorController.updateVendorStatus));

// export const PATCH = checkRole(['admin'])(
//   catchAsync(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
//     const body = await req.json();

//     if ('status' in body) {
//       return VendorController.updateVendorStatus(req, { params });
//     }

//     return VendorController.updateVendor(req, { params });
//   })
// );

// export const DELETE = catchAsync(checkRole(['admin'])(VendorController.deleteVendor));