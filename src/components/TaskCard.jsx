import { Check, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isTaskOverdue, formatDate, dueLabel } from '../utils/dateUtils';

const PRIORITY_CLASS = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
const STATUS_CLASS = { Pending: 'badge-pending', 'In Progress': 'badge-inprogress', Completed: 'badge-completed' };

export function PriorityBadge({ priority }) {
  return <span className={`badge ${PRIORITY_CLASS[priority] || 'badge-medium'}`}>{priority}</span>;
}

export function StatusBadge({ status, overdue }) {
  if (overdue) return <span className="badge badge-overdue">Overdue</span>;
  return <span className={`badge ${STATUS_CLASS[status] || 'badge-pending'}`}>{status}</span>;
}