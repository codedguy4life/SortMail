const Sidebar = ({ activeView, onViewChange, onLogout, totalEmails = 0, senderCount = 0, inactiveCount = 0 }) => (
  <aside className="sidebar">
    <div className="brand"><span className="brand-mark">S</span><span>SortMail</span></div>

    <div className="sidebar-section">
      <p className="sidebar-heading">Inbox</p>
      <nav className="sidebar-nav" aria-label="Mailbox">
        <button className={"nav-item " + (activeView === "all" ? "active" : "")} onClick={() => onViewChange("all")}>
          <span className="nav-dot green" />
          <span className="nav-label">All Mail</span>
          <span className="nav-count">{totalEmails}</span>
        </button>
        <div className="sidebar-summary"><strong>{senderCount}</strong> senders synced</div>
      </nav>
    </div>

    <div className="sidebar-section sidebar-manage">
      <p className="sidebar-heading">Manage</p>
      <nav className="sidebar-nav" aria-label="Inbox management">
        <button className={"nav-item " + (activeView === "inactive" ? "active" : "")} onClick={() => onViewChange("inactive")}>
          <span className="manage-icon">◷</span>
          <span className="nav-label">Inactive senders</span>
          <span className="nav-count">{inactiveCount}</span>
        </button>
      </nav>
    </div>

    <div className="sidebar-bottom">
      <button className="logout-button" onClick={onLogout}>
        <span className="manage-icon">↪</span><span>Sign out</span>
      </button>
    </div>
  </aside>
);

export default Sidebar;
