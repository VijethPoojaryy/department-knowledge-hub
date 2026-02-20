import React, { useState } from 'react';
// useNavigate lets us programmatically redirect to another page
import { useNavigate } from 'react-router-dom';

function Login() {
  // useState stores what the user types in the input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // This runs when the form is submitted
  const handleLogin = (e) => {
    e.preventDefault(); // Prevents the page from refreshing (default form behavior)

    // Later, you'll send email+password to your backend here
    // For now, we just redirect to dashboard
    console.log('Logging in with:', email, password);
    navigate('/dashboard');
  };

  return (
    // min-vh-100 = full screen height, d-flex centers content
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '420px' }}>
        
        {/* Header */}
        <div className="text-center mb-4">
          <i className="bi bi-mortarboard-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
          <h4 className="mt-2 fw-bold">Resource Hub</h4>
          <p className="text-muted small">Departmental Knowledge Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Updates state as user types
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            <i className="bi bi-box-arrow-in-right me-2"></i>Login
          </button>
        </form>

        {/* Link to Register */}
        <p className="text-center mt-3 small">
          New student?{' '}
          <a href="/register" className="text-primary fw-semibold">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;