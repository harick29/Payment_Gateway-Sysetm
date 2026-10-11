import crypto from 'node:crypto';
import { config } from './config.js';

function authHeader(key, secret) {
  return `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`;
}

export async function createRazorpayOrder({ amountPaise, receipt }) {
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    throw new Error('Razorpay test keys are not configured. Add them to backend/.env.');
  }

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: authHeader(config.razorpayKeyId, config.razorpayKeySecret),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      payment_capture: 1
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.description || 'Razorpay order creation failed.');
  }
  return data;
}

export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!config.razorpayKeySecret) return false;
  const expected = crypto
    .createHmac('sha256', config.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ''));
}

export function verifyWebhookSignature(rawBody, signature) {
  if (!config.razorpayWebhookSecret || !signature) return false;
  const expected = crypto
    .createHmac('sha256', config.razorpayWebhookSecret)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function createRazorpayXPayout({ amountPaise, fundAccountId, referenceId, narration }) {
  if (!config.razorpayXKeyId || !config.razorpayXKeySecret || !config.razorpayXAccountNumber) {
    throw new Error('RazorpayX payout credentials are not configured.');
  }
  if (!fundAccountId) {
    throw new Error('A RazorpayX fund_account_id is required for a live payout.');
  }

  const response = await fetch('https://api.razorpay.com/v1/payouts', {
    method: 'POST',
    headers: {
      Authorization: authHeader(config.razorpayXKeyId, config.razorpayXKeySecret),
      'Content-Type': 'application/json',
      'X-Payout-Idempotency': crypto.randomUUID()
    },
    body: JSON.stringify({
      account_number: config.razorpayXAccountNumber,
      fund_account_id: fundAccountId,
      amount: amountPaise,
      currency: 'INR',
      mode: 'UPI',
      purpose: 'payout',
      queue_if_low_balance: true,
      reference_id: referenceId,
      narration: narration.slice(0, 30)
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.description || 'RazorpayX payout failed.');
  }
  return data;
}
