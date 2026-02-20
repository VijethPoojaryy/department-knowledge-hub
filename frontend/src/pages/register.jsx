import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [usn, setUsn] = useState("");
  const [semester, setSemester] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const usnPattern = /^[0-9][A-Z]{2,4}[0-9]{2}[0-9]{3}$/;

    if (!usnPattern.test(usn)) {
      setError("USN format is invalid. Example: 1BCA21001");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const registerData = {
      name: fullName,
      usn,
      semester,
      email,
      password,
      role,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "480px" }}
      >
        <h4 className="text-center mb-3">Create Account</h4>

        {error && (
          <div className="alert alert-danger small">{error}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">USN</label>
            <input
              type="text"
              className="form-control"
              value={usn}
              onChange={(e) => setUsn(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Semester</label>
            <select
              className="form-select"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              <option value="1">1st</option>
              <option value="2">2nd</option>
              <option value="3">3rd</option>
              <option value="4">4th</option>
              <option value="5">5th</option>
              <option value="6">6th</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Register As</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;