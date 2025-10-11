import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { OrderServices } from './order.service';
import { IOrder } from './order.interface';
import dbConnect from '@/lib/db';
import mongoose, { Types } from 'mongoose';
import { IOrderDetails } from '../orderDetails/orderDetails.interface';
import { OrderDetailsModel } from '../orderDetails/orderDetails.model';
import { OrderModel } from './order.model';
import { v4 as uuidv4 } from 'uuid';

// // Create a new order
// const createOrder = async (req: NextRequest) => {
//   await dbConnect();

//   try {
//     const body = await req.json();

//     const payload: Partial<IOrder> = {
//       orderId: body.orderId,
//       userId: body.userId,
//       storeId: body.storeId,
//       deliveryMethodId: body.deliveryMethodId,
//       paymentMethodId: body.paymentMethodId,

//       shippingName: body.shippingName,
//       shippingPhone: body.shippingPhone,
//       shippingEmail: body.shippingEmail,
//       shippingStreetAddress: body.shippingStreetAddress,
//       shippingCity: body.shippingCity,
//       shippingDistrict: body.shippingDistrict,
//       shippingPostalCode: body.shippingPostalCode,
//       shippingCountry: body.shippingCountry,
//       addressDetails: body.addressDetails,

//       deliveryCharge: body.deliveryCharge,
//       totalAmount: body.totalAmount,

//       paymentStatus: body.paymentStatus,
//       orderStatus: body.orderStatus,
//       orderForm: body.orderForm,
//       orderDate: body.orderDate,
//       deliveryDate: body.deliveryDate,

//       parcelId: body.parcelId,
//       trackingId: body.trackingId,
//       couponId: body.couponId,

//       orderDetails: body.orderDetails, // array of OrderDetails IDs
//     };

//     const result = await OrderServices.createOrderInDB(payload);

//     return sendResponse({
//       success: true,
//       statusCode: StatusCodes.CREATED,
//       message: 'Order created successfully!',
//       data: result,
//     });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return sendResponse({
//       success: false,
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: 'Failed to create order',
//       data: null,
//     });
//   }
// };



interface ProductItem {
  productId: string;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  discountPrice?: number;
}

// Main controller
export const createOrderWithDetails = async (req: NextRequest) => {
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();

    // Validate body minimally
    if (!body.userId || !body.products || !Array.isArray(body.products) || body.products.length === 0) {
      throw new Error('Invalid order data.');
    }

    const orderId = body.orderId || `ORD-${Date.now()}`;

    // Step 1: Create OrderDetails documents
    const orderDetailsDocs: Partial<IOrderDetails>[] = body.products.map((p: ProductItem) => ({
      orderDetailsId: uuidv4().split('-')[0],
      orderId: new Types.ObjectId(), // temporary, will replace after Order doc is created
      productId: new Types.ObjectId(p.productId),
      vendorId: new Types.ObjectId(p.vendorId),
      quantity: p.quantity,
      unitPrice: p.unitPrice,
      discountPrice: p.discountPrice,
      totalPrice: p.discountPrice
        ? p.discountPrice * p.quantity
        : p.unitPrice * p.quantity,
    }));

    // Step 2: Calculate totalAmount
    const productsTotal = orderDetailsDocs.reduce((sum, item) => sum + item.totalPrice!, 0);
    const totalAmount = productsTotal + (body.deliveryCharge || 0);

    // Step 3: Create the main Order document
    const orderPayload: Partial<IOrder> = {
      orderId,
      userId: new Types.ObjectId(body.userId),
      storeId: body.storeId ? new Types.ObjectId(body.storeId) : undefined,
      deliveryMethodId: new Types.ObjectId(body.deliveryMethodId),
      paymentMethodId: new Types.ObjectId(body.paymentMethodId),

      shippingName: body.shippingName,
      shippingPhone: body.shippingPhone,
      shippingEmail: body.shippingEmail,
      shippingStreetAddress: body.shippingStreetAddress,
      shippingCity: body.shippingCity,
      shippingDistrict: body.shippingDistrict,
      shippingPostalCode: body.shippingPostalCode,
      shippingCountry: body.shippingCountry,
      addressDetails: body.addressDetails,

      deliveryCharge: body.deliveryCharge || 0,
      totalAmount: totalAmount,

      paymentStatus: body.paymentStatus || 'Pending',
      orderStatus: body.orderStatus || 'Pending',
      orderForm: body.orderForm || 'Website',
      orderDate: new Date(),
      deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,

      parcelId: body.parcelId,
      trackingId: body.trackingId,
      couponId: body.couponId ? new Types.ObjectId(body.couponId) : undefined,
    };

    // Step 4: Save Order first
    const orderDoc = await OrderModel.create([orderPayload], { session });
    
    // Step 5: Replace temporary orderId in OrderDetails with actual Order _id
    orderDetailsDocs.forEach((item) => (item.orderId = orderDoc[0]._id));

    // Step 6: Insert all OrderDetails
    const createdOrderDetails = await OrderDetailsModel.insertMany(orderDetailsDocs, { session });

    // Step 7: Update Order document with OrderDetails references
    orderDoc[0].orderDetails = createdOrderDetails.map((d) => d._id);
    await orderDoc[0].save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Order created successfully!',
      data: {
        order: orderDoc[0],
        orderDetails: createdOrderDetails,
      },
    });
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating order with details:', error);

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to create order',
      data: null,
    });
  }
};


// Get all orders
const getAllOrders = async () => {
  await dbConnect();
  const result = await OrderServices.getAllOrdersFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Orders retrieved successfully!',
    data: result,
  });
};

// Get orders by user
const getOrdersByUser = async (req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
  await dbConnect();
  const { userId } = await params;
  const result = await OrderServices.getOrdersByUserFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Orders retrieved successfully for the user!',
    data: result,
  });
};

// Update order
const updateOrder = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();

  const payload: Partial<IOrder> = {};
  Object.assign(payload, body); // simple merge, can add validation if needed

  const result = await OrderServices.updateOrderInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order updated successfully!',
    data: result,
  });
};

// Delete order
const deleteOrder = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;

  await OrderServices.deleteOrderFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order deleted successfully!',
    data: null,
  });
};

export const OrderController = {
  createOrderWithDetails,
  getAllOrders,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
};
