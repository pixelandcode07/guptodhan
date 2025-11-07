import { NextRequest, NextResponse } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';
import { PaymentService } from './payment.service';

const initiatePayment = async (req: NextRequest) => {
    await dbConnect();
    
    try {
        const { orderId } = await req.json();
        
        if (!orderId) {
            return sendResponse({ 
                success: false, 
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Order ID is required.',
                data: null 
            });
        }

        const url = await PaymentService.initPayment(orderId);
        
        return sendResponse({ 
            success: true, 
            statusCode: StatusCodes.OK,
            message: 'Payment session initiated successfully.',
            data: { url } 
        });
    } catch (error: any) {
        console.error('❌ Payment Initiation Error:', error);
        return sendResponse({ 
            success: false, 
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message || 'Failed to initiate payment.',
            data: null 
        });
    }
};

const handleSuccess = async (req: NextRequest, { params }: { params: { transactionId: string } }) => {
    await dbConnect();
    
    try {
        const { transactionId } = params;
        await PaymentService.handleSuccessfulPayment(transactionId);
        
        // ✅ Redirect to success page with transaction details
        const redirectUrl = new URL(
            `/payment/success?tran_id=${transactionId}`, 
            process.env.FRONTEND_URL || process.env.NEXTAUTH_URL
        );
        return NextResponse.redirect(redirectUrl);
    } catch (error: any) {
        console.error('❌ Success Handler Error:', error);
        
        // ✅ Redirect to error page if something goes wrong
        const redirectUrl = new URL(
            `/payment/error?message=${encodeURIComponent(error.message)}`, 
            process.env.FRONTEND_URL || process.env.NEXTAUTH_URL
        );
        return NextResponse.redirect(redirectUrl);
    }
};

const handleFail = async (req: NextRequest, { params }: { params: { transactionId: string } }) => {
    await dbConnect();
    
    try {
        const { transactionId } = params;
        await PaymentService.handleFailedPayment(transactionId);

        // ✅ Redirect to fail page with transaction details
        const redirectUrl = new URL(
            `/payment/fail?tran_id=${transactionId}`, 
            process.env.FRONTEND_URL || process.env.NEXTAUTH_URL
        );
        return NextResponse.redirect(redirectUrl);
    } catch (error: any) {
        console.error('❌ Fail Handler Error:', error);
        
        const redirectUrl = new URL(
            `/payment/error?message=${encodeURIComponent(error.message)}`, 
            process.env.FRONTEND_URL || process.env.NEXTAUTH_URL
        );
        return NextResponse.redirect(redirectUrl);
    }
};

const handleCancel = async (req: NextRequest, { params }: { params: { transactionId: string } }) => {
    await dbConnect();

    try {
        const { transactionId } = params;
        await PaymentService.handleCancelledPayment(transactionId);

        // ✅ Redirect to cancel page
        const redirectUrl = new URL(
            `/payment/cancel?tran_id=${transactionId}`,
            process.env.FRONTEND_URL || process.env.NEXTAUTH_URL
        );
        return NextResponse.redirect(redirectUrl);
    } catch (error: any) {
        console.error('❌ Cancel Handler Error:', error);

        const redirectUrl = new URL(
            `/payment/error?message=${encodeURIComponent(error.message)}`,
            process.env.FRONTEND_URL || process.env.NEXTAUTH_URL
        );
        return NextResponse.redirect(redirectUrl);
    }
};

const handleIpn = async (req: NextRequest) => {
    await dbConnect();
    
    try {
        const ipnData = Object.fromEntries(await req.formData());
        console.log('📨 IPN Data Received:', ipnData);
        
        await PaymentService.validateAndProcessIPN(ipnData);
        
        return sendResponse({ 
            success: true, 
            statusCode: StatusCodes.OK,
            message: 'IPN received and processed successfully.',
            data: null
        });
    } catch (error: any) {
        console.error('❌ IPN Handler Error:', error);
        
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