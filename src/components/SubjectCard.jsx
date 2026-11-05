import { Pencil, Trash2 } from 'lucide-react';

export default function SubjectCard({ subject, stats = { total: 0, completed: 0, pending: 0 }, onEdit, onDelete }) {
  const pct = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="card card-hover subject-card">
      <div className="subject-color-bar" style={{ background: subject.color }} />
      <div className="subject-name-row">
        <h3 style={{ fontSize: 15.5, fontWeight: 650, wordBreak: 'break-word' }}>{subject.name}</h3>
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEdit(subject)}
            aria-label={`Edit subject ${subject.name}`}
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            className="btn-icon danger"
            onClick={() => onDelete(subject)}
            aria-label={`Delete subject ${subject.name}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="subject-stats">
        <div className="subject-stat">
          <strong>{stats.total}</strong>
          Total
        </div>
