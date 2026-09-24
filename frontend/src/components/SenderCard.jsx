const categoryLabels = {
  person: "People",
  company: "Companies",
  subscription: "Newsletters",
  transaction: "Transactions",
  notification: "Notifications",
};

const categoryColors = {
  person: "purple",
  company: "blue",
  subscription: "amber",
  transaction: "red",
  notification: "cyan",
};

const SenderCard = ({ sender, selected, checked, onSelect, onCheck }) => {
  const initials = (sender.displayName || sender.emailAddress || "?")
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const categoryLabel = categoryLabels[sender.category];
  const color = categoryColors[sender.category] || "gray";
  const lastReceived = sender.latestReceivedAt
    ? new Date(sender.latestReceivedAt).toLocaleString()
    : "No date";

  return (
    <article className={"sender-card " + (selected ? "selected" : "")}>
      <label className="sender-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheck(sender._id)}
          aria-label={"Select " + (sender.displayName || sender.emailAddress)}
        />
      </label>

      <button className="sender-main" onClick={() => onSelect(sender._id)}>
        <span className={"avatar " + color}>{initials}</span>

        <span className="sender-copy">
          <span className="sender-title-line">
            <strong>{sender.displayName || sender.emailAddress}</strong>
            {categoryLabel && <span className={"category-badge " + color}>{categoryLabel}</span>}
          </span>
          <span>{sender.domain || sender.emailAddress}</span>
          {sender.latestSubject && (
            <span className="sender-subject">{sender.latestSubject}</span>
          )}
        </span>

        <span className="sender-volume">
          <b>{sender.messageCount || 0}</b>
          <small>{sender.unreadCount || 0} unread</small>
        </span>

        <span className="sender-last">
          <b>{lastReceived}</b>
          <small>last received</small>
        </span>
      </button>
    </article>
  );
};

export default SenderCard;
