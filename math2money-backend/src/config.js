import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  payoutMode: process.env.PAYOUT_MODE || 'simulation',
  razorpayXKeyId: process.env.RAZORPAYX_KEY_ID || '',
  razorpayXKeySecret: process.env.RAZORPAYX_KEY_SECRET || '',
  razorpayXAccountNumber: process.env.RAZORPAYX_ACCOUNT_NUMBER || ''
};

export const DEMO_USER_ID = 1;
