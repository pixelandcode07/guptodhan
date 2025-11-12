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

// Import all models to ensure they're registered before any populate operations
// These MUST be imported before OrderServices is used
import '@/lib/modules/product/vendorProduct.model';
import '@/lib/modules/vendor-store/vendorStore.model';

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
  size?: string;
  color?: string;
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
      size: p.size || undefined,
      color: p.color || undefined,
    }));

    // Step 2: Calculate totalAmount
    const productsTotal = orderDetailsDocs.reduce((sum, item) => sum + item.totalPrice!, 0);
    const totalAmount = productsTotal + (body.deliveryCharge || 0);

    // Step 3: Get storeId from first product if not provided
    // Get vendorStoreId from the first product's vendorStoreId
    let storeId: Types.ObjectId | undefined = undefined;
    if (body.storeId) {
      storeId = new Types.ObjectId(body.storeId);
    } else if (body.products && body.products.length > 0) {
      // Fetch the first product to get its vendorStoreId
      try {
        const { VendorProductModel } = await import('@/lib/modules/product/vendorProduct.model');
        const firstProduct = await VendorProductModel.findById(body.products[0].productId).select('vendorStoreId');
        if (firstProduct?.vendorStoreId) {
          storeId = firstProduct.vendorStoreId as Types.ObjectId;
        }
      } catch (error) {
        console.error('Error fetching product for storeId:', error);
        // Will throw error later if storeId is still undefined
      }
    }

    // Step 4: Get or find default payment method if not provided
    let paymentMethodId: Types.ObjectId | undefined = undefined;
    if (body.paymentMethodId) {
      paymentMethodId = new Types.ObjectId(body.paymentMethodId);
    } else {
      // Try to find COD payment method dynamically
      try {
        // Check if PaymentMethodModel exists in mongoose models
        if (mongoose.models.PaymentMethodModel) {
          const PaymentMethodModel = mongoose.models.PaymentMethodModel;
          // Try to find a payment method with name containing "COD" or "Cash"
          const codMethod = await PaymentMethodModel.findOne({ 
            $or: [
              { name: { $regex: /COD/i } },
              { name: { $regex: /Cash/i } },
              { name: { $regex: /On Delivery/i } }
            ]
          });
          if (codMethod) {
            paymentMethodId = codMethod._id as Types.ObjectId;
          } else {
            // If no COD method found, try to use the first payment method
            const firstMethod = await PaymentMethodModel.findOne();
            if (firstMethod) {
              paymentMethodId = firstMethod._id as Types.ObjectId;
            }
          }
        } else {
          // PaymentMethodModel doesn't exist - create a default COD payment method
          // Create a simple schema and model dynamically
          const PaymentMethodSchema = new mongoose.Schema({ 
            name: { type: String, required: true },
            description: { type: String },
            isActive: { type: Boolean, default: true }
          }, { timestamps: true });
          
          type PaymentMethodType = { name: string; description?: string; isActive?: boolean; _id: Types.ObjectId };
          const PaymentMethodModel = (mongoose.models.PaymentMethodModel || 
            mongoose.model<PaymentMethodType>('PaymentMethodModel', PaymentMethodSchema)) as mongoose.Model<PaymentMethodType>;
          
          // Try to find or create a COD payment method
          let codMethod = await PaymentMethodModel.findOne({ name: { $regex: /COD/i } });
          if (!codMethod) {
            codMethod = await PaymentMethodModel.findOne({ name: { $regex: /Cash/i } });
          }
          if (!codMethod) {
            // Create a default COD payment method
            codMethod = await PaymentMethodModel.create({ 
              name: 'Cash on Delivery (COD)',
              description: 'Pay when order is delivered',
              isActive: true
            });
          }
          paymentMethodId = codMethod._id as Types.ObjectId;
        }
      } catch (error) {
        console.error('Error finding payment method:', error);
        throw new Error('Payment Method ID is required. Please provide paymentMethodId or ensure a default COD payment method exists in the database.');
      }
    }

    // Validate required fields
    if (!storeId) {
      throw new Error('Store ID is required. Could not determine store from products.');
    }
    if (!paymentMethodId) {
      throw new Error('Payment Method ID is required. Please provide paymentMethodId or ensure a default COD payment method exists in the database.');
    }

    // Step 5: Create the main Order document
    const orderPayload: Partial<IOrder> = {
      orderId,
      userId: new Types.ObjectId(body.userId),
      storeId: storeId,
      deliveryMethodId: body.deliveryMethodId,
      paymentMethod: body.paymentMethod,

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

    // Step 6: Save Order first
    const orderDoc = await OrderModel.create([orderPayload], { session });
    
    // Step 7: Replace temporary orderId in OrderDetails with actual Order _id
    orderDetailsDocs.forEach((item) => (item.orderId = orderDoc[0]._id));

    // Step 8: Insert all OrderDetails
    const createdOrderDetails = await OrderDetailsModel.insertMany(orderDetailsDocs, { session });

    // Step 9: Update Order document with OrderDetails references
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


// Get all orders (with optional userId filter)
const getAllOrders = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const userId = searchParams.get('userId');
  
  // If userId is provided, get orders for that user only
  if (userId) {
    // Validate userId is a valid ObjectId format
    if (!Types.ObjectId.isValid(userId)) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid user ID format',
        data: null,
      });
    }
    
    try {
      const result = await OrderServices.getOrdersByUserFromDB(userId);
      return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User orders retrieved successfully!',
        data: result,
      });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return sendResponse({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error instanceof Error ? error.message : 'Failed to fetch user orders',
        data: null,
      });
    }
  }
  
  // Otherwise, get all orders (admin view)
  const result = await OrderServices.getAllOrdersFromDB(status || undefined);

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

