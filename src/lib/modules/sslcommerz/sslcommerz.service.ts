// ✅ ALTERNATIVE SOLUTION: Use axios instead of fetch
import axios from "axios";
import { ISSLCommerzPayload } from "./sslcommerz.interface";

const store_id = process.env.SSLCZ_STORE_ID!;
const store_passwd = process.env.SSLCZ_STORE_PASS!;
const is_live = process.env.SSLCZ_IS_LIVE === "true";

// SSLCommerz API endpoints
const SSLCZ_SANDBOX_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const SSLCZ_LIVE_URL = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";
const SSLCZ_VALIDATION_URL = is_live 
  ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
  : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

if (!store_id || !store_passwd) {
  throw new Error("SSLCommerz credentials not found in environment variables");
}

export const initPaymentSession = async (payload: ISSLCommerzPayload) => {
  const baseUrl = process.env.FRONTEND_URL || process.env.NEXTAUTH_URL;
  if (!baseUrl) {
    throw new Error("NEXTAUTH_URL or FRONTEND_URL not configured");
  }

  const paymentData = {
    store_id,
    store_passwd,
    total_amount: payload.total_amount,
    currency: "BDT",
    tran_id: payload.tran_id,
    success_url: `${baseUrl}/api/v1/payment/success/${payload.tran_id}`,
    fail_url: `${baseUrl}/api/v1/payment/fail/${payload.tran_id}`,
    cancel_url: `${baseUrl}/api/v1/payment/cancel/${payload.tran_id}`,
    ipn_url: `${baseUrl}/api/v1/payment/ipn`,
    shipping_method: "Courier",
    product_name: payload.product_name,
    product_category: "E-commerce",
    product_profile: "general",
    cus_name: payload.cus_name,
    cus_email: payload.cus_email,
    cus_add1: payload.cus_add1,
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: payload.cus_phone,
    cus_fax: payload.cus_phone,
    ship_name: payload.cus_name,
    ship_add1: payload.cus_add1,
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
  };

  try {
    const apiUrl = is_live ? SSLCZ_LIVE_URL : SSLCZ_SANDBOX_URL;
    
    console.log('📤 Sending request to SSLCommerz:', apiUrl);
    
    const response = await axios.post(apiUrl, paymentData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const apiResponse = response.data;

    if (!apiResponse?.GatewayPageURL) {
      console.error("❌ SSLCommerz Init Failed:", apiResponse);
      throw new Error(apiResponse?.failedreason || "Failed to get GatewayPageURL from SSLCommerz");
    }

    console.log("✅ SSLCommerz Init Success:", apiResponse.GatewayPageURL);
    return apiResponse.GatewayPageURL;
  } catch (error: any) {
    console.error("❌ SSLCommerz Init Error:", error.response?.data || error.message);
    throw new Error(`Failed to initiate SSLCommerz payment: ${error.response?.data?.failedreason || error.message}`);
  }
};

export const validatePayment = async (ipnData: any) => {
  try {
    const validationData = {
      val_id: ipnData.val_id,
      store_id,
      store_passwd,
      format: 'json',
    };

    console.log('📤 Validating payment with SSLCommerz');
    
    const response = await axios.get(SSLCZ_VALIDATION_URL, {
      params: validationData,
    });

    const result = response.data;
    console.log("✅ Payment Validation Result:", result);
    
    return result;
  } catch (error: any) {
    console.error("❌ Payment Validation Error:", error.response?.data || error.message);
    throw new Error(`Payment validation failed: ${error.message}`);
  }
};