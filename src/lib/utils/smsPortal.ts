import axios from "axios";

// বাংলাদেশি নম্বর ফরম্যাট করার জন্য হেল্পার
export const formatBDPhoneNumber = (phone: string): string => {
  let formatted = phone.replace(/[\s-]/g, '');
  if (formatted.startsWith('01')) {
    formatted = '88' + formatted;
  } else if (formatted.startsWith('+88')) {
    formatted = formatted.substring(1);
  }
  return formatted;
};

export const sendSMS = async (phone: string, message: string) => {
  // .env থেকে KhudeBarta এর ক্রেডেনশিয়াল নেওয়া হচ্ছে
  const apiKey = process.env.SMS_API_KEY;
  const secretKey = process.env.SMS_SECRET_KEY; 
  const callerID = process.env.SMS_CALLER_ID; 

  const shouldSendSMS = process.env.FORCE_SMS_SEND === 'true' || process.env.NODE_ENV !== 'development';

  if (!shouldSendSMS) {
    console.log(`⚠️ SMS Skipped (Dev Mode). Target: ${phone}, Msg: ${message}`);
    return { success: true, message: "Skipped in dev mode" };
  }

  if (!apiKey || !secretKey || !callerID) {
    console.error("❌ SMS Configuration Missing in .env (Need API_KEY, SECRET_KEY, CALLER_ID)");
    return { success: false, error: "Missing API credentials" };
  }

  try {
    const formattedPhone = formatBDPhoneNumber(phone);
    
    // KhudeBarta Bulk SMS Endpoint
    const url = "http://118.67.213.114:3775/sendtext";

    // KhudeBarta API অনুযায়ী GET রিকোয়েস্টে প্যারামিটার পাঠানো হচ্ছে
    const response = await axios.get(url, {
      params: {
        apikey: apiKey,
        secretkey: secretKey,
        callerID: callerID,
        toUser: formattedPhone,
        messageContent: message
      }
    });

    // KhudeBarta API তে Status "0" মানে রিকোয়েস্ট সাকসেসফুল 
    if (response.data && response.data.Status === "0") {
      console.log(`✅ SMS Sent Successfully to ${phone}`);
      return { success: true, data: response.data };
    } else {
      console.warn(`⚠️ SMS Gateway Warning:`, response.data);
      return { success: false, data: response.data };
    }
  } catch (error: any) {
    console.error("❌ SMS Network Error:", error.message);
    return { success: false, error: error.message };
  }
};