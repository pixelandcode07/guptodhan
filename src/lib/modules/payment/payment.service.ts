import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { OrderModel } from '../product-order/order/order.model';
import { initPaymentSession, validatePayment } from '../sslcommerz/sslcommerz.service';
import { OrderModel } from '../product-order/order/order.model';
import { v4 as uuidv4 } from 'uuid';

const initPayment = async (orderId: string) => {
    const order = await OrderModel.findById(orderId).populate('userId');
    if (!order) {
        throw new Error('Order not found.');
    }

    // Ensure the user data is populated
    const user = order.userId as any;
    if (!user) {
        throw new Error('User details not found for this order.');
    }

    // ✅ FIX: Check if payment already initiated
    if (order.transactionId) {
        throw new Error('Payment already initiated for this order. Please use the existing payment link or contact support.');
    }

    // ✅ FIX: Validate order amount
    if (order.totalAmount <= 0) {
        throw new Error('Invalid order amount.');
    }

    const transactionId = `GDH-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;

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

        // Update the order with the transaction ID
        await OrderModel.findByIdAndUpdate(orderId, { 
            transactionId,
            paymentStatus: 'Pending' 
        });

        return gatewayUrl;
    } catch (error: any) {
        console.error('SSLCommerz Init Error:', error);
        throw new Error(`Failed to initiate payment: ${error.message}`);
    }
};

const handleSuccessfulPayment = async (transactionId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        // ✅ FIX: Find order first to check status
        const order = await OrderModel.findOne({ transactionId });
        
        if (!order) {
            throw new Error('Order not found for this transaction.');
        }

        // ✅ FIX: Prevent duplicate processing (idempotency)
        if (order.paymentStatus === 'Paid') {
            console.log(`⚠️ Payment already processed for transaction: ${transactionId}`);
            await session.commitTransaction();
            return order;
        }

        // ✅ FIX: Update order with proper status
        const updatedOrder = await OrderModel.findOneAndUpdate(
            { transactionId, paymentStatus: { $ne: 'Paid' } },
            { 
                paymentStatus: 'Paid', 
                orderStatus: 'Processing',
                paymentMethod: 'SSLCommerz' 
            },
            { new: true, session }
        );

        if (!updatedOrder) {
            throw new Error('Failed to update order status.');
        }

        // ✅ TODO: Add email notification, invoice generation, etc.
        // await sendPaymentConfirmationEmail(updatedOrder);
        // await generateInvoice(updatedOrder);

        await session.commitTransaction();
        console.log(`✅ Payment successful for transaction: ${transactionId}`);
        return updatedOrder;
    } catch (error) {
        await session.abortTransaction();
        console.error('Error handling successful payment:', error);
        throw error;
    } finally {
        session.endSession();
    }
};

const handleFailedPayment = async (transactionId: string) => {
    try {
        const order = await OrderModel.findOneAndUpdate(
            { transactionId },
            { 
                paymentStatus: 'Failed',
                // Keep orderStatus as Pending so user can retry
            },
            { new: true }
        );
        
        if (!order) {
            throw new Error('Order not found for this transaction.');
        }

        console.log(`❌ Payment failed for transaction: ${transactionId}`);
        // ✅ TODO: Send failure notification
        // await sendPaymentFailureEmail(order);
        
        return order;
    } catch (error) {
        console.error('Error handling failed payment:', error);
        throw error;
    }
};

const handleCancelledPayment = async (transactionId: string) => {
    try {
        const order = await OrderModel.findOneAndUpdate(
            { transactionId },
            { 
                paymentStatus: 'Cancelled',
                // Keep orderStatus as Pending in case user wants to retry
            },
            { new: true }
        );
        
        if (!order) {
            throw new Error('Order not found for this transaction.');
        }

        console.log(`🚫 Payment cancelled for transaction: ${transactionId}`);
        return order;
    } catch (error) {
        console.error('Error handling cancelled payment:', error);
        throw error;
    }
};

// ✅ MAJOR FIX: Added transaction support and idempotency for IPN
const validateAndProcessIPN = async (ipnData: any) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        console.log('📨 IPN Received:', ipnData.tran_id);

        // Step 1: Validate with SSLCommerz
        const validationResult = await validatePayment(ipnData);
        
        if (validationResult?.status !== 'VALID') {
            console.error('❌ IPN Validation Failed:', validationResult);
            throw new Error('IPN Validation Failed.');
        }

        // Step 2: Find order
        const order = await OrderModel.findOne({ transactionId: ipnData.tran_id });
        
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
        if (parseFloat(ipnData.amount) !== order.totalAmount) {
            console.error('❌ Amount mismatch:', {
                ipn: ipnData.amount,
                order: order.totalAmount
            });
            throw new Error('Payment amount mismatch detected.');
        }

        // Step 5: Update order with transaction
        await OrderModel.findOneAndUpdate(
            { transactionId: ipnData.tran_id, paymentStatus: { $ne: 'Paid' } },
            { 
                paymentStatus: 'Paid', 
                orderStatus: 'Processing',
                paymentMethod: 'SSLCommerz'
            },
            { session }
        );

        await session.commitTransaction();
        console.log(`✅ IPN processed successfully for transaction: ${ipnData.tran_id}`);
        
        // ✅ TODO: Send confirmation email
        // await sendPaymentConfirmationEmail(order);
        
        return { message: 'IPN processed successfully', order };
    } catch (error: any) {
        await session.abortTransaction();
        console.error('Error processing IPN:', error);
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