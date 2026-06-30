import { ServiceController } from "@/lib/modules/service-section/provideService/provideService.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
// import { checkRole } from "@/lib/middlewares/checkRole"; // ❌ Removed role check

export const GET = catchAsync(ServiceController.getAllServices);

// ✅ FIX 3: allow any authenticated user to create a service request
export const POST = catchAsync(ServiceController.createService);