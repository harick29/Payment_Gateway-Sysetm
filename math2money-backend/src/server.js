import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { config, DEMO_USER_ID } from './config.js';
import { pool, query, withTransaction } from './db.js';
import {
  createRazorpayOrder,
  createRazorpayXPayout,
  verifyPaymentSignature,
  verifyWebhookSignature
} from './razorpay.js';

const app = express();
app.use(cors({ origin: config.frontendUrl, credentials: true }));

// Razorpay webhook must receive the raw request body for HMAC verification.
app.post('/api/webhooks/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!verifyWebhookSignature(req.body, signature)) {
      return res.status(400).json({ message: 'Invalid webhook signature.' });
    }

    const event = JSON.parse(req.body.toString('utf8'));
    const payment = event?.payload?.payment?.entity;
    const orderId = payment?.order_id;

    if (orderId) {
      const status = event.event === 'payment.captured' ? 'CAPTURED' : event.event === 'payment.failed' ? 'FAILED' : null;
      if (status) {
        await query(
          `UPDATE payments SET payment_id = COALESCE($1, payment_id), status = $2 WHERE order_id = $3`,
          [payment.id, status, orderId]
        );
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ message: 'Webhook processing failed.' });
  }
});

app.use(express.json());

function money(paise) {
  return Number(paise) / 100;
}

function getUserId(req) {
  return Number(req.header('x-demo-user-id') || DEMO_USER_ID);
}

function sendError(res, error, status = 500) {
  console.error(error);
  return res.status(status).json({ message: error.message || 'Something went wrong.' });
}

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true, database: 'connected', payoutMode: config.payoutMode });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const userId = getUserId(req);
    const wallet = await query(`SELECT balance_paise, total_earned_paise, total_withdrawn_paise FROM wallets WHERE user_id = $1`, [userId]);
    const activity = await query(
      `SELECT id, type, amount_paise, status, description, created_at, reference_id
       FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );
    const progress = await query(
      `SELECT COUNT(*)::int AS completed_today FROM challenge_attempts
       WHERE user_id = $1 AND is_correct = true AND created_at::date = CURRENT_DATE`,
      [userId]
    );
    const w = wallet.rows[0] || { balance_paise: 0, total_earned_paise: 0, total_withdrawn_paise: 0 };
    res.json({
      user: { id: userId, name: 'Demo User', email: 'demo@math2money.local' },
      wallet: {
        balance: money(w.balance_paise),
        totalEarned: money(w.total_earned_paise),
        totalWithdrawn: money(w.total_withdrawn_paise)
      },
      completedToday: progress.rows[0]?.completed_today || 0,
      transactions: activity.rows.map(t => ({
        id: t.id,
        type: t.type,
        amount: money(t.amount_paise),
        status: t.status,
        title: t.description || t.type,
        time: new Date(t.created_at).toLocaleString('en-IN'),
        referenceId: t.reference_id
      }))
    });
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/wallet', async (req, res) => {
  try {
    const result = await query(`SELECT balance_paise, total_earned_paise, total_withdrawn_paise FROM wallets WHERE user_id = $1`, [getUserId(req)]);
    const w = result.rows[0] || { balance_paise: 0, total_earned_paise: 0, total_withdrawn_paise: 0 };
    res.json({ balance: money(w.balance_paise), totalEarned: money(w.total_earned_paise), totalWithdrawn: money(w.total_withdrawn_paise) });
  } catch (error) { sendError(res, error); }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, type, amount_paise, status, description, reference_id, created_at
       FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100`,
      [getUserId(req)]
    );
    res.json(result.rows.map(t => ({
      id: t.id, type: t.type, amount: money(t.amount_paise), status: t.status,
      title: t.description || t.type, referenceId: t.reference_id,
      time: new Date(t.created_at).toLocaleString('en-IN')
    })));
  } catch (error) { sendError(res, error); }
});

