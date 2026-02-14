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
import { deleteCachePattern } from '@/lib/redis/cache-helpers';

// --- Import Models ---
import "@/lib/modules/product/vendorProduct.model";
import "@/lib/modules/vendor-store/vendorStore.model";
import "@/lib/modules/promo-code/promoCode.model";
import { VendorProductModel } from '@/lib/modules/product/vendorProduct.model';

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

const calculateDeliveryCharge = (location: string, products: any[]) => {
  // 1. Base Charge (Dhaka 60, Outside 120)
  let charge = location.toLowerCase().includes('dhaka') ? 60 : 120;

  // 2. Heavy Item Surcharge (Product Specific)
  let extraCharge = 0;
  products.forEach(p => {
    if (p.shippingCost && p.shippingCost > 0) {
      extraCharge += p.shippingCost; 
    }
  });

  return charge + extraCharge;
};

// --- Create Order (Multi-Vendor Supported) ---
const createOrderWithDetails = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, products, shippingCity, paymentMethod, shippingAddress } = body;

    if (!userId || !products || products.length === 0) {
      throw new Error('Invalid order data.');
    }

    // 1. Fetch Real Product Data form DB (Security & Grouping)
    const productIds = products.map((p: any) => p.productId);
    const dbProducts = await VendorProductModel.find({ _id: { $in: productIds } });

    if (dbProducts.length !== products.length) {
       // Some products might be missing/deleted
    }

    // 2. Group Products by Vendor (Store ID)
    const orderGroups: Record<string, any[]> = {};

    for (const item of products) {
      const dbProduct = dbProducts.find(p => p._id.toString() === item.productId);
      if (!dbProduct) continue;

      const storeId = dbProduct.vendorStoreId.toString();

      if (!orderGroups[storeId]) {
        orderGroups[storeId] = [];
      }

      // Add item with Verified Data
      orderGroups[storeId].push({
        ...item,
        vendorId: storeId, // Store ID is the Vendor reference
        unitPrice: dbProduct.discountPrice || dbProduct.productPrice, // Use DB Price
        originalProduct: dbProduct // Keep ref for checking shipping cost later
      });
    }

    // 3. Create Separate Orders for Each Vendor
    const createdOrders = [];
    const transactionGroupId = `TRX-${Date.now()}`; // Single Payment Reference

    for (const storeId of Object.keys(orderGroups)) {
      const storeItems = orderGroups[storeId];
      
      // Calculate Totals for THIS store
      const itemsTotal = storeItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      
      // Delivery Charge Logic (Specific to this shipment)
      const deliveryCharge = calculateDeliveryCharge(shippingCity || 'Dhaka', storeItems.map(i => i.originalProduct));
      
      const totalAmount = itemsTotal + deliveryCharge;

      // Generate Order ID
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create Order Document
      const orderPayload = {
        orderId,
        userId: new Types.ObjectId(userId),
        storeId: new Types.ObjectId(storeId), // Specific Store
        deliveryMethodId: body.deliveryMethodId || 'Standard',
        paymentMethod: paymentMethod || 'Cash On Delivery',
        transactionId: paymentMethod === 'Online' ? transactionGroupId : undefined,
        
        // Shipping Info
        shippingName: body.shippingName,
        shippingPhone: body.shippingPhone,
        shippingEmail: body.shippingEmail,
        shippingStreetAddress: body.shippingStreetAddress,
        shippingCity: shippingCity,
        shippingDistrict: body.shippingDistrict,
        shippingPostalCode: body.shippingPostalCode,
        shippingCountry: body.shippingCountry || 'Bangladesh',
        
        deliveryCharge,
        totalAmount,
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        orderDate: new Date(),
        orderDetails: [] // Will update after creating details
      };

      const newOrder = await OrderModel.create(orderPayload);

      // Create Order Details Documents
      const detailDocs = storeItems.map(item => ({
        orderDetailsId: uuidv4().split('-')[0],
        orderId: newOrder._id,
        productId: new Types.ObjectId(item.productId),
        vendorId: new Types.ObjectId(storeId),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
        size: item.size,
        color: item.color,
      }));

      const createdDetails = await OrderDetailsModel.insertMany(detailDocs);

      // Link Details to Order
      newOrder.orderDetails = createdDetails.map(d => d._id);
      await newOrder.save();

      createdOrders.push(newOrder);
    }

    await deleteCachePattern(`orders:user:${userId}*`);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: `Order placed successfully! (${createdOrders.length} shipments created)`,
      data: createdOrders,
    });

  } catch (error: any) {
    console.error('❌ Order Creation Failed:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to place order.',
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