import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "@/lib/utils/sendResponse";
import { OrderServices } from "./order.service";
import { IOrder } from "./order.interface";
import dbConnect from "@/lib/db";
import mongoose, { Types } from "mongoose";
import { IOrderDetails } from "../orderDetails/orderDetails.interface";
import { OrderDetailsModel } from "../orderDetails/orderDetails.model";
import { OrderModel } from "./order.model";
import { v4 as uuidv4 } from "uuid";

// ✅ CRITICAL: Import ALL models FIRST - Order of imports matters!
// These must be imported BEFORE OrderServices is used
import "@/lib/modules/product/vendorProduct.model";
import "@/lib/modules/vendor-store/vendorStore.model"; // ✅ MUST import Store model
import "@/lib/modules/promo-code/promoCode.model";

interface ProductItem {
  productId: string;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  discountPrice?: number;
  size?: string;
  color?: string;
}

// ✅ Helper: Convert value to ObjectId with validation
const toObjectId = (
  value: unknown,
  label: string,
  options: { optional?: boolean } = {}
): Types.ObjectId | undefined => {
  const { optional = false } = options;

  if (value === undefined || value === null || value === "") {
    if (optional) return undefined;
    throw new Error(`${label} is required.`);
  }

  if (value instanceof Types.ObjectId) {
    return value;
  }

  // Handle object with _id property
  if (typeof value === "object" && value !== null && "_id" in value) {
    return toObjectId((value as { _id: unknown })._id, label, options);
  }

  if (typeof value === "string" && Types.ObjectId.isValid(value)) {
    return new Types.ObjectId(value);
  }

  if (optional) return undefined;

  throw new Error(`${label} is invalid.`);
};

// ✅ Create Order with Details
export const createOrderWithDetails = async (req: NextRequest) => {
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();

    // Validate body
    if (
      !body.userId ||
      !body.products ||
      !Array.isArray(body.products) ||
      body.products.length === 0
    ) {
      throw new Error("Invalid order data: userId and products array required.");
    }

    const orderId = body.orderId || `ORD-${Date.now()}`;

    // Create OrderDetails documents
    const orderDetailsDocs: Partial<IOrderDetails>[] = body.products.map(
      (p: ProductItem) => ({
        orderDetailsId: uuidv4().split("-")[0],
        orderId: new Types.ObjectId(),
        productId: toObjectId(p.productId, "Product ID"),
        vendorId: toObjectId(p.vendorId, "Vendor ID"),
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        discountPrice: p.discountPrice,
        totalPrice: p.discountPrice
          ? p.discountPrice * p.quantity
          : p.unitPrice * p.quantity,
        size: p.size || undefined,
        color: p.color || undefined,
      })
    );

    // Calculate totalAmount
    const productsTotal = orderDetailsDocs.reduce(
      (sum, item) => sum + item.totalPrice!,
      0
    );
    const totalAmount = productsTotal + (body.deliveryCharge || 0);

    // Get storeId
    let storeId: Types.ObjectId | undefined = undefined;

    if (body.storeId) {
      storeId = toObjectId(body.storeId, "Store ID", { optional: true });
    }

    if (!storeId && body.products && body.products.length > 0) {
      try {
        const { VendorProductModel } = await import(
          "@/lib/modules/product/vendorProduct.model"
        );
        const firstProduct = await VendorProductModel.findById(
          toObjectId(body.products[0].productId, "Product ID")
        ).select("vendorStoreId");

        if (firstProduct?.vendorStoreId) {
          storeId = firstProduct.vendorStoreId as Types.ObjectId;
        }
      } catch (error) {
        console.error("Error fetching product for storeId:", error);
      }
    }

    if (!storeId) {
      throw new Error(
        "Store ID is required. Could not determine store from request or products."
      );
    }

    // Create Order document
    const orderPayload: Partial<IOrder> = {
      orderId,
      userId: toObjectId(body.userId, "User ID"),
      storeId: storeId,
      deliveryMethodId: body.deliveryMethodId,
      paymentMethod: body.paymentMethod,
      transactionId: body.transactionId || undefined,
      shippingName: body.shippingName || "Guest User",
      shippingPhone: body.shippingPhone || "01700000000",
      shippingEmail: body.shippingEmail || "guest@example.com",
      shippingStreetAddress: body.shippingStreetAddress || "Address not provided",
      shippingCity: body.shippingCity || "Dhaka",
      shippingDistrict: body.shippingDistrict || "Dhaka",
      shippingPostalCode: body.shippingPostalCode || "1000",
      shippingCountry: body.shippingCountry || "Bangladesh",
      addressDetails: body.addressDetails || "Address details not provided",
      deliveryCharge: body.deliveryCharge || 0,
      totalAmount: totalAmount,
      paymentStatus: body.paymentStatus || "Pending",
      orderStatus: body.orderStatus || "Pending",
      orderForm: body.orderForm || "Website",
      orderDate: new Date(body.orderDate) || new Date(),
      deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
      parcelId: body.parcelId || undefined,
      trackingId: body.trackingId || undefined,
      couponId: body.couponId ? toObjectId(body.couponId, "Coupon ID", { optional: true }) : undefined,
    };

    // Save Order
    const orderDoc = await OrderModel.create([orderPayload], { session });

    if (!orderDoc || orderDoc.length === 0) {
      throw new Error("Failed to create order document.");
    }

    // Replace temporary orderId in OrderDetails
    orderDetailsDocs.forEach((item) => {
      item.orderId = orderDoc[0]._id;
    });

    // Insert OrderDetails
    const createdOrderDetails = await OrderDetailsModel.insertMany(
      orderDetailsDocs,
      { session }
    );

    // Update Order with OrderDetails references
    orderDoc[0].orderDetails = createdOrderDetails.map((d) => d._id);
    await orderDoc[0].save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    console.log("✅ Order created successfully:", {
      orderId: orderDoc[0].orderId,
      orderDetailsCount: createdOrderDetails.length,
    });

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Order created successfully!",
      data: {
        order: orderDoc[0],
        orderDetails: createdOrderDetails,
      },
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    const errorMessage = error?.message || "Failed to create order";
    console.error("❌ Error creating order with details:", errorMessage);

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      data: null,
    });
  }
};

