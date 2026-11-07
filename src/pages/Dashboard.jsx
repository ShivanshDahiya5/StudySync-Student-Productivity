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
