import { NextRequest, NextResponse } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { Order } from '../order/order.model';
import { PaymentServices } from './payment.service';
import { validatePayment } from '../sslcommerz/sslcommerz.service';

const initiatePayment = async (req: NextRequest) => {
  await dbConnect();
  const { orderId } = await req.json();
  const url = await PaymentServices.initPaymentInDB(orderId);
  return sendResponse({ success: true, data: { url } });
};

const handleSuccess = async (_req: NextRequest, { params }: { params: { transactionId: string } }) => {
    await dbConnect();
    await Order.updateOne({ transactionId: params.transactionId }, { paymentStatus: 'paid', status: 'processing' });
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/payment/success?tran_id=${params.transactionId}`);
};

const handleFailOrCancel = async (_req: NextRequest, { params }: { params: { transactionId: string } }) => {
    await dbConnect();
    await Order.updateOne({ transactionId: params.transactionId }, { paymentStatus: 'failed' });
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/payment/fail?tran_id=${params.transactionId}`);
};

const handleIpn = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.formData();
    const data = Object.fromEntries(body.entries());
    const tran_id = data.tran_id as string;
    
    const validation = await validatePayment(data);
    if (validation?.status !== 'VALID') {
        console.error("IPN Validation Failed:", data);
        return sendResponse({ success: false, message: 'IPN validation failed.' });
    }

    await Order.updateOne({ transactionId: tran_id }, { paymentStatus: 'paid', status: 'processing' });
    return sendResponse({ success: true, message: 'IPN received.' });
};

export const PaymentController = {
  initiatePayment,
  handleSuccess,
  handleFailOrCancel,
  handleIpn,
};