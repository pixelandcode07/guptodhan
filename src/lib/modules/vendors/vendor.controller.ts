// src/lib/modules/vendors/vendor.controller.ts
// ✅ OPTIMIZED: Better error handling, proper validation, improved performance

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { VendorServices } from './vendor.service';
import { updateVendorStatusValidationSchema, updateVendorValidationSchema } from './vendor.validation';
import dbConnect from '@/lib/db';

// ================================================================
// 📋 GET ALL VENDORS
// ================================================================

const getAllVendors = async (req: NextRequest) => {
  try {
    await dbConnect();
    
    const result = await VendorServices.getAllVendorsFromDB();

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Vendors retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in getAllVendors:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve vendors',
      data: null,
    });
  }
};

// ================================================================
// 🔍 GET SINGLE VENDOR BY ID
// ================================================================

const getVendorById = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    const { id } = await params;

    // Validate ID format
    if (!id || id.length !== 24) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid vendor ID format',
        data: null,
      });
    }

    const result = await VendorServices.getVendorByIdFromDB(id);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Vendor retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in getVendorById:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: error.message || 'Vendor not found',
      data: null,
    });
  }
};

// ================================================================
// ✏️ UPDATE VENDOR
// ================================================================

const updateVendor = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    const { id } = await params;

    // Validate ID format
    if (!id || id.length !== 24) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid vendor ID format',
        data: null,
      });
    }

    const body = await req.json();

    // Validate data
    const validatedData = updateVendorValidationSchema.parse(body);
    
    // Parse businessCategory if it's a string
    if (validatedData.businessCategory && typeof validatedData.businessCategory === 'string') {
      try {
        validatedData.businessCategory = JSON.parse(validatedData.businessCategory as any);
      } catch (err) {
        return sendResponse({
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Invalid businessCategory format',
          data: null,
        });
      }
    }

    const result = await VendorServices.updateVendorInDB(id, validatedData);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Vendor updated successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in updateVendor:', error);
    return sendResponse({
      success: false,
      statusCode: error.message?.includes('Vendor not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to update vendor',
      data: null,
    });
  }
};

// ================================================================
// 🔄 UPDATE VENDOR STATUS
// ================================================================

const updateVendorStatus = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    const { id } = await params;

    // Validate ID format
    if (!id || id.length !== 24) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid vendor ID format',
        data: null,
      });
    }

    const body = await req.json();

    // Validate status
    const { status } = updateVendorStatusValidationSchema.parse(body);

    const result = await VendorServices.updateVendorStatusInDB(id, status);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: `Vendor status updated to ${status} successfully!`,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in updateVendorStatus:', error);
    return sendResponse({
      success: false,
      statusCode: error.message?.includes('Vendor not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to update vendor status',
      data: null,
    });
  }
};

// ================================================================
// 🗑️ DELETE VENDOR
// ================================================================

const deleteVendor = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    const { id } = await params;

    // Validate ID format
    if (!id || id.length !== 24) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid vendor ID format',
        data: null,
      });
    }

    await VendorServices.deleteVendorFromDB(id);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Vendor and associated user deleted successfully!',
      data: null,
    });
  } catch (error: any) {
    console.error('Error in deleteVendor:', error);
    return sendResponse({
      success: false,
      statusCode: error.message?.includes('Vendor not found') ? StatusCodes.NOT_FOUND : StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to delete vendor',
      data: null,
    });
  }
};

// ================================================================
// 🔍 GET VENDORS BY STATUS
// ================================================================

const getVendorsByStatus = async (req: NextRequest) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid status. Must be: pending, approved, or rejected',
        data: null,
      });
    }

    const result = await VendorServices.getVendorsByStatusFromDB(status);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: `${status.charAt(0).toUpperCase() + status.slice(1)} vendors retrieved successfully!`,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in getVendorsByStatus:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve vendors',
      data: null,
    });
  }
};

// ================================================================
// 🔍 GET VENDORS BY CATEGORY
// ================================================================

const getVendorsByCategory = async (req: NextRequest) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    if (!category) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Category parameter is required',
        data: null,
      });
    }

    const result = await VendorServices.getVendorsByCategoryFromDB(category);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: `Vendors in ${category} category retrieved successfully!`,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in getVendorsByCategory:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve vendors',
      data: null,
    });
  }
};

// ================================================================
// 🔍 SEARCH VENDORS
// ================================================================

const searchVendors = async (req: NextRequest) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Search query is required',
        data: null,
      });
    }

    const result = await VendorServices.searchVendorsFromDB(query);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Search results retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in searchVendors:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Search failed',
      data: null,
    });
  }
};

// ================================================================
// 📊 GET VENDOR STATISTICS
// ================================================================

const getVendorStats = async (req: NextRequest) => {
  try {
    await dbConnect();

    const result = await VendorServices.getVendorStatsFromDB();

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Vendor statistics retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in getVendorStats:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve statistics',
      data: null,
    });
  }
};

// ================================================================
// 📤 EXPORTS
// ================================================================

export const VendorController = {
  getAllVendors,
  getVendorById,
  updateVendor,
  updateVendorStatus,
  deleteVendor,
  getVendorsByStatus,
  getVendorsByCategory,
  searchVendors,
  getVendorStats,
};