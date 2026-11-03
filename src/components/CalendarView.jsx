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
