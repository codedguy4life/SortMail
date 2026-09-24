import { useEffect, useState } from "react";
import { getSenderEmails } from "../api/api";
import EmailList from "./EmailList";

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
        setEmails(data.emails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [senderId]);

  if (!senderId) {
    return (
      <aside className="contact-panel empty-contact">
        <div>
          <span className="contact-placeholder">◎</span>
          <h2>Choose a sender</h2>
          <p>Select someone from the directory to see their emails and activity.</p>
        </div>
      </aside>
    );
  }

  if (loading) {
    return <aside className="contact-panel"><p className="panel-loading">Loading sender...</p></aside>;
  }

  if (error) {
    return (
      <aside className="contact-panel">
        <button className="panel-close" onClick={onClose}>×</button>
        <p className="error-message">{error}</p>
      </aside>
    );
  }

  const name = sender?.displayName || sender?.emailAddress || "Sender";
  const initial = name.charAt(0).toUpperCase();

  return (
    <aside className="contact-panel">
      <div className="contact-top">
        <button className="panel-close" onClick={onClose}>×</button>
        <div className="contact-avatar">{initial}</div>
        <h2>{name}</h2>
        <p>{sender.emailAddress}</p>
        <span className="domain-chip">{sender.domain}</span>
      </div>

      <div className="contact-stats">
        <div><strong>{sender.messageCount}</strong><span>Total emails</span></div>
        <div><strong>{sender.category === "unknown" ? "—" : sender.category}</strong><span>Category</span></div>
      </div>

      <div className="panel-actions">
        <button>Archive all</button>
        <button>Mute sender</button>
      </div>

      <EmailList emails={emails} />
    </aside>
  );
};

export default ContactPanel;
