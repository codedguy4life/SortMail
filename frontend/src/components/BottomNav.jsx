const items = [
  { id: "all", label: "All Mail", icon: "⌁" },
  { id: "people", label: "People", icon: "◎" },
  { id: "companies", label: "Companies", icon: "▦" },
  { id: "newsletters", label: "Newsletters", icon: "✉" },
  { id: "manage", label: "Manage", icon: "⚙" },
];

const BottomNav = ({ activeCategory, onCategoryChange }) => (
  <nav className="bottom-nav" aria-label="Mobile navigation">
    {items.map((item) => (
      <button
        key={item.id}
        className={activeCategory === item.id ? "active" : ""}
        onClick={() => onCategoryChange(item.id)}
      >
        <span>{item.icon}</span>
        <small>{item.label}</small>
      </button>
    ))}
  </nav>
);

export default BottomNav;
