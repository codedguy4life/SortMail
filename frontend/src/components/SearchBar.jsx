const SearchBar = ({ value, onChange }) => (
  <label className="search-bar">
    <span>⌕</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search senders..."
      aria-label="Search senders"
    />
    {value && (
      <button type="button" onClick={() => onChange("")} aria-label="Clear search">
        ×
      </button>
    )}
  </label>
);

export default SearchBar;
