const items = [
  { id: "all", label: "All Mail", icon: "⌁" },
  { id: "inactive", label: "Inactive", icon: "◷" },
];

const BottomNav = ({ activeView, onViewChange }) => (
  <nav className="bottom-nav" aria-label="Mobile navigation">
    {items.map((item) => (
      <button key={item.id} className={activeView === item.id ? "active" : ""} onClick={() => onViewChange(item.id)}>
        <span>{item.icon}</span><small>{item.label}</small>
      </button>
    ))}
  </nav>
);

export default BottomNav;
