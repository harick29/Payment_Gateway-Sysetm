CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance_paise BIGINT NOT NULL DEFAULT 0 CHECK (balance_paise >= 0),
  total_earned_paise BIGINT NOT NULL DEFAULT 0 CHECK (total_earned_paise >= 0),
  total_withdrawn_paise BIGINT NOT NULL DEFAULT 0 CHECK (total_withdrawn_paise >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  correct_answer INTEGER NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  reward_paise INTEGER NOT NULL CHECK (reward_paise > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  submitted_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  reward_paise INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('EARNING','DEPOSIT','WITHDRAWAL','REFUND')),
  amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
  status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
  reference_id VARCHAR(120),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id VARCHAR(100) UNIQUE NOT NULL,
  payment_id VARCHAR(100),
  amount_paise INTEGER NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'CREATED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payout_id VARCHAR(120),
  amount_paise INTEGER NOT NULL,
  mode VARCHAR(20) NOT NULL DEFAULT 'simulation',
  status VARCHAR(30) NOT NULL DEFAULT 'PROCESSING',
  reference_id VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (name, email)
VALUES ('Demo User', 'demo@math2money.local')
ON CONFLICT (email) DO NOTHING;

INSERT INTO wallets (user_id)
SELECT id FROM users WHERE email = 'demo@math2money.local'
ON CONFLICT (user_id) DO NOTHING;
