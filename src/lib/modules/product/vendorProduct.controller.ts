import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { VendorProductServices } from "./vendorProduct.service";
import { sendResponse } from "@/lib/utils/sendResponse";
import { createVendorProductValidationSchema } from "./vendorProduct.validation";
import { IVendorProduct } from "./vendorProduct.interface";
import dbConnect from "@/lib/db";

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
      productOptions: (validatedData.productOptions ?? []).map((option) => ({
        ...option,
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

const getAllVendorProducts = async () => {
  await dbConnect();
  const result = await VendorProductServices.getAllVendorProductsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "All vendor products retrieved successfully!",
    data: result,
  });
};

const getActiveVendorProducts = async () => {
  await dbConnect();
  const result = await VendorProductServices.getActiveVendorProductsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Active vendor products retrieved successfully!",
    data: result,
  });
};

const getVendorProductById = async (
  req: NextRequest,
  { params }: { params: { id: string } }
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
<<<<<<< HEAD
  { params }: { params: { categoryId: string } }
) => {
  await dbConnect();
  const result = await VendorProductServices.getVendorProductsByCategoryFromDB(
    params.categoryId
  );
=======
  context: { params: Promise<{ id: string }> } // Next.js App Router e params Promise
) => {
  await dbConnect();

  // Unwrap the params promise
  const resolvedParams = await context.params;
  const categoryId = resolvedParams.id;

  console.log("Category ID:", categoryId);

  // Call service
  const result = await VendorProductServices.getVendorProductsByCategoryFromDB(categoryId);
>>>>>>> de22851d1eba8bd65456e99a63faf844636fca89

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category products retrieved successfully!",
    data: result,
  });
};

const getVendorProductsBySubCategory = async (
  req: NextRequest,
  { params }: { params: { subCategoryId: string } }
) => {
  await dbConnect();
  const result =
    await VendorProductServices.getVendorProductsBySubCategoryFromDB(
      params.subCategoryId
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
  { params }: { params: { childCategoryId: string } }
) => {
  await dbConnect();
  const result =
    await VendorProductServices.getVendorProductsByChildCategoryFromDB(
      params.childCategoryId
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
  { params }: { params: { brandId: string } }
) => {
  await dbConnect();
  const result = await VendorProductServices.getVendorProductsByBrandFromDB(
    params.brandId
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
  { params }: { params: { id: string } }
) => {
  try {
    await dbConnect();
    const body = await req.json();

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

    const result = await VendorProductServices.updateVendorProductInDB(
      params.id,
      payload
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
      message: "Vendor product updated successfully!",
      data: result,
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
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const result = await VendorProductServices.deleteVendorProductFromDB(
    params.id
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
    message: "Vendor product deleted successfully!",
    data: result,
  });
};

const addProductOption = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await dbConnect();
    const body = await req.json();

    const result = await VendorProductServices.addProductOptionInDB(
      params.id,
      body
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
  { params }: { params: { id: string; optionIndex: string } }
) => {
  try {
    await dbConnect();
    const optionIndex = parseInt(params.optionIndex);

    const result = await VendorProductServices.removeProductOptionFromDB(
      params.id,
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
  const searchTerm = searchParams.get("q") || "";

  if (!searchTerm) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Search term is required!",
      data: null,
    });
  }

  const result = await VendorProductServices.searchVendorProductsFromDB(
    searchTerm
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Search results retrieved successfully!",
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
};
