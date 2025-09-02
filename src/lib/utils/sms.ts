import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

interface SmsOptions { to: string; body: string; }

export const sendSms = async (options: SmsOptions) => {
  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials are not configured in .env.local');
    }
    await client.messages.create({
      body: options.body,
      from: twilioPhoneNumber,
      to: options.to,
    });
    console.log(`✅ SMS sent successfully to ${options.to}`);
  } catch (error) {
    console.error('❌ FAILED TO SEND SMS:', error);
    throw new Error('Failed to send the verification SMS.');
  }
};