const navItems = [
  { id: "all", label: "All Mail", color: "green" },
  { id: "people", label: "People", color: "purple" },
  { id: "companies", label: "Companies", color: "blue" },
  { id: "newsletters", label: "Newsletters", color: "amber" },
  { id: "transactions", label: "Transactions", color: "red" },
  { id: "notifications", label: "Notifications", color: "cyan" },
];

const Sidebar = ({ activeCategory, onCategoryChange, onLogout, counts = {}, inactiveCount = 0 }) => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">S</span>
        <span>SortMail</span>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-heading">Inbox</p>
        <nav className="sidebar-nav" aria-label="Mailbox">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeCategory === item.id ? "active" : ""}`}
              onClick={() => onCategoryChange(item.id)}
            >
              <span className={`nav-dot ${item.color}`} />
              <span className="nav-label">{item.label}</span>
              <span className="nav-count">{counts[item.id] ?? 0}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-section sidebar-manage">
        <p className="sidebar-heading">Manage</p>
        <nav className="sidebar-nav" aria-label="Inbox management">
          <button
            className={`nav-item ${activeCategory === "manage-inactive" ? "active" : ""}`}
            onClick={() => onCategoryChange("manage-inactive")}
          >
            <span className="manage-icon">◷</span>
            <span className="nav-label">Inactive senders</span>
            <span className="nav-count">{inactiveCount}</span>
          </button>
          <button
            className={`nav-item ${activeCategory === "manage-trash" ? "active" : ""}`}
            onClick={() => onCategoryChange("manage-trash")}
          >
            <span className="manage-icon">⌫</span>
            <span className="nav-label">Trash</span>
          </button>
          <button
            className={`nav-item ${activeCategory === "manage-unsubscribe" ? "active" : ""}`}
            onClick={() => onCategoryChange("manage-unsubscribe")}
          >
            <span className="manage-icon">⊘</span>
            <span className="nav-label">Unsubscribe</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="logout-button" onClick={onLogout}>
          <span className="manage-icon">↪</span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
