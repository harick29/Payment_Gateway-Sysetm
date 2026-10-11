import {
  ArrowRight,
  CheckCircle2,
  Brain,
  Wallet,
  ShieldCheck,
  Sparkles,
  Coins,
} from "lucide-react";

import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <Coins size={21} />
          </div>

          <span>Math2Money</span>

        </div>


        <div className="nav-links">

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#rewards">
            Rewards
          </a>

        </div>


        <div className="nav-actions">

          {/* LOGIN */}

          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>


          {/* GET STARTED */}

          <Link
            to="/signup"
            className="primary-btn small-btn"
          >
            Get Started
            <ArrowRight size={17} />
          </Link>

        </div>

      </nav>


      {/* =========================
          HERO SECTION
      ========================= */}

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="eyebrow">

              <Sparkles size={15} />

              Turn your skills into rewards

            </div>


            <h1>

              Solve.

              <span> Earn.</span>

              <br />

              Grow.

            </h1>


            <p className="hero-description">

              Challenge yourself with daily math problems,
              earn coins for every correct answer, and turn
              your progress into real rewards.

            </p>


            <div className="hero-buttons">

              {/* START SOLVING */}

              <Link
                to="/signup"
                className="primary-btn hero-btn"
              >

                Start Solving

                <ArrowRight size={19} />

              </Link>


              {/* HOW IT WORKS */}

              <a
                href="#how-it-works"
                className="secondary-btn"
              >
                See How It Works
              </a>

            </div>


            <div className="hero-trust">

              <div>

                <CheckCircle2 size={17} />

                Daily challenges

              </div>


              <div>

                <CheckCircle2 size={17} />

                Reward tracking

              </div>


              <div>

                <CheckCircle2 size={17} />

                Secure payouts

              </div>

            </div>

          </div>


          {/* =========================
              HERO VISUAL
          ========================= */}

          <div className="hero-visual">

            <div className="glow glow-one"></div>

            <div className="glow glow-two"></div>


            <div className="dashboard-preview">


              {/* BALANCE */}

              <div className="preview-top">

                <div>

                  <span className="preview-label">
                    AVAILABLE BALANCE
                  </span>

                  <h3>
                    ₹127.00
                  </h3>

                </div>


                <div className="coin-badge">

                  <Coins size={20} />

                  127

                </div>

              </div>


              {/* PROGRESS */}

              <div className="progress-section">

                <div className="progress-header">

                  <span>
                    Today's progress
                  </span>

                  <span>
                    7 / 10
                  </span>

                </div>


                <div className="progress-bar">

                  <div className="progress-fill"></div>

                </div>

              </div>


              {/* CHALLENGE */}

              <div className="challenge-preview">

                <div className="challenge-icon">

                  <Brain size={23} />

                </div>


                <div className="challenge-info">

                  <span>
                    DAILY CHALLENGE
                  </span>

                  <strong>
                    24 × 6 = ?
                  </strong>

                </div>


                <div className="reward-pill">

                  +1 🪙

                </div>

              </div>


              {/* FLOATING REWARD */}

              <div className="floating-reward">

                <div className="floating-icon">

                  <Coins size={19} />

                </div>


                <div>

                  <strong>
                    +1 Coin
                  </strong>

                  <span>
                    Challenge completed
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            STATS
        ========================= */}

        <section className="stats-section">


          <div className="stat">

            <strong>
              10+
            </strong>

            <span>
              Daily Challenges
            </span>

          </div>


          <div className="stat">

            <strong>
              1 🪙
            </strong>

            <span>
              Per Correct Answer
            </span>

          </div>


          <div className="stat">

            <strong>
              ₹1
            </strong>

            <span>
              Per Coin
            </span>

          </div>


          <div className="stat">

            <strong>
              100%
            </strong>

            <span>
              Progress Tracking
            </span>

          </div>

        </section>


        {/* =========================
            HOW IT WORKS
        ========================= */}

        <section
          className="section"
          id="how-it-works"
        >

          <div className="section-heading">

            <div className="section-tag">
              SIMPLE PROCESS
            </div>


            <h2>

              From solving problems

              <br />

              to earning rewards.

            </h2>


            <p>

              Math2Money makes every small
              learning achievement count.

            </p>

          </div>


          <div className="steps">


            {/* STEP 1 */}

            <div className="step-card">

              <div className="step-number">
                01
              </div>


              <div className="step-icon purple">

                <Brain />

              </div>


              <h3>
                Solve
              </h3>


              <p>

                Get a fresh set of engaging
                math challenges every day.

              </p>

            </div>


            {/* STEP 2 */}

            <div className="step-card">

              <div className="step-number">
                02
              </div>


              <div className="step-icon green">

                <Coins />

              </div>


              <h3>
                Earn
              </h3>


              <p>

                Answer correctly and receive
                coins directly in your reward balance.

              </p>

            </div>


            {/* STEP 3 */}

            <div className="step-card">

              <div className="step-number">
                03
              </div>


              <div className="step-icon gold">

                <Wallet />

              </div>


              <h3>
                Redeem
              </h3>


              <p>

                Track your earnings and request
                eligible withdrawals.

              </p>

            </div>

          </div>

        </section>


        {/* =========================
            FEATURES
        ========================= */}

        <section
          className="features-section"
          id="features"
        >

          <div className="feature-content">

            <div className="section-tag">
              BUILT FOR YOU
            </div>


            <h2>

              More than just

              <br />

              solving equations.

            </h2>


            <p>

              Math2Money combines learning,
              gamification and reward tracking
              into one simple experience.

            </p>

          </div>


          <div className="feature-grid">


            {/* FEATURE 1 */}

            <div className="feature-card">

              <Brain />

              <h3>
                Daily Challenges
              </h3>

              <p>

                New math challenges keep
                your mind active every day.

              </p>

            </div>


            {/* FEATURE 2 */}

            <div className="feature-card">

              <Coins />

              <h3>
                Instant Rewards
              </h3>

              <p>

                See your earned coins reflected
                immediately in your reward balance.

              </p>

            </div>


            {/* FEATURE 3 */}

            <div className="feature-card">

              <ShieldCheck />

              <h3>
                Secure System
              </h3>

              <p>

                Designed with secure authentication
                and transaction tracking in mind.

              </p>

            </div>


            {/* FEATURE 4 */}

            <div className="feature-card">

              <Wallet />

              <h3>
                Smart Wallet
              </h3>

              <p>

                Keep track of your earnings and
                withdrawal history in one place.

              </p>

            </div>

          </div>

        </section>


        {/* =========================
            CTA
        ========================= */}

        <section
          className="cta-section"
          id="rewards"
        >

          <div className="cta-glow"></div>

          <Sparkles className="cta-sparkle" />


          <h2>

            Ready to turn your

            <br />

            answers into rewards?

          </h2>


          <p>

            Start solving your first challenge today.

          </p>


          {/* CTA GET STARTED */}

          <Link
            to="/signup"
            className="primary-btn cta-btn"
          >

            Get Started

            <ArrowRight size={19} />

          </Link>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">


        <div className="brand">

          <div className="brand-icon">

            <Coins size={19} />

          </div>


          <span>
            Math2Money
          </span>

        </div>


        <p>
          Solve. Earn. Grow.
        </p>


        <span className="copyright">

          © 2026 Math2Money

        </span>

      </footer>

    </div>
  );
}

export default Landing;