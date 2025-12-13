import { z } from "zod";

// Reusable schema for productOptions
const productOptionValidationSchema = z.object({
  productImage: z.string().optional(),

  unit: z.array(z.string()).optional(),
  simType: z.array(z.string()).optional(),
  condition: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),

  stock: z.number().optional(),
  price: z.number().optional(),
  discountPrice: z.number().optional(),
  warranty: z.string().optional(),
});
// Create vendor product validation
export const createVendorProductValidationSchema = z.object({
  // ✅ **পরিবর্তন:** vendorStoreId যোগ করা হয়েছে
  vendorStoreId: z.string().min(1, { message: "Store ID is required." }),

  productId: z.string().min(1, { message: "Product ID is required." }),
  productTitle: z.string().min(1, { message: "Product title is required." }),
  shortDescription: z
    .string()
    .min(1, { message: "Short description is required." })
    .max(255, { message: "Short description cannot exceed 255 characters." }),
  vendorName: z.string().min(1, { message: "Vendor name is required." }),
  fullDescription: z
    .string()
    .min(1, { message: "Full description is required." }),
  specification: z.string().optional(),
  warrantyPolicy: z.string().optional(),
  productTag: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  photoGallery: z
    .array(z.string())
    .min(1, { message: "At least one photo is required." }),
  thumbnailImage: z
    .string()
    .min(1, { message: "Thumbnail image is required." }),
  productPrice: z.number(),
  discountPrice: z.number().optional(),
  stock: z.number().optional(),
  sku: z.string().optional(),
  rewardPoints: z.number().optional(),
  category: z.string().min(1, { message: "Category ID is required." }),
  subCategory: z.string().optional(),
  childCategory: z.string().optional(),
  brand: z.string().optional(),
  productModel: z.string().optional(),
  flag: z.string().optional(),
  warranty: z.string().min(1, { message: "Warranty is required." }),
  weightUnit: z.string().optional(),
  offerDeadline: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .optional(),
  metaTitle: z.string().optional(),
  metaKeyword: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  productOptions: z.array(productOptionValidationSchema).optional(),
  removeThumbnail: z.string().optional(),
  removedPhotoGallery: z.array(z.string()).optional(),
});

// Update vendor product validation
export const updateVendorProductValidationSchema = z.object({
  // ✅ **পরিবর্তন:** vendorStoreId যোগ করা হয়েছে
  vendorStoreId: z.string().optional(),

  productId: z.string().optional(),
  productTitle: z.string().optional(),
  vendorName: z.string().min(1, { message: "Vendor name is required." }),

  shortDescription: z.string().max(255).optional(),
  fullDescription: z.string().optional(),
  specification: z.string().optional(),
  warrantyPolicy: z.string().optional(),
  productTag: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  photoGallery: z.array(z.string()).optional(),
  thumbnailImage: z.string().optional(),
  productPrice: z.number().optional(),
  discountPrice: z.number().optional(),
  stock: z.number().optional(),
  sku: z.string().optional(),
  rewardPoints: z.number().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  childCategory: z.string().optional(),
  brand: z.string().optional(),
  productModel: z.string().optional(),
  flag: z.string().optional(),
  warranty: z.string().optional(),
  weightUnit: z.string().optional(),
  offerDeadline: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .optional(),
  metaTitle: z.string().optional(),
  metaKeyword: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  productOptions: z.array(productOptionValidationSchema).optional(),
});
