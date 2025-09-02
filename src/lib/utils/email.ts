// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\utils\email.ts
import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';

interface EmailOptions { to: string; subject: string; template: string; data: { [key: string]: any }; }

export const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const { to, subject, template, data } = options;
  const templatePath = path.join(process.cwd(), 'src', 'lib', 'email-templates', template);
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Guptodhan'}" <${process.env.SMTP_USER}>`,
    to, subject, html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP Email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ FAILED TO SEND EMAIL:', error);
    throw new Error('Failed to send the verification email.');
  }
};