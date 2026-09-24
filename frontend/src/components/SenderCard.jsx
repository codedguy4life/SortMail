const SenderCard = ({ sender, selected, checked, onSelect, onCheck }) => {
  const initials = (sender.displayName || sender.emailAddress || "?")
    .split(/[\\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const category = sender.category === "unknown" ? "Unsorted" : sender.category;

  return (
    <article className={`sender-card ${selected ? "selected" : ""}`}>
      <label className="sender-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheck(sender._id)}
          aria-label={`Select ${sender.displayName || sender.emailAddress}`}
        />
      </label>

      <button className="sender-main" onClick={() => onSelect(sender._id)}>
        <span className="avatar">{initials}</span>
        <span className="sender-copy">
          <strong>{sender.displayName || sender.emailAddress}</strong>
          <span>{sender.emailAddress}</span>
        </span>
        <span className="sender-meta">
          <b>{sender.messageCount}</b>
          <small>emails</small>
        </span>
      </button>

      <span className="sender-category">{category}</span>
    </article>
  );
};

export default SenderCard;
