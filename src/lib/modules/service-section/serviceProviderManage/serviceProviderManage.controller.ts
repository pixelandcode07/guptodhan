import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { BookingServices } from "./serviceProviderManage.service";
import { IBooking } from "./serviceProviderManage.interface";
import dbConnect from "@/lib/db";
import { verifyToken } from "@/lib/utils/jwt";
import { createBookingValidationSchema } from "./serviceProviderManage.validation";
import { BookingModel } from "./serviceProviderManage.model";
import { ServiceModel } from "../provideService/provideService.model";
import { NextResponse } from "next/server";


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
  };
  return { userId: decoded.userId, role: decoded.role };
};

// Create a new booking
// const createBooking = async (req: NextRequest) => {
//   await dbConnect();

//    const { userId } = getUserDetailsFromToken(req);
//    console.log('🟢 Creating booking for user:', userId);
//   try {
//     const body = await req.json();

//     const { customer_id, customer_name, service_id, service_name, booking_date, time_slot, location_details, estimated_cost } = body;

//     if (!customer_id || !customer_name || !service_id || !service_name || !booking_date || !time_slot || !location_details || !estimated_cost) {
//       return sendResponse({
//         success: false,
//         statusCode: StatusCodes.BAD_REQUEST,
//         message: "Missing required booking fields",
//         data: null,
//       });
//     }

//     const payload: Partial<IBooking> = {
//       customer_id,
//       service_id,
//       booking_date,
//       time_slot,
//       location_details,
//       estimated_cost,
//     };

//     const result = "await BookingServices.createBookingInDB(payload)";

//     return sendResponse({
//       success: true,
//       statusCode: StatusCodes.CREATED,
//       message: "Booking created successfully!",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     return sendResponse({
//       success: false,
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: "Failed to create booking",
//       data: null,
//     });
//   }
// };

const createBooking = async (req: NextRequest) => {
  await dbConnect();

  const { userId } = getUserDetailsFromToken(req);
  console.log('🟢 Creating booking for user:', userId);

  // Parse and validate request body
  const body = await req.json();
  console.log('🟢 Creating booking with data:', body);

  const service = await ServiceModel.findById(body.service_id);
  console.log('🟢 Fetched service for booking:', service);
  if (!service) {
    return new NextResponse("Service not found", { status: 404 });
  }

  // Prepare payload
  const payload = {
    ...body,
    customer_id: userId,
    provider_id: service.provider_id,
  };
  console.log('🟢 Booking payload prepared:', payload);

  const validatedData = createBookingValidationSchema.parse(payload);
  console.log('🟢 Booking data validated:', validatedData);

  // Save booking
  const booking = await BookingServices.createBookingInDB(validatedData);

  // Return response
  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Booking created successfully!",
    data: booking,
  });
};


// Get all bookings (Admin)
const getAllBookings = async () => {
  await dbConnect();
  const result = await BookingServices.getAllBookingsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Bookings retrieved successfully!",
    data: result,
  });
};

// Get bookings for a specific provider
const getProviderBookings = async (req: NextRequest, { params }: { params: Promise<{ providerId: string }> }) => {
  await dbConnect();
  const { providerId } = await params;

  const result = await BookingServices.getProviderBookingsFromDB(providerId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Provider bookings retrieved successfully!",
    data: result,
  });
};

// Get booking by order ID
const getBookingByOrderId = async (req: NextRequest, { params }: { params: Promise<{ order_id: string }> }) => {
  await dbConnect();
  const { order_id } = await params;

  try {
    const result = await BookingServices.getBookingByOrderIdFromDB(order_id);
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: "Booking retrieved successfully!",
      data: result,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: "Booking not found",
      data: null,
    });
  }
};

// Update booking by booking ID
const updateBooking = async (req: NextRequest, { params }: { params: Promise<{ booking_id: string }> }) => {
  await dbConnect();
  const { booking_id } = await params;
  try {
    const body = await req.json();

    const payload: Partial<IBooking> = body;

    const result = await BookingServices.updateBookingInDB(booking_id, payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: "Booking updated successfully!",
      data: result,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to update booking",
      data: null,
    });
  }
};

const getUserBookings = async (
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) => {
  await dbConnect();

  try {
    const { user_id } = await params;

    if (!user_id) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "User ID is required.",
        data: null,
      });
    }

    const result = await BookingServices.getUserBookingsFromDB(user_id);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: "User bookings retrieved successfully!",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch user bookings.",
      data: null,
    });
  }
};


export const BookingController = {
  createBooking,
  getAllBookings,
  getProviderBookings,
  getBookingByOrderId,
  updateBooking,
  getUserBookings
};
