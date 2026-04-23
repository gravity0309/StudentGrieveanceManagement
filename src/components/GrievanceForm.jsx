import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Academic', 'Hostel', 'Transport', 'Other'];
const STATUSES = ['Pending', 'Resolved'];

const GrievanceForm = ({ onSubmit, onClose, initialData, loading, title }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Academic',
    status: 'Pending',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Academic',
        status: initialData.status || 'Pending',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
          >×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              type="text"
              placeholder="Brief title of your grievance"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe your issue in detail..."
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving...</> : 'Save Grievance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrievanceForm;
