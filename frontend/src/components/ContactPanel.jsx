import { useEffect, useState } from "react";
import { getSenderEmails } from "../api/api";
import EmailList from "./EmailList";

const categoryLabels = {
  person: "People",
  company: "Companies",
  subscription: "Newsletters",
  transaction: "Transactions",
  notification: "Notifications",
};

const ContactPanel = ({ senderId, onClose }) => {
  const [sender, setSender] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!senderId) {
      setSender(null);
      setEmails([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getSenderEmails(senderId);
        setSender(data.sender);
        setEmails(data.emails || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [senderId]);

  if (!senderId) {
    return <aside className="contact-panel empty-contact"><div><span className="contact-placeholder">◎</span><h2>Choose a sender</h2><p>Select a sender to inspect the real email history stored for them.</p></div></aside>;
  }

  if (loading) return <aside className="contact-panel"><p className="panel-loading">Loading sender...</p></aside>;

  if (error) return <aside className="contact-panel"><button className="panel-close" onClick={onClose}>×</button><p className="error-message">{error}</p></aside>;

  const name = sender?.displayName || sender?.emailAddress || "Sender";
  const initial = name.charAt(0).toUpperCase();
  const unreadCount = emails.filter((email) => !email.isRead).length;
  const lastReceived = emails[0]?.receivedAt || null;

  return (
    <aside className="contact-panel">
      <div className="contact-top">
        <button className="panel-close" onClick={onClose} aria-label="Close sender panel">×</button>
        <div className="contact-avatar">{initial}</div>
        <h2>{name}</h2>
        <p>{sender.emailAddress}</p>
        <span className="domain-chip">{sender.domain}</span>
      </div>

      <div className="contact-stats">
        <div><strong>{sender.messageCount || 0}</strong><span>Total emails</span></div>
        <div><strong>{emails.length}</strong><span>Loaded history</span></div>
        <div><strong>{unreadCount}</strong><span>Unread in history</span></div>
        <div><strong>{categoryLabels[sender.category] || "Unsorted"}</strong><span>Current category</span></div>
      </div>

      <div className="contact-last">
        <span>Latest received</span>
        <strong>{lastReceived ? new Date(lastReceived).toLocaleString() : "No email date available"}</strong>
      </div>

      <EmailList emails={emails} />
    </aside>
  );
};

export default ContactPanel;
