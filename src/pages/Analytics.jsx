import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import EmptyState from '../components/EmptyState';
import {
  ListChecks, CheckCircle2, Clock, AlertTriangle,
  Percent, TrendingUp, Target, BarChart3,
} from 'lucide-react';
import {
  computeStats,
  weeklyCompletionTrend,
  subjectStats,
  PRIORITY_RANK,
} from '../utils/taskUtils';
import { isTaskOverdue, formatDate } from '../utils/dateUtils';

const STATUS_COLORS = {
  Completed: 'var(--success)',
  Pending: 'var(--warning)',
  'In Progress': 'var(--info)',
};

export default function Analytics() {
  const { tasks, subjects, getSubject } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const trend = useMemo(() => weeklyCompletionTrend(tasks), [tasks]);
  const perSubject = useMemo(() => subjectStats(tasks), [tasks]);

  const createdThisWeek = trend.reduce((sum, d) => sum + d.created, 0);
  const completedThisWeek = trend.reduce((sum, d) => sum + d.completed, 0);

  const statusData = ['Completed', 'Pending', 'In Progress']
    .map((s) => ({
      name: s,
      value: tasks.filter((t) => t.status === s).length,
      color: STATUS_COLORS[s],
    }))
    .filter((d) => d.value > 0);

  const priorityData = ['High', 'Medium', 'Low']
    .map((p) => ({ name: p, value: tasks.filter((t) => t.priority === p).length }))
    .filter((d) => d.value > 0);

  const subjectData = subjects
    .map((s) => ({
      name: s.name.length > 12 ? `${s.name.slice(0, 11)}…` : s.name,
      Tasks: perSubject[s.id]?.total || 0,
      color: s.color,
    }))
    .filter((d) => d.Tasks > 0)
    .sort((a, b) => b.Tasks - a.Tasks);

  const bestDay = [...trend].sort((a, b) => b.completed - a.completed)[0];
  const hardestSubject = [...subjectData][0];
  const overdueTasks = tasks.filter(isTaskOverdue);
  const avgPerDay = createdThisWeek > 0 ? (createdThisWeek / 7).toFixed(1) : '0';

  if (tasks.length === 0) {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Analytics</h1>
            <p>Understand your study patterns with real data.</p>
          </div>
        </div>
        <div className="card">
          <EmptyState
            icon={BarChart3}
            title="No data to analyze yet"
            text="Analytics are computed from your actual tasks. Create a few tasks and complete them — charts and insights will appear here automatically."
            actionLabel="Go to My Tasks"
            onAction={() => navigate('/tasks')}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Analytics</h1>
          <p>Understand your study patterns — every number below is computed from your saved tasks.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/tasks')}>
          <Plus size={16} /> Manage Tasks
        </button>
      </div>

      <div className="analytics-grid">
        <StatCard label="Total created" value={stats.total} icon={ListChecks} tone="indigo" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="green" />
        <StatCard label="Still pending" value={stats.pending} icon={Clock} tone="amber" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} tone="red" />
      </div>