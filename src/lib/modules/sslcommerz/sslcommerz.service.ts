import axios from "axios";
import { ISSLCommerzPayload } from "./sslcommerz.interface";

// ✅ Credentials Fallback setup
const getCredentials = () => {
  const store_id = process.env.SSLCZ_STORE_ID || "pixel689c2e87c5516";
  const store_passwd = process.env.SSLCZ_STORE_PASS || "pixel689c2e87c5516@ssl";
  const is_live = process.env.SSLCZ_IS_LIVE === "true";

  return { store_id, store_passwd, is_live };
};

const SSLCZ_SANDBOX_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const SSLCZ_LIVE_URL    = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

export const initPaymentSession = async (payload: ISSLCommerzPayload) => {
  const { store_id, store_passwd, is_live } = getCredentials();

  let baseUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://guptodhan.com";
  baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash if any

  const apiUrl = is_live ? SSLCZ_LIVE_URL : SSLCZ_SANDBOX_URL;

  // 🔥 CRITICAL FIX: Sanitize Data to prevent SSLCommerz PHP 500 Crash
  // দশমিকের কারণে যেন এরর না আসে তাই Math.round করা হলো
  const safeAmount = Math.round(payload.total_amount).toString();
  // ফোন নাম্বারে শুধুমাত্র সংখ্যা রাখা হলো
  const safePhone = (payload.cus_phone || "01700000000").replace(/[^0-9]/g, "").substring(0, 15);
  // নামে স্পেশাল ক্যারেক্টার বা বাংলা থাকলে তা মুছে ইংলিশ করা হলো
  const safeName = (payload.cus_name || "Customer").replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 50) || "Customer";

  const paymentData: Record<string, string> = {
    store_id: store_id,
    store_passwd: store_passwd,
    total_amount: safeAmount,
    currency: "BDT",
    tran_id: payload.tran_id,
    success_url: `${baseUrl}/api/v1/payment/success/${payload.tran_id}`,
    fail_url: `${baseUrl}/api/v1/payment/fail/${payload.tran_id}`,
    cancel_url: `${baseUrl}/api/v1/payment/cancel/${payload.tran_id}`,
    ipn_url: `${baseUrl}/api/v1/payment/ipn`,
    shipping_method: "Courier",
    product_name: "E-Commerce Product", // Hardcoded safely to avoid crashes
    product_category: "General",
    product_profile: "general",
    cus_name: safeName,
    cus_email: payload.cus_email || "customer@guptodhan.com",
    cus_add1: "Dhaka", // Hardcoded to avoid Bangla/Comma text crash
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: safePhone,
    cus_fax: safePhone,
    ship_name: safeName,
    ship_add1: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
  };

  // ✅ Convert to URLSearchParams for absolute 100% compatibility with PHP
  const params = new URLSearchParams();
  Object.keys(paymentData).forEach(key => {
      params.append(key, paymentData[key]);
  });

  console.log("📤 Sending clean payload to SSLCommerz:", apiUrl);

  try {
    const response = await axios.post(apiUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 30000,
      validateStatus: () => true, // Allows us to catch and log 500 errors manually
    });

    if (response.status !== 200) {
      console.error("❌ SSLCommerz HTTP Error:", response.status, response.data);
      throw new Error(`SSLCommerz Gateway Error: HTTP ${response.status}. The server might be down.`);
    }

    const apiResponse = response.data;
    if (typeof apiResponse !== 'object' || !apiResponse.GatewayPageURL) {
        console.error("❌ Invalid Response from SSLCommerz:", apiResponse);
        throw new Error("Failed to get Gateway URL. Check API credentials.");
    }

    console.log("✅ SSLCommerz GatewayURL Generated Successfully!");
    return apiResponse.GatewayPageURL as string;

  } catch (error: any) {
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
        throw new Error("Cannot connect to SSLCommerz. Please check VPS connection.");
    }
    throw new Error(error.message || "Connection to SSLCommerz failed.");
  }
};

export const validatePayment = async (ipnData: any) => {
  const { store_id, store_passwd, is_live } = getCredentials();

  const VALIDATION_URL = is_live
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

  try {
    console.log("📤 Validating IPN for transaction:", ipnData.tran_id);

    const response = await axios.get(VALIDATION_URL, {
      params: {
        val_id:      ipnData.val_id,
        store_id,
        store_passwd,
        format:      "json",
      },
      timeout: 15000,
    });

    console.log("✅ IPN Validation Result:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("❌ IPN Validation Error:", error.response?.data || error.message);
    throw new Error(`Payment validation failed: ${error.message}`);
  }
};