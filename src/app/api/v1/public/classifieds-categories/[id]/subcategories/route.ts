import { NextRequest } from "next/server";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { ClassifiedSubCategoryController } from "@/lib/modules/classifieds-subcategory/subcategory.controller";

export const GET = catchAsync(async (req: NextRequest, context: any) => {
  return ClassifiedSubCategoryController.getSubCategoriesByParent(req, context);
});
