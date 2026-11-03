import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, AlertTriangle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
    monthMatrix,
    monthLabel,
    weekdayNames,
    toISODate,
    todayISO,
    isTaskOverdue,
    formatTimestamp,
} from '../utils/dateUtils';
import { StatusBadge, PriorityBadge } from './TaskCard';
import EmptyState from './EmptyState';

export default function CalendarView() {
    const { tasks, getSubject, settings, toggleTaskStatus } = useApp();
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [selectedDate, setSelectedDate] = useState(todayISO());

    const weekStartsOn = settings.weekStartsOn;
    const weeks = monthMatrix(year, month, weekStartsOn);
    const days = weekdayNames(weekStartsOn);
    const today = todayISO();

    const tasksByDate = {};
    tasks.forEach((t) => {
        if (!t.dueDate) return;
        if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
        tasksByDate[t.dueDate].push(t);
    });

    const shiftMonth = (delta) => {
        const d = new Date(year, month + delta, 1);
        setYear(d.getFullYear());
        setMonth(d.getMonth());
    };

    const selectedTasks = (tasksByDate[selectedDate] || []).sort((a, b) =>
        a.status === 'Completed' ? 1 : b.status === 'Completed' ? -1 : 0
    );

    const upcoming = tasks
        .filter((t) => t.status !== 'Completed' && t.dueDate >= today)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 6);

    const overdueTasks = tasks.filter(isTaskOverdue);

    return (
        <>
            <div className="calendar-layout">
                <div className="card">
                    <div className="calendar-toolbar">
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                                setYear(now.getFullYear());
                                setMonth(now.getMonth());
                                setSelectedDate(today);
                            }}
                        >
                            Today
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <button
                                type="button"
                                className="btn-icon"
                                onClick={() => shiftMonth(-1)}
                                aria-label="Previous month"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="calendar-month-label">{monthLabel(year, month)}</span>
                            <button
                                type="button"
                                className="btn-icon"
                                onClick={() => shiftMonth(1)}
                                aria-label="Next month"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <span style={{ width: 68 }} aria-hidden="true" />
                    </div>

                    <div className="calendar-weekdays" role="row">
                        {days.map((d) => (
                            <span key={d} role="columnheader">
                                {d}
                            </span>
                        ))}
                    </div>

                    <div className="calendar-grid">
                        {weeks.flat().map((date) => {
                            const iso = toISODate(date);
                            const dayTasks = tasksByDate[iso] || [];
                            const inMonth = date.getMonth() === month;
                            const cls = [
                                'calendar-day',
                                inMonth ? '' : 'other-month',
                                iso === today ? 'today' : '',
                                iso === selectedDate ? 'selected' : '',
                            ]
                                .filter(Boolean)
                                .join(' ');

                            return (
                                <button
                                    type="button"
                                    key={iso}
                                    className={cls}
                                    onClick={() => setSelectedDate(iso)}
                                    aria-label={`${iso}, ${dayTasks.length} task(s)`}
                                    aria-pressed={iso === selectedDate}
                                >
                                    <span className="calendar-day-number">{date.getDate()}</span>
                                    <span className="calendar-dots">
                                        {dayTasks.slice(0, 4).map((t) => (
                                            <span
                                                key={t.id}
                                                className="calendar-dot"
                                                style={{
                                                    background:
                                                        t.status === 'Completed'
                                                            ? 'var(--success)'
                                                            : getSubject(t.subjectId)?.color || 'var(--primary)',
                                                }}
                                            />
                                        ))}
                                        {dayTasks.length > 4 ? <span className="calendar-dot-more">+{dayTasks.length - 4}</span> : null}
                                    </span>
                                    {dayTasks.some((t) => isTaskOverdue(t)) ? (
                                        <span className="calendar-day-count">Overdue</span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h3 className="card-title">
                                    <CalendarDays size={16} aria-hidden="true" />
                                    {selectedDate === today ? 'Today' : formatTimestamp(selectedDate)}
                                </h3>
                                <p className="card-subtitle">
                                    {selectedTasks.length} task{selectedTasks.length === 1 ? '' : 's'} scheduled
                                </p>
                            </div>
                        </div>
                        <div className="card-body">
                            {selectedTasks.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
                                    No tasks are due on this date. Pick another day or add a task with this due date.
                                </p>
                            ) : (
                                <div>
                                    {selectedTasks.map((t) => {
                                        const subject = getSubject(t.subjectId);
                                        const overdue = isTaskOverdue(t);
                                        return (
                                            <div key={t.id} className="day-task-item">
                                                <button
                                                    type="button"
                                                    className={`task-check${t.status === 'Completed' ? ' done' : ''}`}
                                                    style={{ marginTop: 2 }}
                                                    onClick={() => toggleTaskStatus(t.id)}
                                                    aria-label={`Toggle completion of ${t.title}`}
                                                />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div
                                                        className={`task-title${t.status === 'Completed' ? ' done' : ''}`}
                                                        style={{ fontSize: 13.5 }}
                                                    >
                                                        {t.title}
                                                    </div>
                                                    <div className="task-meta" style={{ marginTop: 5, gap: 7 }}>
                                                        {subject ? (
                                                            <span className="subject-chip">
                                                                <span className="subject-dot" style={{ background: subject.color }} />
                                                                {subject.name}
                                                            </span>
                                                        ) : null}
                                                        <PriorityBadge priority={t.priority} />
                                                        <StatusBadge status={t.status} overdue={overdue} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    {overdueTasks.length > 0 ? (
                        <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--danger) 40%, var(--border))' }}>
                            <div className="card-header">
                                <h3 className="card-title" style={{ color: 'var(--danger)' }}>
                                    <AlertTriangle size={16} aria-hidden="true" />
                                    Overdue ({overdueTasks.length})
                                </h3>
                            </div>
                            <div className="card-body" style={{ paddingTop: 10 }}>
                                {overdueTasks
                                    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                                    .map((t) => (
                                        <div key={t.id} className="day-task-item">
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div className="task-title" style={{ fontSize: 13.5 }}>
                                                    {t.title}
                                                </div>
                                                <div className="task-meta" style={{ marginTop: 4 }}>
                                                    <span className="task-meta-item overdue">{formatTimestamp(t.dueDate)}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-icon"
                                                onClick={() => toggleTaskStatus(t.id)}
                                                aria-label={`Mark ${t.title} as completed`}
                                            >
                                                <Check size={16} />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Upcoming deadlines</h3>
                        </div>
                        <div className="card-body" style={{ paddingTop: 10 }}>
                            {upcoming.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
                                    Nothing upcoming — enjoy the free time or plan something new.
                                </p>
                            ) : (
                                upcoming.map((t) => {
                                    const subject = getSubject(t.subjectId);
                                    return (
                                        <div key={t.id} className="day-task-item">
                                            <span
                                                className="subject-dot"
                                                style={{ background: subject?.color || 'var(--primary)', marginTop: 7 }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div className="task-title" style={{ fontSize: 13.5 }}>
                                                    {t.title}
                                                </div>
                                                <div className="task-meta" style={{ marginTop: 4 }}>
                                                    <span className="task-meta-item">{formatTimestamp(t.dueDate)}</span>
                                                    <PriorityBadge priority={t.priority} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="card" style={{ marginTop: 20 }}>
                    <EmptyState
                        icon={CalendarDays}
                        title="Your calendar is empty"
                        text="Once you create tasks with due dates, they will appear on the calendar automatically."
                    />
                </div>
            ) : null}
        </>
    );
}
