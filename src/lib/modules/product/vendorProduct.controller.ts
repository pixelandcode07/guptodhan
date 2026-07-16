import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { createVendorProductValidationSchema, updateVendorProductValidationSchema } from "./vendorProduct.validation";
import { IVendorProduct } from "./vendorProduct.interface";
import dbConnect from "@/lib/db";
import { VendorProductServices } from "./vendorProduct.service";
import { VendorProductModel } from "@/lib/models-index";
import { CacheKeys, deleteCacheKey, deleteCachePattern } from "@/lib/redis/cache-helpers";
import slugify from "slugify";

// ===================================
// 📝 CREATE VENDOR PRODUCT
// ===================================

const createVendorProduct = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = createVendorProductValidationSchema.parse(body);

    const baseSlug = slugify(validatedData.productTitle, {
      lower: true,
      strict: true,
      trim: true
    });

    const uniqueSuffix = `${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 1000)}`;
    const finalSlug = `${baseSlug}-${uniqueSuffix}`;

    // ✅ MAGIC FIX: TypeScript Error Solution using Destructuring
    // আলাদা করে নিচ্ছি যাতে string ও null ভ্যালুগুলো সরাসরি interface-এর সাথে conflict না করে
    const {
      vendorStoreId,
      category,
      subCategory,
      childCategory,
      brand,
      productModel,
      flag,
      warranty,
      weightUnit,
      offerDeadline,
      productOptions,
      ...restData
    } = validatedData;

    const payload: Partial<IVendorProduct> = {
      ...restData,
      slug: finalSlug,
      callForPrice: restData.callForPrice || false,
      
      // null আসলে undefined সেট করছি যাতে Interface (TS) খুশি থাকে
      offerDeadline: offerDeadline === null ? undefined : offerDeadline,

      // String থেকে ObjectId তে কনভার্ট করছি
      vendorStoreId: new Types.ObjectId(vendorStoreId),
      category: new Types.ObjectId(category),
      subCategory: subCategory ? new Types.ObjectId(subCategory) : undefined,
      childCategory: childCategory ? new Types.ObjectId(childCategory) : undefined,
      brand: brand ? new Types.ObjectId(brand) : undefined,
      productModel: productModel ? new Types.ObjectId(productModel) : undefined,
      flag: flag ? new Types.ObjectId(flag) : undefined,
      warranty: warranty ? new Types.ObjectId(warranty) : undefined,
      weightUnit: weightUnit ? new Types.ObjectId(weightUnit) : undefined,
      
      productOptions: (productOptions ?? []).map((option: any) => ({
        productImage: option.productImage || undefined,
        unit: Array.isArray(option.unit) ? option.unit : option.unit ? [option.unit] : [],
        simType: option.simType 
          ? (Array.isArray(option.simType) ? option.simType.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.simType)])
          : [],
        condition: option.condition
          ? (Array.isArray(option.condition) ? option.condition.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.condition)])
          : [],
        color: option.color
          ? (Array.isArray(option.color) ? option.color.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.color)])
          : [],
        size: option.size
          ? (Array.isArray(option.size) ? option.size.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.size)])
          : [],
        country: option.country
          ? (Array.isArray(option.country) ? option.country.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.country)])
          : [],
        storage: option.storage || undefined,
        warranty: option.warranty || undefined,
        stock: option.stock || undefined,
        price: option.price || undefined,
        discountPrice: option.discountPrice || undefined,
      })),
    };

    const result = await VendorProductServices.createVendorProductInDB(payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Vendor product created successfully!",
      data: result,
    });
  } catch (err) {
    console.error("Error creating vendor product:", err);

    if (err instanceof ZodError) {
      const errorMessages = err.issues.map((issue) => {
        const field = issue.path.join(".");
        return `${field}: ${issue.message}`;
      });

      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: errorMessages.join("; "),
        data: err.issues,
      });
    }

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err instanceof Error ? err.message : "Something went wrong while saving the product.",
      data: null,
    });
  }
};

