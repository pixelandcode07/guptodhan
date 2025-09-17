import {ModelFormController} from "@/lib/modules/product-config/controllers/modelName.controller";

import {catchAsync} from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ModelFormController.getModelFormsByBrand);

export const POST = catchAsync(ModelFormController.createModelForm);