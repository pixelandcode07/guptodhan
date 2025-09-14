import { ModelFormController } from "@/lib/modules/product-config/controllers/modelName.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";


export const PATCH = catchAsync(ModelFormController.updateModelForm);

export const DELETE = catchAsync(ModelFormController.deleteModelForm);