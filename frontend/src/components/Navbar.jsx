<div className="d-flex gap-3 ms-auto align-items-center">
  <a href="/dashboard" className="text-white text-decoration-none small">
    <i className="bi bi-grid-fill me-1"></i>Dashboard
  </a>
  <a href="/upload" className="text-white text-decoration-none small">
    <i className="bi bi-cloud-upload-fill me-1"></i>Upload
  </a>
  <a href="/notices" className="text-white text-decoration-none small">
    <i className="bi bi-bell-fill me-1"></i>Notices
  </a>

  {/* Admin Panel link — in a real app, you'd only render this if role is admin/faculty */}
  <a href="/admin" className="text-warning text-decoration-none small fw-semibold">
    <i className="bi bi-shield-check me-1"></i>Admin
  </a>

  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
    Logout
  </button>
</div>