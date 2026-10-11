import { Coins } from "lucide-react";

function TransactionItem({ amount, title, time }) {
  return (
    <div className="transaction-item">

      <div className="transaction-left">
        <div className="transaction-icon">
          <Coins size={17} />
        </div>

        <div>
          <strong>{title}</strong>
          <span>{time}</span>
        </div>
      </div>

      <strong className="transaction-amount">
        +₹{amount}.00
      </strong>

    </div>
  );
}

export default TransactionItem;