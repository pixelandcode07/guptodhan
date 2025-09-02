// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\utils\email.ts

import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

export const sendEmail = async (options: EmailOptions) => {
  // ১. Nodemailer transporter তৈরি করা
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: true, // 465 পোর্টের জন্য এটি 'true' হতে হবে
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const { to, subject, template, data } = options;

  // ২. EJS টেমপ্লেটের পাথ খুঁজে বের করা
  const templatePath = path.join(process.cwd(), 'src', 'lib', 'email-templates', template);

  // ৩. EJS টেমপ্লেটকে ডেটা দিয়ে HTML-এ রেন্ডার করা
  const html: string = await ejs.renderFile(templatePath, data);

  // ৪. ইমেইল অপশন ডিফাইন করা
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Guptodhan'}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  // ৫. ইমেইল পাঠানো
  await transporter.sendMail(mailOptions);
  console.log(`✅ OTP Email sent successfully to ${to}`);
};