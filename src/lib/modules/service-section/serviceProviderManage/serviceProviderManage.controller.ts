import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { BookingServices } from "./serviceProviderManage.service";
import { IBooking } from "./serviceProviderManage.interface";
import dbConnect from "@/lib/db";

// Create a new booking
const createBooking = async (req: NextRequest) => {
  await dbConnect();
  try {
    const body = await req.json();

    const { customer_id, customer_name, service_id, service_name, booking_date, time_slot, location_details, estimated_cost } = body;

    if (!customer_id || !customer_name || !service_id || !service_name || !booking_date || !time_slot || !location_details || !estimated_cost) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Missing required booking fields",
        data: null,
      });
    }

    const payload: Partial<IBooking> = {
      customer_id,
      customer_name,
      service_id,
      service_name,
      booking_date,
      time_slot,
      location_details,
      estimated_cost,
    };

    const result = await BookingServices.createBookingInDB(payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Booking created successfully!",
      data: result,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to create booking",
      data: null,
    });
  }
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
