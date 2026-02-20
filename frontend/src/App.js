import { useState, useEffect } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";
import Notices from "./pages/notices";
import Sidebar from "./components/sidebar";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setUser(data);
        })
        .catch(() => {})
        .finally(() => setBooting(false));
    } else {
      setBooting(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (booting) {
    return <div>Loading...</div>;
  }

  if (!user) return <Login onLogin={handleLogin} />;

  const PAGES = {
    dashboard: <Dashboard />,
    upload: <Upload />,
    notices: <Notices />
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={page}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {PAGES[page] || <Dashboard />}
      </main>
    </div>
  );
}