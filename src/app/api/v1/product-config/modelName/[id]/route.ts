import { ModelFormController } from "@/lib/modules/product-config/controllers/modelName.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(ModelFormController.updateModelForm));
export const DELETE = catchAsync(checkRole(["admin"])(ModelFormController.deleteModelForm));