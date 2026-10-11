const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-demo-user-id': '1',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  dashboard: () => request('/dashboard'),
  wallet: () => request('/wallet'),
  transactions: () => request('/transactions'),
  nextChallenge: (difficulty = 'easy') => request(`/challenges/next?difficulty=${encodeURIComponent(difficulty)}`),
  submitChallenge: (id, answer) => request(`/challenges/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answer: Number(answer) })
  }),
  createPaymentOrder: (amount) => request('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount: Number(amount) })
  }),
  verifyPayment: (payload) => request('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  payout: (amount, fundAccountId = '') => request('/payouts', {
    method: 'POST',
    body: JSON.stringify({ amount: Number(amount), fundAccountId })
  })
};

export async function openRazorpayCheckout({ amount, orderId, keyId, onSuccess }) {
  if (!window.Razorpay) {
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-razorpay-checkout]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.dataset.razorpayCheckout = 'true';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  const razorpay = new window.Razorpay({
    key: keyId,
    amount,
    currency: 'INR',
    name: 'Math2Money',
    description: 'Add money to Math2Money wallet',
    order_id: orderId,
    handler: onSuccess,
    theme: { color: '#111827' }
  });

  razorpay.open();
}
