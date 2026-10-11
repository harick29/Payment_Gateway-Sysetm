import { useState } from "react";
import {
  ArrowUpRight,
  Flame,
  Coins,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WalletCard from "../components/WalletCard";
import ChallengeCard from "../components/ChallengeCard";
import TransactionItem from "../components/TransactionItem";

function Dashboard() {
  const [coins, setCoins] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [activePage, setActivePage] = useState("Dashboard");
  const [transactions, setTransactions] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("easy");

  const handleCorrectAnswer = (reward, questionData) => {
    setCoins((previous) => previous + reward);

    setCompleted((previous) => previous + 1);

    setTransactions((previous) => [
      {
        id: Date.now(),
        amount: reward,
        title: `${questionData.difficulty} Challenge`,
        time: "Just now",
      },
      ...previous,
    ]);
  };

  /* ========================= */
  /* DASHBOARD */
  /* ========================= */

  const renderDashboard = () => (
    <>
      <section className="welcome-section">
        <div>
          <p className="eyebrow">YOUR DASHBOARD</p>

          <h1>Ready to solve & earn?</h1>

          <p className="welcome-text">
            Complete today's math challenges and earn coins.
          </p>
        </div>

        <div className="streak-box">
          <Flame size={20} />

          <div>
            <strong>
              {completed > 0 ? "1 Day" : "Start"}
            </strong>

            <span>Streak</span>
          </div>
        </div>
      </section>

      <section className="summary-grid">

        <WalletCard coins={coins} />

        <div className="summary-card">

          <div className="summary-card-icon purple">
            🪙
          </div>

          <div>
            <span>Total Coins</span>
            <strong>{coins}</strong>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-card-icon green">
            ✓
          </div>

          <div>
            <span>Today's Progress</span>
            <strong>{completed} / 10</strong>
          </div>

        </div>

      </section>

      <section className="content-grid">

        <ChallengeCard
          daily={true}
          onCorrect={handleCorrectAnswer}
        />

        <ActivityCard
          transactions={transactions}
        />

      </section>

      <ProgressSection
        completed={completed}
      />

    </>
  );


  /* ========================= */
  /* CHALLENGES */
  /* ========================= */

  const renderChallenges = () => (
    <>
      <PageHeader
        eyebrow="CHALLENGES"
        title="Choose Your Challenge"
        description="Select a difficulty and solve questions to earn rewards."
      />

      <div className="difficulty-grid">

        {/* EASY */}

        <div className="difficulty-card">

          <div className="difficulty-icon easy-icon">
            🟢
          </div>

          <div className="difficulty-content">

            <h3>Easy</h3>

            <p>
              Basic arithmetic questions
            </p>

            <strong>
              +₹1 per question
            </strong>

          </div>

          <button
            className="start-challenge-button"
            onClick={() =>
              setSelectedDifficulty("easy")
            }
          >
            Start Challenge
          </button>

        </div>


        {/* MEDIUM */}

        <div className="difficulty-card">

          <div className="difficulty-icon medium-icon">
            🟡
          </div>

          <div className="difficulty-content">

            <h3>Medium</h3>

            <p>
              Intermediate calculation questions
            </p>

            <strong>
              +₹2 per question
            </strong>

          </div>

          <button
            className="start-challenge-button"
            onClick={() =>
              setSelectedDifficulty("medium")
            }
          >
            Start Challenge
          </button>

        </div>


        {/* HARD */}

        <div className="difficulty-card">

          <div className="difficulty-icon hard-icon">
            🔴
          </div>

          <div className="difficulty-content">

            <h3>Hard</h3>

            <p>
              Advanced mathematical problems
            </p>

            <strong>
              +₹5 per question
            </strong>

          </div>

          <button
            className="start-challenge-button"
            onClick={() =>
              setSelectedDifficulty("hard")
            }
          >
            Start Challenge
          </button>

        </div>

      </div>


      <div className="selected-challenge">

        <div className="selected-level-heading">

          <span>
            Selected Level
          </span>

          <strong>
            {selectedDifficulty.charAt(0).toUpperCase() +
              selectedDifficulty.slice(1)}
          </strong>

        </div>

        <ChallengeCard
          difficulty={selectedDifficulty}
          onCorrect={handleCorrectAnswer}
        />

      </div>

    </>
  );


  /* ========================= */
  /* WALLET */
  /* ========================= */

  const renderWallet = () => (
    <>
      <PageHeader
        eyebrow="WALLET"
        title="Your Wallet"
        description="Track your earned coins and balance."
      />

      <div className="wallet-page-grid">

        <WalletCard coins={coins} />

        <div className="wallet-stat-large">

          <span>Total Earned</span>

          <strong>
            ₹{coins}.00
          </strong>

          <p>
            {coins}{" "}
            {coins === 1 ? "coin" : "coins"}
            {" "}earned from challenges.
          </p>

        </div>

      </div>

      <div className="wallet-note">

        <Coins size={20} />

        <div>

          <strong>Your earnings</strong>

          <p>
            Complete more challenges to increase
            your Math2Money balance.
          </p>

        </div>

      </div>

    </>
  );


  /* ========================= */
  /* HISTORY */
  /* ========================= */

  const renderHistory = () => (
    <>
      <PageHeader
        eyebrow="HISTORY"
        title="Transaction History"
        description="View your recent Math2Money activity."
      />

      <div className="history-card">

        {transactions.length === 0 ? (

          <div className="empty-activity history-empty">

            <div className="empty-icon">
              📜
            </div>

            <h3>
              No transactions yet
            </h3>

            <p>
              Your completed challenges will appear here.
            </p>

          </div>

        ) : (

          <div className="transactions">

            {transactions.map((transaction) => (

              <TransactionItem
                key={transaction.id}
                amount={transaction.amount}
                title={transaction.title}
                time={transaction.time}
              />

            ))}

          </div>

        )}

      </div>

    </>
  );


  /* ========================= */
  /* PROFILE */
  /* ========================= */

  const renderProfile = () => (
    <>
      <section className="profile-page-header">

        <div>

          <p className="eyebrow">
            ACCOUNT
          </p>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your personal information and
            view your Math2Money activity.
          </p>

        </div>

      </section>


      <div className="profile-page-grid">

        {/* PROFILE CARD */}

        <div className="profile-main-card">

          <div className="profile-cover"></div>

          <div className="profile-main-content">

            <div className="profile-page-avatar">
              U
            </div>

            <div className="profile-user-info">

              <h2>
                Demo User
              </h2>

              <p>
                Math2Money Member
              </p>

            </div>

          </div>

        </div>


        {/* ACCOUNT DETAILS */}

        <div className="profile-info-card">

          <div className="profile-card-heading">

            <span className="section-label">
              PERSONAL INFORMATION
            </span>

            <h2>
              Account Details
            </h2>

          </div>


          <div className="profile-fields">

            <div className="profile-field">

              <label>
                Full Name
              </label>

              <p>
                Demo User
              </p>

            </div>


            <div className="profile-field">

              <label>
                Email Address
              </label>

              <p>
                user@example.com
              </p>

            </div>


            <div className="profile-field">

              <label>
                Phone Number
              </label>

              <p>
                +91 XXXXX XXXXX
              </p>

            </div>


            <div className="profile-field">

              <label>
                Date of Birth
              </label>

              <p>
                01 January 2000
              </p>

            </div>


            <div className="profile-field profile-field-full">

              <label>
                Address
              </label>

              <p>
                123 Example Street,
                Chennai, Tamil Nadu,
                India - 600001
              </p>

            </div>

          </div>

        </div>


        {/* STATISTICS */}

        <div className="profile-stats-card">

          <span className="section-label">
            YOUR MATH2MONEY ACTIVITY
          </span>

          <h2>
            Account Statistics
          </h2>


          <div className="profile-stat-grid">

            <div className="profile-stat-box">

              <span>
                🪙
              </span>

              <strong>
                {coins}
              </strong>

              <p>
                Total Coins
              </p>

            </div>


            <div className="profile-stat-box">

              <span>
                🏆
              </span>

              <strong>
                {completed}
              </strong>

              <p>
                Challenges Completed
              </p>

            </div>


            <div className="profile-stat-box">

              <span>
                🔥
              </span>

              <strong>
                {completed > 0 ? 1 : 0}
              </strong>

              <p>
                Current Streak
              </p>

            </div>

          </div>

        </div>

      </div>

    </>
  );


  /* ========================= */
  /* MAIN PAGE */
  /* ========================= */

  return (
    <div className="app">

      <Navbar
        setActivePage={setActivePage}
      />

      <div className="app-body">

        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <main className="main-content">

          {activePage === "Dashboard" &&
            renderDashboard()}

          {activePage === "Challenges" &&
            renderChallenges()}

          {activePage === "Wallet" &&
            renderWallet()}

          {activePage === "History" &&
            renderHistory()}

          {activePage === "Profile" &&
            renderProfile()}

        </main>

      </div>

    </div>
  );
}


/* ========================= */
/* PAGE HEADER */
/* ========================= */

function PageHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <section className="page-header">

      <p className="eyebrow">
        {eyebrow}
      </p>

      <h1>
        {title}
      </h1>

      <p>
        {description}
      </p>

    </section>
  );
}


