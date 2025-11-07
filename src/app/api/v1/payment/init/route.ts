// ==========================================
// FILE: app/api/v1/payment/init/route.ts
// ==========================================
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { PaymentController } from '@/lib/modules/payment/payment.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole, TUserRole } from '@/lib/middlewares/checkRole';

const allowedRoles: TUserRole[] = ['user', 'vendor', 'service-provider', 'admin'];

export const POST = catchAsync(checkRole(allowedRoles)(PaymentController.initiatePayment));
