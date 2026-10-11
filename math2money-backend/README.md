# Math2Money Backend

Node.js + Express + PostgreSQL backend for the Math2Money React prototype.

## What is included

- Server-side math challenge generation and answer verification
- Persistent wallet balance
- Challenge earnings ledger
- Transaction history
- Razorpay Payment Gateway TEST-mode order creation
- Razorpay payment signature verification
- Razorpay webhook verification endpoint
- Safe payout simulation by default
- Optional RazorpayX payout adapter

## 1. Requirements

- Node.js 18+
- PostgreSQL 14+
- A Razorpay TEST-mode account only if you want to test Add Money

## 2. Database

Create a PostgreSQL database named `math2money`.

Then run `sql/schema.sql` using psql or pgAdmin.

Example:

```bash
createdb math2money
psql -d math2money -f sql/schema.sql
```

## 3. Environment

Copy `.env.example` to `.env` and fill your PostgreSQL connection string.

For payment testing, add your Razorpay TEST `Key ID` and `Key Secret`.

Do NOT put the Razorpay secret in the React app.

## 4. Start backend

```bash
npm install
npm run dev
```

Backend: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## 5. Start frontend

In the frontend folder:

```bash
npm install
npm run dev
```

Frontend defaults to `http://localhost:5173`.

## Razorpay payment flow

1. React asks `POST /api/payments/create-order`.
2. Backend creates a Razorpay order using the server secret.
3. React opens Razorpay Checkout with the public key.
4. React sends the returned IDs to `POST /api/payments/verify`.
5. Backend verifies the HMAC SHA-256 signature.
6. Only after verification is the wallet credited.
7. Razorpay webhook endpoint can update payment state asynchronously.

## Payout flow

The project defaults to:

```env
PAYOUT_MODE=simulation
```

This is deliberate: it prevents accidental real-money transfers while developing.

To use RazorpayX, you need an appropriate RazorpayX setup and credentials. Then set:

```env
PAYOUT_MODE=razorpayx
RAZORPAYX_KEY_ID=...
RAZORPAYX_KEY_SECRET=...
RAZORPAYX_ACCOUNT_NUMBER=...
```

The frontend should pass a RazorpayX `fund_account_id` for a configured beneficiary.

## Demo user

The prototype uses a fixed demo user ID (`1`) so you can integrate the frontend without building authentication first.

This is intentionally a prototype shortcut. Before production, replace it with real authentication and authorization.
