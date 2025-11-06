import SSLCommerzPayment from 'sslcommerz-lts';
import { ISSLCommerzPayload } from './sslcommerz.interface';

const store_id = process.env.SSLCZ_STORE_ID!;
const store_passwd = process.env.SSLCZ_STORE_PASS!;
const is_live = process.env.SSLCZ_IS_LIVE === 'true';

// ✅ FIX: Added validation for environment variables
if (!store_id || !store_passwd) {
    throw new Error('SSLCommerz credentials not found in environment variables');
}

// পেমেন্ট সেশন শুরু করার জন্য
export const initPaymentSession = async (payload: ISSLCommerzPayload) => {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.FRONTEND_URL;
    
    if (!baseUrl) {
        throw new Error('NEXTAUTH_URL or FRONTEND_URL not configured');
    }

    const data = {
        store_id,
        store_passwd,
        total_amount: payload.total_amount,
        currency: 'BDT',
        tran_id: payload.tran_id,
        
        // ✅ FIX: Ensure URLs are correctly formatted
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

    console.log('🔄 Initiating SSLCommerz Payment:', {
        tran_id: data.tran_id,
        amount: data.total_amount,
        is_live
    });

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse.status !== 'SUCCESS') {
        console.error('❌ SSLCommerz Init Failed:', apiResponse);
        throw new Error(`Failed to initiate SSLCommerz payment: ${apiResponse.failedreason || 'Unknown error'}`);
    }

    console.log('✅ SSLCommerz Payment Initiated:', apiResponse.GatewayPageURL);
    return apiResponse.GatewayPageURL;
};

// পেমেন্ট ভ্যালিডেট করার জন্য (IPN এবং Success URL-এর জন্য)
export const validatePayment = async (data: any) => {
    try {
        console.log('🔍 Validating Payment:', data.tran_id);
        
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const result = await sslcz.validate(data);
        
        console.log('✅ Payment Validation Result:', result?.status);
        return result;
    } catch (error: any) {
        console.error('❌ Payment Validation Error:', error);
        throw new Error(`Payment validation failed: ${error.message}`);
    }
};