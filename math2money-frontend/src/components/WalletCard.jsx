import { Coins, WalletCards } from "lucide-react";

function WalletCard({ coins }) {
  return (
    <div className="wallet-card">

      <div className="wallet-card-top">
        <div>
          <p>Available Balance</p>
          <h2>₹{coins}.00</h2>
        </div>

        <div className="wallet-icon">
          <WalletCards size={24} />
        </div>
      </div>

      <div className="wallet-card-bottom">
        <span>
          <Coins size={16} />
          {coins} {coins === 1 ? "Coin" : "Coins"}
        </span>

        <span>1 Coin = ₹1</span>
      </div>

    </div>
  );
}

export default WalletCard;