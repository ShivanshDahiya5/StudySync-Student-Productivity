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