function makeQuestion(difficulty) {
  const level = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'easy';
  let a, b, answer, question;
  if (level === 'easy') {
    a = Math.floor(Math.random() * 30) + 1;
    b = Math.floor(Math.random() * 30) + 1;
    answer = a + b;
    question = `${a} + ${b}`;
  } else if (level === 'medium') {
    a = Math.floor(Math.random() * 40) + 10;
    b = Math.floor(Math.random() * 20) + 2;
    answer = a * b;
    question = `${a} × ${b}`;
  } else {
    b = Math.floor(Math.random() * 12) + 2;
    answer = Math.floor(Math.random() * 30) + 10;
    a = answer * b;
    question = `${a} ÷ ${b}`;
  }
  const reward = level === 'easy' ? 100 : level === 'medium' ? 200 : 500;
  return { level, question, answer, reward };
}

app.get('/api/challenges/next', async (req, res) => {
  try {
    const generated = makeQuestion(req.query.difficulty || 'easy');
    const result = await query(
      `INSERT INTO challenges (question, correct_answer, difficulty, reward_paise) VALUES ($1,$2,$3,$4) RETURNING id`,
      [generated.question, generated.answer, generated.level, generated.reward]
    );
    res.json({ id: result.rows[0].id, question: generated.question, difficulty: generated.level, reward: money(generated.reward) });
  } catch (error) { sendError(res, error); }
});

app.post('/api/challenges/:id/submit', async (req, res) => {
  const challengeId = Number(req.params.id);
  const submitted = Number(req.body.answer);
  if (!Number.isInteger(submitted)) return res.status(400).json({ message: 'A numeric answer is required.' });

  try {
    const result = await withTransaction(async client => {
      const challenge = await client.query(`SELECT * FROM challenges WHERE id = $1`, [challengeId]);
      if (!challenge.rows[0]) throw Object.assign(new Error('Challenge not found.'), { status: 404 });
      const c = challenge.rows[0];
      const correct = submitted === c.correct_answer;
      const reward = correct ? c.reward_paise : 0;
      const userId = getUserId(req);

      await client.query(
        `INSERT INTO challenge_attempts (user_id, challenge_id, submitted_answer, is_correct, reward_paise) VALUES ($1,$2,$3,$4,$5)`,
        [userId, challengeId, submitted, correct, reward]
      );

      if (correct) {
        await client.query(
          `UPDATE wallets SET balance_paise = balance_paise + $1, total_earned_paise = total_earned_paise + $1, updated_at = NOW() WHERE user_id = $2`,
          [reward, userId]
        );
        await client.query(
          `INSERT INTO transactions (user_id, type, amount_paise, status, reference_id, description) VALUES ($1,'EARNING',$2,'SUCCESS',$3,$4)`,
          [userId, reward, `challenge_${challengeId}`, `${c.difficulty} Challenge`]
        );
      }

      const wallet = await client.query(`SELECT balance_paise FROM wallets WHERE user_id = $1`, [userId]);
      return { correct, reward: money(reward), newBalance: money(wallet.rows[0].balance_paise), difficulty: c.difficulty };
    });
    res.json(result);
  } catch (error) { sendError(res, error, error.status || 500); }
});

