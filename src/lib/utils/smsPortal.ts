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
  const apiKey = process.env.SMS_API_KEY;
  const shouldSendSMS = process.env.FORCE_SMS_SEND === 'true' || process.env.NODE_ENV !== 'development';

  if (!shouldSendSMS) {
    console.log(`⚠️ SMS Skipped (Dev Mode). Target: ${phone}, Msg: ${message}`);
    return { success: true, message: "Skipped in dev mode" };
  }

  try {
    const formattedPhone = formatBDPhoneNumber(phone);
    const url = "https://api.sms.net.bd/sendsms";

    const response = await axios.post(url, {
      api_key: apiKey,
      msg: message,
      to: formattedPhone,
    });

    if (response.data.error === 0) {
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