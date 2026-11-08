import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  ListChecks,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Percent,
  Zap,
  ArrowRight,
  CalendarClock,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import ChartCard from '../components/ChartCard';
import EmptyState from '../components/EmptyState';
import { StatusBadge, PriorityBadge } from '../components/TaskCard';
import {
  computeStats,
  tasksDueToday,
  upcomingDeadlines,
  recentlyCompleted,
  weeklyCompletionTrend,
  subjectStats,
  motivationalMessage,
} from '../utils/taskUtils';
import { isTaskOverdue, formatDate, dueLabel } from '../utils/dateUtils';

export default function Dashboard() {
  const { tasks, subjects, getSubject, settings, toggleTaskStatus } = useApp();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const dueToday = useMemo(() => tasksDueToday(tasks), [tasks]);
  const upcoming = useMemo(() => upcomingDeadlines(tasks, 5), [tasks]);
  const recentDone = useMemo(() => recentlyCompleted(tasks, 5), [tasks]);
  const trend = useMemo(() => weeklyCompletionTrend(tasks), [tasks]);
  const perSubject = useMemo(() => subjectStats(tasks), [tasks]);

  const chartTrend = trend.map((d) => ({ name: d.label, Completed: d.completed, Created: d.created }));

  const chartSubjects = subjects
    .map((s) => ({
      name: s.name.length > 12 ? `${s.name.slice(0, 11)}…` : s.name,
      Completed: perSubject[s.id]?.completed || 0,
      Pending: perSubject[s.id]?.pending || 0,
      color: s.color,
    }))
    .filter((d) => d.Completed + d.Pending > 0);

  const pieData = [
    { name: 'Completed', value: stats.completed, color: 'var(--success)' },
    { name: 'Pending', value: stats.pending - tasks.filter((t) => t.status === 'In Progress').length, color: 'var(--warning)' },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'In Progress').length, color: 'var(--info)' },
  ].filter((d) => d.value > 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Hello, {settings.displayName || 'Student'} 👋</h1>
          <p>Here is what your academic world looks like today.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setQuickAddOpen(true)}>
          <Plus size={16} /> Quick Add Task
        </button>
      </div>

      <div className="motivation-banner">
        <Zap size={18} aria-hidden="true" />
        <span>{motivationalMessage(stats, dueToday.length)}</span>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Tasks" value={stats.total} icon={ListChecks} tone="indigo" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} tone="amber" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="green" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} tone="red" />
        <StatCard label="Completion" value={`${stats.completionRate}%`} icon={Percent} tone="sky" />
      </div>

      {tasks.length > 0 ? (
        <div className="chart-grid" style={{ marginTop: 20 }}>
          <ChartCard title="Weekly productivity" subtitle="Tasks created vs. completed over the last 7 days">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartTrend} barGap={4}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
                <Tooltip cursor={{ fill: 'var(--surface-2)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12.5 }} />
                <Bar dataKey="Created" fill="var(--primary)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="Completed" fill="var(--success)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Completion by subject"
            subtitle="How each subject is tracking"
          >
            {chartSubjects.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="No subject data yet"
                text="Assign a subject to your tasks to see this breakdown."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartSubjects} layout="vertical" barSize={14}>
                  <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip cursor={{ fill: 'var(--surface-2)' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12.5 }} />
                  <Bar dataKey="Completed" stackId="a" fill="var(--success)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Pending" stackId="a" fill="var(--warning)" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      ) : null}

      <div className="dash-grid">
        <div className="dash-col">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Zap size={17} aria-hidden="true" style={{ color: 'var(--primary)' }} />
                Today&apos;s tasks
              </h2>
              <Link to="/tasks" className="btn btn-ghost btn-sm">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ marginTop: 10 }}>
              {tasks.length === 0 ? (
                <EmptyState
                  icon={ListChecks}
                  title="No tasks yet"
                  text="Create your first assignment or study task and it will show up here."
                  actionLabel="Create your first task"
                  onAction={() => setQuickAddOpen(true)}
                />
              ) : dueToday.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="Nothing due today"
                  text="You have no deadlines for today. Check upcoming deadlines or add a new task."
                  actionLabel="Add Task"
                  onAction={() => setQuickAddOpen(true)}
                />
              ) : (
                <TaskList
                  tasks={dueToday}
                  onAdd={() => setQuickAddOpen(true)}
                  emptyTitle="Nothing due today"
                  emptyText="Add a task with today's due date to see it here."
                />
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recently completed</h2>
              <Link to="/analytics" className="btn btn-ghost btn-sm">
                Analytics <ArrowRight size={14} />
              </Link>
            </div>
            <div className="card-body" style={{ paddingTop: 10 }}>
              {recentDone.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
                  Completed tasks will appear here with their completion date.
                </p>
              ) : (
                recentDone.map((t) => {
                  const subject = getSubject(t.subjectId);
                  return (
                    <div key={t.id} className="day-task-item">
                      <button
                        type="button"
                        className="task-check done"
                        style={{ marginTop: 2 }}
                        onClick={() => toggleTaskStatus(t.id)}
                        aria-label={`Mark ${t.title} as pending`}
                      >
                        <CheckCircle2 size={12} />
                      </button>
<div style={{ flex: 1, minWidth: 0 }}>
                        <div className="task-title done" style={{ fontSize: 13.5 }}>
                          {t.title}
                        </div>
                        <div className="task-meta" style={{ marginTop: 4, gap: 8 }}>
                          {subject ? (
                            <span className="subject-chip">
                              <span className="subject-dot" style={{ background: subject.color }} />
                              {subject.name}
                            </span>
                          ) : null}
                          <span>Completed {formatDate(t.completedAt ? t.completedAt.slice(0, 10) : t.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="dash-col">
          {pieData.length > 0 ? (
            <ChartCard title="Task status" subtitle="Live breakdown of all your tasks">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={3}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12.5 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          ) : null}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Upcoming deadlines</h2>
              <Link to="/calendar" className="btn btn-ghost btn-sm">
                Calendar <ArrowRight size={14} />
              </Link>
            </div>
            <div className="card-body" style={{ paddingTop: 10 }}>
              {upcoming.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
                  No upcoming deadlines. Great time to get ahead!
                </p>
              ) : (
                upcoming.map((t) => {
                  const subject = getSubject(t.subjectId);
                  const overdue = isTaskOverdue(t);
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
                        <div className="task-meta" style={{ marginTop: 4, gap: 7 }}>
                          <span className={`task-meta-item${overdue ? ' overdue' : ''}`}>
                            {formatDate(t.dueDate)} · {dueLabel(t.dueDate)}
                          </span>
                          <PriorityBadge priority={t.priority} />
                          <StatusBadge status={t.status} overdue={overdue} />
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