// ✅ Get All Orders
const getAllOrders = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const userId = searchParams.get("userId");

  if (userId) {
    if (!Types.ObjectId.isValid(userId)) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Invalid user ID format",
        data: null,
      });
    }

    try {
      const result = await OrderServices.getOrdersByUserFromDB(userId);
      return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: "User orders retrieved successfully!",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return sendResponse({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch user orders",
        data: null,
      });
    }
  }

  const result = await OrderServices.getAllOrdersFromDB(status || undefined);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Orders retrieved successfully!",
    data: result,
  });
};

// ✅ Get Orders by User
const getOrdersByUser = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  await dbConnect();
  const { userId } = await params;
  const result = await OrderServices.getOrdersByUserFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Orders retrieved successfully for the user!",
    data: result,
  });
};

// ✅ Update Order
const updateOrder = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();

  const payload: Partial<IOrder> = {};
  Object.assign(payload, body);

  const result = await OrderServices.updateOrderInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Order updated successfully!",
    data: result,
  });
};

// ✅ Delete Order
const deleteOrder = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;

  await OrderServices.deleteOrderFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Order deleted successfully!",
    data: null,
  });
};

// ✅ Get My Orders
const getMyOrders = async (req: NextRequest) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const userIdFromQuery = searchParams.get("userId");
  const userIdFromHeader = req.headers.get("x-user-id");
  const userId = userIdFromQuery || userIdFromHeader;

  if (!userId) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message:
        "User ID is required. Please provide userId as query parameter or ensure you are authenticated.",
      data: null,
    });
  }

  if (!Types.ObjectId.isValid(userId)) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Invalid user ID format",
      data: null,
    });
  }

  try {
    const result = await OrderServices.getOrdersByUserFromDB(userId);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: "User orders retrieved successfully!",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        error instanceof Error ? error.message : "Failed to fetch user orders",
      data: null,
    });
  }
};

// ✅ Get Order by ID
const getOrderById = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;

  const userId = req.headers.get("x-user-id");
  const userRole = req.headers.get("x-user-role")?.toLowerCase();

  const isPrivileged =
    userRole === "admin" ||
    userRole === "super_admin" ||
    userRole === "superadmin";

  if (!userId && !isPrivileged) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "User ID not found in request headers",
      data: null,
    });
  }

  const result = await OrderServices.getOrderByIdFromDB(id);

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: "Order not found",
      data: null,
    });
  }

  // Check if order belongs to user
  const orderResult = result as Record<string, unknown> | null;
  const orderUserId =
    orderResult && "userId" in orderResult
      ? typeof orderResult.userId === "object" &&
        orderResult.userId !== null &&
        "_id" in orderResult.userId
        ? (orderResult.userId as { _id: Types.ObjectId })._id.toString()
        : orderResult.userId?.toString() || ""
      : "";

  if (!isPrivileged && orderUserId && orderUserId !== userId) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.FORBIDDEN,
      message: "You can only view your own orders",
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Order retrieved successfully!",
    data: result,
  });
};

// ✅ Get Sales Report
const getSalesReport = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const filters = {
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    orderStatus: searchParams.get("orderStatus") || undefined,
    paymentStatus: searchParams.get("paymentStatus") || undefined,
    paymentMethod: searchParams.get("paymentMethod") || undefined,
  };

  const result = await OrderServices.getSalesReportFromDB(filters);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Sales report retrieved successfully!",
    data: result,
  });
};

// ✅ Get Returned Orders by User
const getReturnedOrdersByUser = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  await dbConnect();
  const { userId } = await params;

  const result = await OrderServices.getReturnedOrdersByUserFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Returned orders retrieved successfully for the user!",
    data: result,
  });
};

// ✅ Get Filtered Orders
const getFilteredOrders = async (req: NextRequest) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const filters = {
    orderId: searchParams.get("orderId"),
    orderForm: searchParams.get("source"),
    paymentStatus: searchParams.get("paymentStatus")
      ? searchParams.get("paymentStatus")![0].toUpperCase() +
        searchParams.get("paymentStatus")!.slice(1).toLowerCase()
      : null,
    customerName: searchParams.get("customerName"),
    customerPhone: searchParams.get("customerPhone"),
    orderStatus: searchParams.get("orderStatus"),
    orderedProduct: searchParams.get("orderedProduct"),
    deliveryMethod: searchParams.get("deliveryMethod"),
    couponCode: searchParams.get("couponCode"),
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
  };

  const result = await OrderServices.getFilteredOrdersFromDB(filters);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Filtered orders retrieved successfully!",
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
  getReturnedOrdersByUser,
  getFilteredOrders,
};