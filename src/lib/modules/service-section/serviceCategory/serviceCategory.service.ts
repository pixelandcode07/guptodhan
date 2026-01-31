import { IServiceCategory } from "./serviceCategory.interface";
import { ServiceCategoryModel } from "./serviceCategory.model";
import { ServiceModel } from "../provideService/provideService.model";

// Create service category
const createServiceCategoryInDB = async (
  payload: Partial<IServiceCategory>
) => {
  const maxOrderCategory = await ServiceCategoryModel.findOne()
    .sort({ orderCount: -1 })
    .select('orderCount -_id')
    .lean<{ orderCount: number }>();

  const nextOrder =
    maxOrderCategory && typeof maxOrderCategory.orderCount === 'number'
      ? maxOrderCategory.orderCount + 1
      : 0;

  const result = await ServiceCategoryModel.create({
    ...payload,
    orderCount: nextOrder,
  });

  return result;
};

// Get all service categories
const getAllServiceCategoriesFromDB = async () => {
  const result = await ServiceCategoryModel.find({}).sort({ orderCount: -1 });
  return result;
};

// Get single category by ID
const getServiceCategoryByIdFromDB = async (id: string) => {
  const result = await ServiceCategoryModel.findById(id);
  return result;
};

// Get single category by slug
const getServiceCategoryBySlugFromDB = async (slug: string) => {
  const result = await ServiceCategoryModel.findOne({ slug });
  return result;
};

// Update service category
const updateServiceCategoryInDB = async (id: string, payload: Partial<IServiceCategory>) => {
  const result = await ServiceCategoryModel.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new Error("Service Category not found to update.");
  }

  return result;
};

// Delete service category
const deleteServiceCategoryFromDB = async (id: string) => {
  const result = await ServiceCategoryModel.findByIdAndDelete(id);

  if (!result) {
    throw new Error("Service Category not found to delete.");
  }

  return null;
};

// rearrange service categories
export const reorderServiceCategoryService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error("orderedIds array is empty");
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    ServiceCategoryModel.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: "service category reordered successfully!" };
};

interface FilterOptions {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

const getServicesByCategorySlugFromDB = async (
  slug: string,
  filters: FilterOptions
) => {
  // ১. ক্যাটাগরি খোঁজা
  const category = await ServiceCategoryModel.findOne({ slug: slug })
    .select("_id name description") 
    .lean<IServiceCategory>(); 

  if (!category) {
    return {
      category: null,
      total: 0,
      services: [],
    };
  }

  const categoryName = category.name; // ID এর বদলে নাম ব্যবহার করা হচ্ছে

  const query: any = {
    service_category: categoryName, 
    service_status: "Active", 
    is_visible_to_customers: true, 
  };

  // --- Filters ---
  if (filters.search) {
    query.$or = [
      { service_title: { $regex: filters.search, $options: "i" } },
      { service_description: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.location) {
    query.$or = [
      { "service_area.city": { $regex: filters.location, $options: "i" } },
      { "service_area.district": { $regex: filters.location, $options: "i" } },
      { "service_area.thana": { $regex: filters.location, $options: "i" } },
    ];
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.base_price = {};
    if (filters.minPrice !== undefined) query.base_price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.base_price.$lte = filters.maxPrice;
  }

  // ৪. সার্ভিস ফেচ করা (FIXED SELECT QUERY)
  const services = await ServiceModel.find(query)
    .sort({ createdAt: -1 })
    .select(
      // 👇 এখানে available_time_slots এবং working_days যোগ করা হয়েছে
      "service_id service_title base_price service_images service_area average_rating total_bookings estimated_duration_hours pricing_type available_time_slots working_days service_status service_category"
    ) 
    .lean();

  return {
    category: { 
        name: category.name,
        description: category.description
    },
    total: services.length,
    services,
  };
};

export const ServiceCategoryServices = {
  createServiceCategoryInDB,
  getAllServiceCategoriesFromDB,
  getServiceCategoryByIdFromDB,
  getServiceCategoryBySlugFromDB,
  updateServiceCategoryInDB,
  deleteServiceCategoryFromDB,

  reorderServiceCategoryService,
  getServicesByCategorySlugFromDB
};
