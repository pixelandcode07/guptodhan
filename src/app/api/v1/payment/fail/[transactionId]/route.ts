export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PaymentController } from '@/lib/modules/payment/payment.controller';

// ✅ Handle POST from SSLCommerz Gateway
export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) => {
  try {
    // ✅ IMPORTANT: await params in Next.js 16+
    const { transactionId } = await params;

    console.log('❌ POST Fail Handler Called with transactionId:', transactionId);

    // Get form data from SSLCommerz
    const formData = await req.formData();
    const sslData = Object.fromEntries(formData);

    console.log('📨 SSLCommerz Fail Data:', {
      tran_id: sslData.tran_id,
      status: sslData.status,
    });

    // Call the controller to handle database updates
    const result = await PaymentController.handleFail(req, { params: await params });

    return result;
  } catch (error: any) {
    console.error('❌ POST Fail Route Error:', error.message);

    const redirectUrl = new URL(
      `/payment/error?message=${encodeURIComponent(error.message || 'Payment failure processing error')}`,
      process.env.FRONTEND_URL || 'http://localhost:3000'
    );
    return NextResponse.redirect(redirectUrl);
  }
};

// ✅ Handle GET from browser redirect
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) => {
  try {
    // ✅ IMPORTANT: await params in Next.js 16+
    const { transactionId } = await params;

    console.log('❌ GET Fail Handler Called with transactionId:', transactionId);

    // Call the controller to handle database updates
    const result = await PaymentController.handleFail(req, { params: await params });

    return result;
  } catch (error: any) {
    console.error('❌ GET Fail Route Error:', error.message);

    const redirectUrl = new URL(
      `/payment/error?message=${encodeURIComponent(error.message || 'Payment failure processing error')}`,
      process.env.FRONTEND_URL || 'http://localhost:3000'
    );
    return NextResponse.redirect(redirectUrl);
  }
};