/* ========================= */
/* ACTIVITY */
/* ========================= */

function ActivityCard({ transactions }) {
  return (
    <div className="activity-card">

      <div className="card-heading">

        <div>

          <span className="section-label">
            ACTIVITY
          </span>

          <h2>
            Recent Activity
          </h2>

        </div>

        <ArrowUpRight size={20} />

      </div>


      {transactions.length === 0 ? (

        <div className="empty-activity">

          <div className="empty-icon">
            🪙
          </div>

          <h3>
            No activity yet
          </h3>

          <p>
            Complete your first challenge to
            start earning.
          </p>

        </div>

      ) : (

        <div className="transactions">

          {transactions
            .slice(0, 4)
            .map((transaction) => (

              <TransactionItem
                key={transaction.id}
                amount={transaction.amount}
                title={transaction.title}
                time={transaction.time}
              />

            ))}

        </div>

      )}

    </div>
  );
}


/* ========================= */
/* PROGRESS */
/* ========================= */

function ProgressSection({ completed }) {
  return (
    <section className="progress-card">

      <div className="progress-heading">

        <div>

          <span className="section-label">
            DAILY GOAL
          </span>

          <h2>
            Complete 10 challenges today
          </h2>

        </div>

        <strong>
          {completed}/10
        </strong>

      </div>


      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${Math.min(
              completed * 10,
              100
            )}%`,
          }}
        />

      </div>

    </section>
  );
}


export default Dashboard;