const getAllVendorProducts = async (req: NextRequest) => {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  // 🔥 FIX: যদি limit প্যারামিটার না থাকে বা 0 হয়, তবে ডিফল্ট 20 হবে
  const limit = Number(searchParams.get("limit")) || 20; 
  
  const result = await VendorProductServices.getAllVendorProductsFromDB(page, limit);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "All vendor products retrieved successfully!",
    data: result,
  });
};


const getAllVendorProductsWithPagination = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const params = {
    page:     Number(searchParams.get('page'))     || 1,
    limit:    Number(searchParams.get('limit'))    || 10,
    search:   searchParams.get('search')           || undefined,
    brand:    searchParams.get('brand')            || undefined,
    color:    searchParams.get('color')            || undefined,
    size:     searchParams.get('size')             || undefined,
    priceMin: Number(searchParams.get('priceMin')) || undefined,
    priceMax: Number(searchParams.get('priceMax')) || undefined,
    sortBy:   searchParams.get('sortBy')           || 'createdAt',
  };

  const result = await VendorProductServices.getAllVendorProductsWithPaginationFromDB(params);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Products retrieved!',
    data: result,
  });
};

const getActiveVendorProducts = async (req: NextRequest) => {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  // 🔥 FIX: এখানেও limit ফিক্স করা হলো
  const limit = Number(searchParams.get("limit")) || 20;
  
  const result = await VendorProductServices.getActiveVendorProductsFromDB(page, limit);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Active vendor products retrieved successfully!",
    data: result,
  });
};

const getVendorProductById = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;

  const result = await VendorProductServices.getVendorProductByIdFromDB(id);

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: "Product not found!",
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vendor product retrieved successfully!",
    data: result,
  });
};


const getVendorProductsByCategory = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const filters = {
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    subCategory: searchParams.get("subCategory") || undefined,
    childCategory: searchParams.get("childCategory") || undefined,
    brand: searchParams.get("brand") || undefined,
    search: searchParams.get("search") || undefined,
    sort: searchParams.get("sort") || undefined,
  };

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const resolvedParams = await context.params;
  const categoryId = resolvedParams.id;

  const result = await VendorProductServices.getVendorProductsByCategoryFromDB(
    categoryId,
    filters,
    page,
    limit
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category products retrieved successfully!",
    data: result,
  });
};

const getVendorProductsBySubCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ subCategoryId: string }> }
) => {
  await dbConnect();
  const { subCategoryId } = await params;
  
  const { searchParams } = new URL(req.url);
  
  const filters = {
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    brand: searchParams.get("brand") || undefined,
    childCategory: searchParams.get("childCategory") || undefined,
    search: searchParams.get("search") || undefined,
    sort: searchParams.get("sort") || undefined,
  };

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  
  const result = await VendorProductServices.getVendorProductsBySubCategoryFromDB(
    subCategoryId,
    filters,
    page,
    limit
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Sub-category products retrieved successfully!",
    data: result,
  });
};

const getVendorProductsByChildCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ childCategoryId: string }> }
) => {
  await dbConnect();
  const { childCategoryId } = await params;
  
  const { searchParams } = new URL(req.url);
  
  const filters = {
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    brand: searchParams.get("brand") || undefined,
    subCategory: searchParams.get("subCategory") || undefined,
    search: searchParams.get("search") || undefined,
    sort: searchParams.get("sort") || undefined,
  };
  
  const result = await VendorProductServices.getVendorProductsByChildCategoryFromDB(
    childCategoryId,
    filters
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Child-category products retrieved successfully!",
    data: result,
  });
};

const getVendorProductsByBrand = async (
  req: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) => {
  await dbConnect();
  const { brandId } = await params;
  
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  
  const result = await VendorProductServices.getVendorProductsByBrandFromDB(
    brandId,
    page,
    limit
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Brand products retrieved successfully!",
    data: result,
  });
};

const updateVendorProduct = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const validatedData = updateVendorProductValidationSchema.parse(body);

    // ✅ MAGIC FIX: TypeScript Error Solution using Destructuring
    const {
      vendorStoreId,
      category,
      subCategory,
      childCategory,
      brand,
      productModel,
      flag,
      warranty,
      weightUnit,
      offerDeadline,
      productOptions,
      ...restData
    } = validatedData;

    // Use `any` for Mongoose query to support $unset and operators
    const updateQuery: any = { $set: { ...restData } };
    
    // offerDeadline null আসলে ডাটাবেস থেকে রিমুভ করে দাও
    if (offerDeadline === null) {
      updateQuery.$unset = { offerDeadline: 1 };
    } else if (offerDeadline !== undefined) {
      updateQuery.$set.offerDeadline = offerDeadline;
    }

    // Convert strings to ObjectIds manually
    if (vendorStoreId) updateQuery.$set.vendorStoreId = new Types.ObjectId(vendorStoreId);
    if (category) updateQuery.$set.category = new Types.ObjectId(category);
    if (subCategory) updateQuery.$set.subCategory = new Types.ObjectId(subCategory);
    if (childCategory) updateQuery.$set.childCategory = new Types.ObjectId(childCategory);
    if (brand) updateQuery.$set.brand = new Types.ObjectId(brand);
    if (productModel) updateQuery.$set.productModel = new Types.ObjectId(productModel);
    if (flag) updateQuery.$set.flag = new Types.ObjectId(flag);
    if (warranty) updateQuery.$set.warranty = new Types.ObjectId(warranty);
    if (weightUnit) updateQuery.$set.weightUnit = new Types.ObjectId(weightUnit);
    
    if (productOptions && Array.isArray(productOptions)) {
      updateQuery.$set.productOptions = productOptions.map((option: any) => ({
        productImage: option.productImage || undefined,
        unit: Array.isArray(option.unit) ? option.unit : option.unit ? [option.unit] : [],
        simType: option.simType 
          ? (Array.isArray(option.simType) ? option.simType.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.simType)])
          : [],
        condition: option.condition
          ? (Array.isArray(option.condition) ? option.condition.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.condition)])
          : [],
        color: option.color
          ? (Array.isArray(option.color) ? option.color.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.color)])
          : [],
        size: option.size
          ? (Array.isArray(option.size) ? option.size.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.size)])
          : [],
        country: option.country
          ? (Array.isArray(option.country) ? option.country.map((id: string) => new Types.ObjectId(id)) : [new Types.ObjectId(option.country)])
          : [],
        storage: option.storage || undefined,
        warranty: option.warranty || undefined,
        stock: option.stock || undefined,
        price: option.price || undefined,
        discountPrice: option.discountPrice || undefined,
      }));
    }

    const updateResult = await VendorProductModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!updateResult) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Product not found!",
        data: null,
      });
    }

    const result = await VendorProductModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      
      { $lookup: { from: 'categorymodels', localField: 'category', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },

      { $lookup: { from: 'subcategorymodels', localField: 'subCategory', foreignField: '_id', as: 'subCategory' } },
      { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },

      { $lookup: { from: 'childcategorymodels', localField: 'childCategory', foreignField: '_id', as: 'childCategory' } },
      { $unwind: { path: '$childCategory', preserveNullAndEmptyArrays: true } },

      { $lookup: { from: 'brandmodels', localField: 'brand', foreignField: '_id', as: 'brand' } },
      { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },

      { $lookup: { from: 'productmodels', localField: 'productModel', foreignField: '_id', as: 'productModel' } },
      { $unwind: { path: '$productModel', preserveNullAndEmptyArrays: true } },

      { $lookup: { from: 'productflags', localField: 'flag', foreignField: '_id', as: 'flag' } },
      { $unwind: { path: '$flag', preserveNullAndEmptyArrays: true } },

      { $lookup: { from: 'productwarrantymodels', localField: 'warranty', foreignField: '_id', as: 'warranty' } },
      { $unwind: { path: '$warranty', preserveNullAndEmptyArrays: true } },

      { $lookup: { from: 'productunits', localField: 'weightUnit', foreignField: '_id', as: 'weightUnit' } },
      { $unwind: { path: '$weightUnit', preserveNullAndEmptyArrays: true } },

      { $lookup: { from: 'storemodels', localField: 'vendorStoreId', foreignField: '_id', as: 'vendorStoreId' } },
      { $unwind: { path: '$vendorStoreId', preserveNullAndEmptyArrays: true } },

      { $lookup: { from: 'productcolors', localField: 'productOptions.color', foreignField: '_id', as: 'colorDetails' } },
      { $lookup: { from: 'productsizes', localField: 'productOptions.size', foreignField: '_id', as: 'sizeDetails' } },
    ]);

    if (!result || !result[0]) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Failed to fetch updated product!",
        data: null,
      });
    }

    const productDoc = result[0];

    const colorMap = new Map((productDoc.colorDetails || []).map((c: any) => [String(c._id), c.colorName]));
    const sizeMap = new Map((productDoc.sizeDetails || []).map((s: any) => [String(s._id), s.name]));

    const transformedProduct = {
      ...productDoc,
      productOptions: (productDoc.productOptions || []).map((option: any) => ({
        ...option,
        color: Array.isArray(option.color) ? option.color.map((id: any) => colorMap.get(String(id)) || String(id)) : option.color,
        size: Array.isArray(option.size) ? option.size.map((id: any) => sizeMap.get(String(id)) || String(id)) : option.size,
      })),
    };

    delete transformedProduct.colorDetails;
    delete transformedProduct.sizeDetails;

    await deleteCacheKey(CacheKeys.PRODUCT.BY_ID(id));
    await deleteCachePattern(CacheKeys.PATTERNS.PRODUCTS_ALL);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: "Vendor product updated successfully!",
      data: transformedProduct,
    });
  } catch (err) {
    console.error("Error updating vendor product:", err);

    if (err instanceof ZodError) {
      const errorMessages = err.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: errorMessages.join("; "),
        data: err.issues,
      });
    }

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err instanceof Error ? err.message : "Something went wrong while updating the product.",
      data: null,
    });
  }
};


