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
