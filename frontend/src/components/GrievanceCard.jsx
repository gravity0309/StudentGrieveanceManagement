import React from 'react';

const GrievanceCard = ({ grievance, onEdit, onDelete }) => {
  const date = new Date(grievance.date || grievance.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="card fade-up" style={{
      padding: '20px',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-light)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top row: title + badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', flex: 1, fontFamily: 'var(--font-display)' }}>
          {grievance.title}
        </h4>
        <span className={`badge badge-${grievance.status?.toLowerCase()}`}>{grievance.status}</span>
      </div>

      {/* Description */}
      <p style={{
        color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6,
        marginBottom: 14,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>
        {grievance.description}
      </p>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="tag">{grievance.category}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{date}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onEdit(grievance)}
            title="Edit grievance"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(grievance._id)}
            title="Delete grievance"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrievanceCard;
