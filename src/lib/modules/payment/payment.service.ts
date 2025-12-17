import mongoose, { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { OrderModel } from '../product-order/order/order.model';
import { initPaymentSession, validatePayment } from '../sslcommerz/sslcommerz.service';

// ✅ Initiate Payment
const initPayment = async (orderId: string) => {
  try {
    // Validate orderId format
    if (!Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid order ID format');
    }

    console.log('📝 Fetching order for payment:', orderId);

    const order = await OrderModel.findById(orderId).populate('userId');

    if (!order) {
      throw new Error('Order not found.');
    }

    // Ensure the user data is populated
    const user = order.userId as any;
    if (!user) {
      throw new Error('User details not found for this order.');
    }

    // ✅ Check if payment already initiated
    if (order.transactionId) {
      console.warn('⚠️ Payment already initiated for this order');
      // Return existing gateway URL instead of throwing error
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

    // ✅ Validate order amount
    if (order.totalAmount <= 0) {
      throw new Error('Invalid order amount.');
    }

    // ✅ Generate unique transaction ID
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

    try {
      const gatewayUrl = await initPaymentSession(sslPayload);

      // ✅ IMPORTANT: Save transactionId to order BEFORE redirecting to payment gateway
      console.log('💾 Saving transaction ID to order...');

      const updatedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        {
          transactionId: transactionId,
          paymentStatus: 'Pending',
        },
        { new: true }
      );

      if (!updatedOrder) {
        throw new Error('Failed to save transaction ID to order');
      }

      console.log('✅ Transaction ID saved to order:', transactionId);
      console.log('✅ Payment initiated for order:', order.orderId);

      return gatewayUrl;
    } catch (error: any) {
      console.error('❌ SSLCommerz Init Error:', error);
      throw new Error(`Failed to initiate payment: ${error.message}`);
    }
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

    // ✅ Find order by transactionId
    const order = await OrderModel.findOne({ transactionId }).session(session);

    if (!order) {
      console.error('❌ Order not found for transaction:', transactionId);
      throw new Error('Order not found for this transaction.');
    }

    console.log('✅ Order found:', order.orderId);

    // Prevent duplicate processing (idempotency)
    if (order.paymentStatus === 'Paid') {
      console.log(`⚠️ Payment already processed for transaction: ${transactionId}`);
      await session.commitTransaction();
      return order;
    }

    // Update order with proper status
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
      {
        paymentStatus: 'Failed',
        // Keep orderStatus as Pending so user can retry
      },
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
      {
        paymentStatus: 'Cancelled',
        // Keep orderStatus as Pending in case user wants to retry
      },
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

    // Step 1: Validate with SSLCommerz
    const validationResult = await validatePayment(ipnData);

    console.log('📊 Validation Result:', {
      status: validationResult?.status,
      amount: validationResult?.amount,
    });

    // Handle both 'VALID' and other success statuses
    if (!validationResult || (validationResult.status !== 'VALID' && validationResult.status !== 'Success')) {
      console.error('❌ IPN Validation Failed:', validationResult);
      throw new Error(`IPN Validation Failed: ${validationResult?.status || 'Unknown status'}`);
    }

    // Step 2: Find order by transactionId
    const order = await OrderModel.findOne({ transactionId: ipnData.tran_id }).session(session);

    if (!order) {
      console.error('❌ Order not found for transaction:', ipnData.tran_id);
      throw new Error('Order not found for this transaction.');
    }

    // Step 3: Prevent duplicate processing (idempotency check)
    if (order.paymentStatus === 'Paid') {
      console.log(`⚠️ IPN already processed for transaction: ${ipnData.tran_id}`);
      await session.commitTransaction();
      return { message: 'IPN already processed', order };
    }

    // Step 4: Verify amount matches
    const ipnAmount = parseFloat(ipnData.amount);
    if (Math.abs(ipnAmount - order.totalAmount) > 0.01) {
      console.error('❌ Amount mismatch:', {
        ipn: ipnAmount,
        order: order.totalAmount,
      });
      throw new Error(`Payment amount mismatch detected. Expected: ${order.totalAmount}, Received: ${ipnAmount}`);
    }

    // Step 5: Update order with transaction
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