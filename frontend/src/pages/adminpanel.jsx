import React, { useState } from 'react';
import Navbar from '../components/Navbar';

// --- DUMMY PENDING FILES ---
// These represent files that students have uploaded but haven't been approved yet.
// In a real app, you'd fetch these from your backend with:
// GET /api/resources?status=pending
// For now, we hardcode them so you can see and test the UI.
const initialPendingFiles = [
  {
    id: 101,
    title: 'Unit 4 - Tree Traversal Notes',
    subject: 'BCA401',
    semester: '4',
    unit: '4',
    fileType: '.pdf',
    fileName: 'tree_traversal.pdf',
    fileSize: '340 KB',
    uploadedBy: 'Rahul Sharma (1BCA21001)',
    submittedAt: Date.now() - (1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: 102,
    title: 'OS Scheduling Algorithms PPT',
    subject: 'BCA402',
    semester: '4',
    unit: '3',
    fileType: '.pptx',
    fileName: 'scheduling.pptx',
    fileSize: '1.2 MB',
    uploadedBy: 'Priya Nair (1BCA21022)',
    submittedAt: Date.now() - (3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: 103,
    title: 'DBMS ER Diagram Handwritten',
    subject: 'BCA403',
    semester: '4',
    unit: '2',
    fileType: '.jpg',
    fileName: 'er_diagram.jpg',
    fileSize: '780 KB',
    uploadedBy: 'Arun Mehta (1BCA21045)',
    submittedAt: Date.now() - (5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 104,
    title: 'Network Layers - Short Notes',
    subject: 'BCA404',
    semester: '3',
    unit: '1',
    fileType: '.docx',
    fileName: 'network_layers.docx',
    fileSize: '215 KB',
    uploadedBy: 'Sneha Rao (1BCA21067)',
    submittedAt: Date.now() - (8 * 60 * 60 * 1000), // 8 hours ago
  },
];

// --- HELPER: timeAgo (same function from Notices page) ---
// Converts a timestamp to a human-friendly string like "3 hours ago"
const timeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// --- FILE TYPE ICON MAP (same logic as Upload page) ---
const fileTypeIcons = {
  '.pdf':  { icon: 'bi-file-earmark-pdf-fill',  color: 'text-danger'  },
  '.ppt':  { icon: 'bi-file-earmark-ppt-fill',  color: 'text-warning' },
  '.pptx': { icon: 'bi-file-earmark-ppt-fill',  color: 'text-warning' },
  '.doc':  { icon: 'bi-file-earmark-word-fill', color: 'text-primary' },
  '.docx': { icon: 'bi-file-earmark-word-fill', color: 'text-primary' },
  '.jpg':  { icon: 'bi-file-earmark-image-fill',color: 'text-success' },
  '.jpeg': { icon: 'bi-file-earmark-image-fill',color: 'text-success' },
  '.png':  { icon: 'bi-file-earmark-image-fill',color: 'text-success' },
};

function AdminPanel() {
  // Simulate the logged-in user's role.
  // Change to 'student' to see the access-denied screen.
  const [currentRole] = useState('admin');

  // This is the master list of pending files.
  // When you approve or reject one, it gets removed from this list.
  const [pendingFiles, setPendingFiles] = useState(initialPendingFiles);

  // This tracks files that have been approved in this session.
  // In a real app, approved files go to the database and appear in the Dashboard.
  const [approvedFiles, setApprovedFiles] = useState([]);

  // This tracks the ID of whichever file currently has an open "Reject" confirmation.
  // We show a small confirmation step before deleting, so admins don't reject by accident.
  const [rejectConfirmId, setRejectConfirmId] = useState(null);

  // --- APPROVE HANDLER ---
  // Moves the file from the pending list to the approved list.
  // In a real app: PATCH /api/resources/:id  { status: 'approved' }
  const handleApprove = (fileId) => {
    // Find the file we're approving
    const fileToApprove = pendingFiles.find((f) => f.id === fileId);

    // Remove it from pending list
    // .filter() keeps every item EXCEPT the one we're approving
    setPendingFiles((prev) => prev.filter((f) => f.id !== fileId));

    // Add it to the approved list so we can show a running log
    setApprovedFiles((prev) => [{ ...fileToApprove, approvedAt: Date.now() }, ...prev]);
  };

  // --- REJECT HANDLER ---
  // Simply removes the file from the pending list — no approval, no publishing.
  // In a real app: DELETE /api/resources/:id  or  PATCH with { status: 'rejected' }
  const handleReject = (fileId) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== fileId));
    setRejectConfirmId(null); // Close the confirmation prompt
  };

  // --- ACCESS CONTROL ---
  // If the user is a student, they should never reach this page.
  // This is a frontend guard — your backend routes will also protect this on the server side.
  if (currentRole === 'student') {
    return (
      <div>
        <Navbar />
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
          <i className="bi bi-shield-lock-fill text-danger" style={{ fontSize: '4rem' }}></i>
          <h4 className="mt-3 fw-bold">Access Denied</h4>
          <p className="text-muted">Only Admin and Faculty can view this page.</p>
          <a href="/dashboard" className="btn btn-primary mt-2">
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container mt-4">

        {/* --- PAGE HEADER --- */}
        <div className="mb-4">
          <h4 className="fw-bold">
            <i className="bi bi-shield-check text-warning me-2"></i>
            Admin Panel — Review Uploads
          </h4>
          <p className="text-muted small">
            Files submitted by students are listed below. Review each one and either
            approve (make it public) or reject (remove it).
          </p>
        </div>

        {/* --- STATS ROW --- */}
        {/* A quick summary bar so the Admin can see the situation at a glance */}
        <div className="row mb-4 g-3">
          <div className="col-6 col-md-3">
            <div className="card text-center border-warning shadow-sm">
              <div className="card-body py-2">
                <div className="fw-bold fs-4 text-warning">{pendingFiles.length}</div>
                <div className="small text-muted">Pending</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card text-center border-success shadow-sm">
              <div className="card-body py-2">
                <div className="fw-bold fs-4 text-success">{approvedFiles.length}</div>
                <div className="small text-muted">Approved Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================== */}
        {/* --- PENDING FILES SECTION --- */}
        {/* ============================== */}
        <h6 className="fw-bold text-warning mb-3">
          <i className="bi bi-hourglass-split me-2"></i>
          Pending Approval ({pendingFiles.length})
        </h6>

        {pendingFiles.length === 0 ? (
          // This empty state appears when all files have been reviewed
          <div className="text-center py-5 text-muted border rounded mb-4">
            <i className="bi bi-check2-circle" style={{ fontSize: '3rem' }}></i>
            <p className="mt-2">All caught up! No pending files to review.</p>
          </div>
        ) : (
          pendingFiles.map((file) => {
            // Get the icon info for this file's type
            const iconInfo = fileTypeIcons[file.fileType] || { icon: 'bi-file-earmark', color: 'text-secondary' };
            // Is the rejection confirmation open for THIS specific file?
            const isConfirmingReject = rejectConfirmId === file.id;

            return (
              <div key={file.id} className="card mb-3 shadow-sm border-warning">
                <div className="card-body">

                  {/* Top Row: File Icon + Info */}
                  <div className="d-flex gap-3 align-items-start">

                    {/* File Type Icon */}
                    <i
                      className={`bi ${iconInfo.icon} ${iconInfo.color} flex-shrink-0`}
                      style={{ fontSize: '2.2rem' }}
                    ></i>

                    {/* File Details */}
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{file.title}</div>
                      <div className="small text-muted">
                        {file.fileName} &nbsp;•&nbsp; {file.fileSize}
                      </div>
                      <div className="small text-muted mt-1">
                        <i className="bi bi-bookmark me-1"></i>{file.subject}
                        &nbsp;|&nbsp;
                        <i className="bi bi-layers me-1"></i>Sem {file.semester}, Unit {file.unit}
                      </div>
                      <div className="small text-muted mt-1">
                        <i className="bi bi-person me-1"></i>
                        Submitted by <span className="fw-semibold">{file.uploadedBy}</span>
                        &nbsp;•&nbsp;
                        <i className="bi bi-clock me-1"></i>{timeAgo(file.submittedAt)}
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons Row */}
                  <div className="mt-3 d-flex gap-2 flex-wrap">

                    {/* APPROVE BUTTON */}
                    {/* Clicking this immediately approves the file */}
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(file.id)}
                    >
                      <i className="bi bi-check-lg me-1"></i>Approve
                    </button>

                    {/* REJECT BUTTON — Two-step process to prevent accidents */}
                    {!isConfirmingReject ? (
                      // Step 1: Show the Reject button normally
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setRejectConfirmId(file.id)}
                      >
                        <i className="bi bi-x-lg me-1"></i>Reject
                      </button>
                    ) : (
                      // Step 2: Replace it with a confirmation prompt
                      // This prevents accidental rejections with one misclick
                      <div className="d-flex align-items-center gap-2">
                        <span className="small text-danger fw-semibold">Are you sure?</span>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(file.id)}
                        >
                          Yes, Reject
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setRejectConfirmId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* =============================== */}
        {/* --- APPROVED FILES LOG --- */}
        {/* =============================== */}
        {/* This section only appears after at least one file has been approved */}
        {approvedFiles.length > 0 && (
          <div className="mt-4">
            <h6 className="fw-bold text-success mb-3">
              <i className="bi bi-check-circle-fill me-2"></i>
              Approved in This Session ({approvedFiles.length})
            </h6>

            {approvedFiles.map((file) => (
              <div key={file.id} className="card mb-2 border-success shadow-sm">
                <div className="card-body py-2 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-semibold small">{file.title}</span>
                    <span className="text-muted small ms-2">— {file.uploadedBy}</span>
                  </div>
                  <span className="badge bg-success">
                    <i className="bi bi-check2 me-1"></i>Live
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminPanel;