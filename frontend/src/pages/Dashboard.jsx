import { useEffect, useMemo, useState } from "react";
import { getSenders } from "../api/api";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import CategoryPills from "../components/CategoryPills";
import SearchBar from "../components/SearchBar";
import SenderList from "../components/SenderList";
import ContactPanel from "../components/ContactPanel";

const Dashboard = () => {
  const [senders, setSenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getSenders()
      .then((data) => setSenders(data.senders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredSenders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return senders.filter((sender) => {
      const matchesSearch = !query ||
        sender.displayName?.toLowerCase().includes(query) ||
        sender.emailAddress?.toLowerCase().includes(query) ||
        sender.domain?.toLowerCase().includes(query);
      const matchesCategory = activeCategory === "all" ||
        activeCategory === "manage" ||
        sender.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [senders, search, activeCategory]);

  const changeCategory = (category) => {
    setActiveCategory(category);
    setSelectedSenderId(null);
  };

  const handleCheck = (id) => {
    setSelectedIds((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) return <div className="app-loading">Loading your inbox...</div>;
  if (error) return <main className="error-page"><h1>Something went wrong</h1><p>{error}</p><button onClick={handleLogout}>Sign out</button></main>;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const totalEmails = senders.reduce((sum, sender) => sum + sender.messageCount, 0);

  return (
    <div className="mail-app">
      <Sidebar activeCategory={activeCategory} onCategoryChange={changeCategory} onLogout={handleLogout} />
      <main className="mail-main">
        <header className="mobile-header">
          <div className="brand"><span className="brand-mark">S</span><span>SortMail</span></div>
          <button onClick={handleLogout} aria-label="Sign out">↪</button>
        </header>

        <section className="directory-header">
          <div>
            <p className="eyebrow">Good morning{user.name ? `, ${user.name.split(" ")[0]}` : ""}</p>
            <h1>See who is filling your inbox.</h1>
            <p className="header-subtitle">SortMail turns a crowded inbox into a clear view of the people, companies and subscriptions behind your email.</p>
          </div>
          <div className="inbox-stat"><strong>{totalEmails}</strong><span>emails synced</span></div>
        </section>

        <div className="mobile-only">
          <CategoryPills activeCategory={activeCategory} onCategoryChange={changeCategory} />
        </div>

        <section className="directory-toolbar">
          <SearchBar value={search} onChange={setSearch} />
          <div className="selection-tools">
            <span>{filteredSenders.length} senders</span>
            {selectedIds.length > 0 && <><button>Archive selected</button><button>Manage selected</button></>}
          </div>
        </section>

        <div className="batch-alert">
          <span>✦</span><div><strong>Sender-first inbox</strong><p>Select senders to prepare bulk cleanup actions.</p></div>
        </div>

        <SenderList senders={filteredSenders} selectedSenderId={selectedSenderId} selectedIds={selectedIds} onSelect={setSelectedSenderId} onCheck={handleCheck} />
      </main>

      <ContactPanel senderId={selectedSenderId} onClose={() => setSelectedSenderId(null)} />
      <BottomNav activeCategory={activeCategory} onCategoryChange={changeCategory} />
    </div>
  );
};

export default Dashboard;
