import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudent } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await registerStudent(form);
      login(data.student, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: '420px' }} className="fade-up">
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
            marginBottom: 16, boxShadow: '0 8px 24px rgba(56,189,248,0.3)'
          }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>
            GrievanceMS
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Student Grievance Management System</p>
        </div>

        <div className="card" style={{ boxShadow: 'var(--shadow-md), var(--shadow-glow)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
            Register to submit and track your grievances
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
            >
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Registering...</> : 'Create Account'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
