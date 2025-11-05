import mongoose from 'mongoose';
import { OrderModel } from '../product-order/order/order.model';
import { initPaymentSession, validatePayment } from '../sslcommerz/sslcommerz.service';
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

    const transactionId = `GUptoDhan-${uuidv4().split('-')[0].toUpperCase()}`;

    const sslPayload = {
        total_amount: order.totalAmount,
        tran_id: transactionId,
        cus_name: user.name,
        cus_email: user.email || 'not-provided@example.com', // Email is optional in your user model
        cus_add1: user.address,
        cus_phone: user.phoneNumber || 'N/A', // Phone might be optional
        product_name: 'Guptodhan Order', // Simplified product name
    };

    const gatewayUrl = await initPaymentSession(sslPayload);

    // Update the order with the transaction ID
    await OrderModel.findByIdAndUpdate(orderId, { transactionId });

    return gatewayUrl;
};

const handleSuccessfulPayment = async (transactionId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const order = await OrderModel.findOneAndUpdate(
            { transactionId },
            { paymentStatus: 'Paid', orderStatus: 'Processing' },
            { new: true, session }
        );

        if (!order) {
            throw new Error('Order not found for this transaction.');
        }

        // Add any further logic here, like generating an invoice or sending an email.

        await session.commitTransaction();
        return order;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const handleFailedPayment = async (transactionId: string) => {
    const order = await OrderModel.findOneAndUpdate(
        { transactionId },
        { paymentStatus: 'Failed' },
        { new: true }
    );
    if (!order) {
        throw new Error('Order not found for this transaction.');
    }
    return order;
};

const handleCancelledPayment = async (transactionId: string) => {
    const order = await OrderModel.findOneAndUpdate(
        { transactionId },
        { paymentStatus: 'Cancelled' }, // Assuming you add 'Cancelled' to the enum
        { new: true }
    );
    if (!order) {
        throw new Error('Order not found for this transaction.');
    }
    return order;
};

const validateAndProcessIPN = async (ipnData: any) => {
    const isValid = await validatePayment(ipnData);
    if (isValid?.status !== 'VALID') {
        throw new Error('IPN Validation Failed.');
    }

    await OrderModel.findOneAndUpdate(
        { transactionId: ipnData.tran_id },
        { paymentStatus: 'Paid', orderStatus: 'Processing' }
    );

    // Further logic (e.g., send confirmation email) can be added here.
    return;
};

export const PaymentService = {
    initPayment,
    handleSuccessfulPayment,
    handleFailedPayment,
    handleCancelledPayment,
    validateAndProcessIPN,
};