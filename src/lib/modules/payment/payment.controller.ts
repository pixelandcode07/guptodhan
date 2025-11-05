import { NextRequest, NextResponse } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';
import { PaymentService } from './payment.service';

const initiatePayment = async (req: NextRequest) => {
    await dbConnect();
    const { orderId } = await req.json();
    const url = await PaymentService.initPayment(orderId);
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK,
        message: 'Payment session initiated successfully.',
        data: { url } 
    });
};

const handleSuccess = async (req: NextRequest, { params }: { params: { transactionId: string } }) => {
    await dbConnect();
    const { transactionId } = params;
    await PaymentService.handleSuccessfulPayment(transactionId);
    
    const redirectUrl = new URL(`/payment/success?tran_id=${transactionId}`, process.env.FRONTEND_URL);
    return NextResponse.redirect(redirectUrl);
};

const handleFail = async (req: NextRequest, { params }: { params: { transactionId: string } }) => {
    await dbConnect();
    const { transactionId } = params;
    await PaymentService.handleFailedPayment(transactionId);

    const redirectUrl = new URL(`/payment/fail?tran_id=${transactionId}`, process.env.FRONTEND_URL);
    return NextResponse.redirect(redirectUrl);
};

const handleCancel = async (req: NextRequest, { params }: { params: { transactionId: string } }) => {
    await dbConnect();
    const { transactionId } = params;
    await PaymentService.handleCancelledPayment(transactionId);

    const redirectUrl = new URL(`/payment/cancel?tran_id=${transactionId}`, process.env.FRONTEND_URL);
    return NextResponse.redirect(redirectUrl);
};

const handleIpn = async (req: NextRequest) => {
    await dbConnect();
    const ipnData = Object.fromEntries(await req.formData());
    
    try {
        await PaymentService.validateAndProcessIPN(ipnData);
        // ✅ FIX: Added statusCode and data properties
        return sendResponse({ 
            success: true, 
            statusCode: StatusCodes.OK,
            message: 'IPN received successfully.',
            data: null
        });
    } catch (error: any) {
        // ✅ FIX: Added statusCode and data properties
        return sendResponse({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: error.message || 'IPN validation failed.',
            data: null
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