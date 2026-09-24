const categoryLabels = {
  unknown: "Unsorted",
  person: "People",
  company: "Companies",
  subscription: "Newsletters",
  transaction: "Transactions",
  notification: "Notifications",
};

const categoryColors = {
  unknown: "gray",
  person: "purple",
  company: "blue",
  subscription: "amber",
  transaction: "red",
  notification: "cyan",
};

const getFrequency = (count) => {
  if (count >= 20) return "Frequent";
  if (count >= 5) return "Regular";
  return "Occasional";
};

const SenderCard = ({ sender, selected, checked, onSelect, onCheck }) => {
  const initials = (sender.displayName || sender.emailAddress || "?")
    .split(/[\\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const category = sender.category || "unknown";
  const categoryLabel = categoryLabels[category] || "Unsorted";
  const color = categoryColors[category] || "gray";
  const frequency = getFrequency(sender.messageCount || 0);

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
        <span className={`avatar ${color}`}>{initials}</span>
        <span className="sender-copy">
          <strong>{sender.displayName || sender.emailAddress}</strong>
          <span>{sender.domain || sender.emailAddress}</span>
          <span className="sender-signals">
            <span className={`mini-dot ${color}`} />
            <span>{categoryLabel}</span>
            <span className="signal-separator">•</span>
            <span>{frequency}</span>
          </span>
        </span>
        <span className="sender-meta">
          <b>{sender.messageCount || 0}</b>
          <small>emails</small>
        </span>
      </button>

      <div className="sender-status">
        <span className="status-bullet" />
        <span>Unsubscribe check</span>
      </div>
    </article>
  );
};

export default SenderCard;
