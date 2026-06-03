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

// 🔥 FIX: Changed v3 to v4 for Sandbox URL
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

  // ✅ Build form-urlencoded string manually — no external dependency needed
  const params: Record<string, string> = {
    store_id,
    store_passwd,
    total_amount:     String(payload.total_amount),
    currency:         "BDT",
    tran_id:          payload.tran_id,
    success_url:      `${baseUrl}/api/v1/payment/success/${payload.tran_id}`,
    fail_url:         `${baseUrl}/api/v1/payment/fail/${payload.tran_id}`,
    cancel_url:       `${baseUrl}/api/v1/payment/cancel/${payload.tran_id}`,
    ipn_url:          `${baseUrl}/api/v1/payment/ipn`,
    shipping_method:  "Courier",
    product_name:     payload.product_name     || "Guptodhan Product",
    product_category: "E-commerce",
    product_profile:  "general",
    cus_name:         payload.cus_name         || "Customer",
    cus_email:        payload.cus_email        || "customer@guptodhan.com",
    cus_add1:         payload.cus_add1         || "Dhaka",
    cus_city:         "Dhaka",
    cus_state:        "Dhaka",
    cus_postcode:     "1000",
    cus_country:      "Bangladesh",
    cus_phone:        payload.cus_phone        || "01700000000",
    cus_fax:          payload.cus_phone        || "01700000000",
    ship_name:        payload.cus_name         || "Customer",
    ship_add1:        payload.cus_add1         || "Dhaka",
    ship_city:        "Dhaka",
    ship_state:       "Dhaka",
    ship_postcode:    "1000",
    ship_country:     "Bangladesh",
  };

  // ✅ URLSearchParams — built into Node.js, no npm package needed
  const body = new URLSearchParams(params).toString();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📤 SSLCommerz Request");
  console.log("   URL:       ", apiUrl);
  console.log("   Mode:      ", is_live ? "🔴 LIVE" : "🟡 SANDBOX");
  console.log("   store_id:  ", store_id);
  console.log("   tran_id:   ", params.tran_id);
  console.log("   amount:    ", params.total_amount, "BDT");
  console.log("   success_url:", params.success_url);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    const response = await axios.post(apiUrl, body, {
      headers: {
        "Content-Type":  "application/x-www-form-urlencoded",
        "Accept":        "application/json",
        "Cache-Control": "no-cache",
      },
      timeout: 20000, // 20 seconds
      // ✅ Don't throw on 4xx/5xx — handle manually so we can log details
      validateStatus: () => true,
    });

    console.log("📥 SSLCommerz HTTP Status:", response.status);
    
    // Check if the response is actually an object before trying to JSON.stringify
    if (typeof response.data === 'object') {
        console.log("📥 SSLCommerz Response:", JSON.stringify(response.data, null, 2));
    } else {
        console.log("📥 SSLCommerz Response (Raw/HTML):", response.data.substring(0, 200) + '...');
    }

    if (response.status !== 200) {
      throw new Error(
        `SSLCommerz returned HTTP ${response.status}. ` +
        `Response: ${typeof response.data === 'object' ? JSON.stringify(response.data) : 'HTML/Invalid format'}`
      );
    }

    const apiResponse = response.data;

    // Safety check if response is HTML instead of JSON
    if (typeof apiResponse !== 'object' || !apiResponse?.GatewayPageURL) {
      const reason = apiResponse?.failedreason || apiResponse?.status || "Invalid response format from SSLCommerz";
      console.error("❌ SSLCommerz: No GatewayPageURL in response");
      console.error("   failedreason:", apiResponse?.failedreason);
      throw new Error(`SSLCommerz rejected the request: ${reason}`);
    }

    console.log("✅ SSLCommerz GatewayURL:", apiResponse.GatewayPageURL);
    return apiResponse.GatewayPageURL as string;

  } catch (error: any) {
    // Network-level error (DNS, timeout, connection refused)
    if (error.code === "ECONNREFUSED") {
      throw new Error("Cannot connect to SSLCommerz. Check VPS network/firewall.");
    }
    if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
      throw new Error("SSLCommerz request timed out. Check VPS outbound connection.");
    }
    // Re-throw our own errors
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