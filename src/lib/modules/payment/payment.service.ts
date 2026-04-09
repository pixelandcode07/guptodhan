import mongoose, { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { OrderModel } from '../product-order/order/order.model';
import { initPaymentSession, validatePayment } from '../sslcommerz/sslcommerz.service';

// ✅ Initiate Payment
const initPayment = async (orderId: string) => {
  try {
    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      throw new Error('Order ID is required.');
    }

    console.log('📝 Fetching order for payment:', orderId);

    // ✅ FIX: Query by the string `orderId` field, NOT by MongoDB `_id`
    // This supports both human-readable IDs (e.g. "GDH-...") and ObjectId strings
    let order = await OrderModel.findOne({ orderId: orderId.trim() }).populate('userId');

    // Fallback: if not found by string orderId, try MongoDB _id (ObjectId)
    if (!order && Types.ObjectId.isValid(orderId)) {
      console.log('⚠️  Not found by orderId string, trying _id fallback...');
      order = await OrderModel.findById(orderId).populate('userId');
    }

    if (!order) {
      throw new Error('Order not found.');
    }

    const user = order.userId as any;
    if (!user) {
      throw new Error('User details not found for this order.');
    }

    // ✅ If payment already initiated, re-use existing transaction
    if (order.transactionId) {
      console.warn('⚠️ Payment already initiated for this order, re-using session...');
      const existingUrl = await initPaymentSession({
        total_amount: order.totalAmount,
        tran_id: order.transactionId,
        cus_name: user.name || 'Guest Customer',
        cus_email: user.email || 'not-provided@example.com',
        cus_add1: user.address || order.shippingStreetAddress,
        cus_phone: user.phoneNumber || order.shippingPhone,
        product_name: `Guptodhan Order #${order.orderId}`,
      });
      return existingUrl;
    }

    if (order.totalAmount <= 0) {
      throw new Error('Invalid order amount.');
    }

    const transactionId = `GDH-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;
    console.log('📤 Generated Transaction ID:', transactionId);

    const sslPayload = {
      total_amount: order.totalAmount,
      tran_id: transactionId,
      cus_name: user.name || 'Guest Customer',
      cus_email: user.email || 'not-provided@example.com',
      cus_add1: user.address || order.shippingStreetAddress,
      cus_phone: user.phoneNumber || order.shippingPhone,
      product_name: `Guptodhan Order #${order.orderId}`,
    };

    const gatewayUrl = await initPaymentSession(sslPayload);

    console.log('💾 Saving transaction ID to order...');

    // ✅ FIX: Update by string orderId field
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId: order.orderId },
      {
        transactionId: transactionId,
        paymentStatus: 'Pending',
      },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error('Failed to save transaction ID to order.');
    }

    console.log('✅ Transaction ID saved to order:', transactionId);
    console.log('✅ Payment initiated for order:', order.orderId);

    return gatewayUrl;
  } catch (error: any) {
    console.error('❌ initPayment Error:', error.message);
    throw error;
  }
};

// ✅ Handle Successful Payment
const handleSuccessfulPayment = async (transactionId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('📝 Processing successful payment for transaction:', transactionId);

    const order = await OrderModel.findOne({ transactionId }).session(session);

    if (!order) {
      console.error('❌ Order not found for transaction:', transactionId);
      throw new Error('Order not found for this transaction.');
    }

    console.log('✅ Order found:', order.orderId);

    // Idempotency guard
    if (order.paymentStatus === 'Paid') {
      console.log(`⚠️ Payment already processed for transaction: ${transactionId}`);
      await session.commitTransaction();
      return order;
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { transactionId, paymentStatus: { $ne: 'Paid' } },
      {
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        paymentMethod: 'SSLCommerz',
      },
      { new: true, session }
    );

    if (!updatedOrder) {
      throw new Error('Failed to update order status.');
    }

    await session.commitTransaction();
    console.log(`✅ Payment successful for transaction: ${transactionId}`);
    console.log(`✅ Order status updated: ${updatedOrder.orderId} -> Processing`);

    return updatedOrder;
  } catch (error: any) {
    await session.abortTransaction();
    console.error('❌ Error handling successful payment:', error.message);
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
    console.log('📝 Processing failed payment for transaction:', transactionId);

    const order = await OrderModel.findOneAndUpdate(
      { transactionId },
      { paymentStatus: 'Failed' },
      { new: true, session }
    );

    if (!order) {
      throw new Error('Order not found for this transaction.');
    }

    await session.commitTransaction();
    console.log(`❌ Payment failed for transaction: ${transactionId}`);

    return order;
  } catch (error: any) {
    await session.abortTransaction();
    console.error('❌ Error handling failed payment:', error.message);
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
    console.log('📝 Processing cancelled payment for transaction:', transactionId);

    const order = await OrderModel.findOneAndUpdate(
      { transactionId },
      { paymentStatus: 'Cancelled' },
      { new: true, session }
    );

    if (!order) {
      throw new Error('Order not found for this transaction.');
    }

    await session.commitTransaction();
    console.log(`🚫 Payment cancelled for transaction: ${transactionId}`);

    return order;
  } catch (error: any) {
    await session.abortTransaction();
    console.error('❌ Error handling cancelled payment:', error.message);
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
    console.log('📨 IPN Processing started for transaction:', ipnData.tran_id);

    const validationResult = await validatePayment(ipnData);

    console.log('📊 Validation Result:', {
      status: validationResult?.status,
      amount: validationResult?.amount,
    });

    if (
      !validationResult ||
      (validationResult.status !== 'VALID' && validationResult.status !== 'Success')
    ) {
      console.error('❌ IPN Validation Failed:', validationResult);
      throw new Error(
        `IPN Validation Failed: ${validationResult?.status || 'Unknown status'}`
      );
    }

    const order = await OrderModel.findOne({
      transactionId: ipnData.tran_id,
    }).session(session);

    if (!order) {
      console.error('❌ Order not found for transaction:', ipnData.tran_id);
      throw new Error('Order not found for this transaction.');
    }

    // Idempotency guard
    if (order.paymentStatus === 'Paid') {
      console.log(`⚠️ IPN already processed for transaction: ${ipnData.tran_id}`);
      await session.commitTransaction();
      return { message: 'IPN already processed', order };
    }

    const ipnAmount = parseFloat(ipnData.amount);
    if (Math.abs(ipnAmount - order.totalAmount) > 0.01) {
      console.error('❌ Amount mismatch:', { ipn: ipnAmount, order: order.totalAmount });
      throw new Error(
        `Payment amount mismatch detected. Expected: ${order.totalAmount}, Received: ${ipnAmount}`
      );
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { transactionId: ipnData.tran_id, paymentStatus: { $ne: 'Paid' } },
      {
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        paymentMethod: 'SSLCommerz',
      },
      { new: true, session }
    );

    if (!updatedOrder) {
      throw new Error('Failed to update order status from IPN.');
    }

    await session.commitTransaction();
    console.log(`✅ IPN processed successfully for transaction: ${ipnData.tran_id}`);

    return { message: 'IPN processed successfully', order: updatedOrder };
  } catch (error: any) {
    await session.abortTransaction();
    console.error('❌ Error processing IPN:', error.message);
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