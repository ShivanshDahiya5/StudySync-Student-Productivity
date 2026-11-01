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

function TaskActions({ task, onEdit }) {
  const { deleteTask } = useApp();
  return (
    <div className="task-actions">
      <button type="button" className="btn-icon" onClick={() => onEdit(task)} aria-label={`Edit task ${task.title}`}>
        <Pencil size={16} />
      </button>
      <button
        type="button"
        className="btn-icon danger"
        onClick={() => deleteTask(task)}
        aria-label={`Delete task ${task.title}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
