import { Pencil, Trash2 } from 'lucide-react';

export default function SubjectCard({ subject, stats = { total: 0, completed: 0, pending: 0 }, onEdit, onDelete }) {
  const pct = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="card card-hover subject-card">
      <div className="subject-color-bar" style={{ background: subject.color }} />
