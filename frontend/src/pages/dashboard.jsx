import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import FileCard from '../components/FileCard';

// --- DUMMY DATA (replace with API data later) ---
// This is fake data so you can see the UI working without a backend
const dummyFiles = [
  { id: 1, title: 'Data Structures Notes', subject: 'BCA401', semester: '4', professor: 'Prof. Sharma', type: 'pdf', status: 'approved' },
  { id: 2, title: 'OS Unit 2 PPT', subject: 'BCA402', semester: '4', professor: 'Prof. Meena', type: 'ppt', status: 'approved' },
  { id: 3, title: 'DBMS Assignment', subject: 'BCA403', semester: '4', professor: 'Prof. Kumar', type: 'doc', status: 'approved' },
  { id: 4, title: 'Network Diagram', subject: 'BCA404', semester: '3', professor: 'Prof. Sharma', type: 'jpg', status: 'approved' },
];

function Dashboard() {
  // These states hold the currently selected filter values
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState('');

  // Filter the files based on whatever the user selected
  // If a filter is empty (''), it matches everything
  const filteredFiles = dummyFiles.filter((file) => {
    const matchSemester = selectedSemester === '' || file.semester === selectedSemester;
    const matchSubject = selectedSubject === '' || file.subject === selectedSubject;
    const matchProfessor = selectedProfessor === '' || file.professor === selectedProfessor;
    return matchSemester && matchSubject && matchProfessor;
  });

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        {/* --- NOTICE BOARD SECTION --- */}
        <div className="mb-5">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-megaphone-fill text-danger me-2"></i>Department Circulars
          </h5>
          {/* Sample notice — later these will come from backend */}
          <div className="alert alert-warning d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-info-circle me-2"></i>
              Internal Assessment 2 scheduled for next Monday. Prepare Unit 3 & 4.
            </span>
            {/* "New" badge — visible only within 24 hours (logic added later) */}
            <span className="badge bg-danger">New</span>
          </div>
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-info-circle me-2"></i>
              Department seminar on AI & ML — Register by Friday.
            </span>
          </div>
        </div>

        {/* --- REPOSITORY SECTION --- */}
        <h5 className="fw-bold mb-3">
          <i className="bi bi-folder2-open text-primary me-2"></i>Study Materials
        </h5>

        {/* Filter bar component */}
        <FilterBar
          onSemesterChange={setSelectedSemester}
          onSubjectChange={setSelectedSubject}
          onProfessorChange={setSelectedProfessor}
        />

        {/* File grid */}
        <div className="row mt-3">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div className="col-md-4 col-sm-6 mb-4" key={file.id}>
                <FileCard file={file} />
              </div>
            ))
          ) : (
            <p className="text-muted">No files match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;