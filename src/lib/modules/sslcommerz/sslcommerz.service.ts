import SSLCommerzPayment from 'sslcommerz-lts';
import { ISSLCommerzPayload } from './sslcommerz.interface';

const store_id = process.env.SSLCZ_STORE_ID!;
const store_passwd = process.env.SSLCZ_STORE_PASS!;
const is_live = process.env.SSLCZ_IS_LIVE === 'true';

if (!store_id || !store_passwd) {
    throw new Error('SSLCommerz credentials not found in environment variables');
}

export const initPaymentSession = async (payload: ISSLCommerzPayload) => {
    const baseUrl = process.env.FRONTEND_URL || process.env.NEXTAUTH_URL;
    if (!baseUrl) throw new Error('NEXTAUTH_URL or FRONTEND_URL not configured');

    const data = {
        store_id,
        store_passwd,
        total_amount: payload.total_amount,
        currency: 'BDT',
        tran_id: payload.tran_id,
        success_url: `${baseUrl}/api/v1/payment/success/${payload.tran_id}`,
        fail_url: `${baseUrl}/api/v1/payment/fail/${payload.tran_id}`,
        cancel_url: `${baseUrl}/api/v1/payment/cancel/${payload.tran_id}`,
        ipn_url: `${baseUrl}/api/v1/payment/ipn`,
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
        ship_city: 'Dhaka',
        ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse.status !== 'SUCCESS') {
        throw new Error(`Failed to initiate SSLCommerz payment: ${apiResponse.failedreason || 'Unknown error'}`);
    }

    return apiResponse.GatewayPageURL;
};

// ✅ নতুন function validatePayment
export const validatePayment = async (ipnData: any) => {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    try {
        const result = await sslcz.validate(ipnData);
        console.log('Payment Validation Result:', result);
        return result;
    } catch (error: any) {
        console.error('Payment Validation Error:', error);
        throw new Error(`Payment validation failed: ${error.message}`);
    }
};
