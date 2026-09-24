const categories = [
  { id: "all", label: "All" },
  { id: "people", label: "People" },
  { id: "companies", label: "Companies" },
  { id: "newsletters", label: "Newsletters" },
  { id: "transactions", label: "Transactions" },
  { id: "notifications", label: "Notifications" },
];

const CategoryPills = ({ activeCategory, onCategoryChange }) => (
  <div className="category-pills">
    {categories.map((category) => (
      <button
        key={category.id}
        className={activeCategory === category.id ? "active" : ""}
        onClick={() => onCategoryChange(category.id)}
      >
        {category.label}
      </button>
    ))}
  </div>
);

export default CategoryPills;
