import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { ServiceServices } from "./provideService.service";
import {
  createServiceValidationSchema,
  updateServiceValidationSchema,
} from "./provideService.validation";
import { verifyToken } from "@/lib/utils/jwt";
import dbConnect from "@/lib/db";
import { uploadToCloudinary } from '@/lib/utils/cloudinary';


// ==========================================
// 🔐 HELPER: Secure User ID & Role Extraction
// ==========================================
const getUserDetailsFromToken = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Authorization token missing or invalid.");
  }
  const token = authHeader.split(" ")[1];
  // Token verify করে userId এবং role বের করা হচ্ছে
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as {
    userId: string;
    role: string;
    profilePicture: string;
  };
  return { userId: decoded.userId, role: decoded.role };
};

// // // Provider: Create a new service
// const createService = async (req: NextRequest) => {
//   await dbConnect();
//   const body = await req.json();
//   const validatedData = createServiceValidationSchema.parse(body);
//   console.log('🟢 Creating service with data:', validatedData);
//   const result = await ServiceServices.createServiceInDB(validatedData);
//   return sendResponse({
//     success: true,
//     statusCode: StatusCodes.CREATED,
//     message: "Service created successfully!",
//     data: result,
//   });
// };

// const createService = async (req: NextRequest) => {
//   await dbConnect();

//   // 🔐 Get userId (provider) from token
//   const { userId } = getUserDetailsFromToken(req);


//   const body = await req.json();
//   const servicePayload = {
//     ...body,
//     provider_id: userId,
//   };

//   // ✅ Validate client-sent service data
//   const validatedData = createServiceValidationSchema.parse(servicePayload);

//   // const result = await ServiceServices.createServiceInDB(servicePayload);
//   const result = await ServiceServices.createServiceInDB(validatedData);

//   return sendResponse({
//     success: true,
//     statusCode: StatusCodes.CREATED,
//     message: "Service created successfully!",
//     data: result,
//   });
// };

// const createService = async (req: NextRequest) => {
//   await dbConnect();

//   // 🔐 Get userId (provider) from token
//   const { userId } = getUserDetailsFromToken(req);

//   // Use FormData instead of JSON
//   const formData = await req.formData();
//   const images = formData.getAll('service_images') as File[]; // multiple images

//   if (!images.length) throw new Error('At least one service image is required.');

//   // Upload images to Cloudinary (or your cloud storage)
//   const uploadResults = await Promise.all(
//     images.map(async (file) => uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'service-images'))
//   );
//   const imageUrls = uploadResults.map(r => r.secure_url);

//   // Prepare payload
//   const payload: any = { provider_id: userId, service_images: imageUrls };

//   // Append other form fields
//   for (const [key, value] of formData.entries()) {
//     if (key !== 'service_images' && typeof value === 'string') {
//       // Nested fields example: service_area.city
//       if (key.includes('.')) {
//         const [parentKey, childKey] = key.split('.');
//         if (!payload[parentKey]) payload[parentKey] = {};
//         payload[parentKey][childKey] = value;
//       } else {
//         payload[key] = value;
//       }
//     }
//   }

//   // Type conversions
//   if (payload.base_price) payload.base_price = Number(payload.base_price);
//   if (payload.minimum_charge) payload.minimum_charge = Number(payload.minimum_charge);
//   if (payload.estimated_duration_hours) payload.estimated_duration_hours = Number(payload.estimated_duration_hours);
//   if (payload.tools_provided) payload.tools_provided = payload.tools_provided === 'true';
//   if (payload.is_visible_to_customers) payload.is_visible_to_customers = payload.is_visible_to_customers === 'true';

//   // Validation
//   const validatedData = createServiceValidationSchema.parse(payload);

//   // Save to DB
//   const result = await ServiceServices.createServiceInDB(validatedData);

//   return sendResponse({
//     success: true,
//     statusCode: StatusCodes.CREATED,
//     message: "Service created successfully!",
//     data: result,
//   });
// };

const createService = async (req: NextRequest) => {
  await dbConnect();
  const { userId } = getUserDetailsFromToken(req);
  const formData = await req.formData();

  // 1. Image handling
  const images = formData.getAll('service_images') as File[];
  let imageUrls: string[] = [];
  if (images.length > 0 && images[0] instanceof File) {
    const uploadResults = await Promise.all(
      images.map(async (file) => uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'service-images'))
    );
    imageUrls = uploadResults.map(r => r.secure_url);
  }

  // 2. Prepare Payload
  const payload: any = {
    provider_id: userId,
    service_images: imageUrls
  };

  // 3. Extracting all keys properly
  const allKeys = Array.from(new Set(formData.keys()));

  for (const key of allKeys) {
    if (key === 'service_images') continue;

    const values = formData.getAll(key);

    // Check for nested fields like service_area.city
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      if (!payload[parentKey]) payload[parentKey] = {};
      payload[parentKey][childKey] = values[0];
    }
    // Handle Arrays (available_time_slots, working_days)
    else if (key === 'available_time_slots' || key === 'working_days') {
      payload[key] = values;
    }
    // Handle Single values
    else {
      payload[key] = values[0];
    }
  }

  // 4. Validation (Zod will handle type conversion now)
  const validatedData = createServiceValidationSchema.parse(payload);

  const result = await ServiceServices.createServiceInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Service created successfully!",
    data: result,
  });
};




// Provider: Get all services for a provider
const getProviderServices = async (
  req: NextRequest,
  { params }: { params: { provider_id: string } }
) => {
  await dbConnect();
  const { provider_id } = await params;
  const result = await ServiceServices.getProviderServicesFromDB(provider_id);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Provider services retrieved successfully!",
    data: result,
  });
};

// get a single service by ID
const getServiceById = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();

  const {id} = await params;
  const service = await ServiceServices.getServiceByIdFromDB(id);
  return sendResponse({
    success: true,
    statusCode: 200,
    message: "Service retrieved successfully!",
    data: service,
  });
};

// Provider: Update a service
const updateService = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateServiceValidationSchema.parse(body);
  const result = await ServiceServices.updateServiceInDB(
    id,
    validatedData
  );
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Service updated successfully!",
    data: result,
  });
};

// Provider: Delete a service
const deleteService = async (
  req: NextRequest,
  { params }: { params: { id: string; provider_id: string } }
) => {
  await dbConnect();
  const { id, provider_id } = params;
  const result = await ServiceServices.deleteServiceInDB(
    id,
    provider_id
  );
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
const changeServiceStatus = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  // await dbConnect();
  // const { service_id } = await params;
  // const body = await req.json();
  // const { status, is_visible_to_customers } = body;
  // const result = await ServiceServices.changeServiceStatusInDB(
  //   service_id,
  //   status,
  //   is_visible_to_customers
  // );
  const { id } = await params;
  const { action } = await req.json();

  let status: "Active" | "Disabled";
  let is_visible_to_customers: boolean;

  if (action === "approve") {
    status = "Active";
    is_visible_to_customers = true;
  } else if (action === "reject") {
    status = "Disabled";
    is_visible_to_customers = false;
  } else {
    throw new Error("Invalid action");
  }

  const result = await ServiceServices.changeServiceStatusInDB(
    id,
    status,
    is_visible_to_customers
  );
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
