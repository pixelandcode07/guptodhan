import mongoose, { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { OrderModel } from "../product-order/order/order.model";
import { initPaymentSession, validatePayment } from "../sslcommerz/sslcommerz.service";

// ✅ Initiate Payment
const initPayment = async (orderId: string) => {
  try {
    if (!orderId || typeof orderId !== "string" || orderId.trim() === "") {
      throw new Error("Order ID is required.");
    }

    let order = await OrderModel.findOne({ orderId: orderId.trim() }).populate("userId");

    if (!order && Types.ObjectId.isValid(orderId)) {
      order = await OrderModel.findById(orderId).populate("userId");
    }

    if (!order) {
      throw new Error("Order not found.");
    }

    const user = order.userId as any;

    if (order.transactionId) {
      console.warn("⚠️ Payment already initiated for this order, re-using session...");
      const existingUrl = await initPaymentSession({
        total_amount:  order.totalAmount,
        tran_id:       order.transactionId,
        cus_name:      user?.name || order.shippingName || "Customer",
        cus_email:     user?.email || order.shippingEmail || "customer@example.com",
        cus_add1:      "Dhaka", // Pass dummy to gateway to avoid crash
        cus_phone:     user?.phoneNumber || order.shippingPhone || "01700000000",
        product_name:  `Guptodhan Order #${order.orderId}`,
      });
      return existingUrl;
    }

    const transactionId = `GDH-${Date.now()}-${uuidv4().split("-")[0].toUpperCase()}`;
    
    const sslPayload = {
      total_amount:  order.totalAmount,
      tran_id:       transactionId,
      cus_name:      user?.name || order.shippingName || "Customer",
      cus_email:     user?.email || order.shippingEmail || "customer@example.com",
      cus_add1:      "Dhaka",
      cus_phone:     user?.phoneNumber || order.shippingPhone || "01700000000",
      product_name:  `Guptodhan Order #${order.orderId}`,
    };

    const gatewayUrl = await initPaymentSession(sslPayload);

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId: order.orderId },
      {
        transactionId,
        paymentStatus: "Pending", // Keep pending until money is received
      },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error("Failed to save transaction ID to order.");
    }

    return gatewayUrl;
  } catch (error: any) {
    console.error("❌ initPayment Error:", error.message);
    throw error;
  }
};

// ✅ Handle Successful Payment (SSLCommerz callback)
const handleSuccessfulPayment = async (transactionId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findOne({ transactionId }).session(session);

    if (!order) throw new Error("Order not found for this transaction.");

    if (order.paymentStatus === "Paid") {
      await session.commitTransaction();
      return order;
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { transactionId, paymentStatus: { $ne: "Paid" } },
      {
        paymentStatus:  "Paid",
        orderStatus:    "Processing",
        paymentMethod:  "SSLCommerz",
      },
      { new: true, session }
    );

    await session.commitTransaction();
    return updatedOrder;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ✅ Handle Failed Payment
const handleFailedPayment = async (transactionId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findOneAndUpdate(
      { transactionId },
      { paymentStatus: "Failed" },
      { new: true, session }
    );

    await session.commitTransaction();
    return order;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ✅ Handle Cancelled Payment
const handleCancelledPayment = async (transactionId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findOneAndUpdate(
      { transactionId },
      { paymentStatus: "Cancelled" },
      { new: true, session }
    );

    await session.commitTransaction();
    return order;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ✅ Validate and Process IPN
const validateAndProcessIPN = async (ipnData: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validationResult = await validatePayment(ipnData);

    if (!validationResult || (validationResult.status !== "VALID" && validationResult.status !== "Success")) {
      throw new Error(`IPN Validation Failed: ${validationResult?.status || "Unknown status"}`);
    }

    const order = await OrderModel.findOne({ transactionId: ipnData.tran_id }).session(session);

    if (!order) throw new Error("Order not found for this transaction.");
    
    if (order.paymentStatus === "Paid") {
      await session.commitTransaction();
      return { message: "IPN already processed", order };
    }

    const ipnAmount = parseFloat(ipnData.amount);
    if (Math.abs(ipnAmount - order.totalAmount) > 0.01) {
      throw new Error(`Payment amount mismatch. Expected: ${order.totalAmount}, Received: ${ipnAmount}`);
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { transactionId: ipnData.tran_id, paymentStatus: { $ne: "Paid" } },
      {
        paymentStatus: "Paid",
        orderStatus:   "Processing",
        paymentMethod: "SSLCommerz",
      },
      { new: true, session }
    );

    await session.commitTransaction();
    return { message: "IPN processed successfully", order: updatedOrder };
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const PaymentService = {
  initPayment,
  handleSuccessfulPayment,
  handleFailedPayment,
  handleCancelledPayment,
  validateAndProcessIPN,
};