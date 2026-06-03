// ✅ FIXED: Use qs.stringify to properly encode form-urlencoded payload
import axios from "axios";
import qs from "qs";
import { ISSLCommerzPayload } from "./sslcommerz.interface";

const store_id    = process.env.SSLCZ_STORE_ID!;
const store_passwd = process.env.SSLCZ_STORE_PASS!;
const is_live     = process.env.SSLCZ_IS_LIVE === "true";

const SSLCZ_SANDBOX_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const SSLCZ_LIVE_URL    = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";
const SSLCZ_VALIDATION_URL = is_live
  ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
  : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

if (!store_id || !store_passwd) {
  throw new Error("SSLCommerz credentials not found in environment variables");
}

export const initPaymentSession = async (payload: ISSLCommerzPayload) => {
  const baseUrl =
    process.env.SSLCZ_CALLBACK_BASE_URL ||
    process.env.FRONTEND_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://guptodhan.vercel.app");

  if (!baseUrl) {
    throw new Error("NEXTAUTH_URL or FRONTEND_URL not configured");
  }

  // ✅ FIX: All values must be strings for form-urlencoded encoding
  const paymentData: Record<string, string> = {
    store_id,
    store_passwd,
    total_amount:      String(payload.total_amount),
    currency:          "BDT",
    tran_id:           payload.tran_id,
    success_url:       `${baseUrl}/api/v1/payment/success/${payload.tran_id}`,
    fail_url:          `${baseUrl}/api/v1/payment/fail/${payload.tran_id}`,
    cancel_url:        `${baseUrl}/api/v1/payment/cancel/${payload.tran_id}`,
    ipn_url:           `${baseUrl}/api/v1/payment/ipn`,
    shipping_method:   "Courier",
    product_name:      payload.product_name,
    product_category:  "E-commerce",
    product_profile:   "general",
    cus_name:          payload.cus_name,
    cus_email:         payload.cus_email,
    cus_add1:          payload.cus_add1 || "N/A",
    cus_city:          "Dhaka",
    cus_state:         "Dhaka",
    cus_postcode:      "1000",
    cus_country:       "Bangladesh",
    cus_phone:         payload.cus_phone || "01700000000",
    cus_fax:           payload.cus_phone || "01700000000",
    ship_name:         payload.cus_name,
    ship_add1:         payload.cus_add1 || "N/A",
    ship_city:         "Dhaka",
    ship_state:        "Dhaka",
    ship_postcode:     "1000",
    ship_country:      "Bangladesh",
  };

  try {
    const apiUrl = is_live ? SSLCZ_LIVE_URL : SSLCZ_SANDBOX_URL;

    console.log("📤 Sending request to SSLCommerz:", apiUrl);
    console.log("📦 Payload tran_id:", paymentData.tran_id);
    console.log("💰 Amount:", paymentData.total_amount);

    // ✅ KEY FIX: qs.stringify() converts object → "key=value&key2=value2"
    // Without this, axios sends a JSON object even with the urlencoded header,
    // which causes SSLCommerz to return HTTP 500.
    const response = await axios.post(apiUrl, qs.stringify(paymentData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 15000, // 15s timeout
    });

    const apiResponse = response.data;

    if (!apiResponse?.GatewayPageURL) {
      console.error("❌ SSLCommerz Init Failed:", apiResponse);
      throw new Error(
        apiResponse?.failedreason || "Failed to get GatewayPageURL from SSLCommerz"
      );
    }

    console.log("✅ SSLCommerz Init Success:", apiResponse.GatewayPageURL);
    return apiResponse.GatewayPageURL;
  } catch (error: any) {
    const errMsg =
      error.response?.data?.failedreason ||
      error.response?.data ||
      error.message;
    console.error("❌ SSLCommerz Init Error:", errMsg);
    throw new Error(`Failed to initiate SSLCommerz payment: ${errMsg}`);
  }
};

export const validatePayment = async (ipnData: any) => {
  try {
    const validationData = {
      val_id:      ipnData.val_id,
      store_id,
      store_passwd,
      format:      "json",
    };

    console.log("📤 Validating payment with SSLCommerz");

    const response = await axios.get(SSLCZ_VALIDATION_URL, {
      params:  validationData,
      timeout: 15000,
    });

    const result = response.data;
    console.log("✅ Payment Validation Result:", result);

    return result;
  } catch (error: any) {
    console.error("❌ Payment Validation Error:", error.response?.data || error.message);
    throw new Error(`Payment validation failed: ${error.message}`);
  }
};