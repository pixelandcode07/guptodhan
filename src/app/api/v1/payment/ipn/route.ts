export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { PaymentController } from '@/lib/modules/payment/payment.controller';

export const POST = async (req: NextRequest) => {
  try {
    console.log('📨 IPN Route Called');
    return await PaymentController.handleIpn(req);
  } catch (error: any) {
    console.error('❌ IPN Route Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'IPN processing failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};