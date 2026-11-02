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

            <div className="analytics-grid" style={{ marginTop: 16 }}>
        <StatCard label="Completion rate" value={`${stats.completionRate}%`} icon={Percent} tone="sky" />
        <StatCard label="Created this week" value={createdThisWeek} icon={TrendingUp} tone="indigo" />
        <StatCard label="Completed this week" value={completedThisWeek} icon={Target} tone="green" />
        <StatCard label="Avg. tasks / day" value={avgPerDay} icon={BarChart3} tone="sky" />
      </div>

      <div className="chart-grid" style={{ marginTop: 20 }}>
        <ChartCard title="Weekly completion trend" subtitle="Tasks completed each day over the last 7 days">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend.map((d) => ({ name: d.label, Completed: d.completed, Created: d.created }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
              <Tooltip />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12.5 }} />
              <Line type="monotone" dataKey="Completed" stroke="var(--success)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Created" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subject-wise distribution" subtitle="Total tasks per subject">
          {subjectData.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No subject data"
              text="Tasks assigned to subjects will appear here."
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
                <Tooltip cursor={{ fill: 'var(--surface-2)' }} />
                <Bar dataKey="Tasks" radius={[6, 6, 0, 0]}>
                  {subjectData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
