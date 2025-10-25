import {ModelFormController} from "@/lib/modules/product-config/controllers/modelName.controller";
import {catchAsync} from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(checkRole(["admin"])(ModelFormController.getAllModelForms));
export const POST = catchAsync(checkRole(["admin"])(ModelFormController.createModelForm));