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
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as {
    userId: string;
    role: string;
  };
  return { userId: decoded.userId, role: decoded.role };
};

const createBooking = async (req: NextRequest) => {
  await dbConnect();
  const { userId } = getUserDetailsFromToken(req);

  const body = await req.json();

  // 1. Fetch Service to get Provider ID
  const service = await ServiceModel.findById(body.service_id);
  if (!service) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: "Service not found",
      data: null,
    });
  }

  // 2. Prepare Payload (Including Contact Info)
  const payload = {
    customer_id: userId,
    provider_id: service.provider_id.toString(),
    service_id: body.service_id,
    booking_date: body.booking_date,
    time_slot: body.time_slot,
    location_details: body.location_details,
    estimated_cost: Number(body.estimated_cost),
    customer_notes: body.customer_notes,
    
    // ✅ NEW: Passing contact info
    contact_info: {
      name: body.contact_info?.name,
      phone: body.contact_info?.phone,
      email: body.contact_info?.email
    }
  };

  // 3. Validation
  const validatedData = createBookingValidationSchema.parse(payload);

  // 4. Save to DB
  const booking = await BookingServices.createBookingInDB(validatedData);

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

// Confirm booking (Provider)
const confirmBooking = async (
  req: NextRequest,
  { params }: { params: Promise<{ booking_id: string }> }
) => {
  await dbConnect();
  const { booking_id } = await params;

  const result = await BookingServices.confirmBookingInDB(booking_id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Booking confirmed successfully!",
    data: result,
  });
};

// Complete booking (Provider)
const completeBooking = async (
  req: NextRequest,
  { params }: { params: Promise<{ booking_id: string }> }
) => {
  await dbConnect();
  const { booking_id } = await params;

  const body = await req.json();

  const result = await BookingServices.completeBookingInDB(
    booking_id,
    body.provider_notes
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Booking completed successfully!",
    data: result,
  });
};

// Cancel booking with note (Provider)
const cancelBooking = async (
  req: NextRequest,
  { params }: { params: Promise<{ booking_id: string }> }
) => {
  await dbConnect();
  const { booking_id } = await params;

  const body = await req.json();

  const result = await BookingServices.cancelBookingInDB(
    booking_id,
    body.provider_rejection_message
  );

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Booking cancelled successfully!",
    data: result,
  });
};



export const BookingController = {
  createBooking,
  getAllBookings,
  getProviderBookings,
  getBookingByOrderId,
  updateBooking,
  getUserBookings,

  cancelBooking,
  completeBooking,
  confirmBooking,
};
