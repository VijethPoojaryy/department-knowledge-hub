 import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Notices from "./pages/Notices";
import Resources from "./pages/Resources";
import Sidebar from "./components/Sidebar";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setUser(data); })
        .catch(() => {})
        .finally(() => setBooting(false));
    } else {
      setBooting(false);
    }
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (booting) {
    return (
      <div className="boot-screen">
        <div className="boot-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2.5" fill="white" opacity="0.9"/>
            <rect x="18" y="2" width="12" height="12" rx="2.5" fill="white" opacity="0.4"/>
            <rect x="2" y="18" width="12" height="12" rx="2.5" fill="white" opacity="0.4"/>
            <rect x="18" y="18" width="12" height="12" rx="2.5" fill="white" opacity="0.9"/>
          </svg>
          <span>NEXUS</span>
        </div>
        <div className="boot-spinner" />
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  const PAGES = { dashboard: <Dashboard />, notices: <Notices />, resources: <Resources /> };

  return (
    <div className="app-shell">
      <Sidebar activePage={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main className="main-content">
        <div className="page-fade-in">
          {PAGES[page] || <Dashboard />}
        </div>
      </main>
    </div>
  );
}