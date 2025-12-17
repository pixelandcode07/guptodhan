import { NextRequest, NextResponse } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';
import { PaymentService } from './payment.service';

// ✅ Initiate Payment
const initiatePayment = async (req: NextRequest) => {
  await dbConnect();

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Order ID is required.',
        data: null,
      });
    }

    console.log('📤 Initiating payment for order:', orderId);

    const url = await PaymentService.initPayment(orderId);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Payment session initiated successfully.',
      data: { url },
    });
  } catch (error: any) {
    console.error('❌ Payment Initiation Error:', error.message);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to initiate payment.',
      data: null,
    });
  }
};

// ✅ Handle Success Callback
const handleSuccess = async (
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) => {
  await dbConnect();

  try {
    const { transactionId } = params;

    if (!transactionId) {
      const redirectUrl = new URL(
        '/payment/error?message=Transaction ID missing',
        process.env.FRONTEND_URL || 'http://localhost:3000'
      );
      return NextResponse.redirect(redirectUrl);
    }

    console.log('✅ Processing successful payment for transaction:', transactionId);

    // Update order status in database
    const updatedOrder = await PaymentService.handleSuccessfulPayment(transactionId);

    // Redirect to success page with order details
    const redirectUrl = new URL(
      `/payment/success?tran_id=${transactionId}&order_id=${updatedOrder?.orderId || ''}`,
      process.env.FRONTEND_URL || 'http://localhost:3000'
    );

    console.log('🔀 Redirecting to:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('❌ Success Handler Error:', error.message);

    const redirectUrl = new URL(
      `/payment/error?message=${encodeURIComponent(error.message || 'Payment processing failed')}`,
      process.env.FRONTEND_URL || 'http://localhost:3000'
    );
    return NextResponse.redirect(redirectUrl);
  }
};

// ✅ Handle Failed Callback
const handleFail = async (
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) => {
  await dbConnect();

  try {
    const { transactionId } = params;

    if (!transactionId) {
      const redirectUrl = new URL(
        '/payment/error?message=Transaction ID missing',
        process.env.FRONTEND_URL || 'http://localhost:3000'
      );
      return NextResponse.redirect(redirectUrl);
    }

    console.log('❌ Processing failed payment for transaction:', transactionId);

    // Update order status in database
    await PaymentService.handleFailedPayment(transactionId);

    // Redirect to fail page
    const redirectUrl = new URL(
      `/payment/fail?tran_id=${transactionId}`,
      process.env.FRONTEND_URL || 'http://localhost:3000'
    );

    console.log('🔀 Redirecting to:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('❌ Fail Handler Error:', error.message);

    const redirectUrl = new URL(
      `/payment/error?message=${encodeURIComponent(error.message || 'Payment failure processing error')}`,
      process.env.FRONTEND_URL || 'http://localhost:3000'
    );
    return NextResponse.redirect(redirectUrl);
  }
};

// ✅ Handle Cancelled Callback
const handleCancel = async (
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) => {
  await dbConnect();

  try {
    const { transactionId } = params;

    if (!transactionId) {
      const redirectUrl = new URL(
        '/payment/error?message=Transaction ID missing',
        process.env.FRONTEND_URL || 'http://localhost:3000'
      );
      return NextResponse.redirect(redirectUrl);
    }

    console.log('🚫 Processing cancelled payment for transaction:', transactionId);

    // Update order status in database
    await PaymentService.handleCancelledPayment(transactionId);

    // Redirect to cancel page
    const redirectUrl = new URL(
      `/payment/cancel?tran_id=${transactionId}`,
      process.env.FRONTEND_URL || 'http://localhost:3000'
    );

    console.log('🔀 Redirecting to:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('❌ Cancel Handler Error:', error.message);

    const redirectUrl = new URL(
      `/payment/error?message=${encodeURIComponent(error.message || 'Payment cancellation processing error')}`,
      process.env.FRONTEND_URL || 'http://localhost:3000'
    );
    return NextResponse.redirect(redirectUrl);
  }
};

// ✅ Handle IPN Callback
const handleIpn = async (req: NextRequest) => {
  await dbConnect();

  try {
    const formData = await req.formData();
    const ipnData = Object.fromEntries(formData);

    console.log('📨 IPN Data Received for transaction:', ipnData.tran_id);

    await PaymentService.validateAndProcessIPN(ipnData);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'IPN received and processed successfully.',
      data: null,
    });
  } catch (error: any) {
    console.error('❌ IPN Handler Error:', error.message);

    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message || 'IPN validation failed.',
      data: null,
    });
  }
};

export const PaymentController = {
  initiatePayment,
  handleSuccess,
  handleFail,
  handleCancel,
  handleIpn,
};