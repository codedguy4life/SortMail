import { useEffect, useState } from "react";
import { getSenders } from "../api/api";
import SenderDetails from "./SenderDetails";

const Dashboard = () => {
  const [senders, setSenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSenderId, setSelectedSenderId] = useState(null);

  useEffect(() => {
    const loadSenders = async () => {
      try {
        const data = await getSenders();

        setSenders(data.senders);
      } catch (error) {
        console.error("Failed to load senders:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSenders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  if (selectedSenderId) {
    return (
      <SenderDetails
        senderId={selectedSenderId}
        onBack={() => setSelectedSenderId(null)}
      />
    );
  }

  if (loading) {
    return <p>Loading your inbox...</p>;
  }

  if (error) {
    return (
      <main>
        <h1>Something went wrong</h1>

        <p>{error}</p>

        <button onClick={handleLogout}>Logout</button>
      </main>
    );
  }

  return (
    <main>
      <header>
        <div>
          <h1>SortMail</h1>

          <p>See who and what is filling your inbox.</p>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </header>

      <section>
        <h2>Top Senders</h2>

        {senders.length === 0 ? (
          <p>No senders found.</p>
        ) : (
          <div>
            {senders.map((sender) => (
              <div
                key={sender._id}
                onClick={() => setSelectedSenderId(sender._id)}
                style={{ cursor: "pointer" }}
              >
                <h3>{sender.displayName || sender.emailAddress}</h3>

                <p>{sender.emailAddress}</p>

                <p>{sender.messageCount} emails</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
