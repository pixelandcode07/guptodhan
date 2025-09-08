// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\product-model\productModel.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createProductModelValidationSchema, updateProductModelValidationSchema } from './productModel.validation';
import { ProductModelServices } from './productModel.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

const createProductModel = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createProductModelValidationSchema.parse(body);
    const payload = { ...validatedData, brand: new Types.ObjectId(validatedData.brand) };
    const result = await ProductModelServices.createProductModelInDB(payload);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Product model created successfully!', data: result });
};

const getModelsByBrand = async (req: NextRequest) => {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');
    if (!brandId) { throw new Error("Brand ID is required to fetch models."); }
    const result = await ProductModelServices.getModelsByBrandFromDB(brandId);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Models retrieved successfully!', data: result });
};

// নতুন: মডেল আপডেট করার জন্য
const updateProductModel = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateProductModelValidationSchema.parse(body);
    const result = await ProductModelServices.updateProductModelInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Product model updated successfully!', data: result });
};

// নতুন: মডেল ডিলিট করার জন্য
const deleteProductModel = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await ProductModelServices.deleteProductModelFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Product model deleted successfully!', data: null });
};

export const ProductModelController = {
    createProductModel,
    getModelsByBrand,
    updateProductModel,
    deleteProductModel,
};