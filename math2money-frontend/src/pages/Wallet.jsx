import {
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon
} from "lucide-react";

import { Link } from "react-router-dom";

function Wallet() {

  const transactions = [
    {
      title: "Math Challenge",
      date: "Today, 6:42 PM",
      amount: "+₹1",
      type: "credit"
    },
    {
      title: "Math Challenge",
      date: "Today, 6:38 PM",
      amount: "+₹1",
      type: "credit"
    },
    {
      title: "Math Challenge",
      date: "Today, 6:31 PM",
      amount: "+₹1",
      type: "credit"
    },
    {
      title: "Withdrawal",
      date: "Sep 18, 2026",
      amount: "-₹50",
      type: "debit"
    }
  ];


  return (
    <div className="wallet-page">

      <header className="wallet-header">

        <div>

          <Link
            to="/dashboard"
            className="back-dashboard"
          >
            ← Dashboard
          </Link>

          <h1>
            My Wallet
          </h1>

          <p>
            Track your earned rewards and transactions.
          </p>

        </div>

      </header>


      <section className="wallet-card">

        <div>

          <span>
            AVAILABLE BALANCE
          </span>

          <h2>
            ₹127.00
          </h2>

          <p>
            🪙 127 Coins
          </p>

        </div>


        <div className="wallet-card-right">

          <div className="wallet-large-icon">

            <WalletIcon size={30} />

          </div>

          <button className="withdraw-button">

            Withdraw Money

            <ArrowUpRight size={17} />

          </button>

        </div>

      </section>


      <section className="transactions">

        <div className="transaction-header">

          <div>

            <span>
              ACTIVITY
            </span>

            <h2>
              Recent Transactions
            </h2>

          </div>

        </div>


        <div className="transaction-list">

          {transactions.map((transaction, index) => (

            <div
              className="transaction-item"
              key={index}
            >

              <div
                className={
                  transaction.type === "credit"
                    ? "transaction-icon credit"
                    : "transaction-icon debit"
                }
              >

                {transaction.type === "credit" ? (
                  <ArrowDownLeft size={18} />
                ) : (
                  <ArrowUpRight size={18} />
                )}

              </div>


              <div className="transaction-info">

                <strong>
                  {transaction.title}
                </strong>

                <span>
                  {transaction.date}
                </span>

              </div>


              <strong
                className={
                  transaction.type === "credit"
                    ? "credit-amount"
                    : "debit-amount"
                }
              >
                {transaction.amount}
              </strong>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Wallet;