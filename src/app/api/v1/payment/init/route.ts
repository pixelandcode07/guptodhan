export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { PaymentController } from '@/lib/modules/payment/payment.controller';

export const POST = async (req: NextRequest) => {
  try {
    console.log('📤 Payment Init Route Called');
    return await PaymentController.initiatePayment(req);
  } catch (error: any) {
    console.error('❌ Init Route Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Payment initialization failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};