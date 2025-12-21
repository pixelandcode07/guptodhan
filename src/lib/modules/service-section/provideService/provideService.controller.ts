import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { ServiceServices } from "./provideService.service";
import { createServiceValidationSchema, updateServiceValidationSchema } from "./provideService.validation";
import dbConnect from "@/lib/db";

// Provider: Create a new service
const createService = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createServiceValidationSchema.parse(body);
  const result = await ServiceServices.createServiceInDB(validatedData);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Service created successfully!",
    data: result,
  });
};

// Provider: Get all services for a provider
const getProviderServices = async (req: NextRequest, { params }: { params: { provider_id: string } }) => {
  await dbConnect();
  const { provider_id } = params;
  const result = await ServiceServices.getProviderServicesFromDB(provider_id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Provider services retrieved successfully!",
    data: result,
  });
};

// get a single service by ID
const getServiceById = async (req: NextRequest, { params }: { params: { service_id: string } }) => {
  await dbConnect();
  const service = await ServiceServices.getServiceByIdFromDB(params.service_id);
  return sendResponse({ success: true, statusCode: 200, message: "Service retrieved successfully!", data: service });
};


// Provider: Update a service
const updateService = async (req: NextRequest, { params }: { params: { service_id: string } }) => {
  await dbConnect();
  const { service_id } = params;
  const body = await req.json();
  const validatedData = updateServiceValidationSchema.parse(body);
  const result = await ServiceServices.updateServiceInDB(service_id, validatedData);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Service updated successfully!",
    data: result,
  });
};

// Provider: Delete a service
const deleteService = async (req: NextRequest, { params }: { params: { service_id: string; provider_id: string } }) => {
  await dbConnect();
  const { service_id, provider_id } = params;
  const result = await ServiceServices.deleteServiceInDB(service_id, provider_id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Service deleted successfully!",
    data: result,
  });
};

// Admin: Get all services
const getAllServices = async () => {
  await dbConnect();
  const result = await ServiceServices.getAllServicesFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "All services retrieved successfully!",
    data: result,
  });
};

// Admin: Change service status
const changeServiceStatus = async (req: NextRequest, { params }: { params: { service_id: string } }) => {
  await dbConnect();
  const { service_id } = params;
  const body = await req.json();
  const { status, is_visible_to_customers } = body;
  const result = await ServiceServices.changeServiceStatusInDB(service_id, status, is_visible_to_customers);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Service status updated successfully!",
    data: result,
  });
};

// Public: Get visible services
const getVisibleServices = async () => {
  await dbConnect();
  const result = await ServiceServices.getVisibleServicesFromDB();
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Visible services retrieved successfully!",
    data: result,
  });
};

// -----------------------
// Export Controller Object
// -----------------------
export const ServiceController = {
  createService,
  getProviderServices,
  updateService,
  deleteService,
  getServiceById,
  getAllServices,
  changeServiceStatus,
  getVisibleServices,
};
