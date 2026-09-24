const navItems = [
  { id: "all", label: "All Mail", icon: "⌁" },
  { id: "people", label: "People", icon: "◎" },
  { id: "companies", label: "Companies", icon: "▦" },
  { id: "newsletters", label: "Newsletters", icon: "✉" },
  { id: "transactions", label: "Transactions", icon: "₦" },
  { id: "notifications", label: "Notifications", icon: "◌" },
];

const Sidebar = ({ activeCategory, onCategoryChange, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">S</span>
        <span>SortMail</span>
      </div>

      <nav className="sidebar-nav" aria-label="Mailbox">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeCategory === item.id ? "active" : ""}`}
            onClick={() => onCategoryChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={() => onCategoryChange("manage")}>
          <span className="nav-icon">⚙</span>
          <span>Manage</span>
        </button>
        <button className="logout-button" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
