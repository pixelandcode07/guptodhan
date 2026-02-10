import { ClassifiedCategoryController } from "@/lib/modules/classifieds-category/category.controller";

// আমরা এখানে catchAsync বা সরাসরি ফাংশন ব্যবহার করতে পারি
// যেহেতু কন্ট্রোলার req, params নিচ্ছে, আমরা সরাসরি কল করব
export const GET = ClassifiedCategoryController.getCategoryPageDataBySlug;