app.post('/api/payments/create-order', async (req, res) => {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) return res.status(400).json({ message: 'Amount must be between ₹1 and ₹100,000.' });
  try {
    const userId = getUserId(req);
    const amountPaise = Math.round(amount * 100);
    const receipt = `m2m_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const order = await createRazorpayOrder({ amountPaise, receipt });
    await query(
      `INSERT INTO payments (user_id, order_id, amount_paise, status) VALUES ($1,$2,$3,'CREATED')`,
      [userId, order.id, amountPaise]
    );
    res.json({ keyId: config.razorpayKeyId, orderId: order.id, amount: amountPaise, currency: 'INR' });
  } catch (error) { sendError(res, error); }
});

app.post('/api/payments/verify', async (req, res) => {
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
  if (!orderId || !paymentId || !signature) return res.status(400).json({ message: 'Incomplete Razorpay response.' });
  try {
    if (!verifyPaymentSignature({ orderId, paymentId, signature })) return res.status(400).json({ message: 'Invalid Razorpay signature.' });
    const result = await withTransaction(async client => {
      const payment = await client.query(`SELECT * FROM payments WHERE order_id = $1 FOR UPDATE`, [orderId]);
      if (!payment.rows[0]) throw Object.assign(new Error('Payment order not found.'), { status: 404 });
      const p = payment.rows[0];
      if (p.status === 'CAPTURED') return { alreadyProcessed: true, amount: money(p.amount_paise) };
      await client.query(`UPDATE payments SET payment_id = $1, status = 'CAPTURED' WHERE order_id = $2`, [paymentId, orderId]);
      await client.query(`UPDATE wallets SET balance_paise = balance_paise + $1, updated_at = NOW() WHERE user_id = $2`, [p.amount_paise, p.user_id]);
      await client.query(`INSERT INTO transactions (user_id, type, amount_paise, status, reference_id, description) VALUES ($1,'DEPOSIT',$2,'SUCCESS',$3,'Razorpay Deposit')`, [p.user_id, p.amount_paise, paymentId]);
      return { alreadyProcessed: false, amount: money(p.amount_paise) };
    });
    res.json({ verified: true, ...result });
  } catch (error) { sendError(res, error, error.status || 500); }
});

app.post('/api/payouts', async (req, res) => {
  const amount = Number(req.body.amount);
  const fundAccountId = String(req.body.fundAccountId || '');
  if (!Number.isFinite(amount) || amount < 1) return res.status(400).json({ message: 'Enter a valid withdrawal amount.' });

  try {
    const userId = getUserId(req);
    const amountPaise = Math.round(amount * 100);
    const result = await withTransaction(async client => {
      const wallet = await client.query(`SELECT balance_paise FROM wallets WHERE user_id = $1 FOR UPDATE`, [userId]);
      if (!wallet.rows[0] || Number(wallet.rows[0].balance_paise) < amountPaise) throw Object.assign(new Error('Insufficient wallet balance.'), { status: 400 });
      const referenceId = `wd_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;

      if (config.payoutMode === 'razorpayx') {
        const payout = await createRazorpayXPayout({ amountPaise, fundAccountId, referenceId, narration: 'Math2Money payout' });
        await client.query(`UPDATE wallets SET balance_paise = balance_paise - $1, total_withdrawn_paise = total_withdrawn_paise + $1, updated_at = NOW() WHERE user_id = $2`, [amountPaise, userId]);
        await client.query(`INSERT INTO payouts (user_id,payout_id,amount_paise,mode,status,reference_id) VALUES ($1,$2,$3,'UPI',$4,$5)`, [userId, payout.id, amountPaise, payout.status?.toUpperCase() || 'PROCESSING', referenceId]);
        await client.query(`INSERT INTO transactions (user_id,type,amount_paise,status,reference_id,description) VALUES ($1,'WITHDRAWAL',$2,$3,$4,'RazorpayX Payout')`, [userId, amountPaise, payout.status?.toUpperCase() || 'PROCESSING', payout.id]);
        return { status: payout.status, payoutId: payout.id, referenceId, mode: 'razorpayx' };
      }

      // Safe prototype mode: reserve the balance and mark the payout as simulated.
      await client.query(`UPDATE wallets SET balance_paise = balance_paise - $1, total_withdrawn_paise = total_withdrawn_paise + $1, updated_at = NOW() WHERE user_id = $2`, [amountPaise, userId]);
      await client.query(`INSERT INTO payouts (user_id,payout_id,amount_paise,mode,status,reference_id) VALUES ($1,$2,$3,'simulation','SIMULATED',$4)`, [userId, `sim_${referenceId}`, amountPaise, referenceId]);
      await client.query(`INSERT INTO transactions (user_id,type,amount_paise,status,reference_id,description) VALUES ($1,'WITHDRAWAL',$2,'SUCCESS',$3,'Demo Payout (Simulation)')`, [userId, amountPaise, referenceId]);
      return { status: 'SIMULATED', payoutId: `sim_${referenceId}`, referenceId, mode: 'simulation' };
    });
    res.json(result);
  } catch (error) { sendError(res, error, error.status || 500); }
});

app.use((err, _req, res, _next) => sendError(res, err));

const server = app.listen(config.port, () => {
  console.log(`Math2Money backend running on http://localhost:${config.port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