// Get orders for the authenticated user
const getMyOrders = async (req: NextRequest) => {
  await dbConnect();
  
  // Get user ID from query params first, then fall back to headers
  const { searchParams } = new URL(req.url);
  const userIdFromQuery = searchParams.get('userId');
  const userIdFromHeader = req.headers.get('x-user-id');
  const userId = userIdFromQuery || userIdFromHeader;
  
  if (!userId) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User ID is required. Please provide userId as query parameter or ensure you are authenticated.',
      data: null,
    });
  }

  // Validate userId is a valid ObjectId format
  if (!Types.ObjectId.isValid(userId)) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid user ID format',
      data: null,
    });
  }

  try {
    const result = await OrderServices.getOrdersByUserFromDB(userId);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User orders retrieved successfully!',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : 'Failed to fetch user orders',
      data: null,
    });
  }
};

// Get order by ID (for authenticated user)
const getOrderById = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  
  // Get user ID from headers
  const userId = req.headers.get('x-user-id');
  const userRole = req.headers.get('x-user-role')?.toLowerCase();
  
  const isPrivileged = userRole === 'admin' || userRole === 'super_admin' || userRole === 'superadmin';

  if (!userId && !isPrivileged) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User ID not found in request headers',
      data: null,
    });
  }

  const result = await OrderServices.getOrderByIdFromDB(id);
  
  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Order not found',
      data: null,
    });
  }

  // Check if the order belongs to the authenticated user
  // result is a lean object, userId might be populated (object) or just an ObjectId (string)
  const orderResult = result as Record<string, unknown> | null;
  const orderUserId = orderResult && 'userId' in orderResult
    ? (typeof orderResult.userId === 'object' && orderResult.userId !== null && '_id' in orderResult.userId
        ? (orderResult.userId as { _id: Types.ObjectId })._id.toString()
        : orderResult.userId?.toString() || '')
    : '';
  if (!isPrivileged && orderUserId && orderUserId !== userId) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.FORBIDDEN,
      message: 'You can only view your own orders',
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order retrieved successfully!',
    data: result,
  });
};

const getSalesReport = async (req: NextRequest) => {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const filters = {
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
        orderStatus: searchParams.get('orderStatus') || undefined,
        paymentStatus: searchParams.get('paymentStatus') || undefined,
        paymentMethod: searchParams.get('paymentMethod') || undefined,
    };

    const result = await OrderServices.getSalesReportFromDB(filters);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Sales report retrieved successfully!',
        data: result,
    });
};

export const OrderController = {
  createOrderWithDetails,
  getAllOrders,
  getOrdersByUser,
  getMyOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getSalesReport,
};
