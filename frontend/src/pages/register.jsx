import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  // One state variable per form field.
  // Think of these as the "memory" of the form.
  const [fullName, setFullName]         = useState('');
  const [usn, setUsn]                   = useState('');
  const [semester, setSemester]         = useState('');
  const [role, setRole]                 = useState('student'); // default role is student
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // This state will hold any error message we want to show the user
  const [error, setError] = useState('');

  // --- VALIDATION LOGIC ---
  // This runs before we "submit" the form to the backend
  const handleRegister = (e) => {
    e.preventDefault(); // Stop page refresh (default HTML form behavior)
    setError('');        // Clear any old error first

    // Rule 1: USN must follow a pattern like 1BCA21001
    // The regex below checks: starts with a digit, then 2-4 uppercase letters,
    // then 2 digits, then 3 digits. Adjust this to match your college's USN format.
    const usnPattern = /^[0-9][A-Z]{2,4}[0-9]{2}[0-9]{3}$/;
    if (!usnPattern.test(usn)) {
      setError('USN format is invalid. Example: 1BCA21001');
      return; // Stop here — don't proceed
    }

    // Rule 2: Password must be at least 6 characters
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Rule 3: Both passwords must match
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please retype carefully.');
      return;
    }

    // If all checks pass, log the data (later, you'll send this to your backend API)
    console.log('Registering user:', { fullName, usn, semester, role, password });

    // For now, redirect to login after "successful" registration
    alert('Registration successful! Please log in.');
    navigate('/');
  };

  return (
    // Full screen centered layout, same style as Login for consistency
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '480px' }}>

        {/* --- HEADER --- */}
        <div className="text-center mb-4">
          <i className="bi bi-person-plus-fill text-success" style={{ fontSize: '2.5rem' }}></i>
          <h4 className="mt-2 fw-bold">Create Your Account</h4>
          <p className="text-muted small">Register to access the Resource Hub</p>
        </div>

        {/* --- ERROR MESSAGE BOX --- */}
        {/* This only appears when the `error` state has some text in it */}
        {error && (
          <div className="alert alert-danger py-2 small">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        {/* --- REGISTRATION FORM --- */}
        <form onSubmit={handleRegister}>

          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rahul Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* USN */}
          <div className="mb-3">
            <label className="form-label fw-semibold">USN (University Seat Number)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 1BCA21001"
              value={usn}
              // Convert to uppercase automatically as the user types
              // This prevents issues like "1bca21001" failing the pattern check
              onChange={(e) => setUsn(e.target.value.toUpperCase())}
              required
            />
            <div className="form-text text-muted">
              Format: 1BCA21001 (must be unique — one account per USN)
            </div>
          </div>

          {/* Semester — using a dropdown so the user can only pick valid values */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Semester</label>
            <select
              className="form-select"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            >
              <option value="">-- Select your Semester --</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
              <option value="5">5th Semester</option>
              <option value="6">6th Semester</option>
            </select>
          </div>

          {/* Role Selector */}
          {/* In a real app, Admin accounts are created manually (not via public form).
              We include this here for hackathon demo purposes. */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Register As</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin (HOD)</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {/* Live feedback: shows a green tick as the user types if passwords match */}
            {confirmPassword && (
              <div className={`form-text ${password === confirmPassword ? 'text-success' : 'text-danger'}`}>
                {password === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success w-100 mt-2">
            <i className="bi bi-check-circle me-2"></i>Register
          </button>
        </form>

        {/* Link back to Login */}
        <p className="text-center mt-3 small">
          Already have an account?{' '}
          <a href="/" className="text-primary fw-semibold">Login here</a>
        </p>

      </div>
    </div>
  );
}

export default Register;