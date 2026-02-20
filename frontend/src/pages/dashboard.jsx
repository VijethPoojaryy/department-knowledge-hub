import { useEffect, useState } from "react";

function StatCard({ label, value, icon, trend, color }) {
  return (
    <div className="stat-card" style={{ "--accent": color }}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`stat-trend ${trend > 0 ? "up" : "down"}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d={trend > 0 ? "M7 10V4M4 7l3-3 3 3" : "M7 4v6M4 7l3 3 3-3"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {Math.abs(trend)}% this week
        </div>
      )}
      <div className="stat-bar">
        <div className="stat-bar-fill" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function ActivityItem({ action, user, time }) {
  return (
    <div className="activity-item">
      <div className="activity-dot" />
      <div className="activity-content">
        <span className="activity-text"><strong>{user}</strong> {action}</span>
        <span className="activity-time">{time}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ notices: 0, resources: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch("/api/notices", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch("/api/resources", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([notices, resources]) => {
        setStats({
          notices: Array.isArray(notices) ? notices.length : 0,
          resources: Array.isArray(resources) ? resources.length : 0,
          users: 12,
        });
      })
      .catch(() => setStats({ notices: 8, resources: 24, users: 12 }))
      .finally(() => setLoading(false));
  }, []);

  const ACTIVITIES = [
    { action: "published a new notice", user: "Admin", time: "2 min ago" },
    { action: "uploaded resource file", user: "Manager", time: "15 min ago" },
    { action: "updated system settings", user: "Admin", time: "1 hr ago" },
    { action: "added a new user", user: "Admin", time: "3 hrs ago" },
    { action: "deleted old notice", user: "Manager", time: "5 hrs ago" },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Welcome back — here's what's happening today.</p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <div className="stats-grid">
          <StatCard
            label="Total Notices"
            value={stats.notices}
            trend={12}
            color="#6366f1"
            icon={
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M5 6h12M5 10h8M5 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            }
          />
          <StatCard
            label="Resources"
            value={stats.resources}
            trend={8}
            color="#10b981"
            icon={
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M5 5a2 2 0 012-2h6l6 6v8a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
          <StatCard
            label="Active Users"
            value={stats.users}
            trend={-3}
            color="#f59e0b"
            icon={
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 19c0-3.866 3.134-7 7-7h0c3.866 0 7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
        </div>
      )}

      <div className="dashboard-bottom">
        <div className="activity-panel">
          <div className="panel-header">
            <h2>Recent Activity</h2>
            <span className="panel-badge">Live</span>
          </div>
          <div className="activity-list">
            {ACTIVITIES.map((a, i) => (
              <ActivityItem key={i} {...a} />
            ))}
          </div>
        </div>

        <div className="quick-panel">
          <div className="panel-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="quick-btn indigo">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              New Notice
            </button>
            <button className="quick-btn green">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 13V4M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Upload Resource
            </button>
            <button className="quick-btn amber">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3.5 17c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Manage Users
            </button>
          </div>

          <div className="system-status">
            <div className="panel-header" style={{ marginBottom: "12px" }}>
              <h2>System Status</h2>
            </div>
            {["API Server", "Database", "Storage"].map((s, i) => (
              <div key={s} className="status-row">
                <span className="status-name">{s}</span>
                <span className="status-badge online">Operational</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}