import axios from "axios";

// ========================================
// 🛠️ Helper: বাংলাদেশি নম্বর ফরম্যাট করা
// ========================================
export const formatBDPhoneNumber = (phone: string): string => {
  let formatted = phone.replace(/[\s\-()]/g, "").trim();

  if (formatted.startsWith("+88")) {
    formatted = formatted.substring(1); // +8801... → 8801...
  } else if (formatted.startsWith("01")) {
    formatted = "88" + formatted; // 01... → 8801...
  }
  // already starts with 88 → unchanged

  return formatted;
};

// ========================================
// 📡 KhudeBarta SMS Gateway Endpoints
// (Domain আগে try হবে, fail হলে IP fallback)
// ========================================
const SMS_ENDPOINTS = [
  "http://portal.khudebarta.com:3775/sendtext",
  "http://118.67.213.114:3775/sendtext",
];

// ========================================
// 📱 sendSMS — Main Function
// ========================================
export const sendSMS = async (
  phone: string,
  message: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  const apiKey    = process.env.SMS_API_KEY;
  const secretKey = process.env.SMS_SECRET_KEY;
  const callerID  = process.env.SMS_CALLER_ID;

  // ── Dev mode check ──────────────────────────────────────────
  const shouldSendSMS =
    process.env.FORCE_SMS_SEND === "true" ||
    process.env.NODE_ENV !== "development";

  if (!shouldSendSMS) {
    console.log(`⚠️  SMS Skipped (Dev Mode). Target: ${phone}, Msg: ${message}`);
    return { success: true, data: { note: "Skipped in dev mode" } };
  }

  // ── Credential check ────────────────────────────────────────
  if (!apiKey || !secretKey || !callerID) {
    const missing = [
      !apiKey    && "SMS_API_KEY",
      !secretKey && "SMS_SECRET_KEY",
      !callerID  && "SMS_CALLER_ID",
    ]
      .filter(Boolean)
      .join(", ");
    console.error(`❌ SMS .env এ এগুলো missing: ${missing}`);
    return { success: false, error: `Missing credentials: ${missing}` };
  }

  // ── Format phone ─────────────────────────────────────────────
  const formattedPhone = formatBDPhoneNumber(phone);
  console.log(`📱 SMS পাঠানো হচ্ছে → Raw: ${phone} | Formatted: ${formattedPhone}`);

  // ── Try each endpoint ────────────────────────────────────────
  let lastError: string = "Unknown error";

  for (const endpoint of SMS_ENDPOINTS) {
    try {
      console.log(`🔗 Trying endpoint: ${endpoint}`);

      const response = await axios.get(endpoint, {
        params: {
          apikey:         apiKey,
          secretkey:      secretKey,
          callerID:       callerID,
          toUser:         formattedPhone,
          messageContent: message,
        },
        timeout: 10000, // 10 seconds
      });

      const data = response.data;
      console.log(`📨 Gateway Response:`, data);

      // Status "0" = ACCEPTED (success)
      if (data?.Status === "0" || data?.Text === "ACCEPTD") {
        console.log(`✅ SMS সফলভাবে পাঠানো হয়েছে! Message_ID: ${data?.Message_ID}`);
        return { success: true, data };
      }

      // Known error codes থেকে human-readable message
      const errMsg = resolveErrorCode(data?.Status, data?.StatusDescription);
      console.warn(`⚠️  Gateway Rejected [${endpoint}]:`, errMsg, data);
      lastError = errMsg;

      // "Org Client Not Found" (-1) হলে অন্য endpoint try করে লাভ নেই
      // কিন্তু 101 (server error) হলে fallback try করা যায়
      if (data?.Status === "-1" || data?.Status === "109" || data?.Status === "108") {
        break; // credential/config issue — retry করে কাজ হবে না
      }
    } catch (err: any) {
      const msg = err.code === "ECONNREFUSED"
        ? `Connection refused to ${endpoint}`
        : err.code === "ETIMEDOUT" || err.code === "ECONNABORTED"
        ? `Timeout connecting to ${endpoint}`
        : err.message;
      console.warn(`⚠️  Network error [${endpoint}]: ${msg}`);
      lastError = msg;
      // next endpoint try করবে
    }
  }

  return { success: false, error: lastError };
};

// ========================================
// 🔍 Error Code Resolver
// ========================================
function resolveErrorCode(status?: string, desc?: string): string {
  const codes: Record<string, string> = {
    "-1":  "Org Client Not Found — KhudeBarta পোর্টালে Originating Client সেট করুন",
    "1":   "Request failed",
    "101": "Internal server error (KhudeBarta side)",
    "108": "Wrong API password / secretkey",
    "109": "API user not found or deleted — apikey চেক করুন",
    "114": "Required content missing",
    "137": "TPS limit exceeded — অনেক দ্রুত request পাঠানো হচ্ছে",
    "-42": "Authorization failed",
  };
  return codes[status ?? ""] ?? desc ?? `Unknown status: ${status}`;
}