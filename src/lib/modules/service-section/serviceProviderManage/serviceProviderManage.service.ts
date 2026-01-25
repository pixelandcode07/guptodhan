import { IBooking } from "./serviceProviderManage.interface";
import { BookingModel } from "./serviceProviderManage.model";


const createBookingInDB = async (payload: Partial<IBooking>) => {
  const result = await BookingModel.create(payload);
  return result;
};


const getProviderBookingsFromDB = async (provider_id: string) => {
  const bookings = await BookingModel.find({ provider_id })
    .sort({ booking_date: -1 }); // latest bookings first

  const total_bookings = bookings.length;

  return { total_bookings, bookings };
};


const getBookingByOrderIdFromDB = async (order_id: string) => {
  const booking = await BookingModel.findOne({ order_id });
  if (!booking) throw new Error("Booking not found.");
  return booking;
};


const updateBookingInDB = async (
  booking_id: string,
  payload: Partial<IBooking>
) => {
  const booking = await BookingModel.findByIdAndUpdate(
    booking_id,
    payload,
    { new: true }
  );

  if (!booking) throw new Error("Booking not found to update.");
  return booking;
};



const getAllBookingsFromDB = async () => {
  const bookings = await BookingModel.find().sort({ booking_date: -1 });
  const total_bookings = bookings.length;

  return { total_bookings, bookings };
};


const getUserBookingsFromDB = async (user_id: string) => {
  const bookings = await BookingModel.find({ customer_id: user_id })
    .sort({ booking_date: -1 }); 

  const total_bookings = bookings.length;

  return { total_bookings, bookings };
};

// Confirm booking
const confirmBookingInDB = async (booking_id: string) => {
  const booking = await BookingModel.findByIdAndUpdate(
    booking_id,
    {
      status: "Confirmed",
    },
    { new: true }
  );

  if (!booking) throw new Error("Booking not found.");
  return booking;
};

// Complete booking
const completeBookingInDB = async (
  booking_id: string,
  provider_notes?: string
) => {
  const booking = await BookingModel.findByIdAndUpdate(
    booking_id,
    {
      status: "Completed",
      provider_notes,
      service_end_time: new Date(),
    },
    { new: true }
  );

  if (!booking) throw new Error("Booking not found.");
  return booking;
};

// Cancel booking with provider note
const cancelBookingInDB = async (
  booking_id: string,
  provider_rejection_message: string
) => {
  const booking = await BookingModel.findByIdAndUpdate(
    booking_id,
    {
      status: "Cancelled",
      provider_rejection_message,
    },
    { new: true }
  );

  if (!booking) throw new Error("Booking not found.");
  return booking;
};


export const BookingServices = {
  createBookingInDB,
  getProviderBookingsFromDB,
  getBookingByOrderIdFromDB,
  updateBookingInDB,
  getAllBookingsFromDB,
  getUserBookingsFromDB,

  confirmBookingInDB,
  completeBookingInDB,
  cancelBookingInDB,

};
