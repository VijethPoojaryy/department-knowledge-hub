import { useState } from "react";

const NAV = [
  {
    label: "Overview",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    page: "dashboard",
  },
  {
    label: "Notices",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 5h12M4 9h8M4 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    page: "notices",
  },
  {
    label: "Resources",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 4a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 2v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    page: "resources",
  },
];

export default function Sidebar({ activePage, setPage, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="8" height="8" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="13" y="1" width="8" height="8" rx="2" fill="currentColor" opacity="0.4"/>
              <rect x="1" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.4"/>
              <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.9"/>
            </svg>
          </div>
          {!collapsed && <span className="brand-name">NEXUS</span>}
        </div>

        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {!collapsed && <span className="nav-section-label">MAIN MENU</span>}
        {NAV.map((item) => (
          <button
            key={item.page}
            className={`nav-item ${activePage === item.page ? "active" : ""}`}
            onClick={() => setPage(item.page)}
            title={collapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {activePage === item.page && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className={`user-card ${collapsed ? "mini" : ""}`}>
          <div className="user-avatar">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-role">Administrator</span>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={onLogout} title="Logout">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h3M12 13l4-4-4-4M7 9h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}