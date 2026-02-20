import React from 'react';
// BrowserRouter wraps everything and enables URL-based navigation
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all our pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Notices from './pages/Notices';

function App() {
  return (
    <Router>
      <Routes>
        {/* When user visits '/', show Login page */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/notices" element={<Notices />} />
      </Routes>
    </Router>
  );
}

export default App;