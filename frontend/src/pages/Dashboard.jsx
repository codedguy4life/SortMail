import { useEffect, useMemo, useState } from "react";
import { getEmailAccounts, getSenders, syncEmailAccount } from "../api/api";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import SearchBar from "../components/SearchBar";
import SenderList from "../components/SenderList";
import ContactPanel from "../components/ContactPanel";

const Dashboard = () => {
  const [senders, setSenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    getSenders().then((data) => setSenders(data.senders || [])).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const totalEmails = useMemo(() => senders.reduce((total, sender) => total + (sender.messageCount || 0), 0), [senders]);

  const inactiveCount = useMemo(() => {
    const cutoff = Date.now() - 60 * 24 * 60 * 60 * 1000;
    return senders.filter((sender) => sender.lastMessageAt && new Date(sender.lastMessageAt).getTime() < cutoff).length;
  }, [senders]);

  const filteredSenders = useMemo(() => {
    const query = search.trim().toLowerCase();
    const cutoff = Date.now() - 60 * 24 * 60 * 60 * 1000;
    return senders.filter((sender) => {
      const matchesSearch = !query || sender.displayName?.toLowerCase().includes(query) || sender.emailAddress?.toLowerCase().includes(query) || sender.domain?.toLowerCase().includes(query);
      const matchesView = activeView === "all" || (activeView === "inactive" && sender.lastMessageAt && new Date(sender.lastMessageAt).getTime() < cutoff);
      return matchesSearch && matchesView;
    });
  }, [senders, search, activeView]);

  const changeView = (view) => { setActiveView(view); setSelectedSenderId(null); setSelectedIds([]); };
  const handleCheck = (id) => setSelectedIds((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const data = await getEmailAccounts();
      if (!data.emailAccounts?.length) {
        setSyncMessage("No Gmail account is connected yet.");
        return;
      }

      let synced = 0;
      for (const account of data.emailAccounts) {
        const result = await syncEmailAccount(account._id);
        synced += result.result?.synced || 0;
      }

      const refreshed = await getSenders();
      setSenders(refreshed.senders || []);
      setSyncMessage(synced ? "Synced " + synced + " new emails." : "Inbox is already up to date.");
    } catch (err) {
      setSyncMessage(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/"; };

  if (loading) return <div className="app-loading">Loading your inbox...</div>;
  if (error) return <main className="error-page"><div><h1>Something went wrong</h1><p>{error}</p><button onClick={handleLogout}>Sign out</button></div></main>;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user.name?.split(" ")[0];

  return (
    <div className="mail-app">
      <Sidebar activeView={activeView} onViewChange={changeView} onLogout={handleLogout} totalEmails={totalEmails} senderCount={senders.length} inactiveCount={inactiveCount} />
      <main className="mail-main">
        <header className="mobile-header"><div className="brand"><span className="brand-mark">S</span><span>SortMail</span></div><button onClick={handleLogout} aria-label="Sign out">↪</button></header>
        <section className="directory-header">
          <div>
            <p className="eyebrow">Good morning{firstName ? ", " + firstName : ""}</p>
            <h1>{activeView === "inactive" ? "Senders that have gone quiet." : "See who is filling your inbox."}</h1>
            <p className="header-subtitle">{activeView === "inactive" ? "A real view of senders with no new email in the last 60 days." : "SortMail organizes your real Gmail data around the people and senders behind your messages."}</p>
          </div>
          <div className="header-actions">
            <div className="inbox-stat"><strong>{totalEmails}</strong><span>emails synced</span></div>
            <button className="sync-button" onClick={handleSync} disabled={syncing}>
              {syncing ? "Syncing..." : "Sync inbox"}
            </button>
          </div>
        </section>
        <section className="directory-toolbar">
          <SearchBar value={search} onChange={setSearch} />
          <div className="selection-tools"><span>{filteredSenders.length} sender{filteredSenders.length === 1 ? "" : "s"}</span>{selectedIds.length > 0 && <span className="selected-count">{selectedIds.length} selected</span>}</div>
        </section>
        <SenderList senders={filteredSenders} selectedSenderId={selectedSenderId} selectedIds={selectedIds} onSelect={setSelectedSenderId} onCheck={handleCheck} />
      </main>
      <ContactPanel senderId={selectedSenderId} onClose={() => setSelectedSenderId(null)} />
      <BottomNav activeView={activeView} onViewChange={changeView} />
    </div>
  );
};

export default Dashboard;