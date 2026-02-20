import React, { useState } from 'react';
import Navbar from '../components/Navbar';

// --- HELPER FUNCTION ---
// Given a notice's creation timestamp, returns true if it was posted within the last 24 hours.
// Date.now() gives current time in milliseconds.
// 24 * 60 * 60 * 1000 = 86,400,000 milliseconds = exactly one day.
const isNew = (createdAt) => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  return Date.now() - createdAt < ONE_DAY_MS;
};

// --- HELPER FUNCTION ---
// Converts a timestamp into a readable string like "2 hours ago" or "3 days ago".
// This is much friendlier than showing a raw date like "2024-02-20T10:30:00".
const timeAgo = (createdAt) => {
  const seconds = Math.floor((Date.now() - createdAt) / 1000);
  if (seconds < 60)   return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)   return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)     return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// --- DUMMY DATA ---
// We simulate realistic data by using Date.now() with offsets.
// Subtracting a small number of milliseconds = "posted recently".
// Subtracting a large number = "posted days ago".
// When your backend is ready, you'll replace this array with an API call.
const dummyNotices = [
  {
    id: 1,
    title: 'Internal Assessment 2 — Schedule Released',
    body: 'IA2 will be conducted from March 10th to March 14th. All students must carry their ID cards. Syllabus covers Unit 3 and Unit 4 of all subjects.',
    postedBy: 'HOD - Dr. Ramesh Kumar',
    category: 'Exam',
    // 2 hours ago — should show "New" badge
    createdAt: Date.now() - (2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: 'Department Seminar: AI & Machine Learning',
    body: 'A guest lecture by Dr. Priya Nair from IIT Bangalore is scheduled for Feb 25th at 10 AM in Seminar Hall B. Attendance is mandatory for 4th and 5th semester students.',
    postedBy: 'Prof. Meena',
    category: 'Event',
    // 5 hours ago — should show "New" badge
    createdAt: Date.now() - (5 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: 'Project Submission Deadline Extended',
    body: 'The final year project synopsis submission deadline has been extended to March 1st. Please submit soft copies to your respective guides.',
    postedBy: 'Prof. Sharma',
    category: 'General',
    // 2 days ago — should NOT show "New" badge
    createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: 'Library: New Books Added to Reference Section',
    body: 'The department library has received new editions of Data Structures by Lipschutz and DBMS by Ramakrishnan. Students can borrow for up to 7 days.',
    postedBy: 'HOD - Dr. Ramesh Kumar',
    category: 'General',
    // 4 days ago — should NOT show "New" badge
    createdAt: Date.now() - (4 * 24 * 60 * 60 * 1000),
  },
];

// --- CATEGORY COLOR MAP ---
// Each category gets a Bootstrap color class so notices are visually distinct.
// This helps students scan the board quickly without reading every notice.
const categoryColors = {
  Exam:    'danger',
  Event:   'primary',
  General: 'secondary',
};

function Notices() {
  // This simulates the logged-in user's role.
  // Change to 'admin' or 'faculty' to see the "Post Notice" form appear.
  const [currentRole] = useState('admin');

  // State for the list of notices — starts with our dummy data.
  // When backend is connected, you'll fetch this from an API instead.
  const [notices, setNotices] = useState(dummyNotices);

  // --- STATE FOR THE "POST NOTICE" FORM ---
  // We only show this form to Admin and Faculty users.
  const [showForm, setShowForm]   = useState(false);
  const [newTitle, setNewTitle]   = useState('');
  const [newBody, setNewBody]     = useState('');
  const [newCategory, setNewCategory] = useState('General');

  // --- POST A NEW NOTICE ---
  // This adds a new notice to the top of the list.
  // createdAt is set to Date.now() — which means isNew() will immediately return true,
  // and the "New" badge will appear for the next 24 hours automatically.
  const handlePostNotice = (e) => {
    e.preventDefault();

    const newNotice = {
      id: Date.now(),      // Use timestamp as a unique ID (fine for frontend demo)
      title: newTitle,
      body: newBody,
      postedBy: 'Prof. Demo (You)',
      category: newCategory,
      createdAt: Date.now(), // This is the key — fresh timestamp = "New" badge appears
    };

    // Add the new notice to the TOP of the list using spread syntax.
    // [...notices] copies the old array, and we put newNotice before it.
    setNotices([newNotice, ...notices]);

    // Reset the form and hide it
    setNewTitle('');
    setNewBody('');
    setNewCategory('General');
    setShowForm(false);
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-4" style={{ maxWidth: '720px' }}>

        {/* --- PAGE HEADER --- */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0">
              <i className="bi bi-megaphone-fill text-danger me-2"></i>
              Department Circulars
            </h4>
            <p className="text-muted small mt-1">
              Official notices from HOD and Faculty
            </p>
          </div>

          {/* Show "Post Notice" button only to Admin and Faculty */}
          {(currentRole === 'admin' || currentRole === 'faculty') && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-1`}></i>
              {showForm ? 'Cancel' : 'Post Notice'}
            </button>
          )}
        </div>

        {/* --- POST NOTICE FORM --- */}
        {/* This block only renders if showForm is true AND the user is admin/faculty */}
        {showForm && (currentRole === 'admin' || currentRole === 'faculty') && (
          <div className="card border-danger mb-4 shadow-sm">
            <div className="card-header bg-danger text-white fw-semibold small">
              <i className="bi bi-pencil-square me-2"></i>New Notice
            </div>
            <div className="card-body">
              <form onSubmit={handlePostNotice}>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Notice Title</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Exam Schedule for April"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Notice Details</label>
                  {/* textarea is for multi-line input — perfect for notice body text */}
                  <textarea
                    className="form-control form-control-sm"
                    rows={3}
                    placeholder="Write the full notice here..."
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Category</label>
                  <select
                    className="form-select form-select-sm"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Exam">Exam</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-danger btn-sm w-100">
                  <i className="bi bi-send-fill me-2"></i>Post to Notice Board
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- NOTICES LIST --- */}
        {notices.length === 0 ? (
          <p className="text-muted text-center mt-5">No notices posted yet.</p>
        ) : (
          notices.map((notice) => {
            // Decide the color for this notice's category badge
            const color = categoryColors[notice.category] || 'secondary';
            // Check right now, at render time, whether this notice is still "new"
            const noticeIsNew = isNew(notice.createdAt);

            return (
              <div
                key={notice.id}
                // If the notice is new, add a left border highlight to make it stand out
                className={`card mb-3 shadow-sm ${noticeIsNew ? 'border-danger border-2' : ''}`}
              >
                <div className="card-body">

                  {/* Top row: Category badge + "New" badge + timestamp */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex gap-2 align-items-center">
                      {/* Category badge — color changes based on category type */}
                      <span className={`badge bg-${color}`}>{notice.category}</span>

                      {/* "New" badge — only renders if isNew() returns true */}
                      {noticeIsNew && (
                        <span className="badge bg-danger">
                          <i className="bi bi-star-fill me-1"></i>New
                        </span>
                      )}
                    </div>

                    {/* Time ago — e.g. "2 hours ago" */}
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-clock me-1"></i>
                      {timeAgo(notice.createdAt)}
                    </span>
                  </div>

                  {/* Notice Title */}
                  <h6 className="fw-bold mb-1">{notice.title}</h6>

                  {/* Notice Body */}
                  <p className="small text-muted mb-2">{notice.body}</p>

                  {/* Posted by */}
                  <div className="small text-secondary">
                    <i className="bi bi-person-circle me-1"></i>
                    Posted by <span className="fw-semibold">{notice.postedBy}</span>
                  </div>

                </div>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}

export default Notices;