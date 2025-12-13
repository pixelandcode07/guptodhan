// ==========================================
// FILE: app/api/v1/payment/ipn/route.ts
// ==========================================
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { PaymentController } from '@/lib/modules/payment/payment.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(PaymentController.handleIpn);