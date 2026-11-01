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

function SubjectTag({ subject }) {
    if (!subject) return null;
    return (
        <span className="subject-chip">
            <span className="subject-dot" style={{ background: subject.color }} />
            {subject.name}
        </span>
    );
}

export default function TaskCard({ task, view = 'list', onEdit }) {
    const { toggleTaskStatus, getSubject } = useApp();
    const subject = getSubject(task.subjectId);
    const overdue = isTaskOverdue(task);
    const done = task.status === 'Completed';

    if (view === 'card') {
        return (
            <div className="card card-hover task-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div className={`priority-stripe ${task.priority}`} title={`${task.priority} priority`} />
                    <TaskActions task={task} onEdit={onEdit} />
                </div>
                <div>
                    <h3 className={`task-title${done ? ' done' : ''}`}>{task.title}</h3>
                    {task.description ? <p className="task-desc">{task.description}</p> : null}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} overdue={overdue} />
                </div>

                <div className="task-meta" style={{ marginTop: 'auto' }}>
                    <SubjectTag subject={subject} />
                    <span className={`task-meta-item${overdue ? ' overdue' : ''}`}>
                        {formatDate(task.dueDate)} · {dueLabel(task.dueDate)}
                    </span>
                </div>

                <button
                    type="button"
                    className={`btn btn-sm ${done ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => toggleTaskStatus(task.id)}
                    style={{ width: '100%' }}
                >
                    <Check size={14} />
                    {done ? 'Mark as Pending' : 'Mark as Completed'}
                </button>
            </div>
        );
    }

    return (
        <div className="task-row">
            <button
                type="button"
                className={`task-check${done ? ' done' : ''}`}
                onClick={() => toggleTaskStatus(task.id)}
                aria-label={done ? `Mark ${task.title} as pending` : `Mark ${task.title} as completed`}
                aria-pressed={done}
            >
                {done ? <Check size={13} /> : null}
            </button>

            <div className="task-main">
                <div className={`task-title${done ? ' done' : ''}`}>{task.title}</div>
                {task.description ? <p className="task-desc">{task.description}</p> : null}
                <div className="task-meta">
                    <SubjectTag subject={subject} />
                    <span className={`task-meta-item${overdue ? ' overdue' : ''}`}>
                        {formatDate(task.dueDate)} · {dueLabel(task.dueDate)}
                    </span>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} overdue={overdue} />
                </div>
            </div>

            <TaskActions task={task} onEdit={onEdit} />
        </div>
    );
}