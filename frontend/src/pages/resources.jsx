import { useEffect, useState } from "react";

const FILE_ICONS = {
  pdf: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="#ef4444" strokeWidth="1.4"/>
      <path d="M11 2v5h5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
      <text x="6" y="15" fontSize="5" fill="#ef4444" fontWeight="700">PDF</text>
    </svg>
  ),
  doc: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="#3b82f6" strokeWidth="1.4"/>
      <path d="M11 2v5h5" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  default: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="#6366f1" strokeWidth="1.4"/>
      <path d="M11 2v5h5" stroke="#6366f1" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

function getIcon(filename) {
  const ext = filename?.split(".").pop()?.toLowerCase();
  return FILE_ICONS[ext] || FILE_ICONS.default;
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", url: "" });
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("grid");

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchResources = () => {
    setLoading(true);
    fetch("/api/resources", { headers })
      .then(r => r.json())
      .then(data => setResources(Array.isArray(data) ? data : []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResources(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/resources", { method: "POST", headers, body: JSON.stringify(form) });
      setShowModal(false);
      setForm({ title: "", description: "", url: "" });
      fetchResources();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/resources/${id}`, { method: "DELETE", headers });
    fetchResources();
  };

  const filtered = resources.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resources</h1>
          <p className="page-sub">{resources.length} files available</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="view-toggle">
            <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </button>
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <button className="primary-btn" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add Resource
          </button>
        </div>
      </div>

      {loading ? (
        <div className={view === "grid" ? "resource-grid" : "resource-list"}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M10 10a4 4 0 014-4h12l12 12v20a4 4 0 01-4 4H14a4 4 0 01-4-4V10z" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
            <path d="M26 6v12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          </svg>
          <p>No resources found</p>
          <button className="primary-btn" onClick={() => setShowModal(true)}>Add your first resource</button>
        </div>
      ) : view === "grid" ? (
        <div className="resource-grid">
          {filtered.map((res, i) => (
            <div key={res._id || i} className="resource-card">
              <div className="resource-card-top">
                <div className="resource-file-icon">{getIcon(res.url || res.title)}</div>
                <button className="resource-delete" onClick={() => handleDelete(res._id)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <h3 className="resource-title">{res.title}</h3>
              <p className="resource-desc">{res.description || "No description"}</p>
              {res.url && (
                <a href={res.url} target="_blank" rel="noreferrer" className="resource-link">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2h5v5M12 2L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 4H3a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  Open
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res, i) => (
                <tr key={res._id || i} className="table-row">
                  <td>{getIcon(res.url || res.title)}</td>
                  <td className="row-title">{res.title}</td>
                  <td className="row-preview">{res.description || "—"}</td>
                  <td className="row-actions">
                    {res.url && (
                      <a href={res.url} target="_blank" rel="noreferrer" className="action-btn view">Open</a>
                    )}
                    <button className="action-btn danger" onClick={() => handleDelete(res._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Resource</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field-group">
                <label>Title</label>
                <input type="text" placeholder="Resource title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="field-group">
                <label>Description</label>
                <textarea rows={3} placeholder="Brief description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="field-group">
                <label>URL / Link</label>
                <input type="url" placeholder="https://..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={saving}>{saving ? "Saving..." : "Add Resource"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}