const deleteVendorProduct = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const result = await VendorProductServices.deleteVendorProductFromDB(id);

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: "Product not found!",
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vendor product deleted successfully!",
    data: result,
  });
};

const addProductOption = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const result = await VendorProductServices.addProductOptionInDB(id, body);

    if (!result) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Product not found!",
        data: null,
      });
    }

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product option added successfully!",
      data: result,
    });
  } catch (err) {
    console.error("Error adding product option:", err);

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        err instanceof Error
          ? err.message
          : "Something went wrong while adding the option.",
      data: null,
    });
  }
};

const removeProductOption = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string; optionIndex: string }> }
) => {
  try {
    await dbConnect();
    const { id, optionIndex: optionIndexStr } = await params;
    const optionIndex = parseInt(optionIndexStr);

    const result = await VendorProductServices.removeProductOptionFromDB(
      id,
      optionIndex
    );

    if (!result) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Product not found!",
        data: null,
      });
    }

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product option removed successfully!",
      data: result,
    });
  } catch (err) {
    console.error("Error removing product option:", err);

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        err instanceof Error
          ? err.message
          : "Something went wrong while removing the option.",
      data: null,
    });
  }
};

const getLandingPageProducts = async () => {
  await dbConnect();
  const result = await VendorProductServices.getLandingPageProductsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Home page products retrieved successfully!",
    data: result,
  });
};

const searchVendorProducts = async (req: NextRequest) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("q")?.trim() || "";
  const type = searchParams.get("type") || "results";

  if (!searchTerm) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Search term is required!",
      data: null,
    });
  }

  let data;
  if (type === "suggestion") {
    data = await VendorProductServices.getLiveSuggestionsFromDB(searchTerm);
  } else {
    data = await VendorProductServices.getSearchResultsFromDB(searchTerm);
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message:
      type === "suggestion"
        ? "Suggestions retrieved successfully!"
        : "Search results retrieved successfully!",
    data,
  });
};

const getOfferProducts = async (req: NextRequest) => {
  await dbConnect();

  // ✅ FIX: URL থেকে limit রিসিভ করা হচ্ছে, ডিফল্ট 6 রাখা হয়েছে
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  const result = await VendorProductServices.getOfferProductsFromDB(limit);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Offer products retrieved successfully!",
    data: result,
  });
};

const getBestSellingProducts = async () => {
  await dbConnect();
  const result = await VendorProductServices.getBestSellingProductsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Best selling products retrieved successfully!",
    data: result,
  });
};

const getForYouProducts = async () => {
  await dbConnect();
  const result = await VendorProductServices.getForYouProductsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "For You products retrieved successfully!",
    data: result,
  });
};

const getVendorProductsByVendorId = async (
  req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) => {
  await dbConnect();
  const { vendorId } = await params;
  
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const result = await VendorProductServices.getVendorProductsByVendorIdFromDB(
    vendorId,
    page,
    limit
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vendor products retrieved successfully!",
    data: result,
  });
};

const getVendorStoreAndProducts = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = await params;

  const query = Object.fromEntries(req.nextUrl.searchParams.entries());

  const result = await VendorProductServices.getVendorStoreAndProductsFromDB(
    id,
    query
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vendor store & products retrieved successfully!",
    data: result,
  });
};

const getVendorStoreAndProductsVendorDashboard = async (
  req: NextRequest,
  { params }: { params: { vendorId: string } }
) => {
  await dbConnect();
  const { vendorId } = await params;

  const result = await VendorProductServices.getVendorStoreAndProductsFromDBVendorDashboard(
    vendorId
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vendor store & products retrieved successfully!",
    data: result,
  });
};

const getVendorStoreProductsWithReviews = async (
  req: NextRequest,
  { params }: { params: { vendorId: string } }
) => {
  await dbConnect();

  const { vendorId } = await params;

  const result =
    await VendorProductServices.getVendorStoreProductsWithReviewsFromDB(
      vendorId
    );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vendor store products with reviews retrieved successfully!",
    data: result,
  });
};


const getVendorProductBySlug = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // Next.js 15 এ params একটি Promise
) => {
  await dbConnect();
  const { slug } = await params;

  // সার্ভিস কল করা হচ্ছে (যেটা আপনি অলরেডি বানিয়েছেন)
  const result = await VendorProductServices.getVendorProductBySlugFromDB(slug);

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: "Product not found!",
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Product retrieved successfully by slug!",
    data: result,
  });
};

// ================================================================
// 🧠 GET JUST FOR YOU PRODUCTS (ALGORITHM BASED)
// ================================================================
const getJustForYouProducts = async (req: NextRequest) => {
  await dbConnect();
  
  // URL থেকে limit রিসিভ করছি, ডিফল্ট 60
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '60', 10);

  const result = await VendorProductServices.getJustForYouProductsFromDB(limit);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Just For You recommendations retrieved successfully!",
    data: result,
  });
};





export const VendorProductController = {
  getJustForYouProducts,
  createVendorProduct,
  getAllVendorProducts,
  getActiveVendorProducts,
  getVendorProductById,
  getVendorProductsByCategory,
  getVendorProductsBySubCategory,
  getVendorProductsByChildCategory,
  getVendorProductsByBrand,
  updateVendorProduct,
  deleteVendorProduct,
  addProductOption,
  removeProductOption,
  getLandingPageProducts,
  searchVendorProducts,
  getVendorProductsByVendorId,

  getOfferProducts,
  getBestSellingProducts,
  getForYouProducts,
  getVendorProductBySlug,
  getAllVendorProductsWithPagination,
  getVendorStoreAndProducts,
  getVendorStoreAndProductsVendorDashboard,
  getVendorStoreProductsWithReviews,
};