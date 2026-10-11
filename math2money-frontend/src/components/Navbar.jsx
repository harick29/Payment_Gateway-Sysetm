import {
  Bell,
  Coins,
} from "lucide-react";

function Navbar({ setActivePage }) {

  return (
    <header className="navbar">

      <div className="navbar-brand">

        <div className="brand-icon">
          <Coins size={20} />
        </div>

        <div>
          <h2>Math2Money</h2>
          <span>Solve. Earn. Grow.</span>
        </div>

      </div>


      <div className="navbar-actions">

        <button className="icon-button">
          <Bell size={20} />
        </button>


        <button
          className="profile"
          onClick={() => setActivePage("Profile")}
        >

          <div className="profile-avatar">
            U
          </div>

          <div className="profile-info">
            <strong>User</strong>
            <span>Member</span>
          </div>

        </button>

      </div>

    </header>
  );
}

export default Navbar;