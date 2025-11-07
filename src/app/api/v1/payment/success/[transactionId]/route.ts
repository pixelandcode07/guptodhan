import { NextResponse } from "next/server";
import { PaymentController } from "@/lib/modules/payment/payment.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = catchAsync(async (req, context) => {
  const { transactionId } = context.params;

  // handleSuccess — database update etc.
  await PaymentController.handleSuccess(req, context);

  // redirect to frontend
  const redirectUrl = `${process.env.FRONTEND_URL}/payment/success?tran_id=${transactionId}`;
  return NextResponse.redirect(redirectUrl);
});
