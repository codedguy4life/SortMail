import { useEffect, useState } from "react";
import { getSenderEmails } from "../api/api";

const SenderDetails = ({ senderId, onBack }) => {
  const [sender, setSender] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSenderEmails = async () => {
      try {
        const data = await getSenderEmails(senderId);

        setSender(data.sender);
        setEmails(data.emails);
      } catch (error) {
        console.error("Failed to load sender emails:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSenderEmails();
  }, [senderId]);

  if (loading) {
    return <p>Loading sender...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <button onClick={onBack}>← Back</button>

      <h1>{sender.displayName || sender.emailAddress}</h1>

      <p>{sender.emailAddress}</p>

      <p>{sender.messageCount} emails</p>

      <h2>Emails</h2>

      {emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <div>
          {emails.map((email) => (
            <article key={email._id}>
              <h3>{email.subject || "(No subject)"}</h3>

              <p>{new Date(email.receivedAt).toLocaleString()}</p>

              <p>{email.isRead ? "Read" : "Unread"}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default SenderDetails;
