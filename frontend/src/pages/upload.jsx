import React, { useState } from 'react';
import Navbar from '../components/Navbar';

// --- CONFIGURATION ---
// List of allowed file extensions. Easy to update in one place if rules change.
const ALLOWED_EXTENSIONS = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.jpg', '.jpeg', '.png'];

// This maps each extension to a human-friendly label and a Bootstrap icon.
// We use this to show the user what's accepted, and to display the file type after selection.
const FILE_TYPE_INFO = {
  '.pdf':  { label: 'PDF',  icon: 'bi-file-earmark-pdf-fill',  color: 'text-danger'  },
  '.ppt':  { label: 'PPT',  icon: 'bi-file-earmark-ppt-fill',  color: 'text-warning' },
  '.pptx': { label: 'PPTX', icon: 'bi-file-earmark-ppt-fill',  color: 'text-warning' },
  '.doc':  { label: 'DOC',  icon: 'bi-file-earmark-word-fill', color: 'text-primary' },
  '.docx': { label: 'DOCX', icon: 'bi-file-earmark-word-fill', color: 'text-primary' },
  '.jpg':  { label: 'JPG',  icon: 'bi-file-earmark-image-fill',color: 'text-success' },
  '.jpeg': { label: 'JPEG', icon: 'bi-file-earmark-image-fill',color: 'text-success' },
  '.png':  { label: 'PNG',  icon: 'bi-file-earmark-image-fill',color: 'text-success' },
};

// --- HELPER FUNCTION ---
// Extracts the file extension from a filename.
// Example: "notes unit2.PDF" → ".pdf"
// We call .toLowerCase() so that ".PDF" and ".pdf" are treated the same.
const getExtension = (filename) => {
  const lastDot = filename.lastIndexOf('.');       // Find the position of the last dot
  if (lastDot === -1) return '';                    // No dot found = no extension
  return filename.slice(lastDot).toLowerCase();     // Everything from the dot onwards
};

