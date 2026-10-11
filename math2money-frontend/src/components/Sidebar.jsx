import {
  Home,
  Calculator,
  WalletCards,
  History,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: Home,
    },
    {
      name: "Challenges",
      icon: Calculator,
    },
    {
      name: "Wallet",
      icon: WalletCards,
    },
    {
      name: "History",
      icon: History,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`sidebar-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}

      </div>

      <div className="sidebar-footer">
        <p>Math2Money</p>
        <span>Earn through learning</span>
      </div>
    </aside>
  );
}

export default Sidebar;