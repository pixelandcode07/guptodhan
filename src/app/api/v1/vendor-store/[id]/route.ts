import { VendorStoreController } from "@/lib/modules/vendor-store/vendorStore.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { NextRequest } from "next/server";

export const GET = catchAsync(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { params } = context;
    const { id } = await params;
    return VendorStoreController.getStoreById(req, { params: { id } });
  }
);

export const PATCH = catchAsync(VendorStoreController.updateStore);
export const DELETE = catchAsync(VendorStoreController.deleteStore);
