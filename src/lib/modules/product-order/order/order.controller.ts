// src/app/api/v1/product-order/order/order.controller.ts
// ✅ FIXED: Remove transactions that cause replica set error

import { NextRequest } from 'next/server';
import mongoose, { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';
import { sendResponse } from '@/lib/utils/sendResponse';
import { OrderModel } from './order.model';
import { OrderDetailsModel } from '../orderDetails/orderDetails.model';
import { IOrder } from './order.interface';
import { IOrderDetails } from '../orderDetails/orderDetails.interface';
import { OrderServices } from './order.service';

// --- Import Models ---
import "@/lib/modules/product/vendorProduct.model";
import "@/lib/modules/vendor-store/vendorStore.model";
import "@/lib/modules/promo-code/promoCode.model";

// --- Helper: ID Conversion ---
const toObjectId = (id: string | any, label: string, options: { optional?: boolean } = {}) => {
  if (!id) {
    if (options.optional) return undefined;
    throw new Error(`${label} is required.`);
  }
  if (id instanceof Types.ObjectId) return id;
  if (typeof id === 'object' && id._id) return new Types.ObjectId(id._id);
  if (typeof id === 'string' && Types.ObjectId.isValid(id)) return new Types.ObjectId(id);
  throw new Error(`Invalid ${label} format.`);
};

// --- 1. Create Order - WITHOUT TRANSACTIONS ---
const createOrderWithDetails = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();

    if (!body.userId || !body.products || !Array.isArray(body.products) || body.products.length === 0) {
      throw new Error('Invalid order data: userId and products array required.');
    }

    const orderId = body.orderId || `ORD-${Date.now()}`;

    const orderDetailsDocs: Partial<IOrderDetails>[] = body.products.map(
      (p: any) => ({
        orderDetailsId: uuidv4().split('-')[0],
        orderId: new Types.ObjectId(),
        productId: toObjectId(p.productId, 'Product ID'),
        vendorId: toObjectId(p.vendorId, 'Vendor ID'),
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        discountPrice: p.discountPrice,
        totalPrice: p.discountPrice ? p.discountPrice * p.quantity : p.unitPrice * p.quantity,
        size: p.size || undefined,
        color: p.color || undefined,
      })
    );

    const productsTotal = orderDetailsDocs.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const totalAmount = productsTotal + (body.deliveryCharge || 0);

    let storeId: Types.ObjectId | undefined = undefined;
    if (body.storeId) {
      storeId = toObjectId(body.storeId, 'Store ID', { optional: true });
    }

    if (!storeId && body.products.length > 0) {
      try {
        const { VendorProductModel } = await import('@/lib/modules/product/vendorProduct.model');
        const firstProduct = await VendorProductModel.findById(toObjectId(body.products[0].productId, 'Product ID')).select('vendorStoreId');
        if (firstProduct?.vendorStoreId) {
          storeId = firstProduct.vendorStoreId as Types.ObjectId;
        }
      } catch (err) {
        console.error('Error fetching store from product:', err);
      }
    }

    if (!storeId) throw new Error('Store ID is required.');

    const orderPayload: Partial<IOrder> = {
      orderId,
      userId: toObjectId(body.userId, 'User ID'),
      storeId: storeId,
      deliveryMethodId: body.deliveryMethodId,
      paymentMethod: body.paymentMethod,
      shippingName: body.shippingName || 'Guest',
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
      parcelId: body.parcelId || undefined,
      trackingId: body.trackingId || undefined,
      couponId: body.couponId ? toObjectId(body.couponId, 'Coupon ID', { optional: true }) : undefined,
    };

    // ✅ Create order WITHOUT transaction
    const orderDoc = await OrderModel.create(orderPayload);
    if (!orderDoc) throw new Error('Failed to create order document.');

    // ✅ Create order details WITHOUT transaction
    orderDetailsDocs.forEach((item) => { item.orderId = orderDoc._id; });
    const createdOrderDetails = await OrderDetailsModel.insertMany(orderDetailsDocs);

    // ✅ Update order with order details
    orderDoc.orderDetails = createdOrderDetails.map((d) => d._id) as any;
    await orderDoc.save();

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Order created successfully!',
      data: { order: orderDoc, orderDetails: createdOrderDetails },
    });

  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create order',
      data: null,
    });
  }
};

