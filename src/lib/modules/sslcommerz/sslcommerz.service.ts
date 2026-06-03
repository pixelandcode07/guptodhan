import axios from "axios";
import { ISSLCommerzPayload } from "./sslcommerz.interface";

// ✅ Lazily read env vars inside functions — avoids build-time crash
const getCredentials = () => {
  const store_id    = process.env.SSLCZ_STORE_ID;
  const store_passwd = process.env.SSLCZ_STORE_PASS;
  const is_live     = process.env.SSLCZ_IS_LIVE === "true";

  if (!store_id || !store_passwd) {
    throw new Error(
      `SSLCommerz credentials missing. ` +
      `SSLCZ_STORE_ID=${store_id ? "✅" : "❌ MISSING"}, ` +
      `SSLCZ_STORE_PASS=${store_passwd ? "✅" : "❌ MISSING"}`
    );
  }

  return { store_id, store_passwd, is_live };
};

const SSLCZ_SANDBOX_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const SSLCZ_LIVE_URL    = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

export const initPaymentSession = async (payload: ISSLCommerzPayload) => {
  const { store_id, store_passwd, is_live } = getCredentials();

  const baseUrl =
    process.env.SSLCZ_CALLBACK_BASE_URL ||
    process.env.FRONTEND_URL            ||
    process.env.NEXTAUTH_URL            ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://guptodhan.com");

  if (!baseUrl) {
    throw new Error("Base URL not configured. Set FRONTEND_URL or NEXTAUTH_URL.");
  }

  const apiUrl = is_live ? SSLCZ_LIVE_URL : SSLCZ_SANDBOX_URL;

  // 🔥 FIX 1: Clean special characters that might break SSLCommerz PHP backend
  const safeProductName = (payload.product_name || "Guptodhan Product").replace(/[^a-zA-Z0-9 \-]/g, "");
  const safePhone = (payload.cus_phone || "01700000000").replace(/[^a-zA-Z0-9]/g, "");

  // 🔥 FIX 2: Force exact 2 decimal places for the amount
  const formattedAmount = Number(payload.total_amount).toFixed(2);

  const paymentData = {
    store_id,
    store_passwd,
    total_amount:     formattedAmount,
    currency:         "BDT",
    tran_id:          payload.tran_id,
    success_url:      `${baseUrl}/api/v1/payment/success/${payload.tran_id}`,
    fail_url:         `${baseUrl}/api/v1/payment/fail/${payload.tran_id}`,
    cancel_url:       `${baseUrl}/api/v1/payment/cancel/${payload.tran_id}`,
    ipn_url:          `${baseUrl}/api/v1/payment/ipn`,
    shipping_method:  "Courier",
    product_name:     safeProductName,
    product_category: "E-commerce",
    product_profile:  "general",
    cus_name:         payload.cus_name         || "Customer",
    cus_email:        payload.cus_email        || "customer@guptodhan.com",
    cus_add1:         payload.cus_add1         || "Dhaka",
    cus_city:         "Dhaka",
    cus_state:        "Dhaka",
    cus_postcode:     "1000",
    cus_country:      "Bangladesh",
    cus_phone:        safePhone,
    cus_fax:          safePhone,
    ship_name:        payload.cus_name         || "Customer",
    ship_add1:        payload.cus_add1         || "Dhaka",
    ship_city:        "Dhaka",
    ship_state:       "Dhaka",
    ship_postcode:    "1000",
    ship_country:     "Bangladesh",
  };

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📤 SSLCommerz Request");
  console.log("   URL:       ", apiUrl);
  console.log("   Mode:      ", is_live ? "🔴 LIVE" : "🟡 SANDBOX");
  console.log("   store_id:  ", store_id);
  console.log("   tran_id:   ", paymentData.tran_id);
  console.log("   amount:    ", paymentData.total_amount, "BDT");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    // 🔥 FIX 3: Passed directly as an object, Axios will auto-encode it to x-www-form-urlencoded
    const response = await axios.post(apiUrl, paymentData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 20000, 
      // Do not throw error on 500 so we can log the exact HTML
      validateStatus: () => true,
    });

    console.log("📥 SSLCommerz HTTP Status:", response.status);

    if (response.status !== 200) {
      console.error("❌ SSLCommerz 500 Error Body:", response.data);
      throw new Error(`SSLCommerz Server Error (HTTP ${response.status}). Please try again.`);
    }

    const apiResponse = response.data;

    if (typeof apiResponse !== 'object' || !apiResponse?.GatewayPageURL) {
      const reason = apiResponse?.failedreason || "Invalid response format from SSLCommerz";
      console.error("❌ SSLCommerz: No GatewayPageURL. Raw response:", apiResponse);
      throw new Error(`SSLCommerz rejected the request: ${reason}`);
    }

    console.log("✅ SSLCommerz GatewayURL:", apiResponse.GatewayPageURL);
    return apiResponse.GatewayPageURL as string;

  } catch (error: any) {
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
      throw new Error("Cannot connect to SSLCommerz. Please check internet connection or try again.");
    }
    throw error;
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