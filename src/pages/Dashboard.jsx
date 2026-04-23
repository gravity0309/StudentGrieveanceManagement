import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAllGrievances, submitGrievance, updateGrievance,
  deleteGrievance, searchGrievances
} from '../utils/api';
import GrievanceForm from '../components/GrievanceForm';
import GrievanceCard from '../components/GrievanceCard';

const Dashboard = () => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editGrievance, setEditGrievance] = useState(null);

  const fetchGrievances = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getAllGrievances();
      setGrievances(data.grievances);
    } catch (err) {
      setError('Failed to load grievances.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setError('');
    try {
      if (editGrievance) {
        await updateGrievance(editGrievance._id, formData);
        showSuccess('Grievance updated successfully!');
      } else {
        await submitGrievance(formData);
        showSuccess('Grievance submitted successfully!');
      }
      setShowModal(false);
      setEditGrievance(null);
      fetchGrievances();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grievance?')) return;
    try {
      await deleteGrievance(id);
      showSuccess('Grievance deleted.');
      fetchGrievances();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleEdit = (grievance) => {
    setEditGrievance(grievance);
    setShowModal(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return fetchGrievances();
    setSearching(true);
    try {
      const { data } = await searchGrievances(searchTerm.trim());
      setGrievances(data.grievances);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchGrievances();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pendingCount = grievances.filter(g => g.status === 'Pending').length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* ---- Navbar ---- */}
      <nav style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>GrievanceMS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{student?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{student?.email}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* ---- Main Content ---- */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* Alerts */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total', value: grievances.length, color: 'var(--accent)' },
            { label: 'Pending', value: pendingCount, color: 'var(--warning)' },
            { label: 'Resolved', value: resolvedCount, color: 'var(--success)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-display)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar: Search + New */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
            <button type="submit" className="btn btn-ghost btn-sm" disabled={searching}>
              {searching ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Search'}
            </button>
            {searchTerm && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleClearSearch}>Clear</button>
            )}
          </form>

          <button
            className="btn btn-primary"
            onClick={() => { setEditGrievance(null); setShowModal(true); }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Grievance
          </button>
        </div>

        {/* Grievances List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <span className="spinner" style={{ width: 32, height: 32 }} />
            <p style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: 14 }}>Loading grievances...</p>
          </div>
        ) : grievances.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
            </svg>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {searchTerm ? 'No grievances found for your search.' : 'No grievances yet. Click "New Grievance" to get started.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {grievances.map((g) => (
              <GrievanceCard
                key={g._id}
                grievance={g}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <GrievanceForm
          title={editGrievance ? 'Edit Grievance' : 'Submit New Grievance'}
          initialData={editGrievance}
          loading={formLoading}
          onSubmit={handleSubmit}
          onClose={() => { setShowModal(false); setEditGrievance(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
