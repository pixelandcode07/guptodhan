import { PaymentController } from '@/lib/modules/payment/payment.controller';

// POST /api/v1/payment/cancel/:transactionId
export const POST = async (req: Request, ctx: { params: { transactionId: string } }) => {
    return PaymentController.handleCancel(req, ctx);
};
