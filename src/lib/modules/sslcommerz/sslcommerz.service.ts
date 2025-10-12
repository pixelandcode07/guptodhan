import SSLCommerzPayment from 'sslcommerz-lts';
import { ISSLCommerzPayload } from './sslcommerz.interface';

const store_id = process.env.SSLCZ_STORE_ID!;
const store_passwd = process.env.SSLCZ_STORE_PASS!;
const is_live = process.env.SSLCZ_IS_LIVE === 'true';

// পেমেন্ট সেশন শুরু করার জন্য
export const initPaymentSession = async (payload: ISSLCommerzPayload) => {
  const data = {
    store_id,
    store_passwd,
    total_amount: payload.total_amount,
    currency: 'BDT',
    tran_id: payload.tran_id, // tran_id must be unique
    success_url: `${process.env.NEXTAUTH_URL}/api/v1/payment/success/${payload.tran_id}`,
    fail_url: `${process.env.NEXTAUTH_URL}/api/v1/payment/fail/${payload.tran_id}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/api/v1/payment/cancel/${payload.tran_id}`,
    ipn_url: `${process.env.NEXTAUTH_URL}/api/v1/payment/ipn`,
    shipping_method: 'Courier',
    product_name: payload.product_name,
    product_category: 'E-commerce',
    product_profile: 'general',
    cus_name: payload.cus_name,
    cus_email: payload.cus_email,
    cus_add1: payload.cus_add1,
    cus_phone: payload.cus_phone,
    ship_name: payload.cus_name,
    ship_add1: payload.cus_add1,
    ship_city: 'Dhaka', // Can be dynamic
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);

  if (apiResponse.status !== 'SUCCESS') {
    throw new Error(`Failed to initiate SSLCommerz payment session: ${apiResponse.failedreason}`);
  }
  // This will return the Gateway Page URL
  return apiResponse.GatewayPageURL;
};

// পেমেন্ট ভ্যালিডেট করার জন্য (IPN এবং Success URL-এর জন্য)
export const validatePayment = async (data: any) => {
    try {
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const result = await sslcz.validate(data);
        return result;
    } catch (error) {
        throw new Error('Payment validation failed.');
    }
};