// --- 2. Get All Orders (Smart Filter) ---
const getAllOrders = async (req: NextRequest) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    const userId = searchParams.get('userId');

    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        return sendResponse({ 
          success: false, 
          statusCode: StatusCodes.BAD_REQUEST, 
          message: 'Invalid user ID format', 
          data: null 
        });
      }
      const result = await OrderServices.getOrdersByUserFromDB(userId);
      return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'User orders retrieved!', 
        data: result 
      });
    }

    const filters = {
      orderId: searchParams.get('orderId'),
      orderForm: searchParams.get('source'),
      paymentStatus: searchParams.get('paymentStatus'),
      customerName: searchParams.get('customerName'),
      customerPhone: searchParams.get('customerPhone'),
      orderStatus: searchParams.get('orderStatus') || searchParams.get('status'),
      orderedProduct: searchParams.get('orderedProduct'),
      deliveryMethod: searchParams.get('deliveryMethod'),
      couponCode: searchParams.get('couponCode'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    };

    const result = await OrderServices.getFilteredOrdersFromDB(filters);
    
    return sendResponse({ 
      success: true, 
      statusCode: StatusCodes.OK, 
      message: 'Orders retrieved successfully!', 
      data: result 
    });
  } catch (error: any) {
    console.error('Error in getAllOrders:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve orders',
      data: null,
    });
  }
};

// --- 3. Get Orders by User ---
const getOrdersByUser = async (req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
  try {
    await dbConnect();
    const { userId } = await params;
    const result = await OrderServices.getOrdersByUserFromDB(userId);
    return sendResponse({ 
      success: true, 
      statusCode: StatusCodes.OK, 
      message: 'User orders retrieved!', 
      data: result 
    });
  } catch (error: any) {
    console.error('Error in getOrdersByUser:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve user orders',
      data: null,
    });
  }
};

// --- 4. Update Order ---
const updateOrder = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const result = await OrderServices.updateOrderInDB(id, body);
    return sendResponse({ 
      success: true, 
      statusCode: StatusCodes.OK, 
      message: 'Order updated!', 
      data: result 
    });
  } catch (error: any) {
    console.error('Error in updateOrder:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to update order',
      data: null,
    });
  }
};

// --- 5. Delete Order ---
const deleteOrder = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    const { id } = await params;
    await OrderServices.deleteOrderFromDB(id);
    return sendResponse({ 
      success: true, 
      statusCode: StatusCodes.OK, 
      message: 'Order deleted!', 
      data: null 
    });
  } catch (error: any) {
    console.error('Error in deleteOrder:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to delete order',
      data: null,
    });
  }
};

// --- 6. Get Single Order ---
const getOrderById = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await dbConnect();
    const { id } = await params;
    const result = await OrderServices.getOrderByIdFromDB(id);
    if (!result) {
      return sendResponse({ 
        success: false, 
        statusCode: StatusCodes.NOT_FOUND, 
        message: 'Order not found', 
        data: null 
      });
    }
    return sendResponse({ 
      success: true, 
      statusCode: StatusCodes.OK, 
      message: 'Order retrieved!', 
      data: result 
    });
  } catch (error: any) {
    console.error('Error in getOrderById:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve order',
      data: null,
    });
  }
};

// --- 7. Sales Report ---
const getSalesReport = async (req: NextRequest) => {
  try {
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
      message: 'Sales report retrieved!', 
      data: result 
    });
  } catch (error: any) {
    console.error('Error in getSalesReport:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve sales report',
      data: null,
    });
  }
};

// --- 8. Returned Orders ---
const getReturnedOrdersByUser = async (req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
  try {
    await dbConnect();
    const { userId } = await params;
    const result = await OrderServices.getReturnedOrdersByUserFromDB(userId);
    return sendResponse({ 
      success: true, 
      statusCode: StatusCodes.OK, 
      message: 'Returned orders retrieved!', 
      data: result 
    });
  } catch (error: any) {
    console.error('Error in getReturnedOrdersByUser:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve returned orders',
      data: null,
    });
  }
};

// --- 9. Request Return ---
const requestReturn = async (req: NextRequest) => {
  try {
    await dbConnect();
    const body = await req.json();
    const { orderId, reason } = body;

    if (!orderId || !reason) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Order ID and return reason are required',
        data: null,
      });
    }

    const result = await OrderServices.requestReturnInDB(orderId, reason);
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Return request submitted successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in requestReturn:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message || 'Failed to request return',
      data: null,
    });
  }
};

// --- 10. Get Vendor Store and Orders ---
const getVendorStoreAndOrdersVendor = async (
  req: NextRequest,
  { params }: { params: { vendorId: string } }
) => {
  try {
    await dbConnect();
    const { vendorId } = await params;
    
    const result = await OrderServices.getVendorStoreAndOrdersFromDBVendor(vendorId);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Vendor store & orders retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in getVendorStoreAndOrdersVendor:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to retrieve vendor store and orders',
      data: null,
    });
  }
};

export const OrderController = {
  createOrderWithDetails,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrder,
  deleteOrder,
  getSalesReport,
  getReturnedOrdersByUser,
  requestReturn,
  getVendorStoreAndOrdersVendor
};