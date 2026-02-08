import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { createVendorProductValidationSchema } from "./vendorProduct.validation";
import { IVendorProduct } from "./vendorProduct.interface";
import dbConnect from "@/lib/db";
import { VendorProductServices } from "./vendorProduct.service";
import { VendorProductModel } from "@/lib/models-index";
import { CacheKeys, deleteCacheKey, deleteCachePattern } from "@/lib/redis/cache-helpers";

// ===================================
// 📝 CREATE VENDOR PRODUCT
// ===================================

const createVendorProduct = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = createVendorProductValidationSchema.parse(body);

    const payload: Partial<IVendorProduct> = {
      ...validatedData,
      vendorStoreId: new Types.ObjectId(validatedData.vendorStoreId),
      category: new Types.ObjectId(validatedData.category),
      subCategory: validatedData.subCategory
        ? new Types.ObjectId(validatedData.subCategory)
        : undefined,
      childCategory: validatedData.childCategory
        ? new Types.ObjectId(validatedData.childCategory)
        : undefined,
      brand: validatedData.brand
        ? new Types.ObjectId(validatedData.brand)
        : undefined,
      productModel: validatedData.productModel
        ? new Types.ObjectId(validatedData.productModel)
        : undefined,
      flag: validatedData.flag
        ? new Types.ObjectId(validatedData.flag)
        : undefined,
      warranty: validatedData.warranty
        ? new Types.ObjectId(validatedData.warranty)
        : undefined,
      weightUnit: validatedData.weightUnit
        ? new Types.ObjectId(validatedData.weightUnit)
        : undefined,
      productOptions: (validatedData.productOptions ?? []).map((option: any) => ({
        productImage: option.productImage || undefined,
        unit: Array.isArray(option.unit)
          ? option.unit
          : option.unit
            ? [option.unit]
            : [],
        simType: Array.isArray(option.simType)
          ? option.simType
          : option.simType
            ? [option.simType]
            : [],
        condition: Array.isArray(option.condition)
          ? option.condition
          : option.condition
            ? [option.condition]
            : [],
        color: Array.isArray(option.color)
          ? option.color
          : option.color
            ? [option.color]
            : [],
        size: Array.isArray(option.size)
          ? option.size
          : option.size
            ? [option.size]
            : [],
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
      message:
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the product.",
      data: null,
    });
  }
};

const getAllVendorProducts = async (req: NextRequest) => {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit"));
  
  const result = await VendorProductServices.getAllVendorProductsFromDB(page, limit);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "All vendor products retrieved successfully!",
    data: result,
  });
};


const getAllVendorProductsNoPagination = async (req: NextRequest) => {
  await dbConnect();
  
  // Direct Service call (No params needed)
  const result = await VendorProductServices.getAllVendorProductsNoPaginationFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "All vendor products retrieved successfully (No Pagination)!",
    data: result,
  });
};

const getActiveVendorProducts = async (req: NextRequest) => {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
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

    // ✅ Prepare payload with proper ObjectId conversions
    const payload: Partial<IVendorProduct> = { ...body };

    if (body.category) payload.category = new Types.ObjectId(body.category);
    if (body.subCategory)
      payload.subCategory = new Types.ObjectId(body.subCategory);
    if (body.childCategory)
      payload.childCategory = new Types.ObjectId(body.childCategory);
    if (body.brand) payload.brand = new Types.ObjectId(body.brand);
    if (body.productModel)
      payload.productModel = new Types.ObjectId(body.productModel);
    if (body.flag) payload.flag = new Types.ObjectId(body.flag);
    if (body.warranty) payload.warranty = new Types.ObjectId(body.warranty);
    if (body.weightUnit)
      payload.weightUnit = new Types.ObjectId(body.weightUnit);
    if (body.vendorStoreId)
      payload.vendorStoreId = new Types.ObjectId(body.vendorStoreId);

    // ✅ Update the product in database
    const updateResult = await VendorProductModel.findByIdAndUpdate(id, payload, {
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

    // ✅ Fetch the updated product with full aggregation pipeline
    // (Same format as GET endpoint for consistency)
    const result = await VendorProductModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      
      // ✅ Lookup category
      {
        $lookup: {
          from: 'categorymodels',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },

      // ✅ Lookup subcategory
      {
        $lookup: {
          from: 'subcategorymodels',
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategory',
        },
      },
      { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },

      // ✅ Lookup child category
      {
        $lookup: {
          from: 'childcategorymodels',
          localField: 'childCategory',
          foreignField: '_id',
          as: 'childCategory',
        },
      },
      { $unwind: { path: '$childCategory', preserveNullAndEmptyArrays: true } },

      // ✅ Lookup brand
      {
        $lookup: {
          from: 'brandmodels',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand',
        },
      },
      { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },

      // ✅ Lookup product model
      {
        $lookup: {
          from: 'productmodels',
          localField: 'productModel',
          foreignField: '_id',
          as: 'productModel',
        },
      },
      { $unwind: { path: '$productModel', preserveNullAndEmptyArrays: true } },

      // ✅ Lookup flag
      {
        $lookup: {
          from: 'productflags',
          localField: 'flag',
          foreignField: '_id',
          as: 'flag',
        },
      },
      { $unwind: { path: '$flag', preserveNullAndEmptyArrays: true } },

      // ✅ Lookup warranty
      {
        $lookup: {
          from: 'productwarrantymodels',
          localField: 'warranty',
          foreignField: '_id',
          as: 'warranty',
        },
      },
      { $unwind: { path: '$warranty', preserveNullAndEmptyArrays: true } },

      // ✅ Lookup weight unit
      {
        $lookup: {
          from: 'productunits',
          localField: 'weightUnit',
          foreignField: '_id',
          as: 'weightUnit',
        },
      },
      { $unwind: { path: '$weightUnit', preserveNullAndEmptyArrays: true } },

      // ✅ Lookup vendor store
      {
        $lookup: {
          from: 'storemodels',
          localField: 'vendorStoreId',
          foreignField: '_id',
          as: 'vendorStoreId',
        },
      },
      { $unwind: { path: '$vendorStoreId', preserveNullAndEmptyArrays: true } },

      // ✅ Lookup colors for productOptions
      {
        $lookup: {
          from: 'productcolors',
          localField: 'productOptions.color',
          foreignField: '_id',
          as: 'colorDetails',
        },
      },

      // ✅ Lookup sizes for productOptions
      {
        $lookup: {
          from: 'productsizes',
          localField: 'productOptions.size',
          foreignField: '_id',
          as: 'sizeDetails',
        },
      },
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

    // ✅ Transform color and size arrays (ObjectIds → names)
    const colorMap = new Map(
      (productDoc.colorDetails || []).map((c: any) => [String(c._id), c.colorName])
    );
    const sizeMap = new Map(
      (productDoc.sizeDetails || []).map((s: any) => [String(s._id), s.name])
    );

    const transformedProduct = {
      ...productDoc,
      productOptions: (productDoc.productOptions || []).map((option: any) => ({
        ...option,
        color: Array.isArray(option.color)
          ? option.color.map((id: any) => colorMap.get(String(id)) || String(id))
          : option.color,
        size: Array.isArray(option.size)
          ? option.size.map((id: any) => sizeMap.get(String(id)) || String(id))
          : option.size,
      })),
    };

    // ✅ Remove temporary lookup fields
    delete transformedProduct.colorDetails;
    delete transformedProduct.sizeDetails;

    // ✅ Clear cache after update
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

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the product.",
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

const getOfferProducts = async () => {
  await dbConnect();
  const result = await VendorProductServices.getOfferProductsFromDB();

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

export const VendorProductController = {
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

  getAllVendorProductsNoPagination,
  getVendorStoreAndProducts,
  getVendorStoreAndProductsVendorDashboard,
  getVendorStoreProductsWithReviews,
};