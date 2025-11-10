import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { VendorServices } from './vendor.service';
import { updateVendorStatusValidationSchema } from './vendor.validation';
import dbConnect from '@/lib/db';

// Get all vendors
const getAllVendors = async (req: NextRequest) => {
  await dbConnect();
  const result = await VendorServices.getAllVendorsFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendors retrieved successfully!',
    data: result,
  });
};

// Update a vendor's status (Approve/Reject)
const updateVendorStatus = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  
  const { status } = updateVendorStatusValidationSchema.parse(body);

  const result = await VendorServices.updateVendorStatusInDB(id, status);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor status updated successfully!',
    data: result,
  });
};
const deleteVendor = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;

  await VendorServices.deleteVendorFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor and associated user deleted successfully!',
    data: null,
  });
};

export const VendorController = {
  getAllVendors,
  updateVendorStatus,
  deleteVendor,
};