function Upload() {
  // --- SIMULATING A LOGGED-IN USER ---
  // Later, this will come from a real authentication system (JWT token / context).
  // For now, you can change this manually to 'faculty' or 'admin' to test role behavior.
  const [currentRole] = useState('student'); // Try changing to 'faculty' to test

  // --- FORM STATE ---
  const [title, setTitle]         = useState('');
  const [subject, setSubject]     = useState('');
  const [semester, setSemester]   = useState('');
  const [unit, setUnit]           = useState('');
  const [file, setFile]           = useState(null);      // The actual File object
  const [fileExt, setFileExt]     = useState('');        // Extension of selected file

  // --- UI FEEDBACK STATE ---
  const [error, setError]         = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- FILE SELECTION HANDLER ---
  // This runs the moment the user picks a file from their computer.
  const handleFileChange = (e) => {
    const selected = e.target.files[0]; // Get the first (and only) selected file
    if (!selected) return;              // User cancelled the file picker

    const ext = getExtension(selected.name);

    // Check if the extension is in our allowed list
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`"${selected.name}" is not allowed. Only PDF, PPT, DOC, and JPG/PNG files are accepted.`);
      setFile(null);   // Clear any previously valid file
      setFileExt('');
      return;
    }

    // If valid, save the file and its extension to state, and clear any old errors
    setError('');
    setFile(selected);
    setFileExt(ext);
  };

  // --- FORM SUBMIT HANDLER ---
  const handleUpload = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Double-check: a file must be selected and must be valid
    if (!file) {
      setError('Please select a valid file before uploading.');
      return;
    }

    // Determine upload status based on user role.
    // Faculty and Admin uploads are immediately "approved".
    // Student uploads go into a "pending" state awaiting review.
    const status = (currentRole === 'faculty' || currentRole === 'admin')
      ? 'approved'
      : 'pending';

    // Build the "upload object" — this is what you'll eventually send to your backend.
    const uploadData = {
      title,
      subject,
      semester,
      unit,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`, // Convert bytes to KB
      fileType: fileExt,
      uploadedBy: currentRole,
      status,                    // 'approved' or 'pending'
      uploadedAt: new Date().toISOString(),
    };

    // For now, just log it. Later, you'll POST this to your Express backend.
    console.log('Upload data ready:', uploadData);

    // Show appropriate success message based on role
    if (status === 'approved') {
      setSuccessMsg('✅ File uploaded successfully! It is now live in the repository.');
    } else {
      setSuccessMsg('⏳ File submitted for review. It will appear in the repository once approved by Faculty or HOD.');
    }

    // Reset the form after successful upload
    setTitle('');
    setSubject('');
    setSemester('');
    setUnit('');
    setFile(null);
    setFileExt('');
    // Reset the actual file input element visually
    document.getElementById('fileInput').value = '';
  };

  // Get the icon/color info for the selected file type (used in the preview section)
  const selectedFileInfo = fileExt ? FILE_TYPE_INFO[fileExt] : null;

  return (
    <div>
      <Navbar />

      <div className="container mt-4" style={{ maxWidth: '640px' }}>

        {/* --- PAGE HEADER --- */}
        <div className="mb-4">
          <h4 className="fw-bold">
            <i className="bi bi-cloud-upload-fill text-primary me-2"></i>Upload Study Material
          </h4>
          {/* Role-aware subtitle: shows different messages to student vs faculty */}
          {currentRole === 'student' ? (
            <p className="text-muted small">
              Your upload will be reviewed by Faculty or HOD before it appears publicly.
            </p>
          ) : (
            <p className="text-muted small">
              As Faculty/Admin, your uploads go live immediately.
            </p>
          )}
        </div>

        {/* --- ALLOWED FORMATS GUIDE --- */}
        {/* This helps users know what they can upload without guessing */}
        <div className="d-flex gap-3 flex-wrap mb-4 p-3 bg-light rounded border">
          <span className="small fw-semibold text-muted me-1">Allowed formats:</span>
          {['.pdf', '.ppt', '.doc', '.jpg'].map((ext) => (
            <span key={ext} className={`small fw-semibold ${FILE_TYPE_INFO[ext].color}`}>
              <i className={`bi ${FILE_TYPE_INFO[ext].icon} me-1`}></i>
              {FILE_TYPE_INFO[ext].label}
            </span>
          ))}
        </div>

        {/* --- ERROR / SUCCESS ALERTS --- */}
        {error && (
          <div className="alert alert-danger py-2 small">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success py-2 small">
            {successMsg}
          </div>
        )}

        {/* --- UPLOAD FORM --- */}
        <div className="card shadow-sm p-4">
          <form onSubmit={handleUpload}>

            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Resource Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Unit 3 - Linked Lists Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Subject Code + Semester — side by side on larger screens */}
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label fw-semibold">Subject Code</label>
                <select
                  className="form-select"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">-- Select Subject --</option>
                  <option value="BCA401">BCA401 - Data Structures</option>
                  <option value="BCA402">BCA402 - Operating Systems</option>
                  <option value="BCA403">BCA403 - DBMS</option>
                  <option value="BCA404">BCA404 - Networks</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Semester</label>
                <select
                  className="form-select"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                >
                  <option value="">-- Select Semester --</option>
                  {[1,2,3,4,5,6].map(s => (
                    <option key={s} value={s}>{s}th Semester</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Unit Number */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Unit Number</label>
              <select
                className="form-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              >
                <option value="">-- Select Unit --</option>
                {[1,2,3,4,5].map(u => (
                  <option key={u} value={u}>Unit {u}</option>
                ))}
              </select>
            </div>

            {/* File Picker */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Choose File</label>
              <input
                type="file"
                id="fileInput"          // We use this ID to reset the input after submit
                className="form-control"
                onChange={handleFileChange}
                // The 'accept' attribute hints to the OS file picker what to show.
                // This is a UI convenience — our JS validation is the real gatekeeper.
                accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>

            {/* --- FILE PREVIEW --- */}
            {/* This section appears only after the user picks a valid file */}
            {file && selectedFileInfo && (
              <div className="alert alert-secondary py-2 d-flex align-items-center gap-3 mb-3">
                <i
                  className={`bi ${selectedFileInfo.icon} ${selectedFileInfo.color}`}
                  style={{ fontSize: '1.8rem' }}
                ></i>
                <div>
                  <div className="fw-semibold small">{file.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {selectedFileInfo.label} &nbsp;•&nbsp; {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              <i className="bi bi-cloud-arrow-up-fill me-2"></i>
              {currentRole === 'student' ? 'Submit for Approval' : 'Upload Now